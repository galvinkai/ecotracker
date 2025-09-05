# QR Code Generator for EcoTracker

This folder contains tools to generate QR codes for the EcoTracker application, making it easy for users to access the web app without typing in the URL.

## Server Endpoints

The EcoTracker backend server now includes two new endpoints for QR code generation:

### 1. `/qrcode` - Generate a QR Code Image

**URL:** `https://ecotracker-api.fly.dev/qrcode`

**Method:** `GET`

**Query Parameters:**
- `url` (optional): The URL to encode in the QR code (default: `https://ecotracker-sable.vercel.app/`)
- `title` (optional): The title for the QR code (default: `EcoTracker App`)
- `color` (optional): The color for the QR code in hex format (default: `#28a745`)

**Example:**
```
https://ecotracker-api.fly.dev/qrcode?url=https://your-custom-url.com&color=%23FF5733
```

**Response:** PNG image

### 2. `/qrcode-html` - Generate an HTML Page with QR Code

**URL:** `https://ecotracker-api.fly.dev/qrcode-html`

**Method:** `GET`

**Query Parameters:** Same as `/qrcode`

**Example:**
```
https://ecotracker-api.fly.dev/qrcode-html?title=Scan%20for%20EcoTracker
```

**Response:** HTML page with embedded QR code, printable

## Standalone QR Code Generator Script

The repository also includes a standalone Python script `generate_qrcode.py` for generating QR codes locally.

### Prerequisites

Install the required packages:
```bash
pip install qrcode pillow
```

### Usage

```bash
python generate_qrcode.py [OPTIONS]
```

**Options:**
- `--url URL`: URL to encode in QR code (default: https://ecotracker-sable.vercel.app/)
- `--title TITLE`: Title for the QR code (default: EcoTracker App)
- `--logo LOGO_PATH`: Path to logo file to overlay on QR code
- `--color COLOR`: Color for QR code (hex format, default: #28a745 - green)
- `--output FILENAME`: Output filename for QR code image (default: ecotracker_qrcode.png)
- `--html`: Generate HTML file with QR code

### Examples

Basic usage:
```bash
python generate_qrcode.py
```

Custom URL and color:
```bash
python generate_qrcode.py --url https://your-custom-url.com --color "#FF5733"
```

Generate HTML file:
```bash
python generate_qrcode.py --html
```

## Integration into Your Application

You can embed the QR code image directly in your application:

```html
<img src="https://ecotracker-api.fly.dev/qrcode" alt="EcoTracker QR Code">
```

Or provide a link to the HTML version:

```html
<a href="https://ecotracker-api.fly.dev/qrcode-html" target="_blank">View QR Code</a>
```

## Printing QR Codes for Distribution

The HTML version includes a print button that formats the QR code for printing. You can print multiple copies for distribution at events or public locations.
