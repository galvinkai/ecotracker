// This script checks if the QR code API endpoint is available
// and redirects to the fallback HTML page if not

(function() {
  // Path to check and fallback page
  const API_URL = 'https://ecotracker-api.fly.dev';
  const API_CHECK_ENDPOINT = '/transactions';
  const FALLBACK_PAGE = '/qrcode.html';
  const QR_CODE_PATH = '/qrcode';
  
  // Only run this script if we're on the QR code page
  if (window.location.pathname === QR_CODE_PATH) {
    checkApiAndRedirectIfNeeded();
  }
  
  async function checkApiAndRedirectIfNeeded() {
    // Don't show error yet, let the component handle it
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${API_URL}${API_CHECK_ENDPOINT}`, {
        method: 'HEAD',
        mode: 'cors',
        // Short timeout to avoid long wait if API is down
        signal: AbortSignal.timeout(3000)
      });
      
      if (!response.ok) {
        // If the API responds but with an error, let the component handle it
        console.warn(`API returned ${response.status} status`);
      }
    } catch (error) {
      // If API is completely unavailable (network error, CORS error, timeout)
      console.error('API unavailable, redirecting to fallback:', error);
      
      // If the error happened quickly (< 1s), redirect immediately
      // Otherwise, component will handle showing the fallback link
      if (Date.now() - startTime < 1000) {
        window.location.href = FALLBACK_PAGE;
      }
    }
  }
})();
