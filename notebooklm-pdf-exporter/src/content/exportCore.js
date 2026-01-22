// Alternative version using your original approach (more reliable)
// This opens a new window and shows print dialog

class NotebookLMExporter {
  constructor() {
    this.selectors = [
      'section.studio-panel labs-tailwind-doc-viewer.note-editor',
      'section.studio-panel note-editor',
      'section.studio-panel',
      '[role="main"]'
    ];
  }

  /**
   * Sanitize filename by removing illegal characters
   * @param {string} filename - The filename to sanitize
   * @returns {string} - Sanitized filename safe for all operating systems
   */
  sanitizeFilename(filename) {
    // Remove characters that are illegal in Windows, macOS, and Linux filenames
    // Illegal: < > : " / \ | ? *
    return filename
      .replace(/[<>:"/\\|?*]/g, '-')  // Replace illegal chars with hyphen
      .replace(/\s+/g, '_')           // Replace spaces with underscores
      .replace(/_{2,}/g, '_')         // Replace multiple underscores with single
      .replace(/^_+|_+$/g, '')        // Remove leading/trailing underscores
      .substring(0, 200);             // Limit to 200 characters
  }

  pickTarget() {
    for (const selector of this.selectors) {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`[NotebookLM Exporter] Found target with selector: ${selector}`);
        return element;
      }
    }
    console.warn('[NotebookLM Exporter] No specific selector found, using document.body');
    return document.body;
  }

  collectMathStyles() {
    const nodes = [];
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (href.includes('katex') || href.includes('mathjax') || href.includes('mjx')) {
        nodes.push(link.outerHTML);
      }
    });

    document.querySelectorAll('style').forEach(style => {
      const id = (style.id || '').toLowerCase();
      const txt = style.textContent || '';
      if (
        id.startsWith('mjx-') ||
        id.includes('mathjax') ||
        txt.includes('.katex') ||
        txt.includes('MJX') ||
        txt.includes('--katex')
      ) {
        nodes.push(`<style>${style.textContent}</style>`);
      }
    });

    console.log(`[NotebookLM Exporter] Collected ${nodes.length} math style blocks`);
    return nodes;
  }

  prepareContent() {
    const src = this.pickTarget();
    if (!src) {
      throw new Error("Could not find NotebookLM note content");
    }

    console.log(`[NotebookLM Exporter] Source element found, child count: ${src.children.length}`);

    const clone = src.cloneNode(true);

    // Remove UI elements
    const removeSel = [
      "button", "[role='button']", "mat-icon", "nav", "header", "footer",
      ".mdc-icon-button", ".mat-mdc-icon-button", ".note-editor-delete-button",
      ".panel-header", ".panel-header-content", ".panel-header .mat-icon",
      ".xap-inline-dialog", ".citation-marker", "[contenteditable='true']",
      ".breadcrumb-icon", ".panel-header-clickable", ".mat-mdc-button-touch-target",
      "#nlm-export-btn", "iframe", "embed", "object", "script"
    ].join(",");

    const removedCount = clone.querySelectorAll(removeSel).length;
    clone.querySelectorAll(removeSel).forEach(el => el.remove());
    console.log(`[NotebookLM Exporter] Removed ${removedCount} UI elements`);

    const textContent = clone.textContent || '';
    console.log(`[NotebookLM Exporter] Clone text length: ${textContent.length} chars`);

    return { clone, src };
  }

  buildPrintDocument(clone) {
    const titleTxt =
      (document.querySelector('input[aria-label="note title editable"]')?.value?.trim()) ||
      document.title.replace(/\s+–.*$/, "") ||
      "NotebookLM Export";

    console.log(`[NotebookLM Exporter] Document title: "${titleTxt}"`);

    const wrapper = document.createElement("div");
    wrapper.className = "page";

    const h1 = document.createElement("h1");
    h1.textContent = titleTxt;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = "Exported from NotebookLM — " + new Date().toLocaleString();

    wrapper.appendChild(h1);
    wrapper.appendChild(meta);
    wrapper.appendChild(clone);

    const tmp = document.createElement("div");
    tmp.appendChild(wrapper);
    const bodyContent = tmp.innerHTML;

    console.log(`[NotebookLM Exporter] Body content length: ${bodyContent.length} chars`);

    const baseStyle = `
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      html, body { margin:0; padding:0; }
      body {
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
        color:#111;
        background:#fff;
        position: relative;
      }
      .page {
        max-width: 820px;
        margin: 24px auto 48px;
        padding: 0 16px;
        min-height: calc(100vh - 120px);
      }
      .meta {
        font-size: 10px;
        color: #999;
        font-style: italic;
        text-align: center;
        margin: 24px 0 8px;
        padding-top: 16px;
        border-top: 1px solid #e5e7eb;
      }
      h1 { font-size: 22px; margin: 0 0 8px; }
      h2,h3,h4 { page-break-after: avoid; margin-top: 24px; }
      p, div, li { line-height: 1.5; font-size: 14.5px; }
      ul, ol { padding-inline-start: 22px; }
      img, pre, code, blockquote, table { page-break-inside: avoid; }
      table {
        border-collapse: collapse !important;
        width: 100% !important;
        margin: 16px 0 !important;
      }
      table th,
      table td,
      tbody tr td,
      thead tr th {
        border: 1px solid #d1d5db !important;
        padding: 8px 12px !important;
        text-align: left !important;
      }
      table th,
      thead tr th {
        background-color: #f3f4f6 !important;
        font-weight: 600 !important;
      }
      a { color: inherit; text-decoration: none; }
      hr { border: none; height: 1px; background: #e5e7eb; margin: 16px 0; }
      .katex, .MathJax, .mjx-chtml { font-size: 1em; }
      .katex-display, .mjx-display { page-break-inside: avoid; }
      math, .MathJax, .katex {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .pdf-page-break {
        page-break-before: always;
        height: 0;
        visibility: hidden;
      }
      @page {
        margin: 16mm;
      }
      @media print {
        .no-print { display: none !important; }
        /* Hide browser-generated artifacts */
        @page {
          margin: 16mm;
        }
        /* Ensure clean headers/footers */
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        /* Force table borders in print */
        table {
          border-collapse: collapse !important;
        }
        table th,
        table td,
        tbody tr td,
        thead tr th {
          border: 1px solid #d1d5db !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        table th,
        thead tr th {
          background-color: #f3f4f6 !important;
        }
      }
    `;

    const mathStyleNodes = this.collectMathStyles();
    const katexFallback = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">`;

    const headExtras = [`<style>${baseStyle}</style>`, ...mathStyleNodes];
    if (!mathStyleNodes.join('\n').toLowerCase().includes('katex')) {
      headExtras.push(katexFallback);
    }

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${titleTxt}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${headExtras.join('\n')}
</head>
<body>
  ${bodyContent}
  <script>
    (async () => {
      try {
        if (document.fonts && document.fonts.ready) { await document.fonts.ready; }
      } catch(e) {}
      setTimeout(() => { try { window.print(); } catch(e) {} }, 250);
    })();
  <\/script>
</body>
</html>`;

    // Sanitize filename for cross-platform compatibility
    const sanitizedTitle = this.sanitizeFilename(titleTxt);
    return { html, filename: `${sanitizedTitle}.html` };
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Update loading indicator message
   */
  updateLoadingIndicator(message) {
    const statusEl = document.getElementById('nlm-export-status');
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  async exportToPDF() {
    try {
      console.log('[NotebookLM Exporter] ===== Starting PDF export =====');

      this.showLoadingIndicator();

      const { clone } = this.prepareContent();
      const { html } = this.buildPrintDocument(clone);

      console.log(`[NotebookLM Exporter] HTML document length: ${html.length} chars`);

      // YOUR ORIGINAL APPROACH: Use Blob URL and open new window
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const w = window.open(url, "_blank");

      if (!w) {
        alert("Pop-up blocked. Please allow pop-ups for this site and try again.");
        URL.revokeObjectURL(url);
        this.hideLoadingIndicator();
        return;
      }

      console.log('[NotebookLM Exporter] Opened new window with content');

      // Clean up URL after 5 seconds
      setTimeout(() => {
        try { URL.revokeObjectURL(url); } catch(_) {}
      }, 5000);

      this.hideLoadingIndicator();

      console.log('[NotebookLM Exporter] ===== Export complete! Use print dialog to save as PDF =====');

    } catch (error) {
      console.error('[NotebookLM Exporter] ===== Export failed =====');
      console.error('[NotebookLM Exporter] Error:', error);
      this.hideLoadingIndicator();
      alert('Failed to export: ' + error.message);
    }
  }

  showLoadingIndicator(message = 'Opening print window...') {
    const overlay = document.createElement('div');
    overlay.id = 'nlm-export-overlay';
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7); display: flex; align-items: center;
      justify-content: center; z-index: 1000000;
    `;
    overlay.innerHTML = `
      <div style="background: white; padding: 32px; border-radius: 8px; text-align: center; min-width: 300px;">
        <div style="margin-bottom: 16px; font-size: 18px; font-weight: 500;">${message}</div>
        <div style="color: #666; font-size: 14px; margin-bottom: 12px;">Please wait</div>
        <div id="nlm-export-status" style="color: #999; font-size: 12px; min-height: 18px;"></div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  hideLoadingIndicator() {
    const overlay = document.getElementById('nlm-export-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }
}

window.notebookLMExporter = new NotebookLMExporter();
