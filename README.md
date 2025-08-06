# Typeracer Mods Chrome Extension

A Chrome extension that enhances your Typeracer.com experience with custom modifications and features.

## Features

- **Custom Styling**: Enhanced visual appearance for the typing interface
- **Real-time WPM Tracker**: Live words-per-minute tracking during races
- **Settings Management**: Easy-to-use popup interface for configuration
- **Race Statistics**: Track your completed races and progress
- **Extension Indicator**: Visual confirmation that mods are active

## Installation

### From Source (Development)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension should now appear in your Chrome toolbar

### Adding Icons

The extension expects icon files in the `icons/` directory:
- `icon16.png` (16x16 pixels)
- `icon32.png` (32x32 pixels) 
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can create these icons or use placeholder images for development.

## Usage

1. Navigate to [play.typeracer.com](https://play.typeracer.com)
2. Click the extension icon in your Chrome toolbar
3. Toggle features on/off using the switches
4. Settings are automatically saved and applied

## File Structure

```
Typeracer-Mods/
├── manifest.json          # Extension configuration
├── popup.html             # Popup interface HTML
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
├── content.js             # Content script (runs on Typeracer pages)
├── content.css            # Content script styling
├── background.js          # Background service worker
├── icons/                 # Extension icons directory
└── README.md              # This file
```

## Development

### Prerequisites

- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript
- Chrome Extensions development familiarity

### Making Changes

1. **Popup Interface**: Edit `popup.html`, `popup.css`, and `popup.js`
2. **Page Modifications**: Edit `content.js` and `content.css`
3. **Background Tasks**: Edit `background.js`
4. **Extension Settings**: Edit `manifest.json`

### Testing

1. Make your changes
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension
4. Test on [play.typeracer.com](https://play.typeracer.com)

### Debugging

- **Popup**: Right-click the extension icon → "Inspect popup"
- **Content Script**: Open DevTools on Typeracer page, check Console
- **Background Script**: Go to `chrome://extensions/` → "Inspect views: background page"

## Features to Implement

Here are some ideas for additional features you can add:

### Beginner Features
- [ ] Dark mode toggle
- [ ] Custom text colors
- [ ] Sound effects for typing
- [ ] Keyboard shortcut hints

### Intermediate Features
- [ ] Typing accuracy tracker
- [ ] Custom themes/skins
- [ ] Auto-save race results
- [ ] Performance graphs

### Advanced Features
- [ ] AI-powered typing suggestions
- [ ] Multiplayer enhancements
- [ ] Custom practice texts
- [ ] Advanced analytics dashboard

## API Usage

### Chrome Storage

```javascript
// Save settings
chrome.storage.sync.set({key: value});

// Load settings
chrome.storage.sync.get(['key'], (result) => {
    console.log(result.key);
});
```

### Messaging Between Scripts

```javascript
// From popup to content script
chrome.tabs.sendMessage(tabId, {action: 'updateSettings'});

// From content script to background
chrome.runtime.sendMessage({action: 'getData'});
```

## Permissions

The extension requests these permissions:

- `activeTab`: Access to the current Typeracer tab
- `storage`: Save user settings and statistics
- `host_permissions`: Access to typeracer.com pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source. Feel free to modify and distribute.

## Support

If you encounter issues:

1. Check the Chrome DevTools console for errors
2. Verify you're on the correct Typeracer URL
3. Try refreshing the extension
4. Reload the Typeracer page

## Version History

- **v1.0.0**: Initial release with basic features
  - Popup interface
  - Basic content script modifications
  - Settings storage
  - Extension indicator 