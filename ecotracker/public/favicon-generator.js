const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// SVG source path
const svgPath = path.join(__dirname, 'favicon.svg');

// Read the SVG file
const svgBuffer = fs.readFileSync(svgPath);

// Generate different sizes of PNG
const sizes = [16, 32, 48, 64, 128, 256];

// Create PNGs at different sizes
const generatePngs = async () => {
  console.log('Generating PNGs from SVG...');
  
  const pngBuffers = [];
  
  for (const size of sizes) {
    const pngBuffer = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
      
    pngBuffers.push({ size, buffer: pngBuffer });
    console.log(`Generated ${size}x${size} PNG`);
  }
  
  // Write combined PNGs to a favicon.ico (multi-sized)
  const faviconPath = path.join(__dirname, 'favicon.ico');
  
  try {
    const { default: toIco } = await import('png-to-ico');
    const icoBuffer = await toIco(pngBuffers.map(item => item.buffer));
    
    fs.writeFileSync(faviconPath, icoBuffer);
    console.log(`Favicon created at ${faviconPath}`);
  } catch (error) {
    console.error('Error creating ICO file:', error);
    
    // Create a simple PNG version as a fallback
    const fallbackSize = 32;
    const fallbackPath = path.join(__dirname, 'favicon.png');
    
    const fallbackBuffer = await sharp(svgBuffer)
      .resize(fallbackSize, fallbackSize)
      .png()
      .toBuffer();
      
    fs.writeFileSync(fallbackPath, fallbackBuffer);
    console.log(`Fallback PNG created at ${fallbackPath}`);
  }
};

generatePngs().catch(console.error);
