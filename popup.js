// Popup JavaScript for Typeracer Mods Extension

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const feature1Checkbox = document.getElementById('feature1');
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Load saved settings
    loadSettings();

    // Event listeners
    saveBtn.addEventListener('click', saveSettings);
    resetBtn.addEventListener('click', resetSettings);
    
    // Auto-save when toggles change
    feature1Checkbox.addEventListener('change', saveSettings);
    

    function loadSettings() {
        chrome.storage.sync.get(['feature1'], function(result) {
            feature1Checkbox.checked = result.feature1 || false;
        
        });
    }

    function saveSettings() {
        const settings = {
            feature1: feature1Checkbox.checked,
            
        };

        chrome.storage.sync.set(settings, function() {
            // Show save confirmation
            showNotification('Settings saved!');
            
            // Send message to content script to update
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0] && tabs[0].url && tabs[0].url.includes('typeracer.com')) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updateSettings',
                        settings: settings
                    });
                }
            });
        });
    }

    function resetSettings() {
        feature1Checkbox.checked = false;
        
        chrome.storage.sync.clear(function() {
            showNotification('Settings reset!');
        });
    }


    function showNotification(message) {
        // Create a temporary notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style); 