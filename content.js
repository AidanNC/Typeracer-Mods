// Content Script for Typeracer Mods Extension
// This script runs on typeracer.com pages

console.log("Typeracer Mods extension loaded!");

// Extension state
let extensionSettings = {
    feature1: false,
	feature2: false,
};

// Global mutation observer
let mutationObserver = null;
let isApplyingFeatures = false;

// Initialize the extension
init();

function init() {
	// Load settings from storage
	chrome.storage.sync.get(["feature1"], function (result) {
		console.log("Loaded from storage:", result);
		extensionSettings = {
			feature1: result.feature1 || false,
		};
		console.log("Initial extension settings:", extensionSettings);

		applyFeatures();
	});

	// Wait for page to be fully loaded
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", setupExtension);
	} else {
		setupExtension();
	}
}

function setupExtension() {
    // Set up observers for dynamic content
    setupMutationObserver();
    
    // Apply features based on current settings
    applyFeatures();
}

// Extension indicator removed - no longer needed

function setupMutationObserver() {
	// Watch for changes in the DOM to handle dynamic content
	mutationObserver = new MutationObserver(function (mutations) {
		// Skip if we're currently applying features
		if (isApplyingFeatures) {
			return;
		}
		
		let shouldReapply = false;
		
		mutations.forEach(function (mutation) {
			if (mutation.type === "childList") {
				// Check if this looks like a significant page change (not our modifications)
				const hasSignificantChanges = Array.from(mutation.addedNodes).some(node => 
					node.nodeType === Node.ELEMENT_NODE && 
					!node.classList.contains("focus-content") && 
					!node.classList.contains("focus-hidden") &&
					(node.tagName === "DIV" || node.tagName === "SECTION" || node.classList.length > 0)
				);
				
				if (hasSignificantChanges) {
					shouldReapply = true;
				}
			}
		});
		
		if (shouldReapply) {
			console.log("Significant DOM change detected, re-applying features");
			applyFeatures();
		}
	});

	mutationObserver.observe(document.body, {
		childList: true,
		subtree: true,
	});
}

function applyFeatures() {
	// Prevent recursive calls
	if (isApplyingFeatures) {
		console.log("Already applying features, skipping...");
		return;
	}
	
	isApplyingFeatures = true;
	console.log("Starting to apply features...");
	
	// Temporarily disconnect observer to prevent infinite loop
	if (mutationObserver) {
		mutationObserver.disconnect();
	}
	
	if (extensionSettings.feature1) {
		enableFeature1();
	} else {
		disableFeature1();
	}
	
	// Wait a bit before reconnecting to let DOM settle
	setTimeout(() => {
		if (mutationObserver) {
			mutationObserver.observe(document.body, {
				childList: true,
				subtree: true,
			});
		}
		isApplyingFeatures = false;
		console.log("Features applied, observer reconnected");
	}, 100);
}

function enableFeature1() {
	// Feature 1: Focus mode - Pure CSS approach
	console.log("Enabling focus mode");
	document.body.classList.add("focus-mode");
}

function disableFeature1() {
	// Feature 1: Disable focus mode - Pure CSS approach
	console.log("Disabling focus mode");
	document.body.classList.remove("focus-mode");
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("Received message:", request);
	if (request.action === "updateSettings") {
		console.log("Old settings:", extensionSettings);
		extensionSettings = request.settings;
		console.log("New settings:", extensionSettings);
		applyFeatures();
	}
});
