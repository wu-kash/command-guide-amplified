/**
 * Guide Widget Wrapper
 * A lightweight wrapper function that can be applied to any element
 * with the specific structure for template-based guides
 */

function initGuideWidget(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found`);
        return null;
    }
    
    // Find the text element containing the template
    const textElement = container.querySelector('.guide-text, #guideText, [data-template]');
    if (!textElement) {
        console.error('Template text element not found in container:', containerId);
        return null;
    }
    
    // Get the original template text
    const originalTemplate = textElement.textContent || textElement.getAttribute('data-template') || '';
    
    // Find all variable inputs
    const variableInputs = container.querySelectorAll('input[id*="guideVar-"], input[id*="var-"], .guide-variable input');
    
    // Function to update the text with current variable values
    function updateText() {
        let text = originalTemplate;
        
        // Replace all variables with current input values
        variableInputs.forEach(input => {
            // Extract variable name from input ID or data attribute
            let variableName;
            if (input.id.includes('guideVar-')) {
                variableName = input.id.replace('guideVar-', '');
            } else if (input.id.includes('var-')) {
                variableName = input.id.replace('var-', '');
            } else if (input.dataset.variable) {
                variableName = input.dataset.variable;
            } else {
                // Try to extract from name attribute
                variableName = input.name || input.placeholder || 'UNKNOWN';
            }
            
            const value = input.value || `{${variableName}}`;
            text = text.replace(new RegExp(`\\{${variableName}\\}`, 'g'), value);
        });
        
        textElement.textContent = text;
        
        // Update one-liner commands
        updateOneLiners();
    }
    
    // Function to update one-liner commands
    function updateOneLiners() {
        const oneLinerCommands = container.querySelectorAll('.oneline-command');
        oneLinerCommands.forEach(command => {
            const template = command.getAttribute('data-template') || command.textContent;
            let text = template;
            
            // Replace all variables with current input values
            variableInputs.forEach(input => {
                let variableName;
                if (input.id.includes('guideVar-')) {
                    variableName = input.id.replace('guideVar-', '');
                } else if (input.id.includes('var-')) {
                    variableName = input.id.replace('var-', '');
                } else if (input.dataset.variable) {
                    variableName = input.dataset.variable;
                } else {
                    variableName = input.name || input.placeholder || 'UNKNOWN';
                }
                
                const value = input.value || `{${variableName}}`;
                text = text.replace(new RegExp(`\\{${variableName}\\}`, 'g'), value);
            });
            
            command.textContent = text;
        });
    }
    
    // Add click-to-copy functionality for one-liner commands
    function addOneLinerClickHandlers() {
        const oneLinerCommands = container.querySelectorAll('.oneline-command');
        oneLinerCommands.forEach(command => {
            command.addEventListener('click', () => {
                const text = command.textContent;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                        showCopyFeedback(command);
                    }).catch(() => {
                        fallbackCopy(text);
                        showCopyFeedback(command);
                    });
                } else {
                    fallbackCopy(text);
                    showCopyFeedback(command);
                }
            });
        });
    }
    
    // Fallback copy function
    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
        } catch (err) {
            document.body.removeChild(textArea);
            throw err;
        }
    }
    
    // Show copy feedback
    function showCopyFeedback(element) {
        const originalText = element.textContent;
        element.textContent = '✅ Copied!';
        element.style.background = '#d4edda';
        element.style.borderColor = '#28a745';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.background = '';
            element.style.borderColor = '';
        }, 1000);
    }
    
    // Add event listeners to all variable inputs
    variableInputs.forEach((input, index) => {
        input.addEventListener('input', updateText);
        input.addEventListener('change', updateText);
        input.addEventListener('keyup', updateText);
    });
    
    // Initial update
    updateText();
    
    // Add click handlers for one-liner commands
    addOneLinerClickHandlers();
    
    // Return utility functions
    return {
        getText: () => textElement.textContent,
        updateText: updateText,
        getTemplate: () => originalTemplate,
        getVariables: () => {
            const variables = {};
            variableInputs.forEach(input => {
                let variableName;
                if (input.id.includes('guideVar-')) {
                    variableName = input.id.replace('guideVar-', '');
                } else if (input.id.includes('var-')) {
                    variableName = input.id.replace('var-', '');
                } else {
                    variableName = input.name || input.placeholder || 'UNKNOWN';
                }
                variables[variableName] = input.value;
            });
            return variables;
        },
        setVariable: (name, value) => {
            const input = variableInputs.find(inp => 
                inp.id.includes(`guideVar-${name}`) || 
                inp.id.includes(`var-${name}`) ||
                inp.name === name ||
                inp.dataset.variable === name
            );
            if (input) {
                input.value = value;
                updateText();
            }
        },
        copy: () => {
            const text = textElement.textContent;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    return Promise.resolve();
                } catch (err) {
                    document.body.removeChild(textArea);
                    return Promise.reject(err);
                }
            }
        },
        download: (filename = 'guide.txt') => {
            const text = textElement.textContent;
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }
    };
}

// Auto-initialize function for elements with data-guide-widget attribute
function autoInitGuideWidgets() {
    const widgets = document.querySelectorAll('[data-guide-widget]');
    const initializedWidgets = {};
    
    widgets.forEach(element => {
        const widgetId = element.id || `guide-widget-${Math.random().toString(36).substr(2, 9)}`;
        if (!element.id) element.id = widgetId;
        
        initializedWidgets[widgetId] = initGuideWidget(widgetId);
    });
    
    return initializedWidgets;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', autoInitGuideWidgets);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initGuideWidget, autoInitGuideWidgets };
} else if (typeof window !== 'undefined') {
    window.initGuideWidget = initGuideWidget;
    window.autoInitGuideWidgets = autoInitGuideWidgets;
}
