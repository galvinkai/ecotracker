import json
import sys
from time import sleep

import requests


def check_backend_health(url):
    """Check if the backend API is responding"""
    try:
        # Test the transactions endpoint
        response = requests.get(f"{url}/transactions")
        if response.status_code == 200:
            print(f"✅ Backend API is accessible at {url}")
            print(f"✅ Successfully retrieved transactions")

            # Check if we got the expected response structure
            data = response.json()
            if 'transactions' in data and 'chartData' in data:
                print(f"✅ Response contains expected data structure")
                return True
            else:
                print(f"❌ Response doesn't contain expected data structure")
                return False
        else:
            print(f"❌ Backend API returned status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"❌ Could not connect to the backend API at {url}")
        print("   Please check if your backend is running and the URL is correct.")
        return False
    except Exception as e:
        print(f"❌ Error checking backend health: {str(e)}")
        return False


def test_predict_endpoint(url):
    """Test the prediction endpoint"""
    try:
        # Sample data for prediction
        test_data = {
            "good_used": "Plastic",
            "quantity_used (tons)": 2.5,
            "carbon_emission (tons CO2)": 1.5,
            "water_usage (liters)": 500,
            "waste_generated (tons)": 0.5
        }

        # Make the prediction request
        response = requests.post(f"{url}/predict", json=test_data)

        if response.status_code == 200:
            print(f"✅ Successfully tested prediction endpoint")

            # Check if we got the expected response structure
            data = response.json()
            if 'prediction' in data and 'recommendation' in data:
                print(f"✅ Prediction endpoint returns expected data structure")
                return True
            else:
                print(f"❌ Prediction response doesn't contain expected data structure")
                return False
        else:
            print(
                f"❌ Prediction endpoint returned status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error testing prediction endpoint: {str(e)}")
        return False


def main():
    print("=" * 50)
    print("EcoTracker Deployment Health Check")
    print("=" * 50)
    print()

    # Get the backend URL
    if len(sys.argv) > 1:
        backend_url = sys.argv[1]
    else:
        backend_url = input(
            "Enter the backend URL (e.g., https://ecotracker-api.fly.dev): ")

    print(f"\nTesting backend at {backend_url}...\n")

    # Check backend health
    backend_ok = check_backend_health(backend_url)

    if backend_ok:
        print("\nTesting prediction endpoint...\n")
        predict_ok = test_predict_endpoint(backend_url)
    else:
        predict_ok = False

    print("\n" + "=" * 50)
    print("Health Check Results")
    print("=" * 50)

    if backend_ok and predict_ok:
        print("\n✅ Your backend deployment is working correctly!")
        print("✅ Main API endpoints are responding as expected")
        print("\n🎉 Congratulations! Your EcoTracker backend is successfully deployed.")
    elif backend_ok:
        print("\n⚠️ Your backend is accessible but the prediction endpoint has issues.")
        print("   Please check your model and prediction logic.")
    else:
        print("\n❌ Backend health check failed.")
        print("   Please check your deployment and configuration.")

    print("\nNext Steps:")
    if backend_ok:
        print("1. Make sure your frontend is configured to use this backend URL:")
        print(f"   {backend_url}")
        print("2. Deploy your frontend to Vercel")
        print("3. Test the full application flow")
    else:
        print("1. Check your Fly.io deployment")
        print("2. Verify your Dockerfile and server.py")
        print("3. Check logs with 'fly logs'")

    print("\nFor help with deployment issues, refer to DEPLOY_TO_FLY_IO.md")


if __name__ == "__main__":
    main()
