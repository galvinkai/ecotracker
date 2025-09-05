"""
Deploy EcoTracker to Fly.io with QR Code functionality

This script handles deployment of the updated EcoTracker backend to Fly.io
with the new QR code generation endpoints.
"""

import argparse
import os
import subprocess
import sys
import time


def run_command(cmd, description=None):
    """Run a shell command and return its output."""
    if description:
        print(f"\n==== {description} ====")
        print(f"Running: {cmd}")

    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"❌ Command failed with error code {result.returncode}")
        print(f"Error: {result.stderr}")
        return False, result.stderr

    return True, result.stdout


def check_fly_auth():
    """Check if user is authenticated with Fly.io."""
    success, output = run_command(
        "flyctl auth whoami", "Checking Fly.io authentication")
    if not success or "not logged in" in output.lower():
        print("You need to log in to Fly.io first.")
        run_command("flyctl auth login", "Logging in to Fly.io")
        return False
    print(f"✅ Authenticated as {output.strip()}")
    return True


def check_dependencies():
    """Check if all required dependencies are installed."""
    # Check for flyctl
    success, _ = run_command("flyctl version", "Checking for Fly.io CLI")
    if not success:
        print("❌ Fly.io CLI (flyctl) is not installed. Please install it first.")
        print("   Visit https://fly.io/docs/hands-on/install-flyctl/")
        return False

    # Check for git
    success, _ = run_command("git --version", "Checking for Git")
    if not success:
        print("❌ Git is not installed. Please install it first.")
        return False

    # Check for Python packages
    packages = ["flask", "qrcode", "pillow"]
    for package in packages:
        cmd = f"pip show {package}"
        success, _ = run_command(cmd, f"Checking for {package}")
        if not success:
            print(f"❌ Python package {package} is not installed.")
            print(f"   Run: pip install {package}")
            return False

    return True


def update_fly_app():
    """Deploy the application to Fly.io."""
    # Check app status
    success, output = run_command("flyctl status", "Checking app status")
    if not success:
        return False

    print(f"Current app status:\n{output}")

    # Deploy the application
    success, output = run_command("flyctl deploy", "Deploying to Fly.io")
    if not success:
        return False

    print(f"Deployment output:\n{output}")

    # Verify deployment
    time.sleep(5)  # Wait a bit for deployment to complete
    success, output = run_command("flyctl status", "Verifying deployment")
    if not success:
        return False

    print(f"Updated app status:\n{output}")
    return True


def test_qr_endpoints():
    """Test the QR code endpoints on the deployed app."""
    # Get the app name from fly.toml
    app_name = None
    try:
        with open("fly.toml", "r") as f:
            for line in f:
                if line.strip().startswith("app = "):
                    app_name = line.strip().split("=")[1].strip().strip('"\'')
                    break
    except Exception as e:
        print(f"❌ Could not determine app name: {str(e)}")
        return False

    if not app_name:
        print("❌ Could not determine app name from fly.toml")
        return False

    # Construct the app URL
    app_url = f"https://{app_name}.fly.dev"

    # Test the QR code endpoint
    print(f"\n==== Testing QR Code Endpoints ====")
    print(f"App URL: {app_url}")
    print("\nQR Code Image Endpoint:")
    print(f"{app_url}/qrcode")
    print("\nQR Code HTML Endpoint:")
    print(f"{app_url}/qrcode-html")

    print("\n✅ Your QR code endpoints are now available!")
    print("You can scan the QR code or share the HTML page URL to access your EcoTracker application.")

    return True


def main():
    """Main function to handle deployment."""
    parser = argparse.ArgumentParser(
        description="Deploy EcoTracker with QR Code functionality to Fly.io")
    parser.add_argument("--skip-checks", action="store_true",
                        help="Skip dependency checks")
    parser.add_argument("--test-only", action="store_true",
                        help="Only test QR endpoints, don't deploy")
    args = parser.parse_args()

    print("=" * 50)
    print("ECOTRACKER DEPLOYMENT WITH QR CODE FUNCTIONALITY")
    print("=" * 50)

    if not args.skip_checks:
        if not check_dependencies():
            print(
                "\n❌ Dependency check failed. Please install the required dependencies.")
            return False

        if not check_fly_auth():
            print("\n❌ Fly.io authentication failed.")
            return False

    if not args.test_only:
        if not update_fly_app():
            print("\n❌ Deployment failed.")
            return False

    if not test_qr_endpoints():
        print("\n❌ QR code endpoint testing failed.")
        return False

    print("\n" + "=" * 50)
    print("✅ DEPLOYMENT COMPLETED SUCCESSFULLY")
    print("=" * 50)
    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
