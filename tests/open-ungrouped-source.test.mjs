import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../newtab.js", import.meta.url), "utf8");
const html = await readFile(new URL("../newtab.html", import.meta.url), "utf8");
const css = await readFile(new URL("../newtab.css", import.meta.url), "utf8");
const manifest = JSON.parse(await readFile(new URL("../manifest.json", import.meta.url), "utf8"));

function cssBlock(selector) {
  const match = css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{[^}]+\\}`));
  assert.ok(match, `Missing CSS block for ${selector}`);
  return match[0];
}

function sourceFunctionBlock(name, nextName) {
  const match = source.match(new RegExp(`function ${name}\\(\\) \\{[\\s\\S]*?\\n  \\}\\n\\n  function ${nextName}`));
  assert.ok(match, `Missing ${name} function block`);
  return match[0];
}

test("manifest exposes Chrome Web Store locales for supported languages", async () => {
  assert.equal(manifest.default_locale, "en");
  assert.equal(manifest.name, "__MSG_extName__");
  assert.equal(manifest.description, "__MSG_extDescription__");
  assert.equal(manifest.action.default_title, "__MSG_extName__");

  for (const locale of ["en", "ko", "ja", "zh_CN"]) {
    const messages = JSON.parse(
      await readFile(new URL(`../_locales/${locale}/messages.json`, import.meta.url), "utf8")
    );
    assert.equal(messages.extName.message, "TabManager");
    assert.ok(messages.extDescription.message.length > 0);
    assert.ok(messages.extDescription.message.length <= 132);
  }
});

test("project columns open all links from the sites button using the settings mode", () => {
  assert.match(source, /openLinksUngrouped/);
  assert.match(source, /openSitesAsGroup: true/);
  assert.match(html, /id="settingOpenSitesAsGroup"/);
  assert.match(source, /settingOpenSitesAsGroup\.addEventListener\("change"/);
  assert.match(source, /dataset\.action === "open-sites"/);
  assert.match(source, /state\.settings\.openSitesAsGroup[\s\S]*tabsApi\.openGroup/);
  assert.match(source, /tabsApi\.openLinksUngrouped/);
  assert.doesNotMatch(source, /dataset\.action === "open-ungrouped"/);
  assert.doesNotMatch(source, /createColumnButton\("\\u2197"/);
});

test("settings expose a persisted dark mode toggle", () => {
  assert.match(html, /id="settingDarkMode"/);
  assert.match(source, /darkMode: false/);
  assert.match(source, /classList\.toggle\("theme-dark"/);
  assert.match(source, /settingDarkMode\.addEventListener\("change"/);
  assert.match(css, /:root\.theme-dark/);
});

test("dark mode setting is the final settings row", () => {
  const settingsList = html.match(/<div class="settings-list">([\s\S]*?)<\/div>\s*<section id="backupSection"/)?.[1] || "";
  assert.ok(settingsList.includes('id="settingOpenSitesAsGroup"'));
  assert.ok(settingsList.includes('id="settingDarkMode"'));
  assert.ok(
    settingsList.lastIndexOf('id="settingDarkMode"') >
      settingsList.lastIndexOf('id="settingOpenSitesAsGroup"')
  );
});

test("settings expose localized compressed backup import and export", () => {
  assert.match(html, /<div class="settings-list">[\s\S]*<\/div>\s*<section id="backupSection" class="backup-section"[\s\S]*<section class="deleted-section"/);
  assert.match(html, /id="backupSection"/);
  assert.match(html, /data-i18n="backup\.title">Backup & transfer/);
  assert.match(html, /id="importBackup"/);
  assert.match(html, /id="exportBackup"/);
  assert.match(html, /id="backupFileInput"/);
  assert.match(html, /accept="\.json,\.gz,\.gzip,\.tabmanager,application\/json,application\/gzip"/);
  assert.match(source, /const BACKUP_FORMAT = "TabManagerBackup"/);
  assert.match(source, /backupFileInput: document\.getElementById\("backupFileInput"\)/);
  assert.match(source, /importBackup: document\.getElementById\("importBackup"\)/);
  assert.match(source, /exportBackup: document\.getElementById\("exportBackup"\)/);
  assert.match(source, /function createBackupPayload/);
  assert.match(source, /async function exportBackup/);
  assert.match(source, /async function importBackupFile/);
  assert.match(source, /async function createBackupBlob/);
  assert.match(source, /async function readBackupFileText/);
  assert.match(source, /function isGzipBackup/);
  assert.match(source, /new CompressionStream\("gzip"\)/);
  assert.match(source, /new DecompressionStream\("gzip"\)/);
  assert.match(source, /tabmanager-backup-\$\{timestamp\}\.json\.gz/);
  assert.match(source, /backupFileInput\.click\(\)/);
  assert.match(source, /backupFileInput\.addEventListener\("change"/);
  assert.match(source, /persist\(migrateState\(backupState\)\)/);
  assert.match(source, /confirm\(t\("backup\.importConfirm"\)\)/);
  assert.match(source, /"backup\.import": "Import"/);
  assert.match(source, /"backup\.export": "Export"/);
  assert.match(source, /"backup\.import": "가져오기"/);
  assert.match(source, /"backup\.export": "내보내기"/);
  assert.match(source, /"backup\.import": "导入"/);
  assert.match(source, /"backup\.export": "导出"/);
  assert.match(source, /"backup\.import": "インポート"/);
  assert.match(source, /"backup\.export": "エクスポート"/);
  assert.match(css, /\.backup-section/);
  assert.match(css, /\.backup-actions/);
  assert.match(css, /\.backup-button/);
});

test("settings expose language selection and localized UI text", () => {
  assert.match(html, /id="settingLanguage"/);
  assert.match(html, /data-i18n=/);
  assert.match(html, /data-i18n-title=/);
  assert.match(source, /language: "en"/);
  assert.match(source, /const TRANSLATIONS = \{/);
  assert.match(source, /ko: \{/);
  assert.match(source, /zh: \{/);
  assert.match(source, /ja: \{/);
  assert.match(source, /function t\(/);
  assert.match(source, /function applyLanguage/);
  assert.match(source, /settingLanguage\.addEventListener\("change"/);
});

test("settings expose a current-tab link toggle with a localized label", () => {
  assert.match(html, /id="settingOpenLinksCurrentTab"/);
  assert.doesNotMatch(html, /id="settingOpenLinksNewTab"/);
  assert.match(html, /data-i18n="settings\.openLinks\.title">Open links in current tab/);
  assert.match(html, /<input id="settingOpenLinksCurrentTab" type="checkbox" \/>/);
  assert.match(source, /openLinksInCurrentTab: false/);
  assert.doesNotMatch(source, /openLinksInNewTab: true/);
  assert.match(source, /settingOpenLinksCurrentTab: document\.getElementById\("settingOpenLinksCurrentTab"\)/);
  assert.match(source, /settingOpenLinksCurrentTab\.checked = state\.settings\.openLinksInCurrentTab/);
  assert.match(source, /openLinksInCurrentTab: elements\.settingOpenLinksCurrentTab\.checked/);
  assert.match(source, /typeof rawSettings\.openLinksInNewTab === "boolean"[\s\S]*settings\.openLinksInCurrentTab = !rawSettings\.openLinksInNewTab/);
  assert.match(source, /delete settings\.openLinksInNewTab/);
  assert.match(source, /"settings\.openLinks\.title": "링크를 현재 탭에서 열기"/);
  assert.match(source, /"settings\.openLinks\.title": "在当前标签页打开链接"/);
  assert.match(source, /"settings\.openLinks\.title": "リンクを現在のタブで開く"/);
});

test("language changes do not rename board page tabs", () => {
  assert.match(source, /function getDisplayPageName\(page\) \{[\s\S]*return page\.name;[\s\S]*\}/);
  assert.doesNotMatch(source, /return t\(`page\.\$\{page\.id\}`\)/);
  assert.match(source, /return `Page \$\{pageNumber\}`;/);
});

test("settings button toggles the settings panel and uses a gear icon", () => {
  assert.doesNotMatch(html, /<span aria-hidden="true">\.\.\.<\/span>/);
  assert.match(html, /class="settings-icon"/);
  assert.match(source, /function toggleSettingsPanel/);
  assert.match(source, /toggleSettingsPanel\(!isSettingsPanelOpen\(\)\)/);
  assert.match(source, /function closeSettingsPanel/);
});

test("top toolbar exposes a create page button", () => {
  assert.match(html, /id="modeTabs"/);
  assert.match(html, /id="createTopPage"/);
  assert.match(html, /class="mode-toolbar"[\s\S]*id="createTopPage"/);
  assert.match(source, /const MAX_PAGES = 10/);
  assert.match(source, /pages: DEFAULT_PAGES/);
  assert.match(source, /createTopPage: document\.getElementById\("createTopPage"\)/);
  assert.match(source, /createTopPage\.addEventListener\("click", createPage\)/);
  assert.match(source, /You can create up to 10 pages/);
  assert.match(source, /renderModeTabs\(\)[\s\S]*for \(const page of state\.pages\)/);
  assert.match(css, /\.mode-toolbar/);
  assert.match(css, /\.create-top-page/);
});

test("top toolbar uses the extension icon before page tabs", () => {
  assert.match(html, /class="board-icon"[\s\S]*src="icons\/icon32\.png"/);
  assert.match(html, /class="board-icon-image"/);
  assert.match(css, /\.board-icon[\s\S]*display: inline-flex/);
  assert.match(css, /\.board-icon-image[\s\S]*object-fit: contain/);
});

test("page tabs can be renamed from the toolbar", () => {
  assert.match(source, /startPageRename/);
  assert.match(source, /renamePage/);
  assert.match(source, /modeTabs\.addEventListener\("dblclick"/);
  assert.match(source, /input\.className = "mode-tab-input"/);
  assert.match(source, /showToast\(t\("toast\.pageRenamed"\)/);
  assert.match(css, /\.mode-tab-input/);
});

test("page tabs can be reordered and dragged to trash", () => {
  assert.match(html, /id="pageTrashDrop"/);
  assert.match(source, /pageDragState/);
  assert.match(source, /button\.draggable = state\.pages\.length > 1/);
  assert.match(source, /function movePage/);
  assert.match(source, /function deletePage/);
  assert.match(source, /function animateModeTabReflow/);
  assert.match(source, /function previewPagePlacement/);
  assert.match(source, /function getPreviewPageOrder/);
  assert.match(source, /function isPointerInsideElement/);
  assert.match(source, /shouldCommitPreview/);
  assert.match(source, /item\.animate/);
  assert.match(source, /modeTabs\.addEventListener\("dragstart", startPageDrag\)/);
  assert.match(source, /modeTabs\.addEventListener\("drop", handlePageDrop\)/);
  assert.match(source, /pageTrashDrop\.addEventListener\("drop", handlePageTrashDrop\)/);
  assert.match(html, /Drop to delete page/);
  assert.match(css, /\.page-trash-drop/);
  assert.match(css, /\.page-trash-icon/);
  assert.match(css, /will-change: transform/);
  assert.match(css, /\.mode-tab\.is-page-drop-before::before/);
});

test("project columns and saved links preview reorder with animation", () => {
  assert.match(source, /function animateElementReflow/);
  assert.match(source, /function previewProjectPlacement/);
  assert.match(source, /function getPreviewProjectOrder/);
  assert.match(source, /function previewSavedLinkPlacement/);
  assert.match(source, /function getPreviewLinkMove/);
  assert.match(source, /projectBoard\.insertBefore/);
  assert.match(source, /querySelector\("\.link-list"\)/);
  assert.match(css, /\.project-column[\s\S]*will-change: transform/);
  assert.match(css, /\.saved-link[\s\S]*will-change: transform/);
});

test("saved groups first keeps manual project order inside saved and empty partitions", () => {
  const getModeProjects = sourceFunctionBlock("getModeProjects", "getActiveProject");

  assert.match(getModeProjects, /return leftSaved - rightSaved;/);
  assert.doesNotMatch(getModeProjects, /createdAt/);
});

test("project columns expose localized sort menu actions", () => {
  assert.match(source, /const SORT_OPTIONS = \[/);
  assert.match(source, /title-asc/);
  assert.match(source, /title-desc/);
  assert.match(source, /recent-asc/);
  assert.match(source, /recent-desc/);
  assert.match(source, /sortMenuProjectId/);
  assert.match(source, /function sortProjectLinks/);
  assert.match(source, /function renderSortMenu/);
  assert.match(source, /lastVisitedAt/);
  assert.match(source, /dataset\.action = "sort-project"/);
  assert.match(source, /dataset\.sortKey = option\.id/);
  assert.match(source, /sort\.titleAsc/);
  assert.match(source, /sort\.recentDesc/);
  assert.match(css, /\.column-sort-wrap/);
  assert.match(css, /\.sort-menu/);
});

test("state migration preserves link visit timestamps for recent sorting", () => {
  assert.match(source, /lastVisitedAt: Number\.isFinite\(link\.lastVisitedAt\)/);
  assert.match(source, /lastVisitedAt: Number\.isFinite\(entry\.link\.lastVisitedAt\)/);
});

test("project header keeps sites below the title and sort control out of document flow", () => {
  assert.match(cssBlock(".column-title"), /display: block/);
  assert.doesNotMatch(cssBlock(".column-title"), /grid-template-columns/);
  assert.match(cssBlock(".site-count"), /margin-top: 6px/);
  assert.doesNotMatch(cssBlock(".site-count"), /justify-self: end/);
  assert.match(cssBlock(".column-actions"), /display: flex/);
  assert.match(cssBlock(".column-sort-wrap"), /position: absolute/);
});

test("saved link reorder adjusts same-group insertion before clamping", () => {
  assert.match(source, /let requestedIndex =[\s\S]*insertAt[\s\S]*targetWithoutLink\.links\.length/);
  assert.match(
    source,
    /sourceProjectId === targetProjectId && sourceIndex < requestedIndex[\s\S]*requestedIndex -= 1/
  );
  assert.match(
    source,
    /const insertionIndex = Math\.min\(requestedIndex, targetWithoutLink\.links\.length\)/
  );
  assert.doesNotMatch(source, /Math\.min\(insertAt, targetWithoutLink\.links\.length\)[\s\S]*sourceIndex < insertionIndex/);
});

test("board search stays expanded in the top toolbar", () => {
  assert.match(css, /\.board-search \{[\s\S]*width: 190px/);
  assert.match(css, /\.board-search input \{[\s\S]*width: 100%/);
  assert.doesNotMatch(css, /\.board-search:hover input/);
});

test("top toolbar exposes a localized multi-page help modal before search", () => {
  assert.match(html, /id="openHelp"/);
  assert.match(html, /class="toolbar-button help-button"/);
  assert.match(html, /class="book-icon"/);
  assert.match(html, /class="help-label" data-i18n="help\.label">Help/);
  assert.match(html, /id="openHelp"[\s\S]*<label class="board-search"/);
  assert.match(html, /id="helpModal"/);
  assert.match(html, /id="helpPrev"/);
  assert.match(html, /id="helpNext"/);
  assert.match(html, /id="helpDots"/);
  assert.match(source, /const HELP_SLIDES = \[/);
  assert.match(source, /help\.slide1\.title/);
  assert.match(
    source,
    /const HELP_SLIDES = \[\s*\{ titleKey: "help\.slide1\.title", bodyKey: "help\.slide1\.body", visual: "select" \},\s*\{ titleKey: "help\.slide2\.title", bodyKey: "help\.slide2\.body", visual: "open" \},\s*\{ titleKey: "help\.slide3\.title", bodyKey: "help\.slide3\.body", visual: "reorder" \},\s*\{ titleKey: "help\.slide4\.title", bodyKey: "help\.slide4\.body", visual: "pages" \}\s*\]/
  );
  assert.doesNotMatch(source, /help\.slide5/);
  assert.match(source, /helpVisual\.dataset\.visual = slide\.visual/);
  assert.match(source, /function openHelpModal/);
  assert.match(source, /function renderHelpSlide/);
  assert.match(source, /openHelp\.addEventListener\("click", openHelpModal\)/);
  assert.match(source, /helpNext\.addEventListener\("click"/);
  assert.match(source, /helpPrev\.addEventListener\("click"/);
  assert.match(source, /function getHelpTextValues/);
  assert.match(source, /currentWindow: t\("sidebar\.currentWindow"\)/);
  assert.match(source, /newGroup: t\("action\.newGroup"\)/);
  assert.match(source, /addToGroup: t\("action\.addToGroup"\)/);
  assert.match(source, /t\(slide\.bodyKey, getHelpTextValues\(\)\)/);
  assert.match(source, /\{currentWindow\}/);
  assert.match(source, /\{newGroup\}/);
  assert.match(source, /\{addToGroup\}/);
  assert.match(source, /drag them onto the board/);
  assert.doesNotMatch(source, /Current window에서|在 Current window|Current window で/);
  assert.match(css, /\.help-modal/);
  assert.match(css, /\.help-card/);
  assert.match(css, /\.book-icon/);
  assert.match(css, /\.help-label/);
  assert.match(css, /\.help-visual\[data-visual="pages"\]/);
  assert.match(css, /\.help-visual\[data-visual="select"\]/);
  assert.match(css, /\.help-visual\[data-visual="reorder"\]/);
  assert.match(css, /\.help-visual\[data-visual="open"\]/);
  assert.match(css, /\.help-visual\[data-visual="search"\]/);
  assert.match(source, /"help\.label": "Help"/);
  assert.match(source, /"help\.label": "도움말"/);
  assert.match(source, /"help\.label": "帮助"/);
  assert.match(source, /"help\.label": "ヘルプ"/);
});

test("current tab sidebar defaults pinned but persists the user's collapsed choice", () => {
  assert.doesNotMatch(html, /<html lang="en" class="sidebar-expanded"/);
  assert.doesNotMatch(html, /id="toggleSidebar"[\s\S]*aria-pressed="true"/);
  assert.match(source, /sidebarPinned: true/);
  assert.match(source, /let sidebarPinned = DEFAULT_STATE\.settings\.sidebarPinned;/);
  assert.match(source, /function renderSidebarPinState/);
  assert.match(source, /sidebarPinned = state\.settings\.sidebarPinned !== false/);
  assert.match(source, /elements\.toggleSidebar\.classList\.toggle\("is-active", sidebarPinned\)/);
  assert.match(source, /elements\.toggleSidebar\.setAttribute\("aria-pressed", String\(sidebarPinned\)\)/);
  assert.match(source, /setSidebarExpanded\(sidebarPinned\)/);
  assert.match(source, /const nextSidebarPinned = !sidebarPinned/);
  assert.match(source, /sidebarPinned: nextSidebarPinned/);
  assert.match(source, /state = await storage\.load\(\);\s*sidebarPinned = state\.settings\.sidebarPinned !== false;\s*renderSidebarPinState\(\)/);
});

test("selected current tabs expose bottom save actions", () => {
  assert.match(html, /id="selectedTabActions"/);
  assert.match(html, /id="saveSelectedNewProject"/);
  assert.match(html, /id="saveSelectedActiveProject"/);
  assert.match(html, /id="addToGroupMenu"/);
  assert.match(source, /saveSelectedTabsToNewProject/);
  assert.match(source, /saveSelectedTabsToProject/);
  assert.match(source, /renderAddToGroupMenu/);
  assert.match(source, /selectedTabActions\.hidden = !hasSelectedTabs/);
  assert.match(css, /--session-panel-width: 286px/);
  assert.match(css, /\.selected-tab-actions\.is-visible/);
  assert.match(css, /\.add-to-group-menu/);
});

test("empty board guides users to drag tabs into a new group", () => {
  assert.match(html, /Drag tabs here to create your first group/);
  assert.match(html, /Drop one or more tabs from Current window/);
  assert.match(html, /class="empty-category-hints"/);
  assert.match(css, /\.empty-category-art::before/);
  assert.match(css, /\.empty-category-hints span/);
});

test("project board exposes an empty-space create group button", () => {
  assert.match(html, /id="addGroupSpace"/);
  assert.match(html, /id="addGroupButton"/);
  assert.match(html, /class="add-group-space"/);
  assert.match(source, /addGroupSpace: document\.getElementById\("addGroupSpace"\)/);
  assert.match(source, /addGroupButton: document\.getElementById\("addGroupButton"\)/);
  assert.match(source, /addGroupSpace\.hidden = projects\.length === 0/);
  assert.match(source, /addGroupButton\.addEventListener\("click", \(\) => createProject\(t\("name\.untitled"\)\)\)/);
  assert.match(css, /\.add-group-space \{[\s\S]*pointer-events: none/);
  assert.match(css, /\.add-group-button \{[\s\S]*pointer-events: auto/);
  assert.match(css, /\.add-group-space-control/);
  assert.match(css, /\.add-group-button\.is-space-drop-target/);
});
