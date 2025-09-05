import argparse
import base64
import io
import os

import qrcode
from PIL import Image, ImageDraw, ImageFont


def generate_qr_code(url, output_path, title=None, logo_path=None, include_title=True, color="#28a745"):
    """
    Generate a QR code for the given URL

    Args:
        url (str): The URL to encode in the QR code
        output_path (str): Path to save the QR code image
        title (str, optional): Title to display above the QR code
        logo_path (str, optional): Path to a logo to overlay on the QR code
        include_title (bool): Whether to include the title in the image
        color (str): Color for the QR code (hex format)
    """
    # Parse the color string
    if color.startswith('#'):
        color = color[1:]
    color_tuple = tuple(int(color[i:i+2], 16) for i in (0, 2, 4))

    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )

    # Add data to the QR code
    qr.add_data(url)
    qr.make(fit=True)

    # Create an image from the QR code with custom color
    qr_img = qr.make_image(fill_color=color_tuple,
                           back_color="white").convert("RGBA")

    # If a logo is provided, overlay it on the QR code
    if logo_path and os.path.exists(logo_path):
        try:
            logo = Image.open(logo_path).convert("RGBA")

            # Calculate the size for the logo (about 20% of the QR code)
            logo_size = int(qr_img.size[0] * 0.2)
            logo = logo.resize((logo_size, logo_size))

            # Calculate position to center the logo
            pos = ((qr_img.size[0] - logo.size[0]) // 2,
                   (qr_img.size[1] - logo.size[1]) // 2)

            # Create a new image for the logo with a white background for better visibility
            logo_bg = Image.new(
                "RGBA", (logo_size + 10, logo_size + 10), (255, 255, 255, 255))
            logo_bg.paste(logo, (5, 5), logo)

            # Paste the logo onto the QR code
            qr_img.paste(logo_bg, (pos[0] - 5, pos[1] - 5), logo_bg)
        except Exception as e:
            print(f"Error adding logo: {e}")

    # If a title is provided, add it to the QR code
    if title and include_title:
        # Create a new image with space for the title
        padding = 50  # Space for the title
        full_img = Image.new(
            "RGB", (qr_img.size[0], qr_img.size[1] + padding), "white")
        full_img.paste(qr_img, (0, padding))

        # Add the title
        draw = ImageDraw.Draw(full_img)

        # Try to use a nice font, fall back to default if not available
        try:
            font = ImageFont.truetype("arial.ttf", 24)
        except IOError:
            try:
                font = ImageFont.truetype(
                    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
            except IOError:
                font = ImageFont.load_default()

        # Draw the title
        text_width = draw.textlength(title, font=font)
        draw.text(
            ((full_img.size[0] - text_width) // 2, padding // 4),
            title,
            fill="black",
            font=font
        )

        qr_img = full_img

    # Save the QR code
    if isinstance(output_path, str):
        qr_img.save(output_path)
        print(f"QR code saved to {output_path}")
    else:
        # It's a file-like object
        qr_img.save(output_path, format="PNG")

    return qr_img


def qr_to_html(url, title=None, logo_path=None, color="#28a745"):
    """
    Generate an HTML file with the QR code embedded

    Args:
        url (str): The URL to encode in the QR code
        title (str, optional): Title to display above the QR code
        logo_path (str, optional): Path to a logo to overlay on the QR code
        color (str): Color for the QR code (hex format)

    Returns:
        str: HTML content with the embedded QR code
    """
    # Generate QR code to a bytes buffer
    img_buffer = io.BytesIO()
    generate_qr_code(url, img_buffer, title, logo_path,
                     include_title=False, color=color)
    img_buffer.seek(0)

    # Convert to base64 for embedding in HTML
    img_str = base64.b64encode(img_buffer.getvalue()).decode('utf-8')

    # Create HTML
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EcoTracker QR Code</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
        }}
        .container {{
            text-align: center;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 400px;
        }}
        h1 {{
            color: {color};
            margin-bottom: 20px;
        }}
        .qr-code {{
            margin: 20px 0;
        }}
        .url {{
            margin-top: 20px;
            word-break: break-all;
            color: #666;
        }}
        .instructions {{
            margin-top: 30px;
            font-size: 14px;
            color: #666;
            text-align: left;
        }}
        .print-button {{
            background-color: {color};
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
            font-size: 16px;
        }}
        @media print {{
            .no-print {{
                display: none;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>{title or "Scan to access EcoTracker"}</h1>
        <div class="qr-code">
            <img src="data:image/png;base64,{img_str}" alt="QR Code">
        </div>
        <div class="url">{url}</div>
        <button class="print-button no-print" onclick="window.print()">Print QR Code</button>
        <div class="instructions no-print">
            <p><strong>How to use:</strong></p>
            <ol>
                <li>Open your phone's camera app</li>
                <li>Point it at the QR code</li>
                <li>Tap the notification that appears</li>
                <li>Start using EcoTracker!</li>
            </ol>
        </div>
    </div>
</body>
</html>
"""
    return html


def main():
    parser = argparse.ArgumentParser(
        description='Generate QR code for EcoTracker application')
    parser.add_argument('--url', default='https://ecotracker-vercel.vercel.app/',
                        help='URL to encode in QR code (default: https://ecotracker-vercel.vercel.app/)')
    parser.add_argument('--title', default='EcoTracker App',
                        help='Title for the QR code')
    parser.add_argument(
        '--logo', help='Path to logo file to overlay on QR code')
    parser.add_argument('--color', default='#28a745',
                        help='Color for QR code (hex format, default: #28a745 - green)')
    parser.add_argument('--output', default='ecotracker_qrcode.png',
                        help='Output filename for QR code image')
    parser.add_argument('--html', action='store_true',
                        help='Generate HTML file with QR code')

    args = parser.parse_args()

    # Generate the QR code
    generate_qr_code(args.url, args.output, args.title,
                     args.logo, color=args.color)

    # If HTML option is selected, generate HTML file
    if args.html:
        html_output = args.output.rsplit('.', 1)[0] + '.html'
        with open(html_output, 'w') as f:
            f.write(qr_to_html(args.url, args.title, args.logo, args.color))
        print(f"HTML file with QR code saved to {html_output}")


if __name__ == "__main__":
    main()
