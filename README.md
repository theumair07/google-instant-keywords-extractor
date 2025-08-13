# Google Instant Keywords Extractor

A powerful Chrome extension that enhances Google Search by allowing you to easily extract and copy search suggestions with a single click.

[![Extension Demo](https://img.shields.io/badge/Chrome-Extension-brightgreen)](https://chromewebstore.google.com/detail/jbkoeplmipccpeogfcadaoahefknignh?hl=en)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Available-196fe2?logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/jbkoeplmipccpeogfcadaoahefknignh?hl=en)
![Version](https://img.shields.io/badge/version-2.2-673AB7)
![License](https://img.shields.io/badge/license-GPL%20v3-2196F3)
![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/rating/jbkoeplmipccpeogfcadaoahefknignh?style=flat&color=ffc107)
![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/jbkoeplmipccpeogfcadaoahefknignh?style=flat&color=00bcd4)
[![License: MIT](https://img.shields.io/badge/License-MIT-FF9800.svg)](https://opensource.org/licenses/MIT)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-E91E63.svg)](https://github.com/theumair07/google-instant-keywords-extractor)


## ✨ Features

- **🖱️ One-Click Copy**: Copy individual search suggestions instantly
- **📋 Bulk Copy Options**: Copy all suggestions or only selected ones
- **☑️ Smart Selection**: Use checkboxes to select multiple suggestions
- **🔒 Persistent Selection**: Maintains selections across DOM updates
- **🔄 Real-time Updates**: Works seamlessly with Google's dynamic suggestions
- **💎 Beautiful UI**: Clean, modern interface with smooth animations
- **🖥️ Responsive Design**: Works perfectly on all screen sizes
- **♿ Accessible**: Full keyboard navigation and screen reader support


## 📸 Screenshots

<table>
  <tr>
    <td>
      <img alt="Google Instant Keywords Extractor - Error Message"
           src="https://github.com/user-attachments/assets/92d4d931-936c-4fd8-a193-a3a7c63162ae"
           width="420">
    </td>
    <td>
      <img alt="Google Instant Keywords Extractor - Active Status Message"
           src="https://github.com/user-attachments/assets/74af3d15-03f9-434b-b9af-4f3cae622898"
           width="420">
    </td>
  </tr>
  <tr>
    <td>
      <img alt="Google Instant Keywords Extractor - Demo Image"
           src="https://github.com/user-attachments/assets/34e74a0e-79f1-403a-a5f9-313dc7800d88"
           width="420">
    </td>
    <td>
      <img alt="Google Instant Keywords Extractor - Demo screenshot"
           src="https://github.com/user-attachments/assets/ddac29fe-58fb-4a61-969a-fd2fcf712a36"
           width="420">
    </td>
  </tr>
</table>




## 🛠️ Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store page](https://chromewebstore.google.com/detail/google-instant-keywords-e/jbkoeplmipccpeogfcadaoahefknignh?hl=en)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will be installed and ready to use

## 📖 How to Use

1. **Visit Google.com** and start typing in the search bar
2. **See the magic happen** - copy buttons and checkboxes appear next to suggestions
3. **Copy individual suggestions** by clicking the copy button next to any suggestion
4. **Select multiple suggestions** using the checkboxes
5. **Use bulk actions**:
   - **Copy All**: Copies all visible suggestions
   - **Copy Selected**: Copies only checked suggestions  
   - **Deselect All**: Clears all selections


##  🔐 Privacy & safety
- **No data collection.**
- Runs only on Google search pages.
- No background processes or external scripts—just safe, local page enhancements.


## 🏗️ Technical Details

### Files Structure
```
├── manifest.json          # Extension configuration
├── content.js            # Main functionality script
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── header-img.png        # Popup header image
```

### 💻 Key Technologies
- **Manifest V3**: Latest Chrome extension format
- **Content Scripts**: Inject functionality into Google pages
- **Material Symbols**: Modern icon system
- **CSS3**: Advanced styling with animations and transitions
- **Vanilla JavaScript**: No external dependencies

### 🔒 Permissions
- `activeTab`: Access to the current active tab (Google.com only)

## 🔧 Development

### ⚙️ Prerequisites
- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### 🧑‍💻 Development Guidelines
1. Follow the existing code style
2. Test your changes thoroughly on Google.com
3. Update documentation as needed
4. Ensure compatibility with Manifest V3

## 📝 Changelog

### ⚡Version 2.2
- Moved functionality from popup to direct search suggestions  
- Enhanced UI with Material Symbols icons  
- Improved selection persistence across DOM updates  
- Better error handling and clipboard operations  
- Optimized performance  
- Added copy buttons directly in front of suggested keywords instead of in the popup  
- Added checkboxes and a copy button for selected keywords  

### ⚡Version 2.1
- Added single copy & copy all functionality in popup  
- Improved visual feedback with toast notifications  
- Enhanced accessibility features  

### ⚡Version 2.0
- Complete rewrite for Manifest V3  
- Modern UI design  
- Improved reliability and performance  

## 🐛 Known Issues

Extension only works on google.com domains


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/theumair07/google-instant-keywords-extractor?tab=MIT-1-ov-file) file for details.

## 👨‍💻 Author

**Umair Khan**
- 🌐 Website: [umairyousafzai.com](https://umairyousafzai.com/)
- ☕ Buy me a coffee: [buymeacoffee.com/theumair07](https://www.buymeacoffee.com/theumair07)
- 📧 Email [work@umairyousafzai.com](mailto:work@umairyousafzai.com)

## 📬 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/theumair07/google-instant-keywords-extractor/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your browser version and the issue

---
⭐ **If you find this extension helpful, please consider giving it a star on GitHub!**
---

<div align="center">

**Made with ❤️ for the SEOs & Content Researchers 🌟**

⭐ **Star this repo if you find it useful!** ⭐  
🍴 **Fork it and make it your own!** 🍴  
🐛 **Report bugs to help improve it!** 🐛

[![GitHub stars](https://img.shields.io/github/stars/theumair07/google-instant-keywords-extractor.svg?style=social&label=Star)](https://github.com/yourusername/google-instant-keywords-extractor)
[![GitHub forks](https://img.shields.io/github/forks/theumair07/google-instant-keywords-extractor.svg?style=social&label=Fork)](https://github.com/yourusername/google-instant-keywords-extractor/fork)

</div>
