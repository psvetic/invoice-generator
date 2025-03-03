const path = require('path');
const { exec } = require('child_process');

// Path to the standalone HTML file
const htmlFilePath = path.join(__dirname, 'public', 'standalone.html');

// Command to open the file based on the platform
let command;
switch (process.platform) {
  case 'darwin': // macOS
    command = `open "${htmlFilePath}"`;
    break;
  case 'win32': // Windows
    command = `start "" "${htmlFilePath}"`;
    break;
  default: // Linux and others
    command = `xdg-open "${htmlFilePath}"`;
}

console.log(`Opening ${htmlFilePath} in your default browser...`);
exec(command, (error) => {
  if (error) {
    console.error(`Error opening file: ${error.message}`);
    console.log('You can manually open the file in your browser.');
  }
});

console.log("\nTo generate a PDF invoice from the command line, run:");
console.log("node dist/generate-pdf.js [invoice-number]");
console.log("\nExample:");
console.log("node dist/generate-pdf.js 12345");
console.log("\nThe PDF will be saved to the uploads/ directory");