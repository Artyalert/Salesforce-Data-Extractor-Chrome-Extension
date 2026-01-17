chrome.runtime.onInstalled.addListener(() => {
  console.log('Salesforce CRM Data Extractor installed');
  // Initialize storage
  chrome.storage.local.set({
    salesforce_data: {
      leads: [],
      contacts: [],
      accounts: [],
      opportunities: [],
      tasks: [],
      lastSync: {}
    }
  });
});

// Handle messages if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  return true;
});
