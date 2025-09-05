import json
import subprocess
import sys
import time
from datetime import datetime


def print_header(text):
    print("\n" + "=" * 50)
    print(f"  {text}")
    print("=" * 50)


def run_command(command):
    try:
        result = subprocess.run(
            command, capture_output=True, text=True, shell=True)
        if result.returncode != 0:
            print(f"Error running command: {command}")
            print(f"Error message: {result.stderr}")
            return None
        return result.stdout
    except Exception as e:
        print(f"Exception when running command: {str(e)}")
        return None


def check_app_status():
    print_header("Fly.io App Status")

    # Get app status
    status_output = run_command("flyctl status")
    if status_output:
        print(status_output)
    else:
        print("Could not retrieve app status.")

    # Get machine counts
    print("\nMachine count:")
    count_output = run_command("flyctl status --json")
    if count_output:
        try:
            data = json.loads(count_output)
            if 'Machines' in data:
                running_count = len(
                    [m for m in data['Machines'] if m['State'] == 'started'])
                print(f"Running machines: {running_count}")

                # If more than 1 machine is running, suggest scaling down
                if running_count > 1:
                    print(
                        "\n⚠️ You have more than one machine running. To reduce costs, consider scaling down:")
                    print("   flyctl scale count 1")
            else:
                print("Could not determine machine count.")
        except json.JSONDecodeError:
            print("Could not parse JSON output.")
    else:
        print("Could not retrieve machine information.")


def check_ip_addresses():
    print_header("IP Address Status")

    ip_output = run_command("flyctl ips list")
    if ip_output:
        print(ip_output)

        # Check for dedicated IPv4 addresses
        if "dedicated" in ip_output and "v4" in ip_output:
            print("\n⚠️ You have dedicated IPv4 addresses that may incur charges.")
            print("   If this is unintentional, you can release them with:")
            print("   flyctl ips release <ADDRESS>")
    else:
        print("Could not retrieve IP address information.")


def check_volumes():
    print_header("Volume Status")

    volume_output = run_command("flyctl volumes list")
    if volume_output:
        if "No volumes" in volume_output:
            print("No volumes created. (This is good for staying in the free tier)")
        else:
            print(volume_output)
            print("\nNote: The free tier includes 3GB of volume storage.")
    else:
        print("Could not retrieve volume information.")


def check_costs():
    print_header("Cost-Saving Recommendations")

    # Check fly.toml configuration
    try:
        with open("fly.toml", "r") as f:
            config = f.read()

            # Check auto-stop setting
            if "auto_stop_machines = false" in config or "auto_stop_machines = 'off'" in config:
                print(
                    "⚠️ auto_stop_machines is disabled. Enable it to automatically stop idle machines:")
                print("   Update fly.toml to set auto_stop_machines = true")

            # Check min_machines_running
            if "min_machines_running = 0" not in config:
                print(
                    "⚠️ min_machines_running is not set to 0. Setting it to 0 allows all machines to stop when idle:")
                print("   Update fly.toml to set min_machines_running = 0")

            # Check VM size
            if "shared-cpu-1x" not in config and "cpu_kind = \"shared\"" not in config:
                print(
                    "⚠️ You may not be using shared CPU VMs. The free tier only includes shared CPU VMs.")
                print("   Update fly.toml to use shared-cpu-1x or cpu_kind = \"shared\"")
    except FileNotFoundError:
        print("Could not find fly.toml file.")


def main():
    print_header(
        f"Fly.io Free Tier Usage Monitor - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    check_app_status()
    check_ip_addresses()
    check_volumes()
    check_costs()

    print_header("Free Tier Limits")
    print("✓ 2 shared-cpu-1x VMs with 256MB RAM")
    print("✓ 3GB of volume storage")
    print("✓ 160GB of outbound data transfer")
    print("✓ Free IPv6 addresses")
    print("✓ Free shared IPv4 addresses")
    print("✓ Free TLS certificates")

    print_header("Next Steps")
    print("1. Run this script periodically to monitor your usage")
    print("2. Check the Fly.io dashboard: https://fly.io/dashboard")
    print("3. To avoid charges when not using the app, run:")
    print("   flyctl scale count 0")
    print("4. To restart the app later, run:")
    print("   flyctl scale count 1")


if __name__ == "__main__":
    main()
