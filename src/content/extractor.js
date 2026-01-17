/**
 * Salesforce Data Extraction Logic
 */

export const detectObjectType = () => {
  const url = window.location.href;
  if (url.includes('/lightning/r/Lead/')) return 'leads';
  if (url.includes('/lightning/r/Contact/')) return 'contacts';
  if (url.includes('/lightning/r/Account/')) return 'accounts';
  if (url.includes('/lightning/r/Opportunity/')) return 'opportunities';
  if (url.includes('/lightning/r/Task/')) return 'tasks';
  
  // Check for list views
  if (url.includes('/lightning/o/Lead/list')) return 'leads_list';
  if (url.includes('/lightning/o/Contact/list')) return 'contacts_list';
  if (url.includes('/lightning/o/Account/list')) return 'accounts_list';
  if (url.includes('/lightning/o/Opportunity/list')) return 'opportunities_list';
  
  return null;
};

export const extractRecordId = () => {
  const url = window.location.href;
  const match = url.match(/\/lightning\/r\/\w+\/([a-zA-Z0-9]{15,18})\/view/);
  return match ? match[1] : null;
};

export const extractFieldData = (objectType) => {
  const data = {
    id: extractRecordId(),
    timestamp: Date.now()
  };

  // Helper to find value by label
  const getValueByLabel = (label) => {
    const labelElements = Array.from(document.querySelectorAll('.slds-form-element__label, .test-id__field-label'));
    const labelEl = labelElements.find(el => el.textContent.trim() === label);
    if (labelEl) {
      const container = labelEl.closest('.slds-form-element') || labelEl.parentElement.parentElement;
      const valueEl = container.querySelector('.slds-form-element__control, .test-id__field-value');
      return valueEl ? valueEl.textContent.trim() : '';
    }
    return '';
  };

  switch (objectType) {
    case 'leads':
      data.name = getValueByLabel('Name');
      data.company = getValueByLabel('Company');
      data.email = getValueByLabel('Email');
      data.phone = getValueByLabel('Phone');
      data.leadSource = getValueByLabel('Lead Source');
      data.status = getValueByLabel('Status');
      data.owner = getValueByLabel('Lead Owner');
      break;
    case 'contacts':
      data.name = getValueByLabel('Name');
      data.email = getValueByLabel('Email');
      data.phone = getValueByLabel('Phone');
      data.accountName = getValueByLabel('Account Name');
      data.title = getValueByLabel('Title');
      data.owner = getValueByLabel('Contact Owner');
      data.mailingAddress = getValueByLabel('Mailing Address');
      break;
    case 'accounts':
      data.accountName = getValueByLabel('Account Name');
      data.website = getValueByLabel('Website');
      data.phone = getValueByLabel('Phone');
      data.industry = getValueByLabel('Industry');
      data.type = getValueByLabel('Type');
      data.owner = getValueByLabel('Account Owner');
      data.annualRevenue = getValueByLabel('Annual Revenue');
      break;
    case 'opportunities':
      data.name = getValueByLabel('Opportunity Name');
      data.amount = getValueByLabel('Amount');
      data.stage = getValueByLabel('Stage');
      data.probability = getValueByLabel('Probability (%)');
      data.closeDate = getValueByLabel('Close Date');
      data.forecastCategory = getValueByLabel('Forecast Category');
      data.owner = getValueByLabel('Opportunity Owner');
      data.account = getValueByLabel('Account Name');
      break;
    case 'tasks':
      data.subject = getValueByLabel('Subject');
      data.dueDate = getValueByLabel('Due Date');
      data.status = getValueByLabel('Status');
      data.priority = getValueByLabel('Priority');
      data.relatedTo = getValueByLabel('Related To');
      data.assignedTo = getValueByLabel('Assigned To');
      break;
  }

  return data;
};
