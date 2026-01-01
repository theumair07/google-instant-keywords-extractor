// Store selected suggestions globally to persist across DOM updates
const selectedSuggestions = new Set();

// Track if the extension is enabled
let extensionEnabled = true;

// Load the saved state on initialization
chrome.storage.sync.get(['extensionEnabled'], function (result) {
    extensionEnabled = result.extensionEnabled !== false; // Default to true
    if (extensionEnabled) {
        initialize();
    }
});

// Listen for toggle messages from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'toggleExtension') {
        extensionEnabled = request.enabled;
        if (extensionEnabled) {
            // Re-enable: add buttons
            initialize();
        } else {
            // Disable: remove all added elements
            removeAllExtensionElements();
        }
        sendResponse({ success: true });
    }
    return true;
});

// Remove all extension-added elements from the page
function removeAllExtensionElements() {
    // Remove copy buttons
    document.querySelectorAll('.suggestion-copy-btn').forEach(el => el.remove());
    // Remove checkbox containers
    document.querySelectorAll('.suggestion-checkbox-container').forEach(el => el.remove());
    // Remove the buttons container
    document.querySelectorAll('.copy-buttons-container').forEach(el => el.remove());
    // Remove copy notification if present
    document.querySelectorAll('.copy-success-notification').forEach(el => el.remove());
    // Clear selections
    selectedSuggestions.clear();
}

// Extract visible Google auto-suggestions
function extractGoogleSearchSuggestions() {
    const suggestions = [];
    const suggestionElements = document.querySelectorAll('li.sbct');
    suggestionElements.forEach((element) => {
        const textElement = element.querySelector('.wM6W7d span');
        if (textElement) {
            suggestions.push(textElement.innerText);
        }
    });
    return suggestions;
}

// Load Material Symbols Outlined (single family for all icons)
function loadMaterialIcons() {
    // Load Material Symbols Outlined (single family for all icons)
    if (!document.querySelector('#material-symbols-outlined-link')) {
        const link = document.createElement('link');
        link.id = 'material-symbols-outlined-link';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
        document.head.appendChild(link);
    }
}

// Copy text to clipboard, preserving focus and falling back to navigator.clipboard if needed
function copyToClipboard(text) {
    let success = false;
    try {
        const activeElement = document.activeElement;
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '-1000px';
        textarea.style.left = '-1000px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (activeElement && typeof activeElement.focus === 'function') {
            activeElement.focus();
        }
    } catch {
        success = false;
    }
    if (success) {
        showCopyNotification();
        return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showCopyNotification())
            .catch(() => showCopyNotification());
    } else {
        showCopyNotification();
    }
}

// Display a brief "Copied!" toast
function showCopyNotification() {
    const existing = document.querySelector('.copy-success-notification');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.className = 'copy-success-notification';
    container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgb(16, 185, 129);
    color: #FFFFFF;
    padding: 10px 16px;
    border-radius: 8px;
    z-index: 2147483647;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 8px;
`;


    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.textContent = 'check_circle';
    icon.style.cssText = `
        font-size: 18px;
        vertical-align: middle;
    `;

    const text = document.createElement('span');
    text.textContent = 'Keyword(s) Copied to Clipboard!';
    text.style.cssText = `
        font-weight: 600;
        letter-spacing: 0.2px;
    `;

    container.appendChild(icon);
    container.appendChild(text);

    const progressWrapper = document.createElement('div');
    progressWrapper.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: transparent;
    `;

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: 100%;
        height: 100%;
        background: #FFFFFF;
        animation: progressCountdown 2s linear forwards;
    `;
    progressWrapper.appendChild(progressBar)

    const style = document.createElement('style');
    style.textContent = `
        @keyframes progressCountdown {
            from { width: 100%; }
            to { width: 0%; }
        }
    `;
    document.head.appendChild(style);

    container.appendChild(progressWrapper);

    document.body.appendChild(container);

    setTimeout(() => {
        container.remove();
        if (style && style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 2000);
}

// Update the "Copy Selected" and "Deselect All" buttons based on selectedSuggestions size
function updateButtonStates() {
    const copySelectedBtn = document.querySelector('.copy-selected-suggestions-btn');
    const deselectBtn = document.querySelector('.deselect-all-btn');

    const selectedCount = selectedSuggestions.size;

    // Update Copy Selected button
    if (copySelectedBtn) {
        if (selectedCount > 0) {
            copySelectedBtn.style.opacity = '1';
            copySelectedBtn.style.pointerEvents = 'auto';
            copySelectedBtn.innerHTML = '<span class="material-symbols-outlined">playlist_add_check</span> Copy Selected (' + selectedCount + ')';
        } else {
            copySelectedBtn.style.opacity = '0.5';
            copySelectedBtn.style.pointerEvents = 'none';
            copySelectedBtn.innerHTML = '<span class="material-symbols-outlined">playlist_add_check</span> Copy Selected';
        }
    }

    // Update Deselect button visibility
    if (deselectBtn) {
        deselectBtn.style.display = selectedCount > 0 ? 'inline-flex' : 'none';
    }
}

// Add copy buttons next to each suggestion and a checkbox to select multiple
function addCopyButtonsToSuggestions() {
    if (!extensionEnabled) return; // Don't add if disabled

    const suggestionElements = document.querySelectorAll('li.sbct');
    suggestionElements.forEach((element) => {
        if (element.querySelector('.suggestion-copy-btn')) return;
        const textElement = element.querySelector('.wM6W7d span');
        if (!textElement) return;

        const suggestionText = textElement.innerText;

        // Create checkbox container to prevent event bubbling
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'suggestion-checkbox-container';
        checkboxContainer.style.cssText = `
            display: inline-flex;
            align-items: center;
            margin-right: 8px;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
        `;

        // Add hover effect for better UX
        checkboxContainer.addEventListener('mouseenter', () => {
            checkboxContainer.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
        });
        checkboxContainer.addEventListener('mouseleave', () => {
            checkboxContainer.style.backgroundColor = 'transparent';
        });

        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'suggestion-checkbox';
        checkbox.setAttribute('data-suggestion', suggestionText);
        checkbox.setAttribute('aria-label', `Select suggestion: ${suggestionText}`);
        // Check if this suggestion was previously selected
        checkbox.checked = selectedSuggestions.has(suggestionText);
        checkbox.style.cssText = `
            width: 16px;
            height: 16px;
            cursor: pointer;
            accent-color: #6366F1;
            margin: 0;
        `;

        // Prevent event bubbling on checkbox container
        checkboxContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
        });

        // Handle checkbox clicks
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
        });

        // Handle change event - update global Set
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            if (checkbox.checked) {
                selectedSuggestions.add(suggestionText);
            } else {
                selectedSuggestions.delete(suggestionText);
            }
            updateButtonStates();
        });

        // Handle keyboard accessibility
        checkbox.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        });

        // Append checkbox to container
        checkboxContainer.appendChild(checkbox);

        // Create copy button with Material Symbols icon
        const copyButton = document.createElement('span');
        copyButton.className = 'suggestion-copy-btn';
        copyButton.innerHTML = '<span class="material-symbols-outlined">content_copy</span>';
        copyButton.title = 'Copy';
        copyButton.style.cssText = `
            background: #6366F1;
            color: #FFFFFF;
            padding: 6px;
            border-radius: 6px;
            cursor: pointer;
            margin-left: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            backdrop-filter: blur(4px);
            border: 1px solid #E5E7EB;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
            transition: all 0.2s ease;
            font-size: 16px;
        `;
        copyButton.addEventListener('mouseenter', () => {
            copyButton.style.background = '#4F46E5';
            copyButton.style.transform = 'translateY(-1px)';
            copyButton.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.25)';
        });
        copyButton.addEventListener('mouseleave', () => {
            copyButton.style.background = '#6366F1';
            copyButton.style.transform = 'translateY(0)';
            copyButton.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.15)';
        });
        copyButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            copyToClipboard(suggestionText);
        });

        const container = element.querySelector('.wM6W7d');
        if (container) {
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.appendChild(checkboxContainer);
            container.appendChild(copyButton);
        }
    });
}

// Create and attach a "Copy All", "Copy Selected", and "Deselect All" control row
function addCopyAllButton() {
    if (!extensionEnabled) return; // Don't add if disabled

    // Skip if buttons already exist and are stable
    const existingContainer = document.querySelector('.copy-buttons-container');
    if (existingContainer && existingContainer.dataset.stable === 'true') {
        // Just update the button states
        updateButtonStates();
        return;
    }

    // Remove old container if it exists
    if (existingContainer) {
        existingContainer.remove();
    }

    // Try to find the suggestion list container
    const suggestionsContainer =
        document.querySelector('.erkvQe') ||
        document.querySelector('div[role="listbox"]');
    if (!suggestionsContainer) return;

    // Ensure the parent can properly contain the button container
    try {
        const cs = window.getComputedStyle(suggestionsContainer);
        if (cs && cs.position === 'static') {
            suggestionsContainer.style.position = 'relative';
        }
        // Ensure container has proper display for sticky positioning
        suggestionsContainer.style.display = 'flex';
        suggestionsContainer.style.flexDirection = 'column';
    } catch { }

    const current = extractGoogleSearchSuggestions();
    if (current.length === 0) return;

    // Create button container for all buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'copy-buttons-container';
    buttonContainer.style.cssText = `
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: flex-end;
        padding: 12px;
        margin-top: 8px;
        background: rgba(249, 250, 251, 0.95);
        border-top: 1px solid #E5E7EB;
        backdrop-filter: blur(8px);
        position: sticky;
        bottom: 0;
        z-index: 1000;
    `;

    // Create Deselect All button
    const deselectButton = document.createElement('button');
    deselectButton.className = 'deselect-all-btn';
    deselectButton.innerHTML = '<span class="material-symbols-outlined" style="font-size: 16px; line-height: 1; vertical-align: middle;">deselect</span> Deselect All';
    deselectButton.style.cssText = `
        background: #EF4444;
        color: #FFFFFF;
        border: 1px solid #E5E7EB;
        padding: 12px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        backdrop-filter: blur(8px);
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15);
        transition: all 0.2s ease;
        white-space: nowrap;
        display: ${selectedSuggestions.size > 0 ? 'inline-flex' : 'none'};
        align-items: center;
        justify-content: center;
        gap: 4px;
        line-height: 1;
        min-width: 120px;
    `;
    deselectButton.addEventListener('mouseenter', () => {
        deselectButton.style.background = '#DC2626';
        deselectButton.style.transform = 'translateY(-1px)';
        deselectButton.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
    });
    deselectButton.addEventListener('mouseleave', () => {
        deselectButton.style.background = '#EF4444';
        deselectButton.style.transform = 'translateY(0)';
        deselectButton.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.15)';
    });
    deselectButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectedSuggestions.clear();
        // Uncheck all checkboxes
        document.querySelectorAll('.suggestion-checkbox').forEach(cb => { cb.checked = false; });
        updateButtonStates();
    });

    // Create Copy Selected button
    const copySelectedButton = document.createElement('button');
    copySelectedButton.className = 'copy-selected-suggestions-btn';
    copySelectedButton.innerHTML = '<span class="material-symbols-outlined">playlist_add_check</span> Copy Selected' +
        (selectedSuggestions.size > 0 ? ` (${selectedSuggestions.size})` : '');
    copySelectedButton.style.cssText = `
        background: #3B82F6;
        color: #FFFFFF;
        border: 1px solid #E5E7EB;
        padding: 8px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        backdrop-filter: blur(8px);
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
        transition: all 0.2s ease;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        line-height: 1;
        min-width: 140px;
        opacity: ${selectedSuggestions.size > 0 ? '1' : '0.5'};
        pointer-events: ${selectedSuggestions.size > 0 ? 'auto' : 'none'};
    `;
    copySelectedButton.addEventListener('mouseenter', () => {
        copySelectedButton.style.background = '#2563EB';
        copySelectedButton.style.transform = 'translateY(-1px)';
        copySelectedButton.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.25)';
    });
    copySelectedButton.addEventListener('mouseleave', () => {
        copySelectedButton.style.background = '#3B82F6';
        copySelectedButton.style.transform = 'translateY(0)';
        copySelectedButton.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.15)';
    });
    copySelectedButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const selected = Array.from(selectedSuggestions);
        if (selected.length > 0) {
            copyToClipboard(selected.join('\n'));
        }
    });

    // Create Copy All button with select_all icon
    const copyAllButton = document.createElement('button');
    copyAllButton.className = 'copy-all-suggestions-btn';
    copyAllButton.innerHTML = '<span class="material-symbols-outlined">select_all</span> Copy All';
    copyAllButton.style.cssText = `
        background: #10B981;
        color: #FFFFFF;
        border: 1px solid #E5E7EB;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        backdrop-filter: blur(8px);
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
        transition: all 0.2s ease;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        line-height: 1;
        min-width: 120px;
    `;
    copyAllButton.addEventListener('mouseenter', () => {
        copyAllButton.style.background = '#059669';
        copyAllButton.style.transform = 'translateY(-1px)';
        copyAllButton.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.25)';
    });
    copyAllButton.addEventListener('mouseleave', () => {
        copyAllButton.style.background = '#10B981';
        copyAllButton.style.transform = 'translateY(0)';
        copyAllButton.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.15)';
    });
    copyAllButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const allSuggestions = extractGoogleSearchSuggestions();
        if (allSuggestions.length > 0) {
            copyToClipboard(allSuggestions.join('\n'));
        }
    });

    // Add buttons to container
    buttonContainer.appendChild(copyAllButton);
    buttonContainer.appendChild(copySelectedButton);
    buttonContainer.appendChild(deselectButton);

    // Mark container as stable to avoid re-creating it constantly
    buttonContainer.dataset.stable = 'true';

    // Insert container into suggestions area
    suggestionsContainer.appendChild(buttonContainer);

    // Make sure states are correct on initial insertion
    updateButtonStates();
}

// Observe changes in the suggestions list and re-add buttons when needed
function startObserving() {
    if (!extensionEnabled) return; // Don't observe if disabled

    const target = document.querySelector('div[role="listbox"]') || document.querySelector('.erkvQe');
    if (!target) return;

    const observer = new MutationObserver(() => {
        if (!extensionEnabled) return; // Don't act if disabled
        setTimeout(() => {
            addCopyButtonsToSuggestions();
            addCopyAllButton();
        }, 150);
    });

    observer.observe(target, {
        childList: true,
        subtree: true
    });
}

// Initialize on page load
function initialize() {
    if (!extensionEnabled) return; // Don't initialize if disabled

    loadMaterialIcons();
    setTimeout(() => {
        addCopyButtonsToSuggestions();
        addCopyAllButton();
    }, 500);
    startObserving();
}

// Re-add buttons when the search input gains focus or receives input
document.addEventListener('focusin', (e) => {
    if (!extensionEnabled) return;
    if (e.target.matches('input[name="q"]')) {
        setTimeout(() => {
            addCopyButtonsToSuggestions();
            addCopyAllButton();
            startObserving();
        }, 200);
    }
});
document.addEventListener('input', (e) => {
    if (!extensionEnabled) return;
    if (e.target.matches('input[name="q"]')) {
        setTimeout(() => {
            addCopyButtonsToSuggestions();
            addCopyAllButton();
        }, 300);
    }
});
document.addEventListener('click', (e) => {
    if (!extensionEnabled) return;
    if (e.target.matches('input[name="q"]')) {
        setTimeout(() => {
            addCopyButtonsToSuggestions();
            addCopyAllButton();
        }, 150);
    }
});
