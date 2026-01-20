# NotebookLM PDF Exporter

A Chrome extension that exports NotebookLM notes to PDF files with one click.

## Features

- **Auto-inject**: Automatically adds an "Export to PDF" button to NotebookLM's interface
- **Math rendering**: Preserves KaTeX and MathJax mathematical formulas
- **Clean output**: Removes UI elements (buttons, navigation) for clean PDF exports
- **One-click**: Simply click the button and save as PDF via print dialog
- **Reliable**: Uses browser's native print-to-PDF for perfect formatting

## Installation

### Loading the Extension (Development Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `notebooklm-pdf-exporter` folder

### Usage

1. Navigate to [notebooklm.google.com](https://notebooklm.google.com)
2. Open any note
3. Click the "Export to PDF" button in the note editor header
4. The PDF will automatically download to your Downloads folder

## Project Structure

```
notebooklm-pdf-exporter/
├── manifest.json                 # Extension configuration
├── icons/
│   ├── icon16.png               # 16x16 icon
│   ├── icon48.png               # 48x48 icon
│   ├── icon128.png              # 128x128 icon
├── src/
│   ├── content/
│   │   ├── content.js           # Entry point, SPA navigation handling
│   │   ├── exportCore.js        # Core export logic
│   │   ├── buttonInjector.js    # Button placement with MutationObserver
│   │   └── styles.css           # Material Design button styles
│   ├── lib/
│   │   ├── html2pdf.bundle.min.js    # PDF generation library
│   │   └── html2canvas.min.js        # Required dependency
│   └── background/
│       └── serviceWorker.js     # Background service worker
└── README.md
```

## Technical Details

### PDF Generation

Uses [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) for client-side PDF generation:
- Combines `html2canvas` for DOM rendering
- Uses `jsPDF` for PDF creation
- 2x scale for high-quality output
- Preserves math formula rendering

### Button Injection

- Uses `MutationObserver` to watch for DOM changes
- Automatically re-injects button on SPA navigation
- Targets multiple selector fallbacks for robustness

### Permissions

- `activeTab`: Access content on NotebookLM pages
- `downloads`: Save PDF to Downloads folder
- `scripting`: Dynamic script injection
- Host: `notebooklm.google.com/*`

## Development

### Requirements

- Chrome browser (version 114+ for Manifest V3 support)

### Building Icons

If you need to regenerate the icons:

```bash
cd icons
python3 generate-icons.py
```

Or use the HTML generator:
```bash
cd icons
open generate.html  # Opens in browser, downloads icons
```

### Testing

1. Load the extension in Chrome
2. Navigate to a NotebookLM note
3. Verify the button appears in the note editor header
4. Click the button and verify PDF downloads correctly
5. Test with notes containing math formulas
6. Test navigation between notes (button should persist)

## Troubleshooting

### Button doesn't appear

- Open DevTools (F12) and check the Console for errors
- Verify you're on `notebooklm.google.com`
- Try refreshing the page
- Check that the extension is enabled in `chrome://extensions/`

### PDF generation fails

- Check Console for error messages
- Try a simpler note first (without complex math)
- Verify internet connection (KaTeX fonts load from CDN)

### Math formulas not rendering correctly

- Ensure you have an internet connection (KaTeX fonts load from CDN)
- Try waiting a moment before clicking export
- Check Console for font loading errors

## License

This extension is based on the NotebookLM Export bookmarklet and uses the following open-source libraries:

- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) - MIT License
- [html2canvas](https://github.com/niklasvh/html2canvas) - MIT License

## Credits

Created as a Chrome extension based on the original NotebookLM Export bookmarklet.

## Version History

- **1.0.0** - Initial release
  - One-click PDF export
  - Math formula support
  - Auto-injection into NotebookLM UI
