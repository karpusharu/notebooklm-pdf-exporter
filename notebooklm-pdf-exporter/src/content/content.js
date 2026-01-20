// content.js - Entry point for NotebookLM PDF Exporter
console.log('[NotebookLM Exporter] Content script loaded');

// Global instances
let buttonInjector = null;

// Initialize button injector when DOM is ready
function initializeComponents() {
  if (typeof ButtonInjector !== 'undefined') {
    buttonInjector = new ButtonInjector();
    buttonInjector.init();
    console.log('[NotebookLM Exporter] Button injector initialized');
  } else {
    console.error('[NotebookLM Exporter] ButtonInjector class not found');
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeComponents);
} else {
  initializeComponents();
}

// Handle SPA navigation (NotebookLM is a single-page app)
let lastUrl = location.href;
const urlObserver = new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('[NotebookLM Exporter] URL changed, re-initializing components');

    // Re-initialize button injector on navigation
    if (buttonInjector) {
      buttonInjector.reset();
    }

    initializeComponents();
  }
});

// Start observing URL changes
urlObserver.observe(document, { subtree: true, childList: true });
