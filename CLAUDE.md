# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a standalone JavaScript bookmarklet for exporting NotebookLM notes to a printable HTML format. The entire project is contained in `Program.js`, which is designed to be executed as a bookmarklet in the browser console.

## Architecture

The script operates in a single execution context with these key phases:

1. **Target Selection** (`pickTarget()`): Attempts to find the NotebookLM note editor container using a fallback chain of selectors
2. **DOM Cloning & Cleanup**: Clones the target element and removes UI cruft (buttons, icons, navigation)
3. **Title Extraction**: Attempts to extract the note title from an input field or falls back to the page title
4. **Style Collection** (`collectMathStyles()`): Extracts KaTeX/MathJax styles from the page to preserve mathematical notation
5. **HTML Generation**: Builds a self-contained HTML document with embedded styles and print-optimized CSS
6. **Print Trigger**: Opens a new window via Blob URL, waits for webfonts to load, then triggers the print dialog

## Key Technical Details

- **CSP Compatibility**: The script avoids `innerHTML` assignments on the main page (only uses it on temporary elements) to prevent Content Security Policy violations
- **Math Rendering**: Preserves KaTeX and MathJax formulas by collecting existing styles and providing a CDN fallback (jsdelivr 0.16.11)
- **Blob URL**: Creates an isolated print context to avoid interfering with the NotebookLM page
- **Font Loading**: Waits for `document.fonts.ready` before printing to ensure KaTeX fonts render properly
- **Popup Detection**: Detects if the browser blocks the popup and alerts the user
- **Selector Strategy**: Uses defensive fallback selectors to target different NotebookLM UI versions

## Title Extraction

The script attempts to extract the note title in this order:
1. `input[aria-label="note title editable"]` - The editable title input field
2. `document.title` (with "– NotebookLM" suffix stripped)
3. Falls back to "NotebookLM Export"

## Cleanup Selectors

The following elements are removed from the cloned DOM:
- Interactive elements: `button`, `[role='button']`, `[contenteditable='true']`
- Navigation/structural: `nav`, `header`, `footer`
- Icons: `mat-icon`, `.mat-mdc-button-touch-target`
- Material Design buttons: `.mdc-icon-button`, `.mat-mdc-icon-button`
- Panel chrome: `.panel-header`, `.panel-header-content`, `.panel-header .mat-icon`, `.panel-header-clickable`
- NotebookLM-specific: `.note-editor-delete-button`, `.xap-inline-dialog`, `.citation-marker`, `.breadcrumb-icon`

## Print Optimization

The generated HTML includes print-specific CSS:
- Page break avoidance for headings, code blocks, tables, and images
- Max-width container (820px) for readable output
- KaTeX/MathJax font size normalization and color adjustment
- 16mm page margins with CSS `@page` rule
- Light color scheme enforced

## Usage

The script is meant to be run in the browser DevTools console while on a NotebookLM note page:

1. Open NotebookLM and navigate to a note
2. Open browser DevTools (F12 or Cmd+Option+I)
3. Paste the entire `Program.js` contents into the console
4. The script will open a new tab/window with a print-ready version of the note

## Selector Notes

The primary selectors target Angular/Material Design elements used by NotebookLM:
- `section.studio-panel labs-tailwind-doc-viewer.note-editor`: Most specific editor selector
- `section.studio-panel note-editor`: Alternate editor selector
- `section.studio-panel`: Panel container fallback
- `[role="main"]`: ARIA main landmark fallback
- `document.body`: Ultimate fallback

If NotebookLM updates their DOM structure, the `pickTarget()` function may need adjustment.
