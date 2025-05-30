function applyFilter(excludedChannels) {
  const notifications = document.querySelectorAll('ytd-notification-renderer');

  notifications.forEach(notif => {
    const link = notif.querySelector('a');
    const img = notif.querySelector('img');
    const channelSpan = notif.querySelector('#text');

    const channelName = channelSpan ? channelSpan.textContent.trim() : '';

    if (excludedChannels.includes(channelName)) return;

    if (link && link.href.includes('/shorts/')) {
      notif.style.display = 'none';
      return;
    }

    if (img && img.clientHeight > 0 && img.clientWidth > 0) {
      const ratio = img.clientHeight / img.clientWidth;
      if (ratio > 1.3 || img.clientHeight > 100) {
        notif.style.display = 'none';
        return;
      }
    }

    const imgContainer = notif.querySelector('#thumbnail');
    if (imgContainer && imgContainer.clientHeight > 100) {
      notif.style.display = 'none';
    }
  });
}

function removeFilter() {
  const notifications = document.querySelectorAll('ytd-notification-renderer');
  notifications.forEach(notif => {
    notif.style.display = '';
  });
}

function toggleFilter(state, excludedChannels) {
  if (state === 'on') {
    applyFilter(excludedChannels);
  } else {
    removeFilter();
  }
}

chrome.storage.sync.get(['filterState', 'excludedChannels'], function(result) {
  const state = result.filterState || 'on';
  const excluded = result.excludedChannels || [];
  toggleFilter(state, excluded);
  insertInlineToggleButton(state);
});

const observer = new MutationObserver(() => {
  chrome.storage.sync.get(['filterState', 'excludedChannels'], function(result) {
    const state = result.filterState || 'on';
    const excluded = result.excludedChannels || [];
    toggleFilter(state, excluded);
    insertInlineToggleButton(state);
  });
});
observer.observe(document.body, { childList: true, subtree: true });

function insertInlineToggleButton(state) {
  const notifMenu = document.querySelector('ytd-notification-topbar-button-renderer tp-yt-paper-tooltip')?.parentElement?.parentElement;

  if (!notifMenu || document.getElementById('shortsToggleBtnNotif')) return;

  const btn = document.createElement('button');
  btn.id = 'shortsToggleBtnNotif';
  btn.textContent = state === 'on' ? 'No Shorts : On' : 'No Shorts : Off';
  btn.style.marginRight = '10px';
  btn.style.padding = '6px 10px';
  btn.style.fontSize = '12px';
  btn.style.borderRadius = '4px';
  btn.style.cursor = 'pointer';
  btn.style.border = 'none';
  btn.style.backgroundColor = state === 'on' ? '#1db954' : '#b91c1c';
  btn.style.color = 'white';

  btn.onclick = () => {
    const newState = state === 'on' ? 'off' : 'on';
    chrome.storage.sync.set({ filterState: newState }, () => {
      location.reload(); // recharge pour appliquer
    });
  };

  notifMenu.insertBefore(btn, notifMenu.lastElementChild); // juste avant le bouton "Paramètres"
}