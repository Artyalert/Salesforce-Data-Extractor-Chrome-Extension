# Salesforce CRM Data Extractor

A Chrome Extension designed to extract data from Salesforce CRM objects (Leads, Contacts, Accounts, Opportunities, Tasks) directly from the browser UI and display them in a centralized dashboard.

## Features
- **One-Click Extraction**: Extract the current record data with a single button click.
- **Multi-Object Support**: Specialized extraction logic for Leads, Contacts, Accounts, Opportunities, and Tasks.
- **Dashboard**: View, search, and manage all extracted records in a clean React-based UI.
- **Visual Feedback**: Real-time status indicators injected into the Salesforce page using Shadow DOM.
- **Persistence**: Data is stored locally and persists across page refreshes.

## Installation Steps
1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top right corner).
4. Click **Load unpacked**.
5. Select the `public` folder (or the root folder if you have built the project) of this extension.
6. The extension icon should now appear in your browser toolbar.

## DOM Selection Strategy
Salesforce Lightning Experience uses a dynamic, component-based DOM. Our extraction strategy focuses on:
- **Context Awareness**: Identifying the object type by parsing the URL structure (e.g., `/lightning/r/Account/`).
- **Label-Value Mapping**: Instead of relying on brittle CSS classes that change frequently, we locate field labels (e.g., "Account Name") and traverse the DOM to find their corresponding value containers.
- **Shadow DOM Isolation**: Injected UI elements are wrapped in a Shadow Root to prevent Salesforce's global styles from interfering with the extension's UI and vice versa.

## Storage Schema
Data is stored in `chrome.storage.local` under the key `salesforce_data`.

```json
{
  "salesforce_data": {
    "leads": [
      { "id": "...", "name": "...", "company": "...", "email": "...", "status": "...", "owner": "..." }
    ],
    "contacts": [],
    "accounts": [],
    "opportunities": [
      { "id": "...", "name": "...", "amount": "...", "stage": "...", "probability": "...", "account": "..." }
    ],
    "tasks": [],
    "lastSync": {
      "leads": 1737096000000,
      "opportunities": 1737096500000
    }
  }
}
```

## Folder Structure
- `/public`: Contains the `manifest.json`, HTML files, and static assets.
- `/src`:
  - `/background`: Service worker for background tasks.
  - `/content`: Content scripts for DOM scraping and page interaction.
  - `/popup`: React source code for the dashboard UI.
  - `/styles`: Tailwind CSS configurations.
- `/icons`: Extension icons.

## Demo Video
[Link to Demo Video] (3-5 minutes)
- Shows extraction from multiple Opportunity stages.
- Demonstrates Leads, Contacts, and Accounts extraction.
- Shows page refresh persistence and the popup dashboard.
- Demonstrates the delete functionality.
