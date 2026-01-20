// serviceWorker.js - Background service worker for NotebookLM PDF Exporter

console.log('[NotebookLM Exporter] Background service worker initialized');

// Extension installation
self.addEventListener('install', (event) => {
  console.log('[NotebookLM Exporter] Extension installed');
});

// Extension activation
self.addEventListener('activate', (event) => {
  console.log('[NotebookLM Exporter] Extension activated');
});

// Handle extension icon click (optional - could open options page)
self.addEventListener('action', (event) => {
  console.log('[NotebookLM Exporter] Extension icon clicked');
  // Could open options page or show notification here
});
