// background.js

const onRun = async () => {
  console.log("Start moving windows");
  const currentWin = await chrome.windows.getCurrent();
  const allWindows = await chrome.windows.getAll();
  const allTabs = (
    await Promise.all(
      allWindows
        .map((w) => chrome.tabs.query({ windowId: w.id }))
    )
  ).flatMap((t) => t);

  allTabs
    .sort((a, b) => b.title?.localeCompare(a.title ?? "") ?? 0)
    .forEach((t) => {
      if (t?.id) {
        chrome.tabs.move(t.id, {
          windowId: currentWin.id,
          index: 0,
        });
      }
    });
};

chrome.action.onClicked.addListener(() => onRun());
export {};
