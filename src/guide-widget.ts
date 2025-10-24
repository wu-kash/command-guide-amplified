/**
 * Guide Widget - A lightweight, reusable guide widget for creating interactive templates
 * with variable substitution and copy functionality.
 */

export interface GuideWidgetOptions {
  containerId: string;
  autoInit?: boolean;
}

export interface GuideWidgetInstance {
  getText: () => string;
  updateText: () => void;
  getTemplate: () => string;
  getVariables: () => Record<string, string>;
  setVariable: (name: string, value: string) => void;
  copy: () => Promise<void>;
  download: (filename?: string) => void;
}

/**
 * Initialize a guide widget on a container element
 * @param containerId - The ID of the container element
 * @returns GuideWidgetInstance or null if container not found
 */
export function initGuideWidget(containerId: string): GuideWidgetInstance | null {
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
  const variableInputs = container.querySelectorAll('input[id*="guideVar-"], input[id*="var-"], .guide-variable input') as NodeListOf<HTMLInputElement>;
  
  // Function to update the text with current variable values
  function updateText(): void {
    let text = originalTemplate;
    
    // Replace all variables with current input values
    variableInputs.forEach(input => {
      // Extract variable name from input ID or data attribute
      let variableName: string;
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
    
    if (textElement) {
      textElement.textContent = text;
    }
    
    // Update one-liner commands
    updateOneLiners();
  }
  
  // Function to update one-liner commands
  function updateOneLiners(): void {
    if (!container) return;
    const oneLinerCommands = container.querySelectorAll('.oneline-command');
    oneLinerCommands.forEach(command => {
      const template = command.getAttribute('data-template') || command.textContent;
      let text = template;
      
      // Replace all variables with current input values
      variableInputs.forEach(input => {
        let variableName: string;
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
  function addOneLinerClickHandlers(): void {
    if (!container) return;
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
  function fallbackCopy(text: string): void {
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
  function showCopyFeedback(element: Element): void {
    const originalText = element.textContent;
    element.textContent = '✅ Copied!';
    (element as HTMLElement).style.background = '#d4edda';
    (element as HTMLElement).style.borderColor = '#28a745';
    
    setTimeout(() => {
      element.textContent = originalText;
      (element as HTMLElement).style.background = '';
      (element as HTMLElement).style.borderColor = '';
    }, 1000);
  }
  
  // Add event listeners to all variable inputs
  variableInputs.forEach((input) => {
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
    getText: () => textElement?.textContent || '',
    updateText: updateText,
    getTemplate: () => originalTemplate,
    getVariables: () => {
      const variables: Record<string, string> = {};
      variableInputs.forEach(input => {
        let variableName: string;
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
    setVariable: (name: string, value: string) => {
      const input = Array.from(variableInputs).find(inp => 
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
      const text = textElement?.textContent || '';
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
    download: (filename: string = 'guide.txt') => {
      const text = textElement?.textContent || '';
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

/**
 * Auto-initialize function for elements with data-guide-widget attribute
 * @returns Object containing all initialized widgets
 */
export function autoInitGuideWidgets(): Record<string, GuideWidgetInstance | null> {
  const widgets = document.querySelectorAll('[data-guide-widget]');
  const initializedWidgets: Record<string, GuideWidgetInstance | null> = {};
  
  widgets.forEach(element => {
    const widgetId = element.id || `guide-widget-${Math.random().toString(36).substr(2, 9)}`;
    if (!element.id) element.id = widgetId;
    
    initializedWidgets[widgetId] = initGuideWidget(widgetId);
  });
  
  return initializedWidgets;
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', autoInitGuideWidgets);
}

// Default export
export default {
  initGuideWidget,
  autoInitGuideWidgets
};
