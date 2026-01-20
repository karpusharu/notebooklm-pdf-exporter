class ButtonInjector {
  constructor() {
    this.injected = false;
    this.observer = null;
    this.panelObserver = null;
    this.button = null;
    this.targetSelectors = [
      // Primary: NotebookLM note editor headers
      'section.studio-panel note-editor .panel-header',
      'section.studio-panel labs-tailwind-doc-viewer.note-editor .panel-header',
      // Fallback: Main panel headers
      'section.studio-panel .panel-header',
      '[role="main"] header'
    ];
  }

  init() {
    // Try immediate injection
    this.tryInject();

    // Set up MutationObserver for reactive DOM changes
    this.observer = new MutationObserver(() => {
      if (!this.injected) {
        this.tryInject();
      }
    });

    // Observe body for DOM changes
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Watch for panel collapse state changes
    this.watchPanelState();
  }

  watchPanelState() {
    // Find the studio panel element
    const checkPanel = () => {
      const panel = document.querySelector('section.studio-panel');
      if (panel) {
        // Start observing the panel for collapse state changes
        if (!this.panelObserver) {
          this.panelObserver = new MutationObserver(() => {
            this.updateButtonVisibility();
          });
          this.panelObserver.observe(panel, {
            attributes: true,
            attributeFilter: ['class', 'style', 'hidden', 'aria-hidden']
          });
        }
        // Initial visibility check
        this.updateButtonVisibility();
      }
    };

    // Check immediately and on DOM changes
    checkPanel();
    this.observer?.disconnect();
    this.observer = new MutationObserver(checkPanel);
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  updateButtonVisibility() {
    if (!this.button) return;

    const panel = document.querySelector('section.studio-panel');
    if (!panel) {
      console.log('[NotebookLM Exporter] No panel found');
      return;
    }

    // Panel is collapsed when width is less than 100px (collapsed = 56px)
    const panelWidth = panel.offsetWidth;
    const isCollapsed = panelWidth < 100;

    // Show/hide button based on panel state (use !important to override CSS)
    if (isCollapsed) {
      this.button.style.setProperty('display', 'none', 'important');
      console.log('[NotebookLM Exporter] Panel collapsed (' + panelWidth + 'px), hiding button');
    } else {
      this.button.style.setProperty('display', 'inline-flex', 'important');
      console.log('[NotebookLM Exporter] Panel expanded (' + panelWidth + 'px), showing button');
    }
  }

  tryInject() {
    for (const selector of this.targetSelectors) {
      const target = document.querySelector(selector);
      if (target && !this.injected && !document.querySelector('#nlm-export-btn')) {
        this.injectButton(target);
        return;
      }
    }
  }

  injectButton(container) {
    // Create settings-style icon button with download icon
    const button = document.createElement('button');
    button.id = 'nlm-export-btn';
    button.className = 'nlm-export-btn';
    button.setAttribute('title', 'Export to PDF'); // Tooltip for accessibility

    // CSS will handle the styling (transparent background, circular, 32x32px)
    // Just set the inline content
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    `;

    // Store button reference for visibility control
    this.button = button;

    // Append to container
    container.appendChild(button);
    this.injected = true;

    // Check initial panel state
    this.updateButtonVisibility();

    // Attach click handler - always export current note
    button.addEventListener('click', () => {
      if (window.notebookLMExporter) {
        console.log('[NotebookLM Exporter] Exporting current note');
        window.notebookLMExporter.exportToPDF();
      } else {
        console.error('[NotebookLM Exporter] Exporter not initialized');
      }
    });

    console.log('[NotebookLM Exporter] Button injected successfully');
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.panelObserver) {
      this.panelObserver.disconnect();
    }
  }

  // Reset injection state (useful for SPA navigation)
  reset() {
    this.injected = false;
  }
}
