// QR Code Debug Test
// This file is a simple test to help debug QR code issues

const checkQrEndpoints = async () => {
  console.log("===== QR Code Debug Test =====");
  
  // Test the QR code image endpoint
  console.log("\nTesting QR Code Image Endpoint...");
  try {
    const imageResponse = await fetch("https://ecotracker-api.fly.dev/qrcode");
    const imageStatus = imageResponse.status;
    console.log(`Status Code: ${imageStatus}`);
    
    if (imageStatus === 200) {
      console.log("✅ QR Code Image Endpoint is working!");
      const contentType = imageResponse.headers.get("content-type");
      console.log(`Content Type: ${contentType}`);
    } else {
      console.log("❌ QR Code Image Endpoint returned an error!");
      console.log(`Response: ${await imageResponse.text()}`);
    }
  } catch (error) {
    console.log("❌ Error accessing QR Code Image Endpoint:");
    console.log(error);
  }
  
  // Test the QR code HTML endpoint
  console.log("\nTesting QR Code HTML Endpoint...");
  try {
    const htmlResponse = await fetch("https://ecotracker-api.fly.dev/qrcode-html");
    const htmlStatus = htmlResponse.status;
    console.log(`Status Code: ${htmlStatus}`);
    
    if (htmlStatus === 200) {
      console.log("✅ QR Code HTML Endpoint is working!");
      const contentType = htmlResponse.headers.get("content-type");
      console.log(`Content Type: ${contentType}`);
    } else {
      console.log("❌ QR Code HTML Endpoint returned an error!");
      console.log(`Response: ${await htmlResponse.text()}`);
    }
  } catch (error) {
    console.log("❌ Error accessing QR Code HTML Endpoint:");
    console.log(error);
  }
  
  // Check CORS headers
  console.log("\nChecking CORS Headers...");
  try {
    const corsResponse = await fetch("https://ecotracker-api.fly.dev/qrcode", {
      method: "OPTIONS"
    });
    const corsHeaders = Array.from(corsResponse.headers.entries())
      .filter(([key]) => key.toLowerCase().includes("access-control"))
      .map(([key, value]) => `${key}: ${value}`);
    
    console.log("CORS Headers:");
    if (corsHeaders.length > 0) {
      corsHeaders.forEach(header => console.log(`- ${header}`));
    } else {
      console.log("No CORS headers found!");
    }
  } catch (error) {
    console.log("❌ Error checking CORS headers:");
    console.log(error);
  }
  
  console.log("\n===== End of Debug Test =====");
};

// Run the tests
checkQrEndpoints();
