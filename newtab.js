(function () {
  "use strict";

  const STORAGE_KEY = "tabManagerState";
  const DRAG_MIME_TYPE = "application/x-tabmanager";
  const BACKUP_FORMAT = "TabManagerBackup";
  const BACKUP_VERSION = 1;
  const MAX_PAGES = 10;
  const DEFAULT_PAGES = [
    { id: "quicklinks", name: "Quicklinks" },
    { id: "readlater", name: "Read later" },
    { id: "tools", name: "Tools" }
  ];
  const DEFAULT_ACTIVE_PROJECT_BY_PAGE = Object.fromEntries(
    DEFAULT_PAGES.map((page) => [page.id, null])
  );
  const ICONS = [
    { id: "sock", label: "Sock", glyph: "\uD83E\uDDE6" },
    { id: "clover", label: "Clover", glyph: "\uD83C\uDF40" },
    { id: "avocado", label: "Avocado", glyph: "\uD83E\uDD51" },
    { id: "ball", label: "Ball", glyph: "\u26BE" },
    { id: "tent", label: "Tent", glyph: "\u26FA" },
    { id: "pin", label: "Pin", glyph: "\uD83D\uDCCC" },
    { id: "bag", label: "Bag", glyph: "\uD83D\uDCBC" },
    { id: "book", label: "Book", glyph: "\uD83D\uDCD8" }
  ];
  const SUPPORTED_LANGUAGES = ["en", "ko", "zh", "ja"];
  const SORT_OPTIONS = [
    { id: "title-asc", labelKey: "sort.titleAsc" },
    { id: "title-desc", labelKey: "sort.titleDesc" },
    { id: "recent-asc", labelKey: "sort.recentAsc" },
    { id: "recent-desc", labelKey: "sort.recentDesc" }
  ];
  const HELP_SLIDES = [
    { titleKey: "help.slide1.title", bodyKey: "help.slide1.body", visual: "select" },
    { titleKey: "help.slide2.title", bodyKey: "help.slide2.body", visual: "open" },
    { titleKey: "help.slide3.title", bodyKey: "help.slide3.body", visual: "reorder" },
    { titleKey: "help.slide4.title", bodyKey: "help.slide4.body", visual: "pages" }
  ];
  const TRANSLATIONS = {
    en: {
      "app.title": "TabManager",
      "app.brand": "TabManager - New tab workspace",
      "page.quicklinks": "Quicklinks",
      "page.readlater": "Read later",
      "page.tools": "Tools",
      "page.defaultName": "Page {count}",
      "page.dropToDelete": "Drop to delete page",
      "page.name": "Page name",
      "page.dragHint": "{name} - drag to reorder, double-click to rename",
      "sidebar.currentWindow": "Current window",
      "sidebar.noTabsSelected": "No tabs selected",
      "sidebar.selectedCount": "{count} selected",
      "search.filterTabs": "Filter tabs",
      "search.savedLinks": "Search saved links",
      "search.links": "Search links",
      "nav.boardPages": "Board pages",
      "board.projectBoard": "Project board",
      "empty.category": "Empty category",
      "empty.title": "Drag tabs here to create your first group",
      "empty.body": "Drop one or more tabs from Current window into this space to save them as a new group.",
      "empty.selectTabs": "Select tabs",
      "empty.dragHere": "Drag here",
      "settings.title": "Settings",
      "settings.close": "Close settings",
      "settings.language.title": "Language",
      "settings.language.desc": "Change the board language.",
      "settings.openLinks.title": "Open links in current tab",
      "settings.openLinks.desc": "Replace the current tab instead of opening a separate tab.",
      "settings.focusTab.title": "Switch to opened tab",
      "settings.focusTab.desc": "Move Chrome focus to the newly opened tab after opening links.",
      "settings.savedFirst.title": "Put saved groups first",
      "settings.savedFirst.desc": "Show groups with saved links before empty groups.",
      "settings.darkMode.title": "Dark mode",
      "settings.darkMode.desc": "Use a darker board and card theme.",
      "settings.openSitesAsGroup.title": "Open sites as Chrome group",
      "settings.openSitesAsGroup.desc": "Use the sites button to open links as a named Chrome tab group.",
      "backup.title": "Backup & transfer",
      "backup.desc": "Export a compressed backup file or import one to restore this workspace.",
      "backup.import": "Import",
      "backup.export": "Export",
      "backup.importConfirm": "Importing this backup will replace the current workspace. Continue?",
      "help.open": "Open help",
      "help.label": "Help",
      "help.close": "Close help",
      "help.pages": "Help pages",
      "help.previous": "Previous",
      "help.next": "Next",
      "help.step": "{current} / {total}",
      "help.slide1.title": "Save current tabs",
      "help.slide1.body": "Select tabs in {currentWindow}, then use {newGroup}, {addToGroup}, or drag them onto the board to save them into a link group.",
      "help.slide2.title": "Use link groups",
      "help.slide2.body": "Click a saved link to open it, or press the sites button to open every link in the group. Settings choose whether sites open as a Chrome tab group or as regular tabs.",
      "help.slide3.title": "Sort and rearrange",
      "help.slide3.body": "Drag groups or saved links to reorder them. Use the sort button to arrange links by title or recent visit, ascending or descending.",
      "help.slide4.title": "Manage workspace pages",
      "help.slide4.body": "Create up to 10 workspace pages for different boards. Hold and drag page tabs to reorder or delete them, and double-click a page tab to rename it.",
      "deleted.recentlyDeleted": "Recently deleted",
      "deleted.tabs": "Tabs",
      "deleted.groups": "Groups",
      "deleted.noTabs": "No recently deleted tabs.",
      "deleted.noGroups": "No recently deleted groups.",
      "deleted.restore": "Restore",
      "time.justNow": "just now",
      "time.minutesAgo": "{count}m ago",
      "time.hoursAgo": "{count}h ago",
      "action.refreshCurrentTabs": "Refresh current tabs",
      "action.pinTabList": "Pin tab list",
      "action.createGroup": "Create group",
      "action.newGroup": "New group",
      "action.addToGroup": "Add to group",
      "action.createPage": "Create page",
      "action.openAll": "Open all",
      "action.saveNewTabs": "Save new tabs",
      "action.openWithoutGroup": "Open without group",
      "action.sortLinks": "Sort links",
      "action.deleteGroup": "Delete group",
      "action.deleteLink": "Delete link",
      "action.undo": "Undo",
      "action.rename": "Click to rename",
      "action.dragGroup": "Drag to reorder group",
      "action.chooseGroup": "Choose a group to add selected tabs",
      "action.createGroupFirst": "Create a group first",
      "action.maximumPages": "Maximum 10 pages",
      "count.sites": "{count} sites",
      "count.tabs": "{count} tabs",
      "name.untitled": "Untitled",
      "name.selectedTab": "Selected tab",
      "name.selectedTabs": "Selected tabs",
      "name.restored": "Restored",
      "name.tabGroup": "Tab group",
      "state.noCurrentTabs": "No current tabs.",
      "state.savedInActiveGroup": "Saved in active group",
      "state.dropTabsHere": "Drop tabs here",
      "state.noMatches": "No matches",
      "input.groupName": "Group name",
      "sort.titleAsc": "Title A-Z",
      "sort.titleDesc": "Title Z-A",
      "sort.recentAsc": "Least recently visited",
      "sort.recentDesc": "Most recently visited",
      "toast.noLinksInGroup": "No links in this group.",
      "toast.tabsOpenedWithoutGroup": "{count} tabs opened without group.",
      "toast.groupAlreadyOpen": "\"{name}\" is already open.",
      "toast.noNewTabsToOpen": "No new tabs to open.",
      "toast.tabsAddedToGroup": "{count} tabs added to \"{name}\".",
      "toast.tabsOpenedAsGroup": "{count} tabs opened as \"{name}\".",
      "toast.groupCreated": "Group created.",
      "toast.newGroupAdded": "New group added.",
      "toast.maxPages": "You can create up to 10 pages.",
      "toast.pageAdded": "{name} added.",
      "toast.dropEmptyFirst": "Drop tabs into an empty area to create a group first.",
      "toast.noNewUrls": "No new URLs to add.",
      "toast.linksSaved": "{count} links saved.",
      "toast.selectTabsFirst": "Select tabs to save first.",
      "toast.linksSavedToNewGroup": "{count} links saved to new group.",
      "toast.chooseGroupFirst": "Choose a group first.",
      "toast.couldNotFindSavedLink": "Could not find that saved link.",
      "toast.linkMoved": "Link moved.",
      "toast.couldNotFindGroup": "Could not find that group.",
      "toast.groupMoved": "Group moved.",
      "toast.couldNotFindLink": "Could not find that link.",
      "toast.linkRemoved": "Link removed.",
      "toast.deleteGroupConfirm": "Delete \"{name}\"?",
      "toast.groupDeleted": "Group deleted.",
      "toast.linkAlreadyRestored": "Link is already restored.",
      "toast.linkRestored": "Link restored.",
      "toast.groupAlreadyRestored": "Group is already restored.",
      "toast.groupRestored": "Group restored.",
      "toast.couldNotFindPage": "Could not find that page.",
      "toast.pageRenamed": "Page renamed.",
      "toast.keepOnePage": "Keep at least one page.",
      "toast.pageDeleted": "\"{name}\" page deleted.",
      "toast.pageAlreadyRestored": "Page is already restored.",
      "toast.pageRestored": "Page restored.",
      "toast.couldNotReorderPage": "Could not reorder page.",
      "toast.groupRenamed": "Group renamed.",
      "toast.linksSorted": "Links sorted.",
      "toast.couldNotOpenGroup": "Could not open group.",
      "toast.couldNotOpenTabs": "Could not open tabs.",
      "toast.backupExported": "Backup exported.",
      "toast.backupImported": "Backup imported.",
      "toast.backupExportFailed": "Could not export backup.",
      "toast.backupImportFailed": "Could not import backup.",
      "toast.backupInvalidFile": "This backup file is not valid.",
      "toast.backupUnsupportedCompression": "This browser cannot read compressed backups.",
      "toast.failedInitialize": "Failed to initialize TabManager."
    },
    ko: {
      "app.title": "TabManager",
      "app.brand": "TabManager - 새 탭 워크스페이스",
      "page.quicklinks": "퀵링크",
      "page.readlater": "나중에 읽기",
      "page.tools": "도구",
      "page.defaultName": "페이지 {count}",
      "page.dropToDelete": "페이지를 삭제하려면 여기에 놓기",
      "page.name": "페이지 이름",
      "page.dragHint": "{name} - 끌어서 순서 변경, 더블클릭으로 이름 변경",
      "sidebar.currentWindow": "현재 창",
      "sidebar.noTabsSelected": "선택된 탭 없음",
      "sidebar.selectedCount": "{count}개 선택됨",
      "search.filterTabs": "탭 필터",
      "search.savedLinks": "저장된 링크 검색",
      "search.links": "링크 검색",
      "nav.boardPages": "보드 페이지",
      "board.projectBoard": "프로젝트 보드",
      "empty.category": "빈 카테고리",
      "empty.title": "탭을 끌어와 첫 그룹을 만드세요",
      "empty.body": "현재 창의 탭 하나 이상을 이 공간에 놓으면 새 그룹으로 저장됩니다.",
      "empty.selectTabs": "탭 선택",
      "empty.dragHere": "여기로 끌기",
      "settings.title": "설정",
      "settings.close": "설정 닫기",
      "settings.language.title": "언어",
      "settings.language.desc": "보드 표시 언어를 바꿉니다.",
      "settings.openLinks.title": "링크를 현재 탭에서 열기",
      "settings.openLinks.desc": "별도 탭을 만들지 않고 현재 탭을 선택한 링크로 바꿉니다.",
      "settings.focusTab.title": "새로 연 탭으로 이동",
      "settings.focusTab.desc": "링크를 연 뒤 Chrome 포커스를 새로 열린 탭으로 전환합니다.",
      "settings.savedFirst.title": "저장된 그룹 먼저 보기",
      "settings.savedFirst.desc": "링크가 있는 그룹을 빈 그룹보다 먼저 보여줍니다.",
      "settings.darkMode.title": "다크 모드",
      "settings.darkMode.desc": "더 어두운 보드와 카드 테마를 사용합니다.",
      "settings.openSitesAsGroup.title": "sites를 Chrome 그룹으로 열기",
      "settings.openSitesAsGroup.desc": "sites 버튼을 누르면 링크들을 이름 있는 Chrome 탭 그룹으로 엽니다.",
      "backup.title": "백업 및 이동",
      "backup.desc": "압축 백업 파일로 내보내거나 가져와서 이 워크스페이스를 복원합니다.",
      "backup.import": "가져오기",
      "backup.export": "내보내기",
      "backup.importConfirm": "이 백업을 가져오면 현재 워크스페이스가 대체됩니다. 계속할까요?",
      "help.open": "도움말 열기",
      "help.label": "도움말",
      "help.close": "도움말 닫기",
      "help.pages": "도움말 페이지",
      "help.previous": "이전",
      "help.next": "다음",
      "help.step": "{current} / {total}",
      "help.slide1.title": "현재 탭 저장",
      "help.slide1.body": "{currentWindow}에서 탭을 선택한 다음 {newGroup}, {addToGroup} 버튼을 누르거나 보드로 드래그해서 링크 그룹에 저장할 수 있습니다.",
      "help.slide2.title": "링크 그룹 사용",
      "help.slide2.body": "저장된 링크를 클릭하면 바로 열리고, sites 버튼을 누르면 그룹 안의 모든 링크가 열립니다. 설정에서 Chrome 탭 그룹으로 열지 일반 탭으로 열지 선택할 수 있습니다.",
      "help.slide3.title": "정렬과 위치 변경",
      "help.slide3.body": "그룹이나 저장된 링크를 드래그해 순서를 바꿀 수 있습니다. 정렬 버튼으로 이름 또는 최근 방문 기준의 오름차순/내림차순 정렬도 할 수 있습니다.",
      "help.slide4.title": "워크스페이스 페이지 관리",
      "help.slide4.body": "용도별 보드를 최대 10개 페이지로 나눌 수 있습니다. 페이지 탭을 길게 드래그해 순서를 바꾸거나 삭제하고, 더블클릭해 이름을 바꿀 수 있습니다.",
      "deleted.recentlyDeleted": "최근 삭제",
      "deleted.tabs": "탭",
      "deleted.groups": "그룹",
      "deleted.noTabs": "최근 삭제된 탭이 없습니다.",
      "deleted.noGroups": "최근 삭제된 그룹이 없습니다.",
      "deleted.restore": "복구",
      "time.justNow": "방금 전",
      "time.minutesAgo": "{count}분 전",
      "time.hoursAgo": "{count}시간 전",
      "action.refreshCurrentTabs": "현재 탭 새로고침",
      "action.pinTabList": "탭 목록 고정",
      "action.createGroup": "그룹 만들기",
      "action.newGroup": "새 그룹",
      "action.addToGroup": "그룹에 추가",
      "action.createPage": "페이지 만들기",
      "action.openAll": "모두 열기",
      "action.saveNewTabs": "새 탭 저장",
      "action.openWithoutGroup": "그룹 없이 열기",
      "action.sortLinks": "링크 정렬",
      "action.deleteGroup": "그룹 삭제",
      "action.deleteLink": "링크 삭제",
      "action.undo": "되돌리기",
      "action.rename": "클릭해서 이름 변경",
      "action.dragGroup": "그룹 순서 바꾸기",
      "action.chooseGroup": "선택한 탭을 추가할 그룹 선택",
      "action.createGroupFirst": "먼저 그룹을 만드세요",
      "action.maximumPages": "최대 10개 페이지",
      "count.sites": "{count} sites",
      "count.tabs": "{count}개 탭",
      "name.untitled": "제목 없음",
      "name.selectedTab": "선택한 탭",
      "name.selectedTabs": "선택한 탭들",
      "name.restored": "복구됨",
      "name.tabGroup": "탭 그룹",
      "state.noCurrentTabs": "현재 탭이 없습니다.",
      "state.savedInActiveGroup": "활성 그룹에 저장됨",
      "state.dropTabsHere": "여기에 탭 놓기",
      "state.noMatches": "일치 항목 없음",
      "input.groupName": "그룹 이름",
      "sort.titleAsc": "이름 오름차순",
      "sort.titleDesc": "이름 내림차순",
      "sort.recentAsc": "최근 방문 오래된 순",
      "sort.recentDesc": "최근 방문 최신 순",
      "toast.noLinksInGroup": "이 그룹에는 링크가 없습니다.",
      "toast.tabsOpenedWithoutGroup": "{count}개 탭을 그룹 없이 열었습니다.",
      "toast.groupAlreadyOpen": "\"{name}\"은 이미 열려 있습니다.",
      "toast.noNewTabsToOpen": "새로 열 탭이 없습니다.",
      "toast.tabsAddedToGroup": "{count}개 탭을 \"{name}\"에 추가했습니다.",
      "toast.tabsOpenedAsGroup": "{count}개 탭을 \"{name}\" 그룹으로 열었습니다.",
      "toast.groupCreated": "그룹을 만들었습니다.",
      "toast.newGroupAdded": "새 그룹을 추가했습니다.",
      "toast.maxPages": "페이지는 최대 10개까지 만들 수 있습니다.",
      "toast.pageAdded": "{name}이 추가되었습니다.",
      "toast.dropEmptyFirst": "먼저 빈 공간에 탭을 놓아 그룹을 만드세요.",
      "toast.noNewUrls": "추가할 새 URL이 없습니다.",
      "toast.linksSaved": "{count}개 링크를 저장했습니다.",
      "toast.selectTabsFirst": "저장할 탭을 먼저 선택하세요.",
      "toast.linksSavedToNewGroup": "{count}개 링크를 새 그룹에 저장했습니다.",
      "toast.chooseGroupFirst": "먼저 그룹을 선택하세요.",
      "toast.couldNotFindSavedLink": "저장된 링크를 찾을 수 없습니다.",
      "toast.linkMoved": "링크를 이동했습니다.",
      "toast.couldNotFindGroup": "해당 그룹을 찾을 수 없습니다.",
      "toast.groupMoved": "그룹을 이동했습니다.",
      "toast.couldNotFindLink": "해당 링크를 찾을 수 없습니다.",
      "toast.linkRemoved": "링크를 삭제했습니다.",
      "toast.deleteGroupConfirm": "\"{name}\" 그룹을 삭제할까요?",
      "toast.groupDeleted": "그룹을 삭제했습니다.",
      "toast.linkAlreadyRestored": "이미 복구된 링크입니다.",
      "toast.linkRestored": "링크를 복구했습니다.",
      "toast.groupAlreadyRestored": "이미 복구된 그룹입니다.",
      "toast.groupRestored": "그룹을 복구했습니다.",
      "toast.couldNotFindPage": "해당 페이지를 찾을 수 없습니다.",
      "toast.pageRenamed": "페이지 이름을 바꿨습니다.",
      "toast.keepOnePage": "페이지는 최소 1개가 필요합니다.",
      "toast.pageDeleted": "\"{name}\" 페이지를 삭제했습니다.",
      "toast.pageAlreadyRestored": "이미 복구된 페이지입니다.",
      "toast.pageRestored": "페이지를 복구했습니다.",
      "toast.couldNotReorderPage": "페이지 순서를 바꿀 수 없습니다.",
      "toast.groupRenamed": "그룹 이름을 바꿨습니다.",
      "toast.linksSorted": "링크를 정렬했습니다.",
      "toast.couldNotOpenGroup": "그룹을 열 수 없습니다.",
      "toast.couldNotOpenTabs": "탭을 열 수 없습니다.",
      "toast.backupExported": "백업을 내보냈습니다.",
      "toast.backupImported": "백업을 가져왔습니다.",
      "toast.backupExportFailed": "백업을 내보낼 수 없습니다.",
      "toast.backupImportFailed": "백업을 가져올 수 없습니다.",
      "toast.backupInvalidFile": "올바른 백업 파일이 아닙니다.",
      "toast.backupUnsupportedCompression": "이 브라우저에서는 압축 백업을 읽을 수 없습니다.",
      "toast.failedInitialize": "TabManager를 초기화하지 못했습니다."
    },
    zh: {
      "app.title": "TabManager",
      "app.brand": "TabManager - 新标签工作区",
      "page.quicklinks": "快捷链接",
      "page.readlater": "稍后阅读",
      "page.tools": "工具",
      "page.defaultName": "页面 {count}",
      "page.dropToDelete": "拖到这里删除页面",
      "page.name": "页面名称",
      "page.dragHint": "{name} - 拖动排序，双击重命名",
      "sidebar.currentWindow": "当前窗口",
      "sidebar.noTabsSelected": "未选择标签",
      "sidebar.selectedCount": "已选择 {count} 个",
      "search.filterTabs": "筛选标签",
      "search.savedLinks": "搜索已保存链接",
      "search.links": "搜索链接",
      "nav.boardPages": "看板页面",
      "board.projectBoard": "项目看板",
      "empty.category": "空分类",
      "empty.title": "将标签拖到这里创建第一个分组",
      "empty.body": "把当前窗口中的一个或多个标签拖到这里，即可保存为新分组。",
      "empty.selectTabs": "选择标签",
      "empty.dragHere": "拖到这里",
      "settings.title": "设置",
      "settings.close": "关闭设置",
      "settings.language.title": "语言",
      "settings.language.desc": "切换看板显示语言。",
      "settings.openLinks.title": "在当前标签页打开链接",
      "settings.openLinks.desc": "不创建单独标签页，而是用所选链接替换当前标签页。",
      "settings.focusTab.title": "切换到新打开的标签页",
      "settings.focusTab.desc": "打开链接后，将 Chrome 焦点移到新打开的标签页。",
      "settings.savedFirst.title": "已保存分组优先",
      "settings.savedFirst.desc": "将包含链接的分组显示在空分组前。",
      "settings.darkMode.title": "深色模式",
      "settings.darkMode.desc": "使用更深色的看板和卡片主题。",
      "settings.openSitesAsGroup.title": "将 sites 作为 Chrome 分组打开",
      "settings.openSitesAsGroup.desc": "点击 sites 按钮时，将链接作为命名的 Chrome 标签分组打开。",
      "backup.title": "备份和迁移",
      "backup.desc": "导出压缩备份文件，或导入备份来恢复此工作区。",
      "backup.import": "导入",
      "backup.export": "导出",
      "backup.importConfirm": "导入此备份会替换当前工作区。要继续吗？",
      "help.open": "打开帮助",
      "help.label": "帮助",
      "help.close": "关闭帮助",
      "help.pages": "帮助页面",
      "help.previous": "上一页",
      "help.next": "下一页",
      "help.step": "{current} / {total}",
      "help.slide1.title": "保存当前标签",
      "help.slide1.body": "在 {currentWindow} 中选择标签，然后使用 {newGroup}、{addToGroup}，或将它们拖到看板中保存到链接分组。",
      "help.slide2.title": "使用链接分组",
      "help.slide2.body": "点击已保存链接即可打开；点击 sites 按钮可打开该分组中的全部链接。可在设置中选择以 Chrome 标签分组或普通标签打开。",
      "help.slide3.title": "排序和调整位置",
      "help.slide3.body": "拖动分组或已保存链接即可调整顺序。使用排序按钮可按标题或最近访问时间进行升序或降序排列。",
      "help.slide4.title": "管理工作区页面",
      "help.slide4.body": "可为不同看板创建最多 10 个工作区页面。按住并拖动页面标签可调整顺序或删除，双击页面标签可重命名。",
      "deleted.recentlyDeleted": "最近删除",
      "deleted.tabs": "标签",
      "deleted.groups": "分组",
      "deleted.noTabs": "没有最近删除的标签。",
      "deleted.noGroups": "没有最近删除的分组。",
      "deleted.restore": "恢复",
      "time.justNow": "刚刚",
      "time.minutesAgo": "{count} 分钟前",
      "time.hoursAgo": "{count} 小时前",
      "action.refreshCurrentTabs": "刷新当前标签",
      "action.pinTabList": "固定标签列表",
      "action.createGroup": "创建分组",
      "action.newGroup": "新建分组",
      "action.addToGroup": "添加到分组",
      "action.createPage": "创建页面",
      "action.openAll": "全部打开",
      "action.saveNewTabs": "保存新标签",
      "action.openWithoutGroup": "不分组打开",
      "action.sortLinks": "排序链接",
      "action.deleteGroup": "删除分组",
      "action.deleteLink": "删除链接",
      "action.undo": "撤销",
      "action.rename": "点击重命名",
      "action.dragGroup": "拖动分组排序",
      "action.chooseGroup": "选择要添加标签的分组",
      "action.createGroupFirst": "请先创建分组",
      "action.maximumPages": "最多 10 个页面",
      "count.sites": "{count} sites",
      "count.tabs": "{count} 个标签",
      "name.untitled": "未命名",
      "name.selectedTab": "已选择的标签",
      "name.selectedTabs": "已选择的标签",
      "name.restored": "已恢复",
      "name.tabGroup": "标签分组",
      "state.noCurrentTabs": "没有当前标签。",
      "state.savedInActiveGroup": "已保存在当前分组",
      "state.dropTabsHere": "把标签拖到这里",
      "state.noMatches": "没有匹配项",
      "input.groupName": "分组名称",
      "sort.titleAsc": "标题升序",
      "sort.titleDesc": "标题降序",
      "sort.recentAsc": "最近访问由旧到新",
      "sort.recentDesc": "最近访问由新到旧",
      "toast.noLinksInGroup": "此分组没有链接。",
      "toast.tabsOpenedWithoutGroup": "已不分组打开 {count} 个标签。",
      "toast.groupAlreadyOpen": "\"{name}\" 已经打开。",
      "toast.noNewTabsToOpen": "没有可打开的新标签。",
      "toast.tabsAddedToGroup": "已将 {count} 个标签添加到 \"{name}\"。",
      "toast.tabsOpenedAsGroup": "已将 {count} 个标签作为 \"{name}\" 打开。",
      "toast.groupCreated": "分组已创建。",
      "toast.newGroupAdded": "新分组已添加。",
      "toast.maxPages": "最多可创建 10 个页面。",
      "toast.pageAdded": "{name} 已添加。",
      "toast.dropEmptyFirst": "请先把标签拖到空白区域创建分组。",
      "toast.noNewUrls": "没有新的 URL 可添加。",
      "toast.linksSaved": "已保存 {count} 个链接。",
      "toast.selectTabsFirst": "请先选择要保存的标签。",
      "toast.linksSavedToNewGroup": "已将 {count} 个链接保存到新分组。",
      "toast.chooseGroupFirst": "请先选择分组。",
      "toast.couldNotFindSavedLink": "找不到该已保存链接。",
      "toast.linkMoved": "链接已移动。",
      "toast.couldNotFindGroup": "找不到该分组。",
      "toast.groupMoved": "分组已移动。",
      "toast.couldNotFindLink": "找不到该链接。",
      "toast.linkRemoved": "链接已删除。",
      "toast.deleteGroupConfirm": "要删除 \"{name}\" 吗？",
      "toast.groupDeleted": "分组已删除。",
      "toast.linkAlreadyRestored": "链接已恢复。",
      "toast.linkRestored": "链接已恢复。",
      "toast.groupAlreadyRestored": "分组已恢复。",
      "toast.groupRestored": "分组已恢复。",
      "toast.couldNotFindPage": "找不到该页面。",
      "toast.pageRenamed": "页面已重命名。",
      "toast.keepOnePage": "至少保留一个页面。",
      "toast.pageDeleted": "\"{name}\" 页面已删除。",
      "toast.pageAlreadyRestored": "页面已恢复。",
      "toast.pageRestored": "页面已恢复。",
      "toast.couldNotReorderPage": "无法调整页面顺序。",
      "toast.groupRenamed": "分组已重命名。",
      "toast.linksSorted": "链接已排序。",
      "toast.couldNotOpenGroup": "无法打开分组。",
      "toast.couldNotOpenTabs": "无法打开标签。",
      "toast.backupExported": "备份已导出。",
      "toast.backupImported": "备份已导入。",
      "toast.backupExportFailed": "无法导出备份。",
      "toast.backupImportFailed": "无法导入备份。",
      "toast.backupInvalidFile": "此备份文件无效。",
      "toast.backupUnsupportedCompression": "此浏览器无法读取压缩备份。",
      "toast.failedInitialize": "TabManager 初始化失败。"
    },
    ja: {
      "app.title": "TabManager",
      "app.brand": "TabManager - 新しいタブのワークスペース",
      "page.quicklinks": "クイックリンク",
      "page.readlater": "あとで読む",
      "page.tools": "ツール",
      "page.defaultName": "ページ {count}",
      "page.dropToDelete": "ページを削除するにはここにドロップ",
      "page.name": "ページ名",
      "page.dragHint": "{name} - ドラッグで並べ替え、ダブルクリックで名前変更",
      "sidebar.currentWindow": "現在のウィンドウ",
      "sidebar.noTabsSelected": "選択中のタブはありません",
      "sidebar.selectedCount": "{count} 件選択中",
      "search.filterTabs": "タブを絞り込み",
      "search.savedLinks": "保存済みリンクを検索",
      "search.links": "リンクを検索",
      "nav.boardPages": "ボードページ",
      "board.projectBoard": "プロジェクトボード",
      "empty.category": "空のカテゴリ",
      "empty.title": "タブをドラッグして最初のグループを作成",
      "empty.body": "現在のウィンドウからタブをこの場所にドロップすると、新しいグループとして保存されます。",
      "empty.selectTabs": "タブを選択",
      "empty.dragHere": "ここにドラッグ",
      "settings.title": "設定",
      "settings.close": "設定を閉じる",
      "settings.language.title": "言語",
      "settings.language.desc": "ボードの表示言語を変更します。",
      "settings.openLinks.title": "リンクを現在のタブで開く",
      "settings.openLinks.desc": "別タブを作成せず、現在のタブを選択したリンクに置き換えます。",
      "settings.focusTab.title": "新しく開いたタブへ移動",
      "settings.focusTab.desc": "リンクを開いた後、Chrome のフォーカスを新しく開いたタブへ移します。",
      "settings.savedFirst.title": "保存済みグループを先に表示",
      "settings.savedFirst.desc": "リンクがあるグループを空のグループより先に表示します。",
      "settings.darkMode.title": "ダークモード",
      "settings.darkMode.desc": "暗めのボードとカードテーマを使います。",
      "settings.openSitesAsGroup.title": "sites を Chrome グループで開く",
      "settings.openSitesAsGroup.desc": "sites ボタンで、リンクを名前付きの Chrome タブグループとして開きます。",
      "backup.title": "バックアップと移行",
      "backup.desc": "圧縮バックアップファイルを書き出すか、読み込んでこのワークスペースを復元します。",
      "backup.import": "インポート",
      "backup.export": "エクスポート",
      "backup.importConfirm": "このバックアップを読み込むと現在のワークスペースが置き換わります。続行しますか？",
      "help.open": "ヘルプを開く",
      "help.label": "ヘルプ",
      "help.close": "ヘルプを閉じる",
      "help.pages": "ヘルプページ",
      "help.previous": "前へ",
      "help.next": "次へ",
      "help.step": "{current} / {total}",
      "help.slide1.title": "現在のタブを保存",
      "help.slide1.body": "{currentWindow} でタブを選択し、{newGroup}、{addToGroup}、またはボードへのドラッグでリンクグループに保存できます。",
      "help.slide2.title": "リンクグループを使う",
      "help.slide2.body": "保存済みリンクをクリックすると開けます。sites ボタンを押すとグループ内のすべてのリンクを開けます。Chrome タブグループで開くか通常タブで開くかは設定で選べます。",
      "help.slide3.title": "並べ替えと移動",
      "help.slide3.body": "グループや保存済みリンクをドラッグして順序を変更できます。並べ替えボタンではタイトルや最近の訪問順で昇順または降順に整理できます。",
      "help.slide4.title": "ワークスペースページを管理",
      "help.slide4.body": "用途別に最大 10 個のワークスペースページを作成できます。ページタブを長押ししてドラッグすると順序変更や削除ができ、ダブルクリックで名前を変更できます。",
      "deleted.recentlyDeleted": "最近削除",
      "deleted.tabs": "タブ",
      "deleted.groups": "グループ",
      "deleted.noTabs": "最近削除されたタブはありません。",
      "deleted.noGroups": "最近削除されたグループはありません。",
      "deleted.restore": "復元",
      "time.justNow": "たった今",
      "time.minutesAgo": "{count}分前",
      "time.hoursAgo": "{count}時間前",
      "action.refreshCurrentTabs": "現在のタブを更新",
      "action.pinTabList": "タブ一覧を固定",
      "action.createGroup": "グループを作成",
      "action.newGroup": "新しいグループ",
      "action.addToGroup": "グループに追加",
      "action.createPage": "ページを作成",
      "action.openAll": "すべて開く",
      "action.saveNewTabs": "新しいタブを保存",
      "action.openWithoutGroup": "グループなしで開く",
      "action.sortLinks": "リンクを並べ替え",
      "action.deleteGroup": "グループを削除",
      "action.deleteLink": "リンクを削除",
      "action.undo": "元に戻す",
      "action.rename": "クリックして名前変更",
      "action.dragGroup": "ドラッグしてグループを並べ替え",
      "action.chooseGroup": "選択したタブを追加するグループを選択",
      "action.createGroupFirst": "先にグループを作成してください",
      "action.maximumPages": "最大 10 ページ",
      "count.sites": "{count} sites",
      "count.tabs": "{count} 個のタブ",
      "name.untitled": "無題",
      "name.selectedTab": "選択したタブ",
      "name.selectedTabs": "選択したタブ",
      "name.restored": "復元済み",
      "name.tabGroup": "タブグループ",
      "state.noCurrentTabs": "現在のタブはありません。",
      "state.savedInActiveGroup": "アクティブなグループに保存済み",
      "state.dropTabsHere": "ここにタブをドロップ",
      "state.noMatches": "一致する項目はありません",
      "input.groupName": "グループ名",
      "sort.titleAsc": "タイトル昇順",
      "sort.titleDesc": "タイトル降順",
      "sort.recentAsc": "最近の訪問が古い順",
      "sort.recentDesc": "最近の訪問が新しい順",
      "toast.noLinksInGroup": "このグループにリンクはありません。",
      "toast.tabsOpenedWithoutGroup": "{count} 個のタブをグループなしで開きました。",
      "toast.groupAlreadyOpen": "\"{name}\" はすでに開いています。",
      "toast.noNewTabsToOpen": "新しく開くタブはありません。",
      "toast.tabsAddedToGroup": "{count} 個のタブを \"{name}\" に追加しました。",
      "toast.tabsOpenedAsGroup": "{count} 個のタブを \"{name}\" として開きました。",
      "toast.groupCreated": "グループを作成しました。",
      "toast.newGroupAdded": "新しいグループを追加しました。",
      "toast.maxPages": "ページは最大 10 個まで作成できます。",
      "toast.pageAdded": "{name} を追加しました。",
      "toast.dropEmptyFirst": "先に空の場所へタブをドロップしてグループを作成してください。",
      "toast.noNewUrls": "追加する新しい URL はありません。",
      "toast.linksSaved": "{count} 個のリンクを保存しました。",
      "toast.selectTabsFirst": "保存するタブを先に選択してください。",
      "toast.linksSavedToNewGroup": "{count} 個のリンクを新しいグループに保存しました。",
      "toast.chooseGroupFirst": "先にグループを選択してください。",
      "toast.couldNotFindSavedLink": "保存済みリンクが見つかりません。",
      "toast.linkMoved": "リンクを移動しました。",
      "toast.couldNotFindGroup": "そのグループが見つかりません。",
      "toast.groupMoved": "グループを移動しました。",
      "toast.couldNotFindLink": "そのリンクが見つかりません。",
      "toast.linkRemoved": "リンクを削除しました。",
      "toast.deleteGroupConfirm": "\"{name}\" を削除しますか？",
      "toast.groupDeleted": "グループを削除しました。",
      "toast.linkAlreadyRestored": "リンクはすでに復元されています。",
      "toast.linkRestored": "リンクを復元しました。",
      "toast.groupAlreadyRestored": "グループはすでに復元されています。",
      "toast.groupRestored": "グループを復元しました。",
      "toast.couldNotFindPage": "そのページが見つかりません。",
      "toast.pageRenamed": "ページ名を変更しました。",
      "toast.keepOnePage": "ページは少なくとも 1 つ必要です。",
      "toast.pageDeleted": "\"{name}\" ページを削除しました。",
      "toast.pageAlreadyRestored": "ページはすでに復元されています。",
      "toast.pageRestored": "ページを復元しました。",
      "toast.couldNotReorderPage": "ページを並べ替えられませんでした。",
      "toast.groupRenamed": "グループ名を変更しました。",
      "toast.linksSorted": "リンクを並べ替えました。",
      "toast.couldNotOpenGroup": "グループを開けませんでした。",
      "toast.couldNotOpenTabs": "タブを開けませんでした。",
      "toast.backupExported": "バックアップを書き出しました。",
      "toast.backupImported": "バックアップを読み込みました。",
      "toast.backupExportFailed": "バックアップを書き出せませんでした。",
      "toast.backupImportFailed": "バックアップを読み込めませんでした。",
      "toast.backupInvalidFile": "有効なバックアップファイルではありません。",
      "toast.backupUnsupportedCompression": "このブラウザでは圧縮バックアップを読み込めません。",
      "toast.failedInitialize": "TabManager を初期化できませんでした。"
    }
  };
  const DEFAULT_STATE = {
    projects: [],
    activeProjectId: null,
    pages: DEFAULT_PAGES,
    activeProjectByMode: DEFAULT_ACTIVE_PROJECT_BY_PAGE,
    activeMode: "quicklinks",
    settings: {
      openLinksInCurrentTab: false,
      focusOpenedTab: true,
      savedGroupsFirst: false,
      darkMode: false,
      openSitesAsGroup: true,
      sidebarPinned: true,
      language: "en"
    },
    trash: {
      links: [],
      projects: []
    }
  };

  const isChromeExtension =
    typeof chrome !== "undefined" && chrome.storage && chrome.tabs && chrome.runtime;

  const elements = {
    sidebar: document.getElementById("sidebar"),
    refreshTabs: document.getElementById("refreshTabs"),
    currentTabCount: document.getElementById("currentTabCount"),
    selectedTabSummary: document.getElementById("selectedTabSummary"),
    currentTabs: document.getElementById("currentTabs"),
    tabFilter: document.getElementById("tabFilter"),
    selectedTabActions: document.getElementById("selectedTabActions"),
    saveSelectedNewProject: document.getElementById("saveSelectedNewProject"),
    saveSelectedActiveProject: document.getElementById("saveSelectedActiveProject"),
    addToGroupMenu: document.getElementById("addToGroupMenu"),
    toggleSidebar: document.getElementById("toggleSidebar"),
    createEmptyProject: document.getElementById("createEmptyProject"),
    modeTabs: document.getElementById("modeTabs"),
    boardSearch: document.getElementById("boardSearch"),
    projectBoard: document.getElementById("projectBoard"),
    addGroupSpace: document.getElementById("addGroupSpace"),
    addGroupButton: document.getElementById("addGroupButton"),
    emptyCategory: document.getElementById("emptyCategory"),
    createTopPage: document.getElementById("createTopPage"),
    openHelp: document.getElementById("openHelp"),
    helpModal: document.getElementById("helpModal"),
    closeHelp: document.getElementById("closeHelp"),
    helpKicker: document.getElementById("helpKicker"),
    helpVisual: document.getElementById("helpVisual"),
    helpTitle: document.getElementById("helpTitle"),
    helpBody: document.getElementById("helpBody"),
    helpDots: document.getElementById("helpDots"),
    helpPrev: document.getElementById("helpPrev"),
    helpNext: document.getElementById("helpNext"),
    openSettings: document.getElementById("openSettings"),
    closeSettings: document.getElementById("closeSettings"),
    settingsPanel: document.getElementById("settingsPanel"),
    settingOpenLinksCurrentTab: document.getElementById("settingOpenLinksCurrentTab"),
    settingFocusOpenedTab: document.getElementById("settingFocusOpenedTab"),
    settingSavedGroupsFirst: document.getElementById("settingSavedGroupsFirst"),
    settingDarkMode: document.getElementById("settingDarkMode"),
    settingOpenSitesAsGroup: document.getElementById("settingOpenSitesAsGroup"),
    settingLanguage: document.getElementById("settingLanguage"),
    backupFileInput: document.getElementById("backupFileInput"),
    importBackup: document.getElementById("importBackup"),
    exportBackup: document.getElementById("exportBackup"),
    deletedLinksList: document.getElementById("deletedLinksList"),
    deletedGroupsList: document.getElementById("deletedGroupsList"),
    pageTrashDrop: document.getElementById("pageTrashDrop"),
    toast: document.getElementById("toast")
  };

  let state = cloneState(DEFAULT_STATE);
  let currentTabs = [];
  let selectedTabIds = new Set();
  let filterText = "";
  let boardSearchText = "";
  let dragState = null;
  let pageDragState = null;
  let toastTimer = null;
  let sidebarPinned = DEFAULT_STATE.settings.sidebarPinned;
  let addToGroupMenuOpen = false;
  let sortMenuProjectId = null;
  let currentHelpSlideIndex = 0;
  let currentTabGroups = new Map();
  let expandedCurrentGroupKeys = new Set();
  let collapsedCurrentGroupKeys = new Set();

  const storage = {
    async load() {
      if (!isChromeExtension) {
        return loadPreviewState();
      }

      const result = await chromeStorageGet(STORAGE_KEY);
      return migrateState(result[STORAGE_KEY]);
    },
    async save(nextState) {
      if (!isChromeExtension) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
        return;
      }

      await chromeStorageSet({ [STORAGE_KEY]: nextState });
    }
  };

  const tabsApi = {
    async queryCurrentWindow() {
      if (!isChromeExtension) {
        return getPreviewTabs();
      }

      return chromeTabsQuery({ currentWindow: true });
    },
    async open(url) {
      if (!isChromeExtension) {
        if (state.settings.openLinksInCurrentTab) {
          window.location.href = url;
        } else {
          window.open(url, "_blank", "noopener,noreferrer");
        }
        return;
      }

      if (state.settings.openLinksInCurrentTab) {
        const [activeTab] = await chromeTabsQuery({ active: true, currentWindow: true });
        if (activeTab?.id) {
          await chromeTabsUpdate(activeTab.id, { url });
        }
        return;
      }

      await chromeTabsCreate({ url, active: state.settings.focusOpenedTab });
    },
    async openLinksUngrouped(project) {
      if (!project?.links?.length) {
        showToast(t("toast.noLinksInGroup"), true);
        return;
      }

      const openedTabIds = [];
      for (const link of project.links) {
        if (!link.url) {
          continue;
        }

        if (!isChromeExtension) {
          window.open(link.url, "_blank", "noopener,noreferrer");
          continue;
        }

        const tab = await chromeTabsCreate({ url: link.url, active: false });
        if (tab?.id) {
          openedTabIds.push(tab.id);
        }
      }

      if (isChromeExtension && state.settings.focusOpenedTab && openedTabIds[0]) {
        await chromeTabsUpdate(openedTabIds[0], { active: true });
      }

      showToast(t("toast.tabsOpenedWithoutGroup", { count: project.links.length }));
    },
    async openGroup(project) {
      if (!project?.links?.length) {
        showToast(t("toast.noLinksInGroup"), true);
        return;
      }

      if (!isChromeExtension) {
        for (const link of project.links) {
          window.open(link.url, "_blank", "noopener,noreferrer");
        }
        return;
      }

      const activeWindowTabs = await chromeTabsQuery({ currentWindow: true });
      const matchedGroup = await resolveChromeGroupForProject(project, activeWindowTabs);
      let targetWindowTabs = Number.isInteger(matchedGroup?.windowId)
        ? await chromeTabsQuery({ windowId: matchedGroup.windowId })
        : activeWindowTabs;
      if (matchedGroup?.id) {
        await mergeSameNamedChromeGroups(project.name, matchedGroup, targetWindowTabs);
        targetWindowTabs = await chromeTabsQuery({ windowId: matchedGroup.windowId });
      }
      const existingGroupTabs = matchedGroup
        ? targetWindowTabs.filter((tab) => tab.groupId === matchedGroup.id)
        : [];
      const existingGroupUrls = new Set(
        existingGroupTabs.map((tab) => normalizeUrl(tab.url)).filter(Boolean)
      );
      const reusableTabsByUrl = getReusableTabsByUrl(targetWindowTabs, matchedGroup?.id);
      const seenUrls = new Set(existingGroupUrls);
      const tabIdsToGroup = [];

      for (const link of project.links) {
        const normalized = normalizeUrl(link.url);
        if (!normalized || seenUrls.has(normalized)) {
          continue;
        }

        seenUrls.add(normalized);
        const reusableTab = reusableTabsByUrl.get(normalized);
        if (reusableTab?.id) {
          tabIdsToGroup.push(reusableTab.id);
          continue;
        }

        const createProperties = {
          url: link.url,
          active: false,
          ...(Number.isInteger(matchedGroup?.windowId) ? { windowId: matchedGroup.windowId } : {})
        };
        const tab = await chromeTabsCreate(createProperties);
        if (tab?.id) {
          tabIdsToGroup.push(tab.id);
        }
      }

      if (tabIdsToGroup.length === 0) {
        if (matchedGroup?.id) {
          const updatedGroup = await chromeTabGroupsUpdate(matchedGroup.id, {
            title: project.name,
            color: getGroupColor(project.icon),
            collapsed: false
          });
          await bindProjectToChromeGroup(project.id, updatedGroup);
          if (state.settings.focusOpenedTab && existingGroupTabs[0]?.id) {
            await chromeTabsUpdate(existingGroupTabs[0].id, { active: true });
          }
          showToast(t("toast.groupAlreadyOpen", { name: project.name }));
          return;
        }

        showToast(t("toast.noNewTabsToOpen"), true);
        return;
      }

      let groupId = matchedGroup?.id || null;
      let updatedGroup = matchedGroup || null;
      try {
        groupId = await chromeTabsGroup(
          groupId ? { groupId, tabIds: tabIdsToGroup } : { tabIds: tabIdsToGroup }
        );
        updatedGroup = await chromeTabGroupsUpdate(groupId, {
          title: project.name,
          color: getGroupColor(project.icon),
          collapsed: false
        });
        await bindProjectToChromeGroup(project.id, updatedGroup);
      } catch (error) {
        console.warn("Could not create Chrome tab group", error);
      }

      if (state.settings.focusOpenedTab) {
        await chromeTabsUpdate(existingGroupTabs[0]?.id || tabIdsToGroup[0], { active: true });
      }

      showToast(
        updatedGroup?.id && matchedGroup?.id
          ? t("toast.tabsAddedToGroup", { count: tabIdsToGroup.length, name: project.name })
          : t("toast.tabsOpenedAsGroup", { count: tabIdsToGroup.length, name: project.name })
      );
    }
  };

  function cloneState(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isSupportedLanguage(language) {
    return SUPPORTED_LANGUAGES.includes(language);
  }

  function getLanguage() {
    const language = state?.settings?.language;
    return isSupportedLanguage(language) ? language : DEFAULT_STATE.settings.language;
  }

  function t(key, values = {}) {
    const dictionary = TRANSLATIONS[getLanguage()] || TRANSLATIONS.en;
    const template = dictionary[key] || TRANSLATIONS.en[key] || key;
    return template.replace(/\{(\w+)\}/g, (_match, valueKey) => {
      const value = values[valueKey];
      return value === undefined || value === null ? "" : String(value);
    });
  }

  function applyLanguage() {
    const language = getLanguage();
    document.documentElement.lang = language === "zh" ? "zh-CN" : language;
    document.title = t("app.title");

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
      element.title = t(element.dataset.i18nTitle);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });
    renderHelpSlide();
  }

  function getDisplayPageName(page) {
    return page.name;
  }

  function createId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function cloneDefaultPages() {
    return DEFAULT_PAGES.map((page) => ({ ...page }));
  }

  function getPageIds(pages = state.pages) {
    return new Set((pages || []).map((page) => page.id));
  }

  function normalizePages(rawPages) {
    const sourcePages = Array.isArray(rawPages) && rawPages.length > 0 ? rawPages : cloneDefaultPages();
    const pages = [];
    const seen = new Set();

    for (const page of sourcePages) {
      if (pages.length >= MAX_PAGES) {
        break;
      }

      const id = typeof page?.id === "string" && page.id.trim() ? page.id.trim() : createId();
      if (seen.has(id)) {
        continue;
      }

      seen.add(id);
      pages.push({
        id,
        name:
          (page?.name || page?.label || t("page.defaultName", { count: pages.length + 1 }))
            .trim()
            .slice(0, 24) || t("page.defaultName", { count: pages.length + 1 })
      });
    }

    return pages.length > 0 ? pages : cloneDefaultPages();
  }

  function getFallbackPageId(pages) {
    return pages[0]?.id || DEFAULT_PAGES[0].id;
  }

  function createBackupPayload() {
    return {
      format: BACKUP_FORMAT,
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      state: cloneState(state)
    };
  }

  function getBackupFileName(isCompressed) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    return isCompressed ? `tabmanager-backup-${timestamp}.json.gz` : `tabmanager-backup-${timestamp}.json`;
  }

  async function createBackupBlob(payloadText) {
    if (typeof CompressionStream === "function") {
      const stream = new Blob([payloadText], { type: "application/json" })
        .stream()
        .pipeThrough(new CompressionStream("gzip"));
      const blob = await new Response(stream).blob();
      return {
        blob: new Blob([blob], { type: "application/gzip" }),
        isCompressed: true
      };
    }

    return {
      blob: new Blob([payloadText], { type: "application/json" }),
      isCompressed: false
    };
  }

  function downloadBackupBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function exportBackup() {
    try {
      const payloadText = JSON.stringify(createBackupPayload(), null, 2);
      const { blob, isCompressed } = await createBackupBlob(payloadText);
      downloadBackupBlob(blob, getBackupFileName(isCompressed));
      showToast(t("toast.backupExported"));
    } catch (error) {
      console.error("Failed to export backup", error);
      showToast(t("toast.backupExportFailed"), true);
    }
  }

  function isGzipBackup(fileName, bytes) {
    return (
      (bytes[0] === 0x1f && bytes[1] === 0x8b) ||
      /\.(gz|gzip)$/i.test(fileName || "")
    );
  }

  async function readBackupFileText(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (!isGzipBackup(file.name, bytes)) {
      return new TextDecoder().decode(bytes);
    }

    if (typeof DecompressionStream !== "function") {
      const error = new Error("unsupported-compression");
      error.code = "unsupported-compression";
      throw error;
    }

    const stream = new Blob([buffer])
      .stream()
      .pipeThrough(new DecompressionStream("gzip"));
    return new Response(stream).text();
  }

  function extractBackupState(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error(t("toast.backupInvalidFile"));
    }

    if (payload.format === BACKUP_FORMAT && payload.state && typeof payload.state === "object") {
      return payload.state;
    }

    if (Array.isArray(payload.projects) || Array.isArray(payload.pages) || payload.settings) {
      return payload;
    }

    throw new Error(t("toast.backupInvalidFile"));
  }

  async function importBackupFile(file) {
    if (!file) {
      return;
    }

    try {
      const text = await readBackupFileText(file);
      const backupState = extractBackupState(JSON.parse(text));
      if (!confirm(t("backup.importConfirm"))) {
        return;
      }

      await persist(migrateState(backupState));
      showToast(t("toast.backupImported"));
    } catch (error) {
      console.error("Failed to import backup", error);
      const message = error.code === "unsupported-compression"
        ? t("toast.backupUnsupportedCompression")
        : t("toast.backupInvalidFile");
      showToast(message || t("toast.backupImportFailed"), true);
    }
  }

  function migrateState(rawState) {
    const input = rawState && typeof rawState === "object" ? rawState : DEFAULT_STATE;
    const pages = normalizePages(input.pages);
    const pageIds = getPageIds(pages);
    const fallbackPageId = getFallbackPageId(pages);
    const projects = Array.isArray(input.projects) ? input.projects : [];
    const activeMode = pageIds.has(input.activeMode) ? input.activeMode : fallbackPageId;
    const activeProjectByMode = {
      ...Object.fromEntries(pages.map((page) => [page.id, null])),
      ...(input.activeProjectByMode || {})
    };

    const migratedProjects = projects.map((project, index) => ({
      id: project.id || createId(),
      name: project.name || t("name.untitled"),
      mode: pageIds.has(project.mode) ? project.mode : fallbackPageId,
      icon: normalizeIconId(project.icon) || ICONS[index % ICONS.length].id,
      createdAt: project.createdAt || Date.now(),
      chromeGroupId: Number.isInteger(project.chromeGroupId) ? project.chromeGroupId : null,
      chromeWindowId: Number.isInteger(project.chromeWindowId) ? project.chromeWindowId : null,
      links: Array.isArray(project.links)
        ? project.links
            .filter((link) => link?.url)
            .map((link) => ({
              id: link.id || createId(),
              title: link.title || link.url || t("name.untitled"),
              url: link.url || "",
              favIconUrl: link.favIconUrl || "",
              addedAt: link.addedAt || Date.now(),
              lastVisitedAt: Number.isFinite(link.lastVisitedAt) ? link.lastVisitedAt : 0
            }))
        : []
    }));
    const rawTrash = input.trash && typeof input.trash === "object" ? input.trash : {};
    const trash = {
      links: Array.isArray(rawTrash.links)
        ? rawTrash.links
            .filter((entry) => entry?.link?.url)
            .slice(0, 3)
            .map((entry) => ({
              id: entry.id || createId(),
              deletedAt: entry.deletedAt || Date.now(),
              projectId: entry.projectId || "",
              projectName: entry.projectName || t("name.restored"),
              projectMode: pageIds.has(entry.projectMode) ? entry.projectMode : fallbackPageId,
              projectIcon: normalizeIconId(entry.projectIcon) || "sock",
              projectIndex: Number.isInteger(entry.projectIndex) ? entry.projectIndex : 0,
              linkIndex: Number.isInteger(entry.linkIndex) ? entry.linkIndex : 0,
              link: {
                id: entry.link.id || createId(),
                title: entry.link.title || entry.link.url || t("name.untitled"),
                url: entry.link.url,
                favIconUrl: entry.link.favIconUrl || "",
                addedAt: entry.link.addedAt || Date.now(),
                lastVisitedAt: Number.isFinite(entry.link.lastVisitedAt)
                  ? entry.link.lastVisitedAt
                  : 0
              }
            }))
        : [],
      projects: Array.isArray(rawTrash.projects)
        ? rawTrash.projects
            .filter((entry) => entry?.project)
            .slice(0, 3)
            .map((entry) => ({
              id: entry.id || createId(),
              deletedAt: entry.deletedAt || Date.now(),
              projectIndex: Number.isInteger(entry.projectIndex) ? entry.projectIndex : 0,
              project: {
                id: entry.project.id || createId(),
                name: entry.project.name || t("name.untitled"),
                mode: pageIds.has(entry.project.mode) ? entry.project.mode : fallbackPageId,
                icon: normalizeIconId(entry.project.icon) || "sock",
                createdAt: entry.project.createdAt || Date.now(),
                chromeGroupId: Number.isInteger(entry.project.chromeGroupId)
                  ? entry.project.chromeGroupId
                  : null,
                chromeWindowId: Number.isInteger(entry.project.chromeWindowId)
                  ? entry.project.chromeWindowId
                  : null,
                links: Array.isArray(entry.project.links)
                  ? entry.project.links
                      .filter((link) => link?.url)
                      .map((link) => ({
                        id: link.id || createId(),
                        title: link.title || link.url || t("name.untitled"),
                        url: link.url,
                        favIconUrl: link.favIconUrl || "",
                        addedAt: link.addedAt || Date.now()
                      }))
                  : []
              }
            }))
        : []
    };

    const activeProjectId = input.activeProjectId || activeProjectByMode[activeMode] || null;

    const rawSettings = input.settings || {};
    const settings = {
      ...DEFAULT_STATE.settings,
      ...rawSettings
    };
    if (
      typeof rawSettings.openLinksInCurrentTab !== "boolean" &&
      typeof rawSettings.openLinksInNewTab === "boolean"
    ) {
      settings.openLinksInCurrentTab = !rawSettings.openLinksInNewTab;
    }
    delete settings.openLinksInNewTab;
    if (!isSupportedLanguage(settings.language)) {
      settings.language = DEFAULT_STATE.settings.language;
    }

    return {
      projects: migratedProjects,
      activeProjectId,
      activeProjectByMode,
      activeMode,
      pages,
      settings,
      trash
    };
  }

  function loadPreviewState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return migrateState(JSON.parse(saved));
      } catch (error) {
        console.warn("Failed to parse preview state", error);
      }
    }

    const now = Date.now();
    return migrateState({
      activeMode: "quicklinks",
      projects: [
        {
          id: createId(),
          mode: "quicklinks",
          name: "Sat Jun 13",
          icon: "sock",
          createdAt: now,
          links: [
            makePreviewLink("Chrome Extensions", "https://developer.chrome.com/docs/extensions/"),
            makePreviewLink("Manifest V3", "https://developer.chrome.com/docs/extensions/mv3/"),
            makePreviewLink("MDN Web Docs", "https://developer.mozilla.org/")
          ]
        },
        {
          id: createId(),
          mode: "quicklinks",
          name: "Study",
          icon: "clover",
          createdAt: now,
          links: [
            makePreviewLink("Data analysis notes", "https://dataq.or.kr/"),
            makePreviewLink("Big data folder", "https://drive.google.com/")
          ]
        },
        {
          id: createId(),
          mode: "quicklinks",
          name: "Finance",
          icon: "avocado",
          createdAt: now,
          links: [
            makePreviewLink("Finance IT interview", "https://www.google.com/search?q=finance+it+interview"),
            makePreviewLink("Job board", "https://jasoseol.com/recruit")
          ]
        },
        {
          id: createId(),
          mode: "tools",
          name: "Tools",
          icon: "bag",
          createdAt: now,
          links: [makePreviewLink("Chrome Web Store", "https://chromewebstore.google.com/")]
        }
      ]
    });
  }

  function makePreviewLink(title, url) {
    return {
      id: createId(),
      title,
      url,
      favIconUrl: "",
      addedAt: Date.now()
    };
  }

  function getPreviewTabs() {
    return [
      makePreviewTab(101, "SimplyStock dashboard", "https://simplystock.example/"),
      makePreviewTab(102, "Naver Finance", "https://finance.naver.com/"),
      makePreviewTab(103, "TradingView screener", "https://www.tradingview.com/", 1),
      makePreviewTab(104, "Session Buddy", "https://sessionbuddy.com/", 1),
      makePreviewTab(105, "Market notes", "https://example.com/market", 1),
      makePreviewTab(106, "TabManager local preview", window.location.href, 2)
    ];
  }

  function makePreviewTab(id, title, url, groupId = -1) {
    return {
      id,
      title,
      url,
      favIconUrl: "",
      groupId,
      tabGroup: isGroupedTabId(groupId) ? getPreviewGroupInfo(groupId) : null
    };
  }

  function chromeStorageGet(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  function chromeStorageSet(value) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(value, () => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  function chromeTabsQuery(queryInfo) {
    return new Promise((resolve, reject) => {
      chrome.tabs.query(queryInfo, (tabs) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
          return;
        }

        resolve(tabs);
      });
    });
  }

  function chromeTabsCreate(createProperties) {
    return new Promise((resolve, reject) => {
      chrome.tabs.create(createProperties, (tab) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
          return;
        }

        resolve(tab);
      });
    });
  }

  function chromeTabsUpdate(tabId, updateProperties) {
    return new Promise((resolve, reject) => {
      chrome.tabs.update(tabId, updateProperties, (tab) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
          return;
        }

        resolve(tab);
      });
    });
  }

  function chromeTabsGroup(groupOptions) {
    return new Promise((resolve, reject) => {
      chrome.tabs.group(groupOptions, (groupId) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
          return;
        }

        resolve(groupId);
      });
    });
  }

  function chromeTabGroupsUpdate(groupId, updateProperties) {
    return new Promise((resolve, reject) => {
      chrome.tabGroups.update(groupId, updateProperties, (group) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
          return;
        }

        resolve(group);
      });
    });
  }

  function chromeTabGroupsGet(groupId) {
    return new Promise((resolve, reject) => {
      chrome.tabGroups.get(groupId, (group) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
          return;
        }

        resolve(group);
      });
    });
  }

  function normalizeIconId(icon) {
    if (!icon) {
      return "";
    }

    const normalized = String(icon).trim().toLowerCase();
    const legacyMap = {
      sock: "sock",
      socks: "sock",
      clover: "clover",
      avocado: "avocado",
      ball: "ball",
      baseball: "ball",
      tent: "tent",
      pin: "pin",
      bag: "bag",
      book: "book"
    };

    return legacyMap[normalized] || "";
  }

  function getIcon(iconId) {
    return ICONS.find((icon) => icon.id === normalizeIconId(iconId)) || ICONS[0];
  }

  function getGroupColor(iconId) {
    const colorMap = {
      sock: "blue",
      clover: "green",
      avocado: "green",
      ball: "yellow",
      tent: "yellow",
      pin: "red",
      bag: "blue",
      book: "purple"
    };

    return colorMap[normalizeIconId(iconId)] || "blue";
  }

  function normalizeUrl(url) {
    try {
      const parsed = new URL(url);
      parsed.hash = "";
      return parsed.toString();
    } catch (_error) {
      return url || "";
    }
  }

  function isExtensionPage(url) {
    if (!isChromeExtension || !url) {
      return false;
    }

    return url.startsWith(chrome.runtime.getURL(""));
  }

  function canSaveTab(tab) {
    if (!tab?.url || isExtensionPage(tab.url)) {
      return false;
    }

    return !/^(chrome|edge|about|devtools):/i.test(tab.url);
  }

  function isGroupedTabId(groupId) {
    return Number.isInteger(groupId) && groupId >= 0;
  }

  function getCurrentGroupKey(groupId) {
    return `chrome-group-${groupId}`;
  }

  async function loadCurrentTabGroups(tabs) {
    const groupIds = [...new Set(tabs.map((tab) => tab.groupId).filter(isGroupedTabId))];
    const groupMap = new Map();

    if (!isChromeExtension) {
      for (const groupId of groupIds) {
        const firstTab = tabs.find((tab) => tab.groupId === groupId);
        groupMap.set(groupId, firstTab?.tabGroup || getPreviewGroupInfo(groupId));
      }
      return groupMap;
    }

    for (const groupId of groupIds) {
      try {
        groupMap.set(groupId, await chromeTabGroupsGet(groupId));
      } catch (_error) {
        groupMap.set(groupId, {
          id: groupId,
          title: t("name.tabGroup"),
          color: "grey",
          collapsed: false
        });
      }
    }

    return groupMap;
  }

  async function findMatchingChromeGroup(groupName, tabs) {
    const targetTitle = normalizeGroupTitle(groupName);
    const groupIds = [...new Set(tabs.map((tab) => tab.groupId).filter(isGroupedTabId))];

    for (const groupId of groupIds) {
      try {
        const group = await chromeTabGroupsGet(groupId);
        if (normalizeGroupTitle(group.title) === targetTitle) {
          return group;
        }
      } catch (_error) {
        // Ignore groups that disappeared while the board was open.
      }
    }

    return null;
  }

  async function resolveChromeGroupForProject(project, preferredTabs = []) {
    const storedGroup = await getStoredChromeGroup(project);
    if (storedGroup) {
      return storedGroup;
    }

    const preferredMatch = await findMatchingChromeGroup(project.name, preferredTabs);
    if (preferredMatch) {
      await bindProjectToChromeGroup(project.id, preferredMatch);
      return preferredMatch;
    }

    const allTabs = await chromeTabsQuery({});
    const fallbackMatch = await findMatchingChromeGroup(project.name, allTabs);
    if (fallbackMatch) {
      await bindProjectToChromeGroup(project.id, fallbackMatch);
    }

    return fallbackMatch;
  }

  async function mergeSameNamedChromeGroups(groupName, targetGroup, tabs) {
    if (!isChromeExtension || !isGroupedTabId(targetGroup?.id)) {
      return;
    }

    const targetTitle = normalizeGroupTitle(groupName);
    const duplicateTabIds = [];
    const groupById = new Map();

    for (const tab of tabs) {
      if (!isGroupedTabId(tab.groupId) || tab.groupId === targetGroup.id) {
        continue;
      }

      if (!groupById.has(tab.groupId)) {
        try {
          groupById.set(tab.groupId, await chromeTabGroupsGet(tab.groupId));
        } catch (_error) {
          groupById.set(tab.groupId, null);
        }
      }

      const group = groupById.get(tab.groupId);
      if (normalizeGroupTitle(group?.title) === targetTitle && tab.id) {
        duplicateTabIds.push(tab.id);
      }
    }

    if (duplicateTabIds.length === 0) {
      return;
    }

    try {
      await chromeTabsGroup({ groupId: targetGroup.id, tabIds: duplicateTabIds });
    } catch (error) {
      console.warn("Could not merge duplicate Chrome groups", error);
    }
  }

  async function getStoredChromeGroup(project) {
    if (!isChromeExtension || !isGroupedTabId(project?.chromeGroupId)) {
      return null;
    }

    try {
      return await chromeTabGroupsGet(project.chromeGroupId);
    } catch (_error) {
      await clearProjectChromeGroupBinding(project.id);
      return null;
    }
  }

  async function clearProjectChromeGroupBinding(projectId) {
    const project = state.projects.find((candidate) => candidate.id === projectId);
    if (!project || (!isGroupedTabId(project.chromeGroupId) && project.chromeWindowId === null)) {
      return;
    }

    await persist({
      ...state,
      projects: state.projects.map((candidate) => {
        if (candidate.id !== projectId) {
          return candidate;
        }

        return {
          ...candidate,
          chromeGroupId: null,
          chromeWindowId: null
        };
      })
    });
  }

  async function bindProjectToChromeGroup(projectId, group) {
    if (!projectId || !isGroupedTabId(group?.id)) {
      return;
    }

    const project = state.projects.find((candidate) => candidate.id === projectId);
    if (
      !project ||
      (project.chromeGroupId === group.id && project.chromeWindowId === (group.windowId ?? null))
    ) {
      return;
    }

    await persist({
      ...state,
      projects: state.projects.map((candidate) => {
        if (candidate.id !== projectId) {
          return candidate;
        }

        return {
          ...candidate,
          chromeGroupId: group.id,
          chromeWindowId: Number.isInteger(group.windowId) ? group.windowId : null
        };
      })
    });
  }

  async function bindProjectToChromeGroupFromDrop(projectId, payload) {
    const chromeGroupId = getChromeGroupIdFromDrop(payload);
    if (!Number.isInteger(chromeGroupId)) {
      return;
    }

    await bindProjectToChromeGroup(projectId, {
      id: chromeGroupId,
      windowId: getChromeWindowIdFromDrop(payload)
    });
  }

  async function syncProjectNameToChromeGroup(project) {
    if (!isChromeExtension || !project) {
      return;
    }

    const storedGroup = await getStoredChromeGroup(project);
    if (storedGroup) {
      const updatedGroup = await chromeTabGroupsUpdate(storedGroup.id, {
        title: project.name,
        color: getGroupColor(project.icon),
        collapsed: storedGroup.collapsed
      });
      await bindProjectToChromeGroup(project.id, updatedGroup);
      return;
    }

    const currentWindowTabs = await chromeTabsQuery({ currentWindow: true });
    const matchingGroup = await findMatchingChromeGroup(project.name, currentWindowTabs);
    if (matchingGroup) {
      await bindProjectToChromeGroup(project.id, matchingGroup);
    }
  }

  function getReusableTabsByUrl(tabs, targetGroupId = null) {
    const reusableTabs = new Map();

    for (const tab of tabs.filter(canSaveTab)) {
      const normalized = normalizeUrl(tab.url);
      const isTargetGroupTab = isGroupedTabId(targetGroupId) && tab.groupId === targetGroupId;
      const isLooseTab = !isGroupedTabId(tab.groupId);
      if (!normalized || reusableTabs.has(normalized) || (!isTargetGroupTab && !isLooseTab)) {
        continue;
      }

      reusableTabs.set(normalized, tab);
    }

    return reusableTabs;
  }

  function normalizeGroupTitle(title) {
    return (title || "").trim().toLowerCase();
  }

  function getPreviewGroupInfo(groupId) {
    const previewGroups = {
      1: { id: 1, title: "Finance", color: "green", collapsed: false },
      2: { id: 2, title: "Research", color: "blue", collapsed: true }
    };

    return previewGroups[groupId] || {
      id: groupId,
      title: t("name.tabGroup"),
      color: "grey",
      collapsed: false
    };
  }

  function getModeProjects() {
    const projects = state.projects.filter((project) => project.mode === state.activeMode);
    if (!state.settings.savedGroupsFirst) {
      return projects;
    }

    return [...projects].sort((left, right) => {
      const leftSaved = left.links.length > 0 ? 0 : 1;
      const rightSaved = right.links.length > 0 ? 0 : 1;
      // Keep stable-sort ties so manual drag order survives inside each partition.
      return leftSaved - rightSaved;
    });
  }

  function getActiveProject() {
    return (
      state.projects.find(
        (project) => project.id === state.activeProjectId && project.mode === state.activeMode
      ) || null
    );
  }

  function ensureActiveProject() {
    const modeProjects = state.projects.filter((project) => project.mode === state.activeMode);
    const mappedId = state.activeProjectByMode[state.activeMode];
    const active =
      modeProjects.find((project) => project.id === state.activeProjectId) ||
      modeProjects.find((project) => project.id === mappedId) ||
      modeProjects[0] ||
      null;

    state.activeProjectId = active?.id || null;
    state.activeProjectByMode = {
      ...Object.fromEntries(state.pages.map((page) => [page.id, null])),
      ...state.activeProjectByMode,
      [state.activeMode]: state.activeProjectId
    };
  }

  async function persist(nextState = state) {
    state = migrateState(nextState);
    ensureActiveProject();
    await storage.save(state);
    render();
  }

  async function refreshCurrentTabs() {
    currentTabs = (await tabsApi.queryCurrentWindow()).filter(canSaveTab);
    currentTabGroups = await loadCurrentTabGroups(currentTabs);
    const activeGroupKeys = new Set(
      [...currentTabGroups.keys()].map((groupId) => getCurrentGroupKey(groupId))
    );
    expandedCurrentGroupKeys = new Set(
      [...expandedCurrentGroupKeys].filter((groupKey) => activeGroupKeys.has(groupKey))
    );
    collapsedCurrentGroupKeys = new Set(
      [...collapsedCurrentGroupKeys].filter((groupKey) => activeGroupKeys.has(groupKey))
    );

    for (const [groupId, group] of currentTabGroups) {
      const groupKey = getCurrentGroupKey(groupId);
      if (!group.collapsed && !collapsedCurrentGroupKeys.has(groupKey)) {
        expandedCurrentGroupKeys.add(groupKey);
      }
    }

    selectedTabIds = new Set(
      [...selectedTabIds].filter((tabId) => currentTabs.some((tab) => tab.id === tabId))
    );
    render();
  }

  function getProjectUrlSet(project) {
    return new Set((project?.links || []).map((link) => normalizeUrl(link.url)));
  }

  function getSelectedTabs() {
    return currentTabs.filter((tab) => selectedTabIds.has(tab.id));
  }

  function getUniqueSavableTabs(tabs, initialUrls = new Set()) {
    const seen = new Set(initialUrls);
    const uniqueTabs = [];

    for (const tab of tabs.filter(canSaveTab)) {
      const normalized = normalizeUrl(tab.url);
      if (seen.has(normalized)) {
        continue;
      }

      seen.add(normalized);
      uniqueTabs.push(tab);
    }

    return uniqueTabs;
  }

  function makeLinksFromTabs(tabs) {
    return tabs.map((tab) => ({
      id: createId(),
      title: tab.title || tab.url,
      url: tab.url,
      favIconUrl: tab.favIconUrl || "",
      addedAt: Date.now()
    }));
  }

  function limitRecent(entries) {
    return entries
      .filter(Boolean)
      .sort((left, right) => right.deletedAt - left.deletedAt)
      .slice(0, 3);
  }

  function makeDeletedLinkEntry(project, link, linkIndex) {
    return {
      id: createId(),
      deletedAt: Date.now(),
      projectId: project.id,
      projectName: project.name,
      projectMode: project.mode,
      projectIcon: project.icon,
      projectIndex: state.projects.findIndex((candidate) => candidate.id === project.id),
      linkIndex,
      link: cloneState(link)
    };
  }

  function makeDeletedProjectEntry(project, projectIndex) {
    return {
      id: createId(),
      deletedAt: Date.now(),
      projectIndex,
      project: cloneState(project)
    };
  }

  async function createProject(name = t("name.untitled"), iconId = null) {
    const modeProjects = state.projects.filter((project) => project.mode === state.activeMode);
    const icon = iconId || ICONS[state.projects.length % ICONS.length].id;
    const trimmedName = (name || t("name.untitled")).trim() || t("name.untitled");
    const project = {
      id: createId(),
      name: trimmedName,
      mode: state.activeMode,
      icon,
      createdAt: Date.now(),
      chromeGroupId: null,
      chromeWindowId: null,
      links: []
    };

    await persist({
      ...state,
      projects: [...state.projects, project],
      activeProjectId: project.id,
      activeProjectByMode: {
        ...state.activeProjectByMode,
        [state.activeMode]: project.id
      }
    });
    showToast(modeProjects.length === 0 ? t("toast.groupCreated") : t("toast.newGroupAdded"));
    return project;
  }

  function getNextPageName() {
    let pageNumber = state.pages.length + 1;
    const existingNames = new Set(state.pages.map((page) => page.name.toLowerCase()));

    while (existingNames.has(`page ${pageNumber}`.toLowerCase())) {
      pageNumber += 1;
    }

    return `Page ${pageNumber}`;
  }

  async function createPage() {
    if (state.pages.length >= MAX_PAGES) {
      showToast(t("toast.maxPages"), true);
      return;
    }

    const page = {
      id: createId(),
      name: getNextPageName()
    };

    addToGroupMenuOpen = false;
    await persist({
      ...state,
      pages: [...state.pages, page],
      activeMode: page.id,
      activeProjectId: null,
      activeProjectByMode: {
        ...state.activeProjectByMode,
        [page.id]: null
      }
    });
    showToast(t("toast.pageAdded", { name: page.name }));
  }

  async function saveTabsToProject(projectId, tabs, onlyNew = true, insertAt = null) {
    const project = state.projects.find((candidate) => candidate.id === projectId);
    if (!project) {
      showToast(t("toast.dropEmptyFirst"), true);
      return 0;
    }

    const savedUrls = getProjectUrlSet(project);
    const uniqueTabs = getUniqueSavableTabs(tabs, onlyNew ? savedUrls : new Set());

    if (uniqueTabs.length === 0) {
      showToast(t("toast.noNewUrls"), true);
      return 0;
    }

    const insertionIndex =
      Number.isInteger(insertAt) && insertAt >= 0 ? insertAt : project.links.length;

    await persist({
      ...state,
      projects: state.projects.map((candidate) => {
        if (candidate.id !== project.id) {
          return candidate;
        }

        const nextLinks = [...candidate.links];
        nextLinks.splice(insertionIndex, 0, ...makeLinksFromTabs(uniqueTabs));
        return {
          ...candidate,
          links: nextLinks
        };
      }),
      activeProjectId: project.id,
      activeProjectByMode: {
        ...state.activeProjectByMode,
        [project.mode]: project.id
      }
    });
    showToast(t("toast.linksSaved", { count: uniqueTabs.length }));
    return uniqueTabs.length;
  }

  function getSelectedTabsProjectName(tabs) {
    if (tabs.length === 1) {
      return (tabs[0].title || t("name.selectedTab")).trim().slice(0, 40) || t("name.selectedTab");
    }

    const groupIds = new Set(tabs.map((tab) => tab.groupId));
    const onlyGroupId = [...groupIds][0];
    if (groupIds.size === 1 && isGroupedTabId(onlyGroupId)) {
      const groupTitle = currentTabGroups.get(onlyGroupId)?.title;
      if (groupTitle?.trim()) {
        return groupTitle.trim().slice(0, 40);
      }
    }

    return t("name.selectedTabs");
  }

  async function saveSelectedTabsToNewProject() {
    const tabs = getUniqueSavableTabs(getSelectedTabs());
    if (tabs.length === 0) {
      showToast(t("toast.selectTabsFirst"), true);
      return;
    }

    const project = {
      id: createId(),
      name: getSelectedTabsProjectName(tabs),
      mode: state.activeMode,
      icon: ICONS[state.projects.length % ICONS.length].id,
      createdAt: Date.now(),
      chromeGroupId: null,
      chromeWindowId: null,
      links: makeLinksFromTabs(tabs)
    };

    selectedTabIds = new Set();
    await persist({
      ...state,
      projects: [...state.projects, project],
      activeProjectId: project.id,
      activeProjectByMode: {
        ...state.activeProjectByMode,
        [state.activeMode]: project.id
      }
    });
    showToast(t("toast.linksSavedToNewGroup", { count: tabs.length }));
  }

  async function saveSelectedTabsToProject(projectId) {
    const project = state.projects.find(
      (candidate) => candidate.id === projectId && candidate.mode === state.activeMode
    );
    if (!project) {
      showToast(t("toast.chooseGroupFirst"), true);
      return;
    }

    const savedCount = await saveTabsToProject(project.id, getSelectedTabs(), true);
    if (savedCount > 0) {
      selectedTabIds = new Set();
      addToGroupMenuOpen = false;
      render();
    }
  }

  async function openProjectSites(project) {
    if (!project) {
      showToast(t("toast.couldNotFindGroup"), true);
      return;
    }

    if (state.settings.openSitesAsGroup) {
      await tabsApi.openGroup(project);
    } else {
      await tabsApi.openLinksUngrouped(project);
    }

    await markLinksVisited(
      project.id,
      project.links.map((link) => link.id)
    );
  }

  async function openSavedLink(projectId, link) {
    await markLinksVisited(projectId, [link.id]);
    await tabsApi.open(link.url);
  }

  async function markLinksVisited(projectId, linkIds) {
    const visitIds = new Set(linkIds.filter(Boolean));
    if (!projectId || visitIds.size === 0) {
      return;
    }

    const visitedAt = Date.now();
    await persist({
      ...state,
      projects: state.projects.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        return {
          ...project,
          links: project.links.map((link) =>
            visitIds.has(link.id) ? { ...link, lastVisitedAt: visitedAt } : link
          )
        };
      })
    });
  }

  function getLinkSortTitle(link) {
    return (link.title || link.url || "").trim();
  }

  function getLinkLastVisited(link) {
    return Number(link.lastVisitedAt || 0);
  }

  function compareLinkTitles(left, right, direction = "asc") {
    const comparison = getLinkSortTitle(left).localeCompare(getLinkSortTitle(right), undefined, {
      numeric: true,
      sensitivity: "base"
    });
    return direction === "desc" ? -comparison : comparison;
  }

  function compareLinkVisits(left, right, direction = "asc") {
    const comparison = getLinkLastVisited(left) - getLinkLastVisited(right);
    return direction === "desc" ? -comparison : comparison;
  }

  function getSortedProjectLinks(links, sortKey) {
    return [...links].sort((left, right) => {
      if (sortKey === "title-asc") {
        return compareLinkTitles(left, right, "asc") || compareLinkVisits(left, right, "desc");
      }

      if (sortKey === "title-desc") {
        return compareLinkTitles(left, right, "desc") || compareLinkVisits(left, right, "desc");
      }

      if (sortKey === "recent-asc") {
        return compareLinkVisits(left, right, "asc") || compareLinkTitles(left, right, "asc");
      }

      if (sortKey === "recent-desc") {
        return compareLinkVisits(left, right, "desc") || compareLinkTitles(left, right, "asc");
      }

      return 0;
    });
  }

  async function sortProjectLinks(projectId, sortKey) {
    if (!SORT_OPTIONS.some((option) => option.id === sortKey)) {
      return;
    }

    const project = state.projects.find((candidate) => candidate.id === projectId);
    if (!project) {
      showToast(t("toast.couldNotFindGroup"), true);
      return;
    }

    sortMenuProjectId = null;
    await persist({
      ...state,
      projects: state.projects.map((candidate) =>
        candidate.id === projectId
          ? { ...candidate, links: getSortedProjectLinks(candidate.links, sortKey) }
          : candidate
      )
    });
    showToast(t("toast.linksSorted"));
  }

  async function moveSavedLink(sourceProjectId, linkId, targetProjectId, insertAt = null) {
    if (!sourceProjectId || !linkId || !targetProjectId) {
      return;
    }

    const sourceProject = state.projects.find((project) => project.id === sourceProjectId);
    const targetProject = state.projects.find((project) => project.id === targetProjectId);
    const link = sourceProject?.links.find((candidate) => candidate.id === linkId);
    const sourceIndex = sourceProject?.links.findIndex((candidate) => candidate.id === linkId);

    if (!sourceProject || !targetProject || !link) {
      showToast(t("toast.couldNotFindSavedLink"), true);
      return;
    }

    const nextProjects = state.projects.map((project) => {
      if (project.id === sourceProjectId) {
        return {
          ...project,
          links: project.links.filter((candidate) => candidate.id !== linkId)
        };
      }

      return project;
    });

    const targetWithoutLink = nextProjects.find((project) => project.id === targetProjectId);
    let requestedIndex =
      Number.isInteger(insertAt) && insertAt >= 0 ? insertAt : targetWithoutLink.links.length;
    if (sourceProjectId === targetProjectId && sourceIndex < requestedIndex) {
      requestedIndex -= 1;
    }
    const insertionIndex = Math.min(requestedIndex, targetWithoutLink.links.length);

    await persist({
      ...state,
      projects: nextProjects.map((project) => {
        if (project.id !== targetProjectId) {
          return project;
        }

        const nextLinks = [...project.links];
        nextLinks.splice(insertionIndex, 0, link);
        return {
          ...project,
          links: nextLinks
        };
      }),
      activeProjectId: targetProjectId,
      activeProjectByMode: {
        ...state.activeProjectByMode,
        [targetProject.mode]: targetProjectId
      }
    });
    showToast(t("toast.linkMoved"));
  }

  async function moveProject(sourceProjectId, targetProjectId = null, position = "before") {
    const sourceProject = state.projects.find((project) => project.id === sourceProjectId);
    if (!sourceProject) {
      showToast(t("toast.couldNotFindGroup"), true);
      return;
    }

    if (sourceProjectId === targetProjectId && position !== "end") {
      return;
    }

    const modeProjects = state.projects.filter((project) => project.mode === sourceProject.mode);
    const reorderedModeProjects = modeProjects.filter((project) => project.id !== sourceProjectId);
    const targetProject = reorderedModeProjects.find((project) => project.id === targetProjectId);
    let insertionIndex = reorderedModeProjects.length;

    if (targetProject) {
      insertionIndex = reorderedModeProjects.findIndex((project) => project.id === targetProject.id);
      if (position === "after") {
        insertionIndex += 1;
      }
    }

    reorderedModeProjects.splice(insertionIndex, 0, sourceProject);

    const nextModeProjects = [...reorderedModeProjects];
    await persist({
      ...state,
      projects: state.projects.map((project) => {
        if (project.mode !== sourceProject.mode) {
          return project;
        }

        return nextModeProjects.shift();
      }),
      activeMode: sourceProject.mode,
      activeProjectId: sourceProject.id,
      activeProjectByMode: {
        ...state.activeProjectByMode,
        [sourceProject.mode]: sourceProject.id
      }
    });
    showToast(t("toast.groupMoved"));
  }

  async function createProjectFromDrop(payload) {
    const droppedItems = resolveDroppedItems(payload);
    const projectName = getProjectNameFromDrop(payload);
    const projectIcon = getProjectIconFromDrop(payload);
    const project = {
      id: createId(),
      name: projectName,
      mode: state.activeMode,
      icon: projectIcon,
      createdAt: Date.now(),
      chromeGroupId: getChromeGroupIdFromDrop(payload),
      chromeWindowId: getChromeWindowIdFromDrop(payload),
      links: []
    };

    await persist({
      ...state,
      projects: [...state.projects, project],
      activeProjectId: project.id,
      activeProjectByMode: {
        ...state.activeProjectByMode,
        [state.activeMode]: project.id
      }
    });

    if (payload.kind === "current-tabs") {
      await saveTabsToProject(project.id, droppedItems, true, 0);
    } else if (payload.kind === "saved-link") {
      await moveSavedLink(payload.sourceProjectId, payload.linkId, project.id, 0);
    }
  }

  function getProjectNameFromDrop(payload) {
    if (payload.kind === "current-tabs" && payload.sourceGroupTitle) {
      return payload.sourceGroupTitle.trim().slice(0, 40) || t("name.untitled");
    }

    return t("name.untitled");
  }

  function getChromeGroupIdFromDrop(payload) {
    return payload.kind === "current-tabs" && Number.isInteger(payload.sourceGroupId)
      ? payload.sourceGroupId
      : null;
  }

  function getChromeWindowIdFromDrop(payload) {
    return payload.kind === "current-tabs" && Number.isInteger(payload.sourceWindowId)
      ? payload.sourceWindowId
      : null;
  }

  function getProjectIconFromDrop(payload) {
    if (payload.kind === "current-tabs" && payload.sourceGroupColor) {
      const colorIconMap = {
        blue: "book",
        cyan: "bag",
        green: "clover",
        grey: "sock",
        orange: "tent",
        pink: "pin",
        purple: "book",
        red: "pin",
        yellow: "ball"
      };
      return colorIconMap[payload.sourceGroupColor] || ICONS[state.projects.length % ICONS.length].id;
    }

    return ICONS[state.projects.length % ICONS.length].id;
  }

  function resolveDroppedItems(payload) {
    if (payload.kind === "current-tabs") {
      return payload.tabIds
        .map((tabId) => currentTabs.find((tab) => tab.id === tabId))
        .filter(Boolean);
    }

    if (payload.kind === "saved-link") {
      const sourceProject = state.projects.find(
        (project) => project.id === payload.sourceProjectId
      );
      const link = sourceProject?.links.find((candidate) => candidate.id === payload.linkId);
      return link ? [link] : [];
    }

    return [];
  }

  async function deleteLink(projectId, linkId) {
    const project = state.projects.find((candidate) => candidate.id === projectId);
    const linkIndex = project?.links.findIndex((link) => link.id === linkId) ?? -1;
    const deletedLink = linkIndex >= 0 ? cloneState(project.links[linkIndex]) : null;

    if (!project || !deletedLink) {
      showToast(t("toast.couldNotFindLink"), true);
      return;
    }

    const trashEntry = makeDeletedLinkEntry(project, deletedLink, linkIndex);
    await persist({
      ...state,
      trash: {
        links: limitRecent([trashEntry, ...(state.trash?.links || [])]),
        projects: state.trash?.projects || []
      },
      projects: state.projects.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        return {
          ...project,
          links: project.links.filter((link) => link.id !== linkId)
        };
      })
    });
    showToast(t("toast.linkRemoved"), false, {
      label: t("action.undo"),
      onClick: () => restoreDeletedLinkEntry(trashEntry)
    });
  }

  async function deleteProject(projectId) {
    const project = state.projects.find((candidate) => candidate.id === projectId);
    if (!project) {
      return;
    }

    const projectIndex = state.projects.findIndex((candidate) => candidate.id === projectId);
    const deletedProject = cloneState(project);
    const trashEntry = makeDeletedProjectEntry(deletedProject, projectIndex);

    const confirmed = confirm(t("toast.deleteGroupConfirm", { name: project.name }));
    if (!confirmed) {
      return;
    }

    const nextProjects = state.projects.filter((candidate) => candidate.id !== projectId);
    await persist({
      ...state,
      trash: {
        links: state.trash?.links || [],
        projects: limitRecent([trashEntry, ...(state.trash?.projects || [])])
      },
      projects: nextProjects,
      activeProjectId: null,
      activeProjectByMode: {
        ...state.activeProjectByMode,
        [project.mode]: null
      }
    });
    showToast(t("toast.groupDeleted"), false, {
      label: t("action.undo"),
      onClick: () => restoreDeletedProjectEntry(trashEntry)
    });
  }

  async function restoreDeletedLinkEntry(entry) {
    const link = cloneState(entry.link);
    let project = state.projects.find((candidate) => candidate.id === entry.projectId);
    let nextProjects = [...state.projects];

    if (!project) {
      project = {
        id: entry.projectId || createId(),
        name: entry.projectName || t("name.restored"),
        mode: getPageIds().has(entry.projectMode) ? entry.projectMode : state.activeMode,
        icon: normalizeIconId(entry.projectIcon) || "sock",
        createdAt: Date.now(),
        links: []
      };
      const projectIndex = Math.min(Math.max(entry.projectIndex || 0, 0), nextProjects.length);
      nextProjects.splice(projectIndex, 0, project);
    }

    const alreadyRestored = project.links.some(
      (candidate) => candidate.id === link.id || normalizeUrl(candidate.url) === normalizeUrl(link.url)
    );
    if (alreadyRestored) {
      showToast(t("toast.linkAlreadyRestored"), true);
      return;
    }

    await persist({
      ...state,
      projects: nextProjects.map((candidate) => {
        if (candidate.id !== project.id) {
          return candidate;
        }

        const nextLinks = [...candidate.links];
        const insertionIndex = Math.min(Math.max(entry.linkIndex || 0, 0), nextLinks.length);
        nextLinks.splice(insertionIndex, 0, link);
        return {
          ...candidate,
          links: nextLinks
        };
      }),
      trash: {
        links: (state.trash?.links || []).filter((candidate) => candidate.id !== entry.id),
        projects: state.trash?.projects || []
      },
      activeMode: project.mode,
      activeProjectId: project.id,
      activeProjectByMode: {
        ...state.activeProjectByMode,
        [project.mode]: project.id
      }
    });
    showToast(t("toast.linkRestored"));
  }

  async function restoreDeletedProjectEntry(entry) {
    const project = cloneState(entry.project);
    const alreadyRestored = state.projects.some((candidate) => candidate.id === project.id);
    if (alreadyRestored) {
      showToast(t("toast.groupAlreadyRestored"), true);
      return;
    }

    const nextProjects = [...state.projects];
    const insertionIndex = Math.min(Math.max(entry.projectIndex || 0, 0), nextProjects.length);
    nextProjects.splice(insertionIndex, 0, project);

    await persist({
      ...state,
      projects: nextProjects,
      trash: {
        links: state.trash?.links || [],
        projects: (state.trash?.projects || []).filter((candidate) => candidate.id !== entry.id)
      },
      activeMode: project.mode,
      activeProjectId: project.id,
      activeProjectByMode: {
        ...state.activeProjectByMode,
        [project.mode]: project.id
      }
    });
    showToast(t("toast.groupRestored"));
  }

  function render() {
    ensureActiveProject();
    sidebarPinned = state.settings.sidebarPinned !== false;
    renderSidebarPinState();
    applyTheme();
    applyLanguage();
    renderModeTabs();
    renderSettings();
    renderSidebar();
    renderProjects();
    renderControls();
  }

  function applyTheme() {
    document.documentElement.classList.toggle("theme-dark", Boolean(state.settings.darkMode));
  }

  function renderSettings() {
    elements.settingOpenLinksCurrentTab.checked = state.settings.openLinksInCurrentTab;
    elements.settingFocusOpenedTab.checked = state.settings.focusOpenedTab;
    elements.settingSavedGroupsFirst.checked = state.settings.savedGroupsFirst;
    elements.settingDarkMode.checked = state.settings.darkMode;
    elements.settingOpenSitesAsGroup.checked = state.settings.openSitesAsGroup;
    elements.settingLanguage.value = getLanguage();
    renderDeletedRecovery();
  }

  function renderDeletedRecovery() {
    renderDeletedLinks();
    renderDeletedGroups();
  }

  function renderDeletedLinks() {
    elements.deletedLinksList.textContent = "";
    const entries = state.trash?.links || [];

    if (entries.length === 0) {
      elements.deletedLinksList.appendChild(createDeletedEmpty(t("deleted.noTabs")));
      return;
    }

    for (const entry of entries) {
      const row = createDeletedRow(
        entry.link.title || entry.link.url,
        `${entry.projectName} - ${formatDeletedTime(entry.deletedAt)}`,
        t("deleted.restore")
      );
      row.querySelector("button").addEventListener("click", () => restoreDeletedLinkEntry(entry));
      elements.deletedLinksList.appendChild(row);
    }
  }

  function renderDeletedGroups() {
    elements.deletedGroupsList.textContent = "";
    const entries = state.trash?.projects || [];

    if (entries.length === 0) {
      elements.deletedGroupsList.appendChild(createDeletedEmpty(t("deleted.noGroups")));
      return;
    }

    for (const entry of entries) {
      const row = createDeletedRow(
        entry.project.name,
        `${t("count.sites", { count: entry.project.links.length })} - ${formatDeletedTime(entry.deletedAt)}`,
        t("deleted.restore")
      );
      row.querySelector("button").addEventListener("click", () => restoreDeletedProjectEntry(entry));
      elements.deletedGroupsList.appendChild(row);
    }
  }

  function createDeletedRow(title, meta, buttonText) {
    const row = document.createElement("div");
    row.className = "deleted-row";

    const text = document.createElement("span");
    text.className = "deleted-text";
    text.appendChild(createText("strong", "", title));
    text.appendChild(createText("small", "", meta));
    row.appendChild(text);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = buttonText;
    row.appendChild(button);
    return row;
  }

  function createDeletedEmpty(message) {
    const empty = document.createElement("p");
    empty.className = "deleted-empty";
    empty.textContent = message;
    return empty;
  }

  function formatDeletedTime(timestamp) {
    const elapsedMs = Date.now() - timestamp;
    const elapsedMinutes = Math.max(0, Math.floor(elapsedMs / 60000));
    if (elapsedMinutes < 1) {
      return t("time.justNow");
    }
    if (elapsedMinutes < 60) {
      return t("time.minutesAgo", { count: elapsedMinutes });
    }

    const elapsedHours = Math.floor(elapsedMinutes / 60);
    return t("time.hoursAgo", { count: elapsedHours });
  }

  function renderModeTabs() {
    elements.modeTabs.textContent = "";

    for (const page of state.pages) {
      const button = document.createElement("button");
      button.className = "mode-tab";
      button.classList.toggle("active", page.id === state.activeMode);
      button.type = "button";
      button.draggable = state.pages.length > 1;
      button.dataset.mode = page.id;
      const pageName = getDisplayPageName(page);
      button.textContent = pageName;
      button.title = t("page.dragHint", { name: pageName });
      elements.modeTabs.appendChild(button);
    }
  }

  function startPageRename(pageId) {
    const page = state.pages.find((candidate) => candidate.id === pageId);
    const button = elements.modeTabs.querySelector(`[data-mode="${CSS.escape(pageId)}"]`);
    if (!page || !button) {
      return;
    }

    const input = document.createElement("input");
    input.className = "mode-tab-input";
    input.type = "text";
    input.maxLength = 24;
    input.value = page.name;
    input.setAttribute("aria-label", t("page.name"));
    button.replaceWith(input);
    input.focus();
    input.select();

    let didFinish = false;
    const finish = async (shouldSave) => {
      if (didFinish) {
        return;
      }
      didFinish = true;

      const nextName = input.value.trim();
      if (!shouldSave || !nextName || nextName === page.name) {
        renderModeTabs();
        return;
      }

      await renamePage(pageId, nextName);
    };

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        finish(true);
      }
      if (event.key === "Escape") {
        event.preventDefault();
        finish(false);
      }
    });
    input.addEventListener("blur", () => finish(true));
  }

  async function renamePage(pageId, nextName) {
    const page = state.pages.find((candidate) => candidate.id === pageId);
    if (!page) {
      showToast(t("toast.couldNotFindPage"), true);
      return;
    }

    await persist({
      ...state,
      pages: state.pages.map((candidate) => {
        if (candidate.id !== pageId) {
          return candidate;
        }

        return {
          ...candidate,
          name: nextName.slice(0, 24)
        };
      })
    });
    showToast(t("toast.pageRenamed"));
  }

  async function movePage(pageId, targetPageId, position = "after") {
    if (!pageId || pageId === targetPageId) {
      return;
    }

    const sourceIndex = state.pages.findIndex((page) => page.id === pageId);
    if (sourceIndex < 0) {
      return;
    }

    const movingPage = state.pages[sourceIndex];
    const remainingPages = state.pages.filter((page) => page.id !== pageId);
    let insertionIndex = remainingPages.length;

    if (targetPageId) {
      const targetIndex = remainingPages.findIndex((page) => page.id === targetPageId);
      if (targetIndex >= 0) {
        insertionIndex = position === "before" ? targetIndex : targetIndex + 1;
      }
    }

    const nextPages = [...remainingPages];
    nextPages.splice(insertionIndex, 0, movingPage);

    await persist({
      ...state,
      pages: nextPages
    });
  }

  async function deletePage(pageId) {
    if (state.pages.length <= 1) {
      showToast(t("toast.keepOnePage"), true);
      return;
    }

    const pageIndex = state.pages.findIndex((page) => page.id === pageId);
    const page = state.pages[pageIndex];
    if (!page) {
      return;
    }

    const deletedPageEntry = {
      page: cloneState(page),
      pageIndex,
      projects: state.projects.filter((project) => project.mode === pageId).map(cloneState),
      activeMode: state.activeMode,
      activeProjectId: state.activeProjectId,
      activeProjectByMode: cloneState(state.activeProjectByMode)
    };

    const nextPages = state.pages.filter((candidate) => candidate.id !== pageId);
    const nextActiveMode =
      state.activeMode === pageId
        ? nextPages[Math.min(pageIndex, nextPages.length - 1)]?.id || nextPages[0].id
        : state.activeMode;
    const nextActiveProjectByMode = { ...state.activeProjectByMode };
    delete nextActiveProjectByMode[pageId];

    await persist({
      ...state,
      pages: nextPages,
      projects: state.projects.filter((project) => project.mode !== pageId),
      activeMode: nextActiveMode,
      activeProjectId:
        state.activeMode === pageId
          ? nextActiveProjectByMode[nextActiveMode] || null
          : state.activeProjectId,
      activeProjectByMode: nextActiveProjectByMode
    });

    showToast(t("toast.pageDeleted", { name: getDisplayPageName(page) }), false, {
      label: t("action.undo"),
      onClick: () => restoreDeletedPageEntry(deletedPageEntry)
    });
  }

  async function restoreDeletedPageEntry(entry) {
    if (state.pages.some((page) => page.id === entry.page.id)) {
      showToast(t("toast.pageAlreadyRestored"), true);
      return;
    }

    const nextPages = [...state.pages];
    const insertionIndex = Math.min(Math.max(entry.pageIndex || 0, 0), nextPages.length);
    nextPages.splice(insertionIndex, 0, entry.page);
    const existingProjectIds = new Set(state.projects.map((project) => project.id));
    const restoredProjects = entry.projects.filter((project) => !existingProjectIds.has(project.id));

    await persist({
      ...state,
      pages: nextPages,
      projects: [...state.projects, ...restoredProjects],
      activeMode: entry.activeMode,
      activeProjectId: entry.activeProjectId,
      activeProjectByMode: {
        ...entry.activeProjectByMode,
        ...state.activeProjectByMode,
        [entry.page.id]: entry.activeProjectByMode[entry.page.id] || null
      }
    });
    showToast(t("toast.pageRestored"));
  }

  function startPageDrag(event) {
    const button = event.target.closest(".mode-tab");
    if (!button || !button.draggable) {
      return;
    }

    pageDragState = {
      pageId: button.dataset.mode,
      originalPageIds: state.pages.map((page) => page.id)
    };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", button.dataset.mode);
    button.classList.add("is-page-dragging");
    showPageTrashDrop();
  }

  function showPageTrashDrop() {
    elements.pageTrashDrop.hidden = false;
    elements.pageTrashDrop.classList.add("is-visible");
    elements.pageTrashDrop.setAttribute("aria-hidden", "false");
  }

  function hidePageTrashDrop() {
    elements.pageTrashDrop.hidden = true;
    elements.pageTrashDrop.classList.remove("is-visible", "is-page-trash-active");
    elements.pageTrashDrop.setAttribute("aria-hidden", "true");
  }

  function clearPageDropTargets() {
    elements.modeTabs
      .querySelectorAll(".is-page-drop-before, .is-page-drop-after")
      .forEach((element) =>
        element.classList.remove("is-page-drop-before", "is-page-drop-after")
      );
    elements.pageTrashDrop.classList.remove("is-page-trash-active");
  }

  function isPointerInsideElement(event, element) {
    if (!event || typeof event.clientX !== "number" || typeof event.clientY !== "number") {
      return false;
    }

    const rect = element.getBoundingClientRect();
    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  }

  function endPageDrag(options = {}) {
    const restore = options.restore ?? true;
    const dragEvent = "dataTransfer" in options ? options : null;
    const nextPages = pageDragState ? getPreviewPageOrder() : state.pages;
    const shouldCommitPreview =
      restore &&
      pageDragState &&
      !hasSamePageOrder(nextPages) &&
      isPointerInsideElement(dragEvent, elements.modeTabs);
    const shouldRestore = restore && pageDragState && !shouldCommitPreview;
    pageDragState = null;
    clearPageDropTargets();
    hidePageTrashDrop();
    elements.modeTabs
      .querySelectorAll(".is-page-dragging")
      .forEach((element) => element.classList.remove("is-page-dragging"));
    if (shouldCommitPreview) {
      persist({
        ...state,
        pages: nextPages
      }).catch(() => showToast(t("toast.couldNotReorderPage"), true));
      return;
    }

    if (shouldRestore) {
      renderModeTabs();
    }
  }

  function getPageDropPlacement(event, targetButton) {
    if (!targetButton?.dataset.mode) {
      return {
        targetPageId: null,
        position: "after"
      };
    }

    const rect = targetButton.getBoundingClientRect();
    return {
      targetPageId: targetButton.dataset.mode,
      position: event.clientX < rect.left + rect.width / 2 ? "before" : "after"
    };
  }

  function animateElementReflow(container, selector, mutator) {
    const items = [...container.querySelectorAll(selector)];
    const beforeRects = new Map(items.map((item) => [item, item.getBoundingClientRect()]));
    mutator();

    for (const item of items) {
      if (!item.isConnected) {
        continue;
      }

      const before = beforeRects.get(item);
      const after = item.getBoundingClientRect();
      const deltaX = before.left - after.left;
      const deltaY = before.top - after.top;
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
        continue;
      }

      item.animate(
        [
          { transform: `translate(${deltaX}px, ${deltaY}px)` },
          { transform: "translate(0, 0)" }
        ],
        {
          duration: 150,
          easing: "cubic-bezier(0.2, 0, 0, 1)"
        }
      );
    }
  }

  function animateModeTabReflow(mutator) {
    animateElementReflow(elements.modeTabs, ".mode-tab", mutator);
  }

  function previewPagePlacement(sourceButton, targetButton, position) {
    if (!sourceButton || !targetButton || sourceButton === targetButton) {
      return;
    }

    const shouldInsertBefore =
      position === "before" && targetButton.previousElementSibling !== sourceButton;
    const shouldInsertAfter =
      position === "after" && targetButton.nextElementSibling !== sourceButton;
    if (!shouldInsertBefore && !shouldInsertAfter) {
      return;
    }

    animateModeTabReflow(() => {
      if (position === "before") {
        elements.modeTabs.insertBefore(sourceButton, targetButton);
        return;
      }

      elements.modeTabs.insertBefore(sourceButton, targetButton.nextSibling);
    });
  }

  function getPreviewPageOrder() {
    const pageById = new Map(state.pages.map((page) => [page.id, page]));
    const orderedIds = [...elements.modeTabs.querySelectorAll(".mode-tab")]
      .map((button) => button.dataset.mode)
      .filter((pageId) => pageById.has(pageId));

    if (orderedIds.length !== state.pages.length) {
      return state.pages;
    }

    return orderedIds.map((pageId) => pageById.get(pageId));
  }

  function hasSamePageOrder(nextPages) {
    return nextPages.every((page, index) => page.id === state.pages[index]?.id);
  }

  function handlePageDragOver(event) {
    if (!pageDragState) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    clearPageDropTargets();

    const targetButton = event.target.closest(".mode-tab");
    if (!targetButton || targetButton.dataset.mode === pageDragState.pageId) {
      return;
    }

    const placement = getPageDropPlacement(event, targetButton);
    const sourceButton = elements.modeTabs.querySelector(
      `[data-mode="${CSS.escape(pageDragState.pageId)}"]`
    );
    previewPagePlacement(sourceButton, targetButton, placement.position);
    targetButton.classList.add(
      placement.position === "before" ? "is-page-drop-before" : "is-page-drop-after"
    );
  }

  async function handlePageDrop(event) {
    if (!pageDragState) {
      return;
    }

    event.preventDefault();
    const nextPages = getPreviewPageOrder();
    const shouldPersist = !hasSamePageOrder(nextPages);
    endPageDrag({ restore: false });
    if (shouldPersist) {
      await persist({
        ...state,
        pages: nextPages
      });
    } else {
      renderModeTabs();
    }
  }

  function handlePageTrashDragOver(event) {
    if (!pageDragState) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    clearPageDropTargets();
    elements.pageTrashDrop.classList.add("is-page-trash-active");
  }

  async function handlePageTrashDrop(event) {
    if (!pageDragState) {
      return;
    }

    event.preventDefault();
    const pageId = pageDragState.pageId;
    endPageDrag({ restore: false });
    await deletePage(pageId);
  }

  function renderSidebar() {
    const activeProject = getActiveProject();
    const savedUrls = getProjectUrlSet(activeProject);
    const lowerFilter = filterText.trim().toLowerCase();
    const visibleTabs = currentTabs.filter((tab) => {
      if (!lowerFilter) {
        return true;
      }

      return `${tab.title || ""} ${tab.url || ""}`.toLowerCase().includes(lowerFilter);
    });

    elements.currentTabCount.textContent = String(currentTabs.length);
    elements.selectedTabSummary.textContent =
      selectedTabIds.size > 0
        ? t("sidebar.selectedCount", { count: selectedTabIds.size })
        : t("sidebar.noTabsSelected");
    elements.currentTabs.textContent = "";

    if (visibleTabs.length === 0) {
      elements.currentTabs.appendChild(createInlineEmptyState(t("state.noCurrentTabs")));
      return;
    }

    for (const section of buildCurrentTabSections(visibleTabs)) {
      if (section.type === "tab") {
        elements.currentTabs.appendChild(createCurrentTabRow(section.tab, savedUrls));
        continue;
      }

      elements.currentTabs.appendChild(createCurrentGroupSection(section, savedUrls));
    }
  }

  function buildCurrentTabSections(tabs) {
    const sections = [];
    const sectionByGroupId = new Map();

    for (const tab of tabs) {
      if (!isGroupedTabId(tab.groupId)) {
        sections.push({ type: "tab", tab });
        continue;
      }

      if (!sectionByGroupId.has(tab.groupId)) {
        const group = currentTabGroups.get(tab.groupId) || getPreviewGroupInfo(tab.groupId);
        const section = {
          type: "group",
          groupId: tab.groupId,
          windowId: tab.windowId,
          group,
          tabs: []
        };
        sectionByGroupId.set(tab.groupId, section);
        sections.push(section);
      }

      sectionByGroupId.get(tab.groupId).tabs.push(tab);
    }

    return sections;
  }

  function createCurrentGroupSection(section, savedUrls) {
    const groupKey = getCurrentGroupKey(section.groupId);
    const isExpanded = expandedCurrentGroupKeys.has(groupKey);
    const wrapper = document.createElement("section");
    wrapper.className = "current-tab-group";
    wrapper.classList.toggle("is-expanded", isExpanded);
    wrapper.dataset.groupId = String(section.groupId);

    const header = document.createElement("button");
    header.type = "button";
    header.className = "current-tab-group-header";
    header.draggable = true;
    header.dataset.dragKind = "current-group";
    header.dataset.tabIds = section.tabs.map((tab) => tab.id).join(",");
    header.dataset.groupId = String(section.groupId);
    header.dataset.groupWindowId = String(section.windowId ?? "");
    header.dataset.groupTitle = section.group.title || t("name.tabGroup");
    header.dataset.groupColor = section.group.color || "grey";

    const icon = document.createElement("span");
    icon.className = `current-group-icon color-${section.group.color || "grey"}`;
    icon.textContent = section.group.title?.charAt(0).toUpperCase() || "G";
    header.appendChild(icon);

    const text = document.createElement("span");
    text.className = "current-group-text";
    text.appendChild(createText("strong", "", section.group.title || t("name.tabGroup")));
    text.appendChild(createText("small", "", t("count.tabs", { count: section.tabs.length })));
    header.appendChild(text);

    const toggle = document.createElement("span");
    toggle.className = "current-group-toggle";
    toggle.textContent = isExpanded ? "^" : "v";
    header.appendChild(toggle);
    wrapper.appendChild(header);

    if (isExpanded) {
      const list = document.createElement("div");
      list.className = "current-group-tabs";
      for (const tab of section.tabs) {
        list.appendChild(createCurrentTabRow(tab, savedUrls, true));
      }
      wrapper.appendChild(list);
    }

    return wrapper;
  }

  function createCurrentTabRow(tab, savedUrls, isNested = false) {
    const normalizedUrl = normalizeUrl(tab.url);
    const isSaved = savedUrls.has(normalizedUrl);
    const row = document.createElement("label");
    row.className = "current-tab";
    row.classList.toggle("is-nested", isNested);
    row.classList.toggle("is-selected", selectedTabIds.has(tab.id));
    row.classList.toggle("is-saved", isSaved);
    row.setAttribute("role", "listitem");
    row.draggable = true;
    row.dataset.dragKind = "current-tab";
    row.dataset.tabId = String(tab.id);

    row.appendChild(createFavicon(tab));

    const text = document.createElement("span");
    text.className = "item-text";
    text.appendChild(createText("span", "item-title", tab.title || tab.url));
    text.appendChild(createText("span", "item-url", isSaved ? t("state.savedInActiveGroup") : tab.url));
    row.appendChild(text);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = selectedTabIds.has(tab.id);
    checkbox.dataset.tabId = String(tab.id);
    row.appendChild(checkbox);

    return row;
  }

  function renderProjects() {
    const lowerSearch = boardSearchText.trim().toLowerCase();
    const projects = getModeProjects();
    elements.projectBoard.textContent = "";
    elements.emptyCategory.classList.toggle("is-visible", projects.length === 0);
    elements.addGroupSpace.hidden = projects.length === 0;

    if (projects.length === 0) {
      return;
    }

    for (const project of projects) {
      const column = document.createElement("section");
      column.className = "project-column";
      column.classList.toggle("is-active", project.id === state.activeProjectId);
      column.dataset.projectId = project.id;

      const header = document.createElement("header");
      header.className = "column-header";
      header.draggable = true;
      header.dataset.dragKind = "project";
      header.dataset.projectId = project.id;
      header.title = t("action.dragGroup");
      header.appendChild(createProjectIcon(project.icon));

      const titleWrap = document.createElement("div");
      titleWrap.className = "column-title";
      const projectName = createText("h3", "project-name", project.name);
      projectName.dataset.action = "rename-project";
      projectName.dataset.projectId = project.id;
      projectName.tabIndex = 0;
      projectName.title = t("action.rename");
      titleWrap.appendChild(projectName);

      const count = document.createElement("button");
      count.type = "button";
      count.className = "site-count";
      count.dataset.action = "open-sites";
      count.dataset.projectId = project.id;
      count.title = t("action.openAll");
      count.textContent = t("count.sites", { count: project.links.length });
      count.appendChild(createText("span", "", ">"));
      titleWrap.appendChild(count);
      header.appendChild(titleWrap);

      const actions = document.createElement("div");
      actions.className = "column-actions";
      const actionRow = document.createElement("div");
      actionRow.className = "column-action-row";
      actionRow.appendChild(createColumnButton("+", t("action.saveNewTabs"), "add-current", project.id));
      actionRow.appendChild(createColumnButton("x", t("action.deleteGroup"), "delete-project", project.id, true));
      actions.appendChild(actionRow);
      actions.appendChild(renderSortMenu(project.id));
      header.appendChild(actions);

      const list = document.createElement("div");
      list.className = "link-list";
      const links = project.links.filter((link) => {
        if (!lowerSearch) {
          return true;
        }

        return `${link.title || ""} ${link.url || ""}`.toLowerCase().includes(lowerSearch);
      });

      if (links.length === 0) {
        list.appendChild(
          createInlineEmptyState(project.links.length === 0 ? t("state.dropTabsHere") : t("state.noMatches"))
        );
      } else {
        for (const link of links) {
          const linkIndex = project.links.findIndex((candidate) => candidate.id === link.id);
          list.appendChild(createSavedLink(project.id, link, linkIndex));
        }
      }

      column.appendChild(header);
      column.appendChild(list);
      elements.projectBoard.appendChild(column);
    }
  }

  function renderSortMenu(projectId) {
    const wrap = document.createElement("div");
    wrap.className = "column-sort-wrap";
    wrap.classList.toggle("is-open", sortMenuProjectId === projectId);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "column-action sort-button";
    button.dataset.action = "sort-project";
    button.dataset.projectId = projectId;
    button.title = t("action.sortLinks");
    button.setAttribute("aria-label", t("action.sortLinks"));
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", String(sortMenuProjectId === projectId));
    const icon = document.createElement("span");
    icon.className = "sort-icon";
    icon.setAttribute("aria-hidden", "true");
    button.appendChild(icon);
    wrap.appendChild(button);

    if (sortMenuProjectId !== projectId) {
      return wrap;
    }

    const menu = document.createElement("div");
    menu.className = "sort-menu";
    menu.setAttribute("role", "menu");

    for (const option of SORT_OPTIONS) {
      const optionButton = document.createElement("button");
      optionButton.type = "button";
      optionButton.setAttribute("role", "menuitem");
      optionButton.dataset.projectId = projectId;
      optionButton.dataset.sortKey = option.id;
      optionButton.textContent = t(option.labelKey);
      menu.appendChild(optionButton);
    }

    wrap.appendChild(menu);
    return wrap;
  }

  function renderControls() {
    elements.sidebar.dataset.selectedCount = String(selectedTabIds.size);
    const hasSelectedTabs = selectedTabIds.size > 0;
    const modeProjects = getModeProjects();
    if (!hasSelectedTabs || modeProjects.length === 0) {
      addToGroupMenuOpen = false;
    }

    elements.selectedTabActions.hidden = !hasSelectedTabs;
    elements.selectedTabActions.classList.toggle("is-visible", hasSelectedTabs);
    elements.saveSelectedNewProject.disabled = !hasSelectedTabs;
    elements.saveSelectedActiveProject.disabled = !hasSelectedTabs || modeProjects.length === 0;
    elements.saveSelectedActiveProject.title =
      modeProjects.length > 0 ? t("action.chooseGroup") : t("action.createGroupFirst");
    elements.saveSelectedActiveProject.setAttribute("aria-expanded", String(addToGroupMenuOpen));
    elements.createTopPage.disabled = state.pages.length >= MAX_PAGES;
    elements.createTopPage.title =
      state.pages.length >= MAX_PAGES ? t("action.maximumPages") : t("action.createPage");
    renderAddToGroupMenu(modeProjects, hasSelectedTabs);
  }

  function renderAddToGroupMenu(modeProjects, hasSelectedTabs) {
    elements.addToGroupMenu.textContent = "";
    const shouldShow = addToGroupMenuOpen && hasSelectedTabs && modeProjects.length > 0;
    elements.addToGroupMenu.hidden = !shouldShow;

    if (!shouldShow) {
      return;
    }

    for (const project of modeProjects) {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "menuitem");
      button.className = "add-to-group-option";
      button.classList.toggle("is-active", project.id === state.activeProjectId);
      button.dataset.projectId = project.id;
      button.appendChild(createText("strong", "", project.name));
      button.appendChild(createText("small", "", t("count.sites", { count: project.links.length })));
      elements.addToGroupMenu.appendChild(button);
    }
  }

  function createSavedLink(projectId, link, linkIndex) {
    const row = document.createElement("div");
    row.className = "saved-link";
    row.setAttribute("role", "listitem");
    row.draggable = true;
    row.dataset.dragKind = "saved-link";
    row.dataset.projectId = projectId;
    row.dataset.linkId = link.id;
    row.dataset.linkIndex = String(linkIndex);

    row.appendChild(createFavicon(link));

    const open = document.createElement("button");
    open.type = "button";
    open.className = "open-link";
    open.appendChild(createText("span", "item-title", link.title || link.url));
    open.appendChild(createText("span", "item-url", link.url));
    open.addEventListener("click", () => {
      openSavedLink(projectId, link).catch((error) => {
        console.error("Could not open saved link", error);
        showToast(t("toast.couldNotOpenTabs"), true);
      });
    });
    row.appendChild(open);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-link";
    remove.title = t("action.deleteLink");
    remove.setAttribute("aria-label", t("action.deleteLink"));
    remove.textContent = "x";
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteLink(projectId, link.id);
    });
    row.appendChild(remove);

    return row;
  }

  function createColumnButton(label, title, action, projectId, danger = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = danger ? "column-action danger" : "column-action";
    button.title = title;
    button.dataset.action = action;
    button.dataset.projectId = projectId;
    button.textContent = label;
    return button;
  }

  function startProjectRename(projectId) {
    const project = state.projects.find((candidate) => candidate.id === projectId);
    const column = elements.projectBoard.querySelector(`[data-project-id="${projectId}"]`);
    const title = column?.querySelector(".project-name");
    if (!project || !title || column.querySelector(".project-name-input")) {
      return;
    }

    const input = document.createElement("input");
    input.className = "project-name-input";
    input.type = "text";
    input.maxLength = 40;
    input.value = project.name;
    input.setAttribute("aria-label", t("input.groupName"));
    title.replaceWith(input);
    input.focus();
    input.select();

    let didFinish = false;
    const finish = async (shouldSave) => {
      if (didFinish) {
        return;
      }
      didFinish = true;

      const nextName = input.value.trim();
      if (!shouldSave || !nextName || nextName === project.name) {
        renderProjects();
        return;
      }

      await renameProject(projectId, nextName);
    };

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        finish(true);
      }
      if (event.key === "Escape") {
        event.preventDefault();
        finish(false);
      }
    });
    input.addEventListener("blur", () => finish(true));
  }

  async function renameProject(projectId, nextName) {
    const project = state.projects.find((candidate) => candidate.id === projectId);
    if (!project) {
      showToast(t("toast.couldNotFindGroup"), true);
      return;
    }

    const renamedProject = {
      ...project,
      name: nextName
    };

    await persist({
      ...state,
      projects: state.projects.map((candidate) => {
        if (candidate.id !== projectId) {
          return candidate;
        }

        return renamedProject;
      })
    });
    await syncProjectNameToChromeGroup(renamedProject);
    showToast(t("toast.groupRenamed"));
  }

  function createProjectIcon(iconId) {
    const icon = getIcon(iconId);
    const element = document.createElement("span");
    element.className = "project-icon";
    element.textContent = icon.glyph;
    element.title = icon.label;
    element.dataset.icon = icon.id;
    return element;
  }

  function createFavicon(item) {
    if (item.favIconUrl) {
      const image = document.createElement("img");
      image.className = "favicon";
      image.src = item.favIconUrl;
      image.alt = "";
      image.addEventListener("error", () => {
        image.replaceWith(createFallbackIcon(item.url));
      });
      return image;
    }

    return createFallbackIcon(item.url);
  }

  function createFallbackIcon(url) {
    const fallback = document.createElement("span");
    fallback.className = "fallback-icon";
    fallback.textContent = getDomainInitial(url);
    fallback.setAttribute("aria-hidden", "true");
    return fallback;
  }

  function getDomainInitial(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "").charAt(0).toUpperCase() || "?";
    } catch (_error) {
      return "?";
    }
  }

  function createText(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    element.textContent = text;
    return element;
  }

  function createInlineEmptyState(message) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = message;
    return empty;
  }

  function showToast(message, isWarning = false, action = null) {
    clearTimeout(toastTimer);
    elements.toast.textContent = "";
    elements.toast.appendChild(createText("span", "toast-message", message));

    if (action?.label && typeof action.onClick === "function") {
      const actionButton = document.createElement("button");
      actionButton.type = "button";
      actionButton.className = "toast-action";
      actionButton.textContent = action.label;
      actionButton.addEventListener("click", async () => {
        clearTimeout(toastTimer);
        elements.toast.classList.remove("is-visible");
        await action.onClick();
      });
      elements.toast.appendChild(actionButton);
    }

    elements.toast.classList.toggle("is-warning", isWarning);
    elements.toast.classList.add("is-visible");

    toastTimer = setTimeout(() => {
      elements.toast.classList.remove("is-visible");
    }, action ? 6200 : 2600);
  }

  function startCurrentTabDrag(event) {
    const groupHeader = event.target.closest(".current-tab-group-header");
    if (groupHeader) {
      const tabIds = groupHeader.dataset.tabIds
        .split(",")
        .map((tabId) => Number(tabId))
        .filter(Number.isInteger);
      dragState = {
        kind: "current-tabs",
        tabIds,
        source: "current-group",
        sourceGroupId: Number(groupHeader.dataset.groupId),
        sourceWindowId: Number(groupHeader.dataset.groupWindowId),
        sourceGroupTitle: groupHeader.dataset.groupTitle || t("name.tabGroup"),
        sourceGroupColor: groupHeader.dataset.groupColor || "grey"
      };
      writeDragData(event, dragState);
      groupHeader.classList.add("is-dragging");
      return;
    }

    const row = event.target.closest(".current-tab");
    if (!row) {
      return;
    }

    const tabId = Number(row.dataset.tabId);
    const tabIds = selectedTabIds.has(tabId) ? [...selectedTabIds] : [tabId];
    dragState = {
      kind: "current-tabs",
      tabIds
    };
    writeDragData(event, dragState);
    row.classList.add("is-dragging");
  }

  function startBoardDrag(event) {
    const row = event.target.closest(".saved-link");
    if (row) {
      dragState = {
        kind: "saved-link",
        sourceProjectId: row.dataset.projectId,
        linkId: row.dataset.linkId
      };
      writeDragData(event, dragState);
      row.classList.add("is-dragging");
      return;
    }

    const header = event.target.closest(".column-header");
    const blockedTarget = event.target.closest("button, input, textarea, select");
    if (!header || blockedTarget) {
      return;
    }

    const column = header.closest(".project-column");
    if (!column?.dataset.projectId) {
      return;
    }

    dragState = {
      kind: "project",
      projectId: column.dataset.projectId
    };
    writeDragData(event, dragState);
    column.classList.add("is-dragging");
  }

  function writeDragData(event, payload) {
    const isMove = payload.kind === "saved-link" || payload.kind === "project";
    event.dataTransfer.effectAllowed = isMove ? "move" : "copy";
    event.dataTransfer.setData(DRAG_MIME_TYPE, JSON.stringify(payload));
    event.dataTransfer.setData("text/plain", payload.kind);
  }

  function readDragData(event) {
    if (dragState) {
      return dragState;
    }

    try {
      const raw = event.dataTransfer.getData(DRAG_MIME_TYPE);
      return raw ? JSON.parse(raw) : null;
    } catch (_error) {
      return null;
    }
  }

  function canAcceptDrop(event) {
    return dragState || [...event.dataTransfer.types].includes(DRAG_MIME_TYPE);
  }

  function markDragPreviewed() {
    if (dragState) {
      dragState.previewed = true;
    }
  }

  function animateProjectReflow(mutator) {
    animateElementReflow(elements.projectBoard, ".project-column", mutator);
  }

  function animateSavedLinkReflow(mutator) {
    animateElementReflow(elements.projectBoard, ".saved-link", mutator);
  }

  function getSourceProjectColumn(projectId) {
    if (!projectId) {
      return null;
    }

    return elements.projectBoard.querySelector(
      `.project-column[data-project-id="${CSS.escape(projectId)}"]`
    );
  }

  function previewProjectPlacement(sourceColumn, targetColumn, position = "end") {
    if (!sourceColumn) {
      return;
    }

    if (!targetColumn) {
      if (sourceColumn === elements.projectBoard.lastElementChild) {
        return;
      }

      animateProjectReflow(() => {
        elements.projectBoard.appendChild(sourceColumn);
      });
      markDragPreviewed();
      return;
    }

    if (sourceColumn === targetColumn) {
      return;
    }

    const shouldInsertBefore =
      position === "before" && targetColumn.previousElementSibling !== sourceColumn;
    const shouldInsertAfter =
      position === "after" && targetColumn.nextElementSibling !== sourceColumn;
    if (!shouldInsertBefore && !shouldInsertAfter) {
      return;
    }

    animateProjectReflow(() => {
      if (position === "before") {
        elements.projectBoard.insertBefore(sourceColumn, targetColumn);
        return;
      }

      elements.projectBoard.insertBefore(sourceColumn, targetColumn.nextSibling);
    });
    markDragPreviewed();
  }

  function getPreviewProjectOrder() {
    const projectById = new Map(getModeProjects().map((project) => [project.id, project]));
    const orderedIds = [...elements.projectBoard.querySelectorAll(".project-column")]
      .map((column) => column.dataset.projectId)
      .filter((projectId) => projectById.has(projectId));

    if (orderedIds.length !== projectById.size) {
      return getModeProjects();
    }

    return orderedIds.map((projectId) => projectById.get(projectId));
  }

  function hasSameProjectOrder(nextProjects) {
    const currentProjects = getModeProjects();
    return nextProjects.every((project, index) => project.id === currentProjects[index]?.id);
  }

  async function persistPreviewProjectOrder(projectId, nextModeProjects) {
    const reorderedProjects = [...nextModeProjects];
    await persist({
      ...state,
      projects: state.projects.map((project) => {
        if (project.mode !== state.activeMode) {
          return project;
        }

        return reorderedProjects.shift();
      }),
      activeProjectId: projectId,
      activeProjectByMode: {
        ...state.activeProjectByMode,
        [state.activeMode]: projectId
      }
    });
  }

  function getSourceSavedLinkRow(payload) {
    if (!payload?.linkId) {
      return null;
    }

    return elements.projectBoard.querySelector(
      `.saved-link[data-link-id="${CSS.escape(payload.linkId)}"]`
    );
  }

  function previewSavedLinkPlacement(sourceRow, targetColumn, targetLink, placement) {
    const targetList = targetColumn?.querySelector(".link-list");
    if (!sourceRow || !targetList || sourceRow === targetLink) {
      return;
    }

    animateSavedLinkReflow(() => {
      if (targetLink && placement.position === "before") {
        targetList.insertBefore(sourceRow, targetLink);
        return;
      }

      if (targetLink && placement.position === "after") {
        targetList.insertBefore(sourceRow, targetLink.nextSibling);
        return;
      }

      targetList.appendChild(sourceRow);
    });
    markDragPreviewed();
  }

  function rememberPreviewLinkMove(targetProjectId, insertAt) {
    if (!dragState || dragState.kind !== "saved-link" || !targetProjectId) {
      return;
    }

    dragState.previewLinkMove = {
      targetProjectId,
      insertAt
    };
  }

  function getPreviewLinkMove(payload) {
    if (payload?.previewLinkMove) {
      return payload.previewLinkMove;
    }

    const sourceRow = getSourceSavedLinkRow(payload);
    const targetColumn = sourceRow?.closest(".project-column");
    const targetList = targetColumn?.querySelector(".link-list");
    if (!sourceRow || !targetColumn || !targetList) {
      return null;
    }

    const targetProjectId = targetColumn.dataset.projectId;
    const visualIndex = [...targetList.querySelectorAll(".saved-link")].indexOf(sourceRow);
    if (visualIndex < 0) {
      return null;
    }

    const sourceProject = state.projects.find((project) => project.id === payload.sourceProjectId);
    const sourceIndex = sourceProject?.links.findIndex((link) => link.id === payload.linkId) ?? -1;
    const insertAt =
      payload.sourceProjectId === targetProjectId && sourceIndex >= 0 && sourceIndex < visualIndex
        ? visualIndex + 1
        : visualIndex;

    return {
      targetProjectId,
      insertAt
    };
  }

  function handleDragOver(event) {
    if (!canAcceptDrop(event)) {
      return;
    }

    event.preventDefault();
    const payload = dragState;
    const targetColumn = event.target.closest(".project-column");
    const targetAddButton = event.target.closest(".add-group-button");
    clearDropTargets();

    if (payload?.kind === "project") {
      const sourceColumn = getSourceProjectColumn(payload.projectId);
      if (targetColumn && targetColumn.dataset.projectId !== payload.projectId) {
        const placement = getProjectDropPlacement(event, targetColumn);
        previewProjectPlacement(sourceColumn, targetColumn, placement.position);
        targetColumn.classList.add(
          "is-project-drop-target",
          placement.position === "after" ? "is-drop-after" : "is-drop-before"
        );
      } else if (targetAddButton) {
        previewProjectPlacement(sourceColumn, null, "end");
        targetAddButton.classList.add("is-space-drop-target");
      }
    } else if (targetColumn) {
      targetColumn.classList.add("is-drop-target");
      if (payload?.kind === "saved-link") {
        const sourceRow = getSourceSavedLinkRow(payload);
        const targetLink = event.target.closest(".saved-link");
        if (targetLink !== sourceRow) {
          const placement = getLinkDropPlacement(event, targetColumn, targetLink);
          rememberPreviewLinkMove(targetColumn.dataset.projectId, placement.index);
          previewSavedLinkPlacement(sourceRow, targetColumn, targetLink, placement);
          if (targetLink) {
            targetLink.classList.add(
              placement.position === "after" ? "is-link-drop-after" : "is-link-drop-before"
            );
          } else {
            targetColumn.querySelector(".link-list")?.classList.add("is-link-drop-end");
          }
        }
      } else {
        showLinkDropTarget(event, targetColumn);
      }
    } else if (targetAddButton) {
      targetAddButton.classList.add("is-space-drop-target");
    } else {
      elements.emptyCategory.classList.add("is-drop-target");
    }

    event.dataTransfer.dropEffect =
      payload?.kind === "saved-link" || payload?.kind === "project" ? "move" : "copy";
  }

  async function handleBoardDrop(event) {
    if (!canAcceptDrop(event)) {
      return;
    }

    event.preventDefault();
    const payload = readDragData(event);
    clearDropTargets();

    if (!payload) {
      return;
    }
    payload.didDrop = true;

    const targetColumn = event.target.closest(".project-column");
    const targetProjectId = targetColumn?.dataset.projectId;
    const targetLink = event.target.closest(".saved-link");

    if (payload.kind === "project") {
      const nextModeProjects = getPreviewProjectOrder();
      if (hasSameProjectOrder(nextModeProjects)) {
        const placement = getProjectDropPlacement(event, targetColumn);
        await moveProject(payload.projectId, placement.targetProjectId, placement.position);
        return;
      }

      await persistPreviewProjectOrder(payload.projectId, nextModeProjects);
      return;
    }

    if (!targetProjectId) {
      await createProjectFromDrop(payload);
      return;
    }

    if (payload.kind === "current-tabs") {
      const tabs = resolveDroppedItems(payload);
      const insertAt = getLinkDropPlacement(event, targetColumn, targetLink).index;
      await saveTabsToProject(targetProjectId, tabs, true, insertAt);
      await bindProjectToChromeGroupFromDrop(targetProjectId, payload);
      return;
    }

    if (payload.kind === "saved-link") {
      const previewMove = getPreviewLinkMove(payload);
      const insertAt = previewMove?.insertAt ?? getLinkDropPlacement(event, targetColumn, targetLink).index;
      await moveSavedLink(
        payload.sourceProjectId,
        payload.linkId,
        previewMove?.targetProjectId || targetProjectId,
        insertAt
      );
    }
  }

  function getProjectDropPlacement(event, targetColumn) {
    if (!targetColumn?.dataset.projectId) {
      return {
        targetProjectId: null,
        position: "end"
      };
    }

    const rect = targetColumn.getBoundingClientRect();
    return {
      targetProjectId: targetColumn.dataset.projectId,
      position: event.clientX > rect.left + rect.width / 2 ? "after" : "before"
    };
  }

  function showLinkDropTarget(event, targetColumn) {
    const targetLink = event.target.closest(".saved-link");
    const targetList = targetColumn.querySelector(".link-list");

    if (targetLink) {
      const placement = getLinkDropPlacement(event, targetColumn, targetLink);
      targetLink.classList.add(
        placement.position === "after" ? "is-link-drop-after" : "is-link-drop-before"
      );
      return;
    }

    targetList?.classList.add("is-link-drop-end");
  }

  function getLinkDropPlacement(event, targetColumn, targetLink) {
    const project = state.projects.find(
      (candidate) => candidate.id === targetColumn?.dataset.projectId
    );
    const fallbackIndex = project?.links.length || 0;

    if (!targetLink) {
      return {
        index: fallbackIndex,
        position: "end"
      };
    }

    const linkIndex = Number(targetLink.dataset.linkIndex);
    if (!Number.isInteger(linkIndex)) {
      return {
        index: fallbackIndex,
        position: "end"
      };
    }

    const rect = targetLink.getBoundingClientRect();
    const position = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
    return {
      index: position === "after" ? linkIndex + 1 : linkIndex,
      position
    };
  }

  async function endDrag(event) {
    const currentDragState = dragState;
    const boardViewport = document.querySelector(".board-viewport");
    const shouldCommitPreview =
      currentDragState?.previewed &&
      !currentDragState.didDrop &&
      isPointerInsideElement(event, boardViewport);
    const shouldRestorePreview = currentDragState?.previewed && !currentDragState.didDrop;
    dragState = null;
    clearDropTargets();
    document
      .querySelectorAll(".is-dragging")
      .forEach((element) => element.classList.remove("is-dragging"));

    if (shouldCommitPreview && currentDragState.kind === "project") {
      const nextModeProjects = getPreviewProjectOrder();
      if (!hasSameProjectOrder(nextModeProjects)) {
        await persistPreviewProjectOrder(currentDragState.projectId, nextModeProjects);
        return;
      }
    }

    if (shouldCommitPreview && currentDragState.kind === "saved-link") {
      const previewMove = getPreviewLinkMove(currentDragState);
      if (previewMove?.targetProjectId) {
        await moveSavedLink(
          currentDragState.sourceProjectId,
          currentDragState.linkId,
          previewMove.targetProjectId,
          previewMove.insertAt
        );
        return;
      }
    }

    if (shouldRestorePreview) {
      renderProjects();
    }
  }

  function clearDropTargets() {
    const dropClasses = [
      "is-drop-target",
      "is-project-drop-target",
      "is-drop-before",
      "is-drop-after",
      "is-link-drop-before",
      "is-link-drop-after",
      "is-link-drop-end",
      "is-space-drop-target"
    ];

    document
      .querySelectorAll(dropClasses.map((className) => `.${className}`).join(", "))
      .forEach((element) => element.classList.remove(...dropClasses));
  }

  function setSidebarExpanded(expanded) {
    document.documentElement.classList.toggle("sidebar-expanded", expanded);
    elements.sidebar.classList.toggle("is-expanded", expanded);
  }

  function renderSidebarPinState() {
    elements.toggleSidebar.classList.toggle("is-active", sidebarPinned);
    elements.toggleSidebar.setAttribute("aria-pressed", String(sidebarPinned));
    setSidebarExpanded(sidebarPinned);
  }

  function isSettingsPanelOpen() {
    return elements.settingsPanel.classList.contains("is-open");
  }

  function openSettingsPanel() {
    elements.settingsPanel.classList.add("is-open");
    elements.settingsPanel.setAttribute("aria-hidden", "false");
    elements.openSettings.setAttribute("aria-pressed", "true");
  }

  function closeSettingsPanel() {
    elements.settingsPanel.classList.remove("is-open");
    elements.settingsPanel.setAttribute("aria-hidden", "true");
    elements.openSettings.setAttribute("aria-pressed", "false");
  }

  function toggleSettingsPanel(open) {
    if (open) {
      openSettingsPanel();
      return;
    }

    closeSettingsPanel();
  }

  function isHelpModalOpen() {
    return elements.helpModal.classList.contains("is-open");
  }

  function openHelpModal() {
    closeSettingsPanel();
    currentHelpSlideIndex = 0;
    renderHelpSlide();
    elements.helpModal.classList.add("is-open");
    elements.helpModal.setAttribute("aria-hidden", "false");
    elements.openHelp.setAttribute("aria-pressed", "true");
  }

  function closeHelpModal() {
    elements.helpModal.classList.remove("is-open");
    elements.helpModal.setAttribute("aria-hidden", "true");
    elements.openHelp.setAttribute("aria-pressed", "false");
  }

  function showHelpSlide(index) {
    currentHelpSlideIndex = Math.max(0, Math.min(index, HELP_SLIDES.length - 1));
    renderHelpSlide();
  }

  function getHelpTextValues() {
    return {
      currentWindow: t("sidebar.currentWindow"),
      newGroup: t("action.newGroup"),
      addToGroup: t("action.addToGroup")
    };
  }

  function renderHelpSlide() {
    if (!elements.helpTitle || !elements.helpBody || !elements.helpDots) {
      return;
    }

    const slide = HELP_SLIDES[currentHelpSlideIndex] || HELP_SLIDES[0];
    elements.helpKicker.textContent = t("help.step", {
      current: currentHelpSlideIndex + 1,
      total: HELP_SLIDES.length
    });
    elements.helpVisual.dataset.visual = slide.visual;
    elements.helpTitle.textContent = t(slide.titleKey);
    elements.helpBody.textContent = t(slide.bodyKey, getHelpTextValues());
    elements.helpPrev.disabled = currentHelpSlideIndex === 0;
    elements.helpNext.disabled = currentHelpSlideIndex === HELP_SLIDES.length - 1;

    elements.helpDots.textContent = "";
    HELP_SLIDES.forEach((_slide, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "help-dot";
      dot.classList.toggle("is-active", index === currentHelpSlideIndex);
      dot.dataset.helpIndex = String(index);
      dot.setAttribute("aria-label", t("help.step", { current: index + 1, total: HELP_SLIDES.length }));
      elements.helpDots.appendChild(dot);
    });
  }

  function bindEvents() {
    elements.currentTabs.addEventListener("click", (event) => {
      const groupHeader = event.target.closest(".current-tab-group-header");
      if (!groupHeader) {
        return;
      }

      const groupKey = getCurrentGroupKey(Number(groupHeader.dataset.groupId));
      if (expandedCurrentGroupKeys.has(groupKey)) {
        expandedCurrentGroupKeys.delete(groupKey);
        collapsedCurrentGroupKeys.add(groupKey);
      } else {
        expandedCurrentGroupKeys.add(groupKey);
        collapsedCurrentGroupKeys.delete(groupKey);
      }
      renderSidebar();
    });

    elements.currentTabs.addEventListener("change", (event) => {
      if (event.target.type !== "checkbox") {
        return;
      }

      const tabId = Number(event.target.dataset.tabId);
      if (event.target.checked) {
        selectedTabIds.add(tabId);
      } else {
        selectedTabIds.delete(tabId);
      }
      render();
    });
    elements.currentTabs.addEventListener("dragstart", startCurrentTabDrag);
    elements.currentTabs.addEventListener("dragend", endDrag);
    elements.projectBoard.addEventListener("dragstart", startBoardDrag);
    elements.projectBoard.addEventListener("dragend", endDrag);

    const boardViewport = document.querySelector(".board-viewport");
    boardViewport.addEventListener("dragover", handleDragOver);
    boardViewport.addEventListener("dragleave", (event) => {
      if (!boardViewport.contains(event.relatedTarget)) {
        clearDropTargets();
      }
    });
    boardViewport.addEventListener("drop", handleBoardDrop);

    elements.projectBoard.addEventListener("click", (event) => {
      const sortOption = event.target.closest("[data-sort-key]");
      if (sortOption) {
        sortProjectLinks(sortOption.dataset.projectId, sortOption.dataset.sortKey).catch((error) => {
          console.error("Could not sort links", error);
          showToast(t("toast.couldNotFindGroup"), true);
        });
        return;
      }

      const actionButton = event.target.closest("[data-action]");
      if (actionButton) {
        const projectId = actionButton.dataset.projectId;
        if (actionButton.dataset.action === "rename-project") {
          startProjectRename(projectId);
          return;
        }
        if (actionButton.dataset.action === "open-sites") {
          const project = state.projects.find((candidate) => candidate.id === projectId);
          openProjectSites(project).catch((error) => {
            console.error("Could not open project group", error);
            showToast(t("toast.couldNotOpenGroup"), true);
          });
          return;
        }
        if (actionButton.dataset.action === "sort-project") {
          sortMenuProjectId = sortMenuProjectId === projectId ? null : projectId;
          renderProjects();
          return;
        }
        if (actionButton.dataset.action === "add-current") {
          saveTabsToProject(projectId, currentTabs, true);
          return;
        }
        if (actionButton.dataset.action === "delete-project") {
          deleteProject(projectId);
          return;
        }
      }

      const column = event.target.closest(".project-column");
      if (column?.dataset.projectId) {
        state.activeProjectId = column.dataset.projectId;
        state.activeProjectByMode = {
          ...state.activeProjectByMode,
          [state.activeMode]: column.dataset.projectId
        };
        storage.save(state);
        render();
      }
    });

    elements.projectBoard.addEventListener("keydown", (event) => {
      const renameTarget = event.target.closest('[data-action="rename-project"]');
      if (!renameTarget || (event.key !== "Enter" && event.key !== "F2")) {
        return;
      }

      event.preventDefault();
      startProjectRename(renameTarget.dataset.projectId);
    });

    elements.refreshTabs.addEventListener("click", refreshCurrentTabs);
    elements.createEmptyProject.addEventListener("click", () => createProject(t("name.untitled")));
    elements.addGroupButton.addEventListener("click", () => createProject(t("name.untitled")));
    elements.createTopPage.addEventListener("click", createPage);
    elements.saveSelectedNewProject.addEventListener("click", saveSelectedTabsToNewProject);
    elements.saveSelectedActiveProject.addEventListener("click", () => {
      if (elements.saveSelectedActiveProject.disabled) {
        return;
      }

      addToGroupMenuOpen = !addToGroupMenuOpen;
      renderControls();
    });
    elements.addToGroupMenu.addEventListener("click", (event) => {
      const option = event.target.closest("[data-project-id]");
      if (!option) {
        return;
      }

      saveSelectedTabsToProject(option.dataset.projectId);
    });
    document.addEventListener("click", (event) => {
      if (!addToGroupMenuOpen || elements.selectedTabActions.contains(event.target)) {
        if (sortMenuProjectId && !event.target.closest(".column-sort-wrap")) {
          sortMenuProjectId = null;
          renderProjects();
        }
        return;
      }

      addToGroupMenuOpen = false;
      renderControls();
      if (sortMenuProjectId && !event.target.closest(".column-sort-wrap")) {
        sortMenuProjectId = null;
        renderProjects();
      }
    });
    elements.toggleSidebar.addEventListener("click", () => {
      const nextSidebarPinned = !sidebarPinned;
      sidebarPinned = nextSidebarPinned;
      renderSidebarPinState();
      persist({
        ...state,
        settings: {
          ...state.settings,
          sidebarPinned: nextSidebarPinned
        }
      });
    });

    elements.sidebar.addEventListener("mouseenter", () => setSidebarExpanded(true));
    elements.sidebar.addEventListener("mouseleave", () => {
      if (!sidebarPinned) {
        setSidebarExpanded(false);
      }
    });

    elements.tabFilter.addEventListener("input", () => {
      filterText = elements.tabFilter.value;
      renderSidebar();
    });

    elements.boardSearch.addEventListener("input", () => {
      boardSearchText = elements.boardSearch.value;
      renderProjects();
    });

    elements.modeTabs.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-mode]");
      if (!button || button.dataset.mode === state.activeMode) {
        return;
      }

      addToGroupMenuOpen = false;
      await persist({ ...state, activeMode: button.dataset.mode });
    });

    elements.modeTabs.addEventListener("dblclick", (event) => {
      const button = event.target.closest("[data-mode]");
      if (!button) {
        return;
      }

      event.preventDefault();
      startPageRename(button.dataset.mode);
    });
    elements.modeTabs.addEventListener("dragstart", startPageDrag);
    elements.modeTabs.addEventListener("dragover", handlePageDragOver);
    elements.modeTabs.addEventListener("drop", handlePageDrop);
    elements.modeTabs.addEventListener("dragend", endPageDrag);
    elements.pageTrashDrop.addEventListener("dragover", handlePageTrashDragOver);
    elements.pageTrashDrop.addEventListener("drop", handlePageTrashDrop);
    elements.pageTrashDrop.addEventListener("dragleave", () => {
      elements.pageTrashDrop.classList.remove("is-page-trash-active");
    });

    elements.openSettings.addEventListener("click", () => {
      toggleSettingsPanel(!isSettingsPanelOpen());
    });

    elements.closeSettings.addEventListener("click", closeSettingsPanel);
    elements.openHelp.addEventListener("click", openHelpModal);
    elements.closeHelp.addEventListener("click", closeHelpModal);
    elements.helpPrev.addEventListener("click", () => {
      showHelpSlide(currentHelpSlideIndex - 1);
    });
    elements.helpNext.addEventListener("click", () => {
      showHelpSlide(currentHelpSlideIndex + 1);
    });
    elements.helpDots.addEventListener("click", (event) => {
      const dot = event.target.closest("[data-help-index]");
      if (!dot) {
        return;
      }

      showHelpSlide(Number(dot.dataset.helpIndex));
    });
    elements.helpModal.addEventListener("click", (event) => {
      if (event.target === elements.helpModal) {
        closeHelpModal();
      }
    });

    elements.importBackup.addEventListener("click", () => {
      elements.backupFileInput.click();
    });
    elements.exportBackup.addEventListener("click", exportBackup);
    elements.backupFileInput.addEventListener("change", () => {
      const [file] = elements.backupFileInput.files || [];
      importBackupFile(file).finally(() => {
        elements.backupFileInput.value = "";
      });
    });

    elements.settingOpenLinksCurrentTab.addEventListener("change", () => {
      persist({
        ...state,
        settings: {
          ...state.settings,
          openLinksInCurrentTab: elements.settingOpenLinksCurrentTab.checked
        }
      });
    });

    elements.settingFocusOpenedTab.addEventListener("change", () => {
      persist({
        ...state,
        settings: {
          ...state.settings,
          focusOpenedTab: elements.settingFocusOpenedTab.checked
        }
      });
    });

    elements.settingSavedGroupsFirst.addEventListener("change", () => {
      persist({
        ...state,
        settings: {
          ...state.settings,
          savedGroupsFirst: elements.settingSavedGroupsFirst.checked
        }
      });
    });

    elements.settingDarkMode.addEventListener("change", () => {
      persist({
        ...state,
        settings: {
          ...state.settings,
          darkMode: elements.settingDarkMode.checked
        }
      });
    });

    elements.settingOpenSitesAsGroup.addEventListener("change", () => {
      persist({
        ...state,
        settings: {
          ...state.settings,
          openSitesAsGroup: elements.settingOpenSitesAsGroup.checked
        }
      });
    });

    elements.settingLanguage.addEventListener("change", () => {
      persist({
        ...state,
        settings: {
          ...state.settings,
          language: elements.settingLanguage.value
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isHelpModalOpen()) {
        closeHelpModal();
        return;
      }

      if (event.key.toLowerCase() === "s" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        if (document.activeElement === document.body) {
          event.preventDefault();
          setSidebarExpanded(true);
          elements.tabFilter.focus();
        }
      }
    });
  }

  async function init() {
    bindEvents();
    state = await storage.load();
    sidebarPinned = state.settings.sidebarPinned !== false;
    renderSidebarPinState();
    ensureActiveProject();
    applyTheme();
    await refreshCurrentTabs();
  }

  init().catch((error) => {
    console.error(error);
    showToast(t("toast.failedInitialize"), true);
  });
})();
