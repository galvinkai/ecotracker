import requests
import webbrowser
import time
import sys
import json
from datetime import datetime

def print_header(text):
    print("\n" + "=" * 50)
    print(f"  {text}")
    print("=" * 50)

def print_success(text):
    print(f"✅ {text}")

def print_error(text):
    print(f"❌ {text}")

def print_info(text):
    print(f"ℹ️ {text}")

def test_backend(backend_url):
    print_header("Testing Backend API Endpoints")
    
    # Test 1: GET /transactions
    try:
        print_info("Testing GET /transactions endpoint...")
        response = requests.get(f"{backend_url}/transactions")
        if response.status_code == 200:
            data = response.json()
            if 'transactions' in data and 'chartData' in data:
                print_success("Successfully retrieved transactions and chart data")
            else:
                print_error("Response format is not as expected")
        else:
            print_error(f"Failed to get transactions: Status code {response.status_code}")
    except Exception as e:
        print_error(f"Error testing transactions endpoint: {str(e)}")

    # Test 2: POST /transactions (Add a test transaction)
    try:
        print_info("Testing POST /transactions endpoint (adding a transaction)...")
        test_transaction = {
            "description": f"Test Transaction {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "amount": 12.34,
            "category": "Glass",
            "date": datetime.now().strftime('%Y-%m-%d')
        }
        
        response = requests.post(f"{backend_url}/transactions", json=test_transaction)
        if response.status_code == 200:
            new_transaction = response.json()
            print_success(f"Successfully added a new transaction with ID: {new_transaction.get('id', 'unknown')}")
        else:
            print_error(f"Failed to add transaction: Status code {response.status_code}")
    except Exception as e:
        print_error(f"Error testing add transaction endpoint: {str(e)}")
    
    # Test 3: GET /insights
    try:
        print_info("Testing GET /insights endpoint...")
        response = requests.get(f"{backend_url}/insights")
        if response.status_code == 200:
            data = response.json()
            if 'insights' in data and 'messages' in data:
                print_success("Successfully retrieved insights and messages")
            else:
                print_error("Insights response format is not as expected")
        else:
            print_error(f"Failed to get insights: Status code {response.status_code}")
    except Exception as e:
        print_error(f"Error testing insights endpoint: {str(e)}")
    
    # Test 4: POST /predict
    try:
        print_info("Testing POST /predict endpoint...")
        test_data = {
            "good_used": "Plastic",
            "quantity_used (tons)": 2.5,
            "carbon_emission (tons CO2)": 1.5,
            "water_usage (liters)": 500,
            "waste_generated (tons)": 0.5
        }
        
        response = requests.post(f"{backend_url}/predict", json=test_data)
        if response.status_code == 200:
            prediction = response.json()
            if 'prediction' in prediction and 'recommendation' in prediction:
                print_success(f"Successfully received prediction: {prediction['prediction']}")
            else:
                print_error("Prediction response format is not as expected")
        else:
            print_error(f"Failed to get prediction: Status code {response.status_code}")
    except Exception as e:
        print_error(f"Error testing prediction endpoint: {str(e)}")

def open_frontend(frontend_url):
    print_header("Opening Frontend in Browser")
    print_info(f"Opening {frontend_url} in your default browser...")
    
    try:
        webbrowser.open(frontend_url)
        print_success("Browser opened successfully")
        
        print_info("Please test the following functionality in the browser:")
        print("1. Check if the transactions list displays correctly")
        print("2. Try adding a new transaction through the UI")
        print("3. Verify that the carbon footprint chart is displayed")
        print("4. Check the insights panel for recommendations")
        print("5. Test the application in both light and dark modes")
    except Exception as e:
        print_error(f"Error opening browser: {str(e)}")

def main():
    print_header("EcoTracker Deployment Testing Script")
    
    if len(sys.argv) > 2:
        backend_url = sys.argv[1]
        frontend_url = sys.argv[2]
    else:
        backend_url = input("Enter your backend URL (e.g., https://ecotracker-api.fly.dev): ")
        frontend_url = input("Enter your frontend URL (e.g., https://ecotracker-xyz.vercel.app): ")
    
    test_backend(backend_url)
    open_frontend(frontend_url)
    
    print_header("Testing Summary")
    print_info("Backend API testing completed")
    print_info("Frontend manual testing initiated")
    print_info("Please complete the manual testing steps in the browser")
    print_info("If all tests pass, your application is successfully deployed!")

if __name__ == "__main__":
    main()
