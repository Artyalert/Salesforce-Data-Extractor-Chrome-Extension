import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const [data, setData] = useState({
    leads: [], contacts: [], accounts: [], opportunities: [], tasks: [],
    lastSync: {}
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
    chrome.storage.onChanged.addListener(loadData);
    return () => chrome.storage.onChanged.removeListener(loadData);
  }, []);

  const loadData = () => {
    chrome.storage.local.get(['salesforce_data'], (result) => {
      if (result.salesforce_data) {
        setData(result.salesforce_data);
      }
    });
  };

  const handleExtract = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'extract' }, (response) => {
        if (response && response.success) {
          loadData();
        }
      });
    });
  };

  const handleDelete = (type, id) => {
    const newData = { ...data };
    newData[type] = newData[type].filter(item => item.id !== id);
    chrome.storage.local.set({ salesforce_data: newData }, loadData);
  };

  const filteredData = (data[activeTab] || []).filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const tabs = ['leads', 'contacts', 'accounts', 'opportunities', 'tasks'];

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">SF Extractor</h1>
        <button 
          onClick={handleExtract}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition"
        >
          Extract Current Object
        </button>
      </header>

      <nav className="bg-white border-b flex px-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium capitalize ${activeTab === tab ? 'tab-active' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="p-4 bg-white border-b">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="text-xs text-gray-400 mt-2">
          Last Sync: {data.lastSync[activeTab] ? new Date(data.lastSync[activeTab]).toLocaleString() : 'Never'}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4">
        {filteredData.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No records found.</div>
        ) : (
          <div className="space-y-3">
            {filteredData.map(item => (
              <div key={item.id} className="border rounded p-3 bg-white shadow-sm relative group">
                <button 
                  onClick={() => handleDelete(activeTab, item.id)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
                {activeTab === 'opportunities' && (
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-blue-500 uppercase">{item.stage}</span>
                    <span className="text-xs text-gray-400">{item.probability}</span>
                  </div>
                )}
                <div className="font-bold text-gray-800">{item.name || item.accountName || item.subject}</div>
                <div className="text-sm text-gray-600">
                  {Object.entries(item).map(([key, val]) => {
                    if (['id', 'timestamp', 'name', 'accountName', 'subject', 'stage', 'probability'].includes(key)) return null;
                    return val ? <div key={key}><span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {val}</div> : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
