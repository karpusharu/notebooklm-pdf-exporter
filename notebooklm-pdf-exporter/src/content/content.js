// content.js - Entry point for NotebookLM PDF Exporter
console.log('[NotebookLM Exporter] Content script loaded, readyState:', document.readyState);

// Global instances
let buttonInjector = null;

// Initialize button injector when DOM is ready
function initializeComponents() {
  try {
    if (typeof ButtonInjector !== 'undefined') {
      console.log('[NotebookLM Exporter] ButtonInjector class found, creating instance');
      buttonInjector = new ButtonInjector();
      buttonInjector.init();
      console.log('[NotebookLM Exporter] Button injector initialized');
    } else {
      console.error('[NotebookLM Exporter] ButtonInjector class not found');
    }
  } catch (error) {
    console.error('[NotebookLM Exporter] Error during initialization:', error);
  }
}

// Wait for document to be ready before initializing
function safeInit() {
  if (document.body) {
    initializeComponents();
  } else {
    // Body doesn't exist yet, wait for it
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeComponents);
    } else {
      // Document is loaded but body doesn't exist - wait a bit
      setTimeout(initializeComponents, 100);
    }
  }
}

// Start initialization
safeInit();

// Also try initialization after delays (for slow-loading SPAs)
const retryDelays = [500, 1000, 2000, 3000];
retryDelays.forEach(delay => {
  setTimeout(() => {
    if (buttonInjector && !buttonInjector.injected) {
      console.log('[NotebookLM Exporter] Retry (' + delay + 'ms): Button not injected yet, forcing retry');
      try {
        buttonInjector.init();
      } catch (error) {
        console.error('[NotebookLM Exporter] Retry error:', error);
      }
    }
  }, delay);
});

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

    safeInit();
  }
});

// Start observing URL changes
try {
  urlObserver.observe(document.documentElement, { subtree: true, childList: true });
} catch (error) {
  console.error('[NotebookLM Exporter] Error setting up URL observer:', error);
}
