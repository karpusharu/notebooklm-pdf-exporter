# NotebookLM PDF Exporter

**Version 1.0** - A Chrome extension for exporting NotebookLM notes to beautifully formatted PDFs with one click.

## Features

- ✨ **One-Click Export** - Instantly export any NotebookLM note to PDF
- 📄 **Clean Formatting** - Preserves formatting, including mathematical equations (KaTeX/MathJax)
- 🎯 **Smart Panel Detection** - Button automatically hides when panel is collapsed
- 🔲 **Minimal UI** - Settings-style icon button that blends seamlessly with NotebookLM
- 📱 **Responsive** - Works with different panel sizes and layouts

## Installation

### From Chrome Web Store (Coming Soon)

### Manual Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `notebooklm-pdf-exporter` folder

## Usage

1. Open any note in [NotebookLM](https://notebooklm.google.com)
2. Click the download icon button in the panel header
3. A new tab will open with a print-ready version of your note
4. Use the print dialog to save as PDF

## How It Works

The extension:
1. Detects when you're on a NotebookLM note page
2. Injects a download icon button into the panel header
3. Extracts the current note content, including all math formulas
4. Opens a new tab with a cleaned, print-ready version
5. Automatically triggers the print dialog for PDF export

## Technical Details

- **Manifest Version**: 3
- **Permissions**: `activeTab`, `downloads`, `scripting`
- **Host**: `https://notebooklm.google.com/*`
- **Content Security Policy**: CSP-compliant (no inline scripts on host page)

### Key Components

- **manifest.json** - Extension configuration
- **content.js** - Content script entry point
- **buttonInjector.js** - UI button management with smart visibility
- **exportCore.js** - PDF export logic with math formula preservation
- **styles.css** - Button styling matching NotebookLM design

## Browser Compatibility

- Chrome/Chromium 88+
- Microsoft Edge 88+
- Any Chromium-based browser

## Development

```bash
# Clone repository
git clone https://github.com/yourusername/notebooklm-pdf-exporter.git

# Load in Chrome
chrome://extensions → Load unpacked → Select notebooklm-pdf-exporter folder
```

## File Structure

```
notebooklm-pdf-exporter/
├── manifest.json              # Extension configuration
├── icons/                     # Extension icons (16, 48, 128px)
├── src/
│   ├── background/
│   │   └── serviceWorker.js   # Background service worker
│   ├── content/
│   │   ├── content.js         # Entry point
│   │   ├── buttonInjector.js  # Button injection & visibility
│   │   ├── exportCore.js      # Export logic
│   │   └── styles.css         # Button styles
│   └── lib/
│       ├── html2canvas.min.js # Canvas generation
│       └── html2pdf.bundle.min.js # PDF creation
```

## Known Limitations

- Exports currently open notes only (not bulk export)
- Requires note to be open in editor
- Print dialog must be manually confirmed

## Credits

Created as a productivity tool for NotebookLM users.

## License

MIT License - See LICENSE file for details

## Version History

### v1.0.0 (January 2026)
- Initial release
- One-click PDF export
- Smart button visibility
- Mathematical formula support
- Panel collapse detection

## Support

For issues, feature requests, or contributions, please visit:
- GitHub Issues: [Create Issue](https://github.com/yourusername/notebooklm-pdf-exporter/issues)
