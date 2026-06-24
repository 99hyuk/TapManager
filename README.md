# TabManager

TabManager is a Chrome Manifest V3 extension for saving, organizing, reopening, and restoring browser tabs in a visual workspace.

It is inspired by board-style tab managers: the current Chrome window appears in a sidebar, and saved links live in workspace pages and draggable groups.

## Features

- Open the board directly from the extension icon.
- View tabs from the current Chrome window.
- Create and rename workspace pages.
- Save selected tabs as a new group or add them to an existing group.
- Drag tabs, links, groups, and pages to reorder them.
- Create a group by dragging tabs into empty board space.
- Open saved links individually or open every link in a group.
- Optionally open a group as a Chrome tab group.
- Sort links inside a group.
- Restore recently deleted links and groups.
- Import and export local workspace backups.
- Supports light mode, dark mode, and English/Korean/Japanese/Chinese UI text.
- Stores data locally with `chrome.storage.local`.

## Tech Stack

- Chrome Manifest V3
- Vanilla JavaScript
- HTML/CSS
- No external build tool

## Install Locally

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select this project folder.
5. Click the TabManager extension icon to open the board.

## Files

- `manifest.json`: extension metadata, permissions, icons, and localization entry.
- `background.js`: opens the TabManager board when the extension icon is clicked.
- `newtab.html`: main board document.
- `newtab.css`: board layout, themes, panels, cards, and interactions.
- `newtab.js`: tab loading, storage, drag-and-drop, restore, import/export, and UI logic.
- `_locales/`: Chrome Web Store and extension localization strings.
- `icons/`: extension icons.
- `tests/`: Node test coverage for core behavior and store packaging expectations.

## Privacy

TabManager stores saved tab titles, URLs, workspace pages, link groups, settings, recently deleted items, and backup/import data locally on the user's device using `chrome.storage.local`.

Saved tab data is not sent to an external server by the extension.

## Release

The Chrome Web Store package should include only the extension runtime files:

- `manifest.json`
- `background.js`
- `newtab.html`
- `newtab.css`
- `newtab.js`
- `_locales/`
- `icons/`

Generated ZIP files and local test artifacts are intentionally ignored by git.
