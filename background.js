// Function to update the blocking rules based on the stored blocked sites
function updateBlocking(blockedSites) {
    // Remove any existing listeners to avoid duplicates
    chrome.webRequest.onBeforeRequest.removeListener(blockingListener);
  
    if (blockedSites.length > 0) {
      const urls = blockedSites.map(site => `*://*.${site}/*`);
      chrome.webRequest.onBeforeRequest.addListener(
        blockingListener,
        { urls: urls },
        ["blocking"]
      );
  
      // Inject content script to display the blocking message
      chrome.scripting.unregisterContentScripts(null, () => {
        chrome.scripting.registerContentScripts([{
          id: 'blocker',
          matches: urls,
          js: ['content.js'],
          run_at: 'document_start'
        }]);
      });
    }
  }
  
  // Listener function that cancels the request
  function blockingListener(details) {
    return { cancel: true };
  }
  
  // Load the initial list of blocked sites and set up the listener
  chrome.storage.local.get({ blockedSites: [] }, function(result) {
    updateBlocking(result.blockedSites);
  });
  
  // Update the blocking rules whenever the blocked sites list changes
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.blockedSites) {
      updateBlocking(changes.blockedSites.newValue);
    }
  });
  