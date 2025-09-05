import datetime
import json
import os

import joblib
import pandas as pd
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from lime.lime_tabular import LimeTabularExplainer

# Load model
model = joblib.load("trained_model.pkl")

# Define feature columns
ENCODING_COLUMNS = ['good_used_Cotton', 'good_used_Glass', 'good_used_Petroleum Products',
                    'good_used_Plastic', 'good_used_Steel', 'good_used_Timber', 'good_used_Wheat']
FEATURE_COLUMNS = ['quantity_used (tons)', 'carbon_emission (tons CO2)', 'water_usage (liters)',
                   'waste_generated (tons)'] + ENCODING_COLUMNS

# Mock data for EcoTracker (since we don't have a database)
transactions = []
transaction_id_counter = 1

# Flask app
app = Flask(__name__)
# Configure CORS to allow requests from Vercel frontend
CORS(app, resources={r"/*": {"origins": "*"}})
app.secret_key = 'A78DB9573F34DA77BBAE766F64C14'

conversation_history = []

# Prompt builder


def generate_llm_prompt(lime_features):
    material_context = """
        Each material has known carbon emission characteristics. For instance:
        - Timber generally has low emissions due to carbon sequestration but can still be impactful in large volumes.
        - Plastic and Petroleum Products are fossil-fuel-based and have very high emission factors.
        - Aluminium and Steel are energy-intensive to produce.
        - Cotton involves agricultural emissions and water use.
        - Glass has a moderate impact depending on its recycling source.
        - Wheat and agricultural products usually have low to moderate emissions."""

    material_conditions = [
        f"- {feat}: weight {float(weight):+.2f}" for feat, weight in lime_features if "good_used_" in feat
    ]
    material_block = "\n".join(material_conditions)

    return f"""You are a friendly Planet Impact Coach helping a person understand the environmental impact of a recent purchase.

The analysis below highlights the influence of different materials on the environmental footprint of the transaction, based on a machine learning model's interpretation using LIME. The goal is to assess ESG environmental alignment based purely on the materials used.

Impact drivers (internal, do NOT show to the user):
{material_block}

Background notes (internal reference only):
{material_context}

[Internal accuracy rules — do not show to the user]
- Treat positive weights in {material_block} as higher climate/impact drivers and negative as lower only if your LIME explanation is for a high-impact/not-aligned class; invert if your target is "low-impact/aligned."
- Identify the single material feature in {material_block} with the largest absolute weight. Mention that material explicitly in the paragraph as the main driver (e.g., "petroleum-based materials are the main driver").
- Convert the main driver into one concrete next-step product focus. Examples:
  • petroleum/plastics → "pick recycled or bio-based versions or a refill/return program"
  • aluminium/steel → "choose high-recycled/low-carbon certified metal or a durable reusable alternative"
  • timber → "FSC-certified or reclaimed wood"
  • cotton → "organic or recycled cotton"
  • glass → "high-recycled glass or a refill system"
  • wheat/agri → "buy only what you need; prefer low-packaging"
- Keep one paragraph, 3–5 sentences, one specific next step.
"""

# LLM Processing


def get_llm_response(conversation_history):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 279d6cd4b6d89d1201745a5ab36c26e0c65cafd4e810e62a142e7aebc0b56d87'
    }

    payload = {
        "model": "meta-llama/Meta-Llama-3-70B-Instruct-Turbo",
        "messages": conversation_history,
        "temperature": 0.3,
        "max_tokens": 4096
    }
    response = requests.post(
        "https://api.together.xyz/v1/chat/completions", headers=headers, data=json.dumps(payload))

    response = response.json()['choices'][0]['message']['content']
    return response

# Map impact level based on carbon value


def get_impact_level(carbon_value):
    if carbon_value < 0.1:
        return "low"
    elif carbon_value < 0.3:
        return "medium"
    else:
        return "high"


@app.route("/predict", methods=["POST"])
def predict():
    global conversation_history

    try:
        print("✅ /predict endpoint hit.")
        print("📦 Incoming JSON:", request.json)

        data = request.json
        df = pd.DataFrame([data])

        # One-hot encode good_used
        good_col = f"good_used_{data['good_used']}"
        for col in ENCODING_COLUMNS:
            df[col] = 1 if col == good_col else 0

        df = df[FEATURE_COLUMNS]
        prediction = model.predict(df)[0]

        explainer = LimeTabularExplainer(
            training_data=df.values,
            feature_names=FEATURE_COLUMNS,
            class_names=["Low", "High"],
            mode='classification'
        )

        explanation = explainer.explain_instance(
            data_row=df.iloc[0].values,
            predict_fn=lambda x: model.predict_proba(
                pd.DataFrame(x, columns=FEATURE_COLUMNS)),
            num_features=10
        )

        lime_features = explanation.as_list()
        prompt = generate_llm_prompt(lime_features)
        response = get_llm_response([{"role": "user", "content": prompt}])

        # For EcoTracker, we also calculate impact level
        impact_level = "high" if prediction == "High" else "low"
        carbon_value = float(
            data.get('carbon_emission (tons CO2)', 0)) * 1000  # Convert to kg

        return jsonify({
            "prediction": prediction,
            "lime_features": lime_features,
            "recommendation": response,
            "carbon": carbon_value,
            "impact_level": impact_level
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/conversation', methods=['POST'])
def chat_conversation():
    global conversation_history

    user_input = request.json['message']
    conversation_history.append({"role": "user", "content": user_input})

    # Get response from LLM
    bot_response = get_llm_response(conversation_history)
    conversation_history.append({"role": "assistant", "content": bot_response})

    # Return the bot response
    return jsonify({"response": conversation_history})

# New routes for EcoTracker


@app.route('/transactions', methods=['GET'])
def get_transactions():
    # Generate chart data based on transactions
    monthly_data = {}

    # If no transactions, return mock data
    if not transactions:
        chart_data = [
            {"month": "Jan", "footprint": 3.2, "target": 2.5},
            {"month": "Feb", "footprint": 2.9, "target": 2.4},
            {"month": "Mar", "footprint": 2.7, "target": 2.3},
            {"month": "Apr", "footprint": 2.5, "target": 2.2},
            {"month": "May", "footprint": 2.8, "target": 2.1},
            {"month": "Jun", "footprint": 2.4, "target": 2.0},
        ]
    else:
        # Calculate monthly footprints from transactions
        for transaction in transactions:
            date = transaction.get('date', '')
            if date:
                month = date.split('-')[1]  # Extract month from YYYY-MM-DD
                month_name = datetime.datetime.strptime(
                    month, '%m').strftime('%b')

                if month_name not in monthly_data:
                    monthly_data[month_name] = {
                        "footprint": 0,
                        "target": 2.0  # Default target
                    }

                # Convert to tons
                monthly_data[month_name]["footprint"] += transaction.get(
                    'carbon', 0) / 1000

        chart_data = [{"month": month, **data}
                      for month, data in monthly_data.items()]

    return jsonify({
        "transactions": transactions,
        "chartData": chart_data
    })


@app.route('/transactions', methods=['POST'])
def add_transaction():
    global transaction_id_counter

    transaction_data = request.json

    # Calculate carbon footprint based on material type and amount
    # Default to wheat if not specified
    material = transaction_data.get('category', 'Wheat')
    amount = transaction_data.get('amount', 0)

    # Simple carbon calculation - in a real app, this would be more sophisticated
    carbon_factors = {
        "Cotton": 0.08,
        "Glass": 0.15,
        "Petroleum Products": 0.8,
        "Plastic": 0.6,
        "Steel": 0.5,
        "Timber": 0.1,
        "Wheat": 0.05
    }

    carbon = amount * carbon_factors.get(material, 0.1)
    impact = get_impact_level(carbon)

    # Create new transaction
    new_transaction = {
        "id": transaction_id_counter,
        "description": transaction_data.get('description', ''),
        "amount": amount,
        "carbon": carbon,
        "category": material,
        "date": transaction_data.get('date', datetime.datetime.now().strftime('%Y-%m-%d')),
        "impact": impact
    }

    transactions.append(new_transaction)
    transaction_id_counter += 1

    return jsonify(new_transaction)


@app.route('/insights', methods=['GET'])
def get_insights():
    # Calculate insights based on transactions
    # For now, return mock data
    insights = [
        {
            "type": "recommendation",
            "title": "Switch to Public Transport",
            "description": "Your transport emissions are 40% above average. Consider using public transport 2-3 times per week.",
            "impact": "Could save 0.3 tons CO₂ monthly",
            "priority": "high"
        },
        {
            "type": "achievement",
            "title": "Energy Efficiency Improved",
            "description": "Great job! Your energy consumption decreased by 15% this month compared to last month.",
            "impact": "Saved 0.2 tons CO₂",
            "priority": "positive"
        },
        {
            "type": "tip",
            "title": "Sustainable Shopping",
            "description": "Try buying local and seasonal products. They typically have 50% lower carbon footprint.",
            "impact": "Potential 0.1 tons CO₂ savings",
            "priority": "medium"
        }
    ]

    messages = [
        {
            "message": "Hey! I noticed your transport emissions spiked this week. Would you like some personalized suggestions to reduce them?",
            "timestamp": "2 hours ago"
        },
        {
            "message": "Congratulations! You've achieved a 15% reduction in your monthly footprint. Keep up the great work! 🌱",
            "timestamp": "1 day ago"
        },
        {
            "message": "Based on your spending patterns, I found 3 eco-friendly alternatives that could save you money and reduce emissions.",
            "timestamp": "3 days ago"
        }
    ]

    return jsonify({
        "insights": insights,
        "messages": messages
    })


if __name__ == "__main__":
    # Get port from environment variable for cloud deployment
    port = int(os.environ.get("PORT", 8080))
    # In production, need to listen on 0.0.0.0 for Fly.io
    app.run(host='0.0.0.0', port=port)
