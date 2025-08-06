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
	// Add extension indicator
	addExtensionIndicator();

	// Set up observers for dynamic content
	setupMutationObserver();

	// Apply features based on current settings
	applyFeatures();
}

function addExtensionIndicator() {
	// Add a small indicator that the extension is active
	const indicator = document.createElement("div");
	indicator.id = "typeracer-mods-indicator";
	indicator.innerHTML = "🏎️ Mods Active";
	indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: opacity 0.3s ease;
    `;

	document.body.appendChild(indicator);

	// Fade out after 3 seconds
	setTimeout(() => {
		indicator.style.opacity = "0.3";
	}, 3000);
}

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
	// Feature 1: Focus mode - show only roomSection, hide everything else
	

	const gameScreen = document.querySelector(".podContainer.gameView");
	const bodyChildren = document.body.children;
	console.log("gameScreen", gameScreen);

    // gameScreen.classList.add("focus-content");

    // console.log("bodyChildren", bodyChildren);
    if (gameScreen) {
        // Remove gameScreen temporarily
        const parent = gameScreen.parentElement;
        const nextSibling = gameScreen.nextSibling;
        gameScreen.remove();
        
        // Hide everything in the body
        document.body.classList.add("focus-hidden");
        
        // Put gameScreen back and make it visible
        if (nextSibling) {
            parent.insertBefore(gameScreen, nextSibling);
        } else {
            parent.appendChild(gameScreen);
        }
        gameScreen.classList.add("focus-content");
    }
    
	
	// if (gameScreen) {
	// 	console.log("Found roomSection, applying focus-content first");
	// 	// First, apply focus-content to roomSection and all its children recursively
	// 	gameScreen.classList.add("focus-content");
	// 	const allChildren = gameScreen.querySelectorAll("*");
	// 	console.log("Applying focus-content to", allChildren.length, "children");
	// 	allChildren.forEach((child) => {
	// 		child.classList.add("focus-content");
	// 	});
		
	// 	// Also mark the parent chain to keep it visible
	// 	let parent = gameScreen.parentElement;
	// 	while (parent && parent !== document.body) {
	// 		parent.classList.add("focus-content");
	// 		parent = parent.parentElement;
	// 	}
	// } else {
	// 	console.log("roomSection not found!");
	// }

	// // // Now hide all other elements by applying focus-hidden to body children
	
	// console.log("Processing", bodyChildren.length, "body children for hiding");
	
	// for (let i = 0; i < bodyChildren.length; i++) {
	// 	const child = bodyChildren[i];
	// 	// Skip our extension indicator and any element that already has focus-content
	// 	if (child.id !== "typeracer-mods-indicator" && !child.classList.contains("focus-content")) {
	// 		console.log("Hiding element:", child.tagName, child.className, child.id);
	// 		child.classList.add("focus-hidden");
	// 		// Also apply to children that don't have focus-content
	// 		const allDescendants = child.querySelectorAll("*");
	// 		console.log("Hiding", allDescendants.length, "descendants");
	// 		allDescendants.forEach((descendant) => {
	// 			if (!descendant.classList.contains("focus-content")) {
	// 				descendant.classList.add("focus-hidden");
	// 			}
	// 		});
	// 	} else {
	// 		console.log("Skipping element (keeping visible):", child.tagName, child.className, child.id);
	// 	}
	// }
	
	console.log("Focus mode setup complete");
}

function disableFeature1() {
	// Remove focus-content class from all elements that have it
	const focusContentElements = document.querySelectorAll(".focus-content");
	focusContentElements.forEach((element) => {
		element.classList.remove("focus-content");
	});

	// Remove focus-hidden class from all elements that have it
	const focusHiddenElements = document.querySelectorAll(".focus-hidden");
	focusHiddenElements.forEach((element) => {
		element.classList.remove("focus-hidden");
	});

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
