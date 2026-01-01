document.addEventListener('DOMContentLoaded', function() {
    console.log('Google Keywords Extractor popup loaded');
    
    const extensionToggle = document.getElementById('extension-toggle');
    
    // Load saved toggle state
    chrome.storage.sync.get(['extensionEnabled'], function(result) {
        // Default to enabled if not set
        const isEnabled = result.extensionEnabled !== false;
        extensionToggle.checked = isEnabled;
    });
    
    // Handle toggle changes
    extensionToggle.addEventListener('change', function() {
        const isEnabled = extensionToggle.checked;
        
        // Save the state
        chrome.storage.sync.set({ extensionEnabled: isEnabled }, function() {
            console.log('Extension enabled:', isEnabled);
        });
        
        // Notify the content script about the change
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url && tabs[0].url.includes('google.com')) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'toggleExtension',
                    enabled: isEnabled
                }).catch(() => {
                    // Content script might not be ready, that's okay
                });
            }
        });
    });
    
    // Check if user is on Google.com
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        const statusMessage = document.getElementById('status-message');
        const statusText = document.querySelector('.status-text');
        
        if (currentTab && currentTab.url && currentTab.url.includes('google.com')) {
            // User is on Google.com - show ready message
            statusMessage.classList.add('ready');
            statusText.textContent = 'Ready! Start typing in Google Search to see suggestions.';
        } else {
            // User is not on Google.com - show warning message
            statusMessage.classList.remove('ready');
            statusText.innerHTML = 'Please visit <a href="https://www.google.com" target="_blank">Google.com</a> to use this extension.';
        }
    });
});
