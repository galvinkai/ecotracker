@echo off
echo This script will attempt to install the necessary dependencies and convert
echo the SVG favicon to an ICO file. You will need Node.js installed.

echo Installing required packages...
npm install -g svg2png-cli
npm install -g png-to-ico-cli

echo Converting SVG to PNG...
svg2png public/favicon.svg -w 256 -h 256 -o public/favicon-256.png

echo Converting PNG to ICO...
png-to-ico public/favicon-256.png > public/favicon.ico

echo Cleaning up temporary files...
del public\favicon-256.png

echo Done! The favicon.ico file has been updated with the leaf icon.
echo You may need to clear your browser cache to see the new favicon.
