// This is a simple script to generate a QR code for the standalone test page
// Add this script to the HTML body to generate a QR code without requiring backend access

function generateQRCode() {
  const url = document.getElementById('url-input').value || 'https://ecotracker-vercel.vercel.app/';
  const title = document.getElementById('title-input').value || 'EcoTracker App';
  const color = document.getElementById('color-input').value || '28a745';
  
  // Use a public QR code API instead of our own backend
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=200x200&color=${color.replace('#', '')}`;
  
  // Update the QR code image
  const qrCodeImage = document.getElementById('qr-code-image');
  qrCodeImage.src = qrCodeUrl;
  qrCodeImage.alt = title;
  
  // Update the title
  document.getElementById('qr-title').textContent = title;
  
  // Update download link
  const downloadLink = document.getElementById('download-link');
  downloadLink.href = qrCodeUrl;
  downloadLink.download = `${title.replace(/\s+/g, '-').toLowerCase()}-qrcode.png`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Add event listeners to form inputs
  document.getElementById('url-input').addEventListener('input', generateQRCode);
  document.getElementById('title-input').addEventListener('input', generateQRCode);
  document.getElementById('color-input').addEventListener('input', generateQRCode);
  
  // Generate initial QR code
  generateQRCode();
});
