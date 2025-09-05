# QR Code Deployment Instructions

Follow these steps to deploy the QR code functionality to your Fly.io instance:

## 1. Install Prerequisites

Ensure you have the following installed:

- Fly.io CLI (flyctl)
  ```powershell
  # Install Fly.io CLI
  iwr https://fly.io/install.ps1 -useb | iex
  
  # Authenticate with Fly.io
  flyctl auth login
  ```

- Python packages
  ```powershell
  pip install qrcode pillow
  ```

## 2. Deploy to Fly.io

Once the prerequisites are installed, deploy the application:

```powershell
cd "C:\Users\pkaiy\Desktop\MISC\ESG Hackathon"
flyctl deploy
```

## 3. Verify the QR Code Endpoints

After deployment, your QR code endpoints will be available at:

- QR Code Image: `https://ecotracker-api.fly.dev/qrcode`
- QR Code HTML Page: `https://ecotracker-api.fly.dev/qrcode-html`

You can customize the QR code by adding query parameters:

```
https://ecotracker-api.fly.dev/qrcode?url=https://your-custom-url.com&title=Your%20Title&color=%2328a745
```

## 4. Integrate the QR Code Component in React

To display the QR code in your React application:

1. Import the `QRCodeDisplay` component:
   ```typescript
   import QRCodeDisplay from './components/QRCodeDisplay';
   ```

2. Add it to your page:
   ```tsx
   <QRCodeDisplay 
     appUrl="https://ecotracker-vercel.vercel.app/" 
     apiUrl="https://ecotracker-api.fly.dev"
     title="EcoTracker App"
     color="28a745"
   />
   ```

## 5. Generate QR Codes Locally

You can also generate QR codes locally using the provided script:

```powershell
python generate_qrcode.py --output ecotracker_qr.png --html
```

This will create both a PNG image and an HTML file with the QR code.

## 6. Test Locally

To test the QR code functionality locally:

```powershell
python server.py
```

Then open your browser to:
- http://localhost:8080/qrcode
- http://localhost:8080/qrcode-html

## 7. Share the QR Code

Once deployed, you can:

1. Print the QR code from the HTML page
2. Include it in marketing materials
3. Display it at events
4. Add it to user documentation

Users can simply scan the QR code with their phone's camera to access the EcoTracker application without typing the URL.
