document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('toggleBtn');

  chrome.storage.sync.get(['filterState'], function(result) {
    let state = result.filterState || 'on';
    updateButton(state);
  });

  btn.addEventListener('click', function() {
    chrome.storage.sync.get(['filterState'], function(result) {
      let state = result.filterState === 'on' ? 'off' : 'on';
      chrome.storage.sync.set({ filterState: state }, function() {
        updateButton(state);
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.reload(tabs[0].id);
        });
      });
    });
  });

  function updateButton(state) {
    btn.textContent = state === 'on' ? 'No Shorts : On' : 'No Shorts : Off';
    btn.className = state === 'on' ? 'on' : 'off';
  }
});