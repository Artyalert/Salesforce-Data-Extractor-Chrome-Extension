import { detectObjectType, extractFieldData } from './extractor.js';

// Visual Feedback UI using Shadow DOM
const createIndicator = () => {
  const container = document.createElement('div');
  container.id = 'sf-extractor-indicator-container';
  document.body.appendChild(container);

  const shadow = container.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = `
    .indicator {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 15px;
      background: #00a1e0;
      color: white;
      border-radius: 5px;
      font-family: sans-serif;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      transition: opacity 0.3s;
      display: none;
    }
    .indicator.show { display: block; }
    .indicator.success { background: #2e844a; }
    .indicator.error { background: #ea001e; }
  `;
  shadow.appendChild(style);

  const el = document.createElement('div');
  el.className = 'indicator';
  shadow.appendChild(el);

  return {
    show: (text, type = '') => {
      el.textContent = text;
      el.className = \`indicator show \${type}\`;
      setTimeout(() => { el.className = 'indicator'; }, 3000);
    }
  };
};

const indicator = createIndicator();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract') {
    const objectType = detectObjectType();
    if (objectType && !objectType.endsWith('_list')) {
      try {
        const data = extractFieldData(objectType);
        saveData(objectType, data);
        indicator.show(\`Extracted \${objectType} successfully!\`, 'success');
        sendResponse({ success: true, data });
      } catch (err) {
        indicator.show('Extraction failed', 'error');
        sendResponse({ success: false, error: err.message });
      }
    } else {
      indicator.show('No record detected on this page', 'error');
      sendResponse({ success: false, error: 'No record detected' });
    }
  }
  return true;
});

const saveData = (type, record) => {
  chrome.storage.local.get(['salesforce_data'], (result) => {
    const data = result.salesforce_data || {
      leads: [], contacts: [], accounts: [], opportunities: [], tasks: [],
      lastSync: {}
    };
    
    const list = data[type];
    const index = list.findIndex(r => r.id === record.id);
    
    if (index > -1) {
      list[index] = record;
    } else {
      list.push(record);
    }
    
    data.lastSync[type] = Date.now();
    chrome.storage.local.set({ salesforce_data: data });
  });
};

console.log('Salesforce CRM Data Extractor content script loaded');
