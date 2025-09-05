"""
QR Code Generator Test Script

This script verifies that all required QR code dependencies are installed
and generates a test QR code for the EcoTracker application.
"""

import sys
import os
import traceback

def check_dependencies():
    """Check if all required packages are installed."""
    required_packages = ['qrcode', 'PIL']
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'PIL':
                # Pillow installs as PIL
                __import__('PIL')
            else:
                __import__(package)
            print(f"✅ {package} is installed")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package} is not installed")
    
    return missing_packages

def generate_test_qrcode():
    """Generate a test QR code to verify functionality."""
    try:
        import qrcode
        from PIL import Image
        
        # Create a test QR code
        print("Generating test QR code...")
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        
        qr.add_data("https://ecotracker-vercel.vercel.app/")
        qr.make(fit=True)
        
        img = qr.make_image(fill_color=(40, 167, 69), back_color="white")
        
        # Save the image
        test_file = "test_qrcode.png"
        img.save(test_file)
        
        # Verify file was created
        if os.path.exists(test_file):
            print(f"✅ Test QR code generated successfully: {os.path.abspath(test_file)}")
            return True
        else:
            print(f"❌ Failed to save QR code")
            return False
    except Exception as e:
        print(f"❌ Error generating QR code: {str(e)}")
        traceback.print_exc()
        return False

def main():
    """Main function to test QR code generation."""
    print("=" * 50)
    print("QR CODE GENERATOR TEST")
    print("=" * 50)
    
    # Check dependencies
    print("\nChecking dependencies:")
    missing_packages = check_dependencies()
    
    if missing_packages:
        print("\nSome required packages are missing. Please install them with:")
        print(f"pip install {' '.join(missing_packages)}")
        return False
    
    # Generate test QR code
    print("\nTesting QR code generation:")
    success = generate_test_qrcode()
    
    # Summary
    print("\n" + "=" * 50)
    if success:
        print("✅ All tests passed! QR code generator is working correctly.")
        print("\nYou can now use the following endpoints:")
        print("- /qrcode - Returns a QR code image")
        print("- /qrcode-html - Returns an HTML page with embedded QR code")
    else:
        print("❌ Tests failed. Please check the errors above.")
    print("=" * 50)
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
