// background.js
import { groupBy } from "lodash";

const onRun = async () => {
  const currentWin = await chrome.windows.getCurrent();
  const allWindows = await chrome.windows.getAll();
  const allTabs = (
    await Promise.all(
      allWindows.map((w) => chrome.tabs.query({ windowId: w.id }))
    )
  ).flatMap((t) => t);

  const tabs = allTabs
    .sort((a, b) => b.title?.localeCompare(a.title ?? "") ?? 0)
    .map((t) => {
      if (t?.id) {
        chrome.tabs.move(t.id, {
          windowId: currentWin.id,
          index: 0,
        });
      }
      return t;
    });
  // group tabs
  const groups = groupBy(tabs, (t) => {
    const url = new URL(t.url ?? "nourl.com");
    return url.hostname ?? "none";
  });
  Object.entries(groups).forEach((kv) => {
    if (kv[1].length > 1) {
      chrome.tabs
        .group({
          tabIds: kv[1].map((t) => t.id) as number[],
        })
        .then((gId) =>
          chrome.tabGroups.update(gId, {
            title: kv[0],
            collapsed: true,
          })
        );
    }
  });
};

chrome.action.onClicked.addListener(() => onRun());
export {};
