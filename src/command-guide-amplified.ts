/**
 * Guide Widget - A lightweight, reusable guide widget for creating interactive templates
 * with variable substitution and copy functionality.
 */

export interface CommandGuideAmplifiedWidgetOptions {
  containerId: string;
  autoInit?: boolean;
}

export interface CommandGuideAmplifiedWidgetInstance {
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
 * @returns CommandGuideAmplifiedWidgetInstance or null if container not found
 */
export function init(containerId: string): CommandGuideAmplifiedWidgetInstance | null {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID '${containerId}' not found`);
    return null;
  }
  
  // Find the text element containing the template
  // Find the main .cga-text element
  let textElement;
  
  // Get all .cga-text elements
  const allGuideTexts = container.querySelectorAll('.cga-text');
  
  // Find the one that's a direct child of the container (not nested)
  for (let i = 0; i < allGuideTexts.length; i++) {
    const element = allGuideTexts[i];
    const isDirectChild = element.parentElement === container;
    const isInsideOneliners = element.closest('.cga-commands');
    
    // Prefer direct children that are not inside oneliners
    if (isDirectChild && !isInsideOneliners) {
      textElement = element;
      break;
    }
  }
  
  // If no direct child found, use the first one that's not inside oneliners
  if (!textElement) {
    for (let i = 0; i < allGuideTexts.length; i++) {
      const element = allGuideTexts[i];
      const isInsideOneliners = element.closest('.cga-commands');
      if (!isInsideOneliners) {
        textElement = element;
        break;
      }
    }
  }
  
  // Final fallback - if no cga-text found, look for cga-command elements
  if (!textElement && allGuideTexts.length > 0) {
    textElement = allGuideTexts[0];
  }
  
  // If still no text element, we can still work with just cga-command elements
  if (!textElement) {
    const allCommandElements = container.querySelectorAll('.cga-command');
    if (allCommandElements.length > 0) {
      // We can still initialize the widget even without cga-text elements
      textElement = allCommandElements[0]; // Use first command as fallback for compatibility
    }
  }

  if (!textElement) {
    console.error('Template text element not found in container:', containerId);
    return null;
  }
  
  // Get all cga-text elements for updating
  const allTemplateElements = container.querySelectorAll('.cga-text:not(.cga-commands .cga-text)');
  const originalTemplates: string[] = [];
  
  allTemplateElements.forEach(element => {
    originalTemplates.push(element.textContent || '');
  });

  // Get all command elements and store their original templates
  const allCommandElements = container.querySelectorAll('.cga-command');
  const originalCommands: string[] = [];
  
  allCommandElements.forEach(element => {
    originalCommands.push(element.textContent || '');
  });
  
  // Keep the first one for backward compatibility
  const originalTemplate = originalTemplates[0] || '';
  
  // Find all variable inputs
  const variableInputs = container.querySelectorAll('input[class*="cga-var-"]') as NodeListOf<HTMLInputElement>;
  
  // Function to update the text with current variable values
  function updateText(): void {
    // Update all template elements
    allTemplateElements.forEach((element, index) => {
      let text = originalTemplates[index] || '';
      
      // Replace all variables with current input values
      variableInputs.forEach(input => {
        // Extract variable name from class name
        let variableName: string;
        const classList = input.className.split(' ');
        const varClass = classList.find(cls => cls.startsWith('cga-var-'));
        if (varClass) {
          variableName = varClass.replace('cga-var-', '');
        } else {
          variableName = input.name || input.placeholder || 'UNKNOWN';
        }
        
        const value = input.value || `{${variableName}}`;
        text = text.replace(new RegExp(`{${variableName}}`, 'g'), value);
      });
      
      element.textContent = text;
    });
    
    // Always update cga-command elements independently
    updateOneLiners();
  }
  
  // Function to update cga-command elements (same logic as cga-text)
  function updateOneLiners(): void {
    if (!container) return;
    const oneLinerCommands = container.querySelectorAll('.cga-command');
    oneLinerCommands.forEach((command) => {
      // Get the original text content (before any variable replacement)
      let text = command.getAttribute('data-original') || command.textContent || '';
      
      // Store original text if not already stored
      if (!command.getAttribute('data-original')) {
        command.setAttribute('data-original', text);
      }
      
      // Replace all variables with current input values (same as cga-text)
      variableInputs.forEach(input => {
        let variableName: string;
        const classList = input.className.split(' ');
        const varClass = classList.find(cls => cls.startsWith('cga-var-'));
        if (varClass) {
          variableName = varClass.replace('cga-var-', '');
        } else {
          variableName = input.name || input.placeholder || 'UNKNOWN';
        }
        
        const value = input.value || `{${variableName}}`;
        text = text.replace(new RegExp(`{${variableName}}`, 'g'), value);
      });
      
      command.textContent = text;
    });
  }
  
  // Add click-to-copy functionality for one-liner commands
  function addOneLinerClickHandlers(): void {
    if (!container) return;
    const oneLinerCommands = container.querySelectorAll('.cga-command');
    oneLinerCommands.forEach(command => {
      command.addEventListener('click', async () => {
        const text = command.textContent;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            showCopyFeedback(command);
          } else {
            await fallbackCopy(text);
            showCopyFeedback(command);
          }
        } catch (error) {
          console.warn('Copy failed:', error);
          // Still show feedback even if copy failed
          showCopyFeedback(command);
        }
      });
    });
  }
  
  // Modern fallback copy function
  async function fallbackCopy(text: string): Promise<void> {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
      
      // Fallback to textarea method for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // Use modern selection API if available
      if (document.getSelection) {
        const selection = document.getSelection();
        if (selection) {
          selection.removeAllRanges();
          const range = document.createRange();
          range.selectNodeContents(textArea);
          selection.addRange(range);
        }
      }
      
      // Try to copy using modern methods
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (!success) {
        throw new Error('Copy command failed');
      }
    } catch (err) {
      throw new Error(`Copy failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }
  
  // Show copy feedback
  function showCopyFeedback(element: Element): void {
    const originalText = element.textContent;
    element.textContent = `[COPIED] ${originalText}`;
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
  
  // Store original text for cga-command elements before any updates
  const oneLinerCommands = container.querySelectorAll('.cga-command');
  oneLinerCommands.forEach(command => {
    if (!command.getAttribute('data-original')) {
      command.setAttribute('data-original', command.textContent || '');
    }
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
        const classList = input.className.split(' ');
        const varClass = classList.find(cls => cls.startsWith('cga-var-'));
        if (varClass) {
          variableName = varClass.replace('cga-var-', '');
        } else {
          variableName = input.name || input.placeholder || 'UNKNOWN';
        }
        variables[variableName] = input.value;
      });
      return variables;
    },
    setVariable: (name: string, value: string) => {
      const input = Array.from(variableInputs).find(inp => {
        const classList = inp.className.split(' ');
        return classList.includes(`cga-var-${name}`) || inp.name === name;
      });
      if (input) {
        input.value = value;
        updateText();
      }
    },
    copy: async () => {
      const text = textElement?.textContent || '';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          await fallbackCopy(text);
        }
      } catch (error) {
        console.warn('Copy failed:', error);
        throw error;
      }
    },
    download: (filename: string = 'guide.txt') => {
      const text = textElement?.textContent || '';
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Clean up the URL after a short delay to ensure download starts
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  };
}

/**
 * Auto-initialize function for elements with data-cga-widget attribute
 * @returns Object containing all initialized widgets
 */
export function autoInitCommandGuideAmplifiedWidgets(): Record<string, CommandGuideAmplifiedWidgetInstance | null> {
  const widgets = document.querySelectorAll('[data-cga-widget]');
  const initializedWidgets: Record<string, CommandGuideAmplifiedWidgetInstance | null> = {};
  
  widgets.forEach(element => {
    const widgetId = element.id || `cga-widget-${crypto.randomUUID().slice(0, 8)}`;
    if (!element.id) element.id = widgetId;
    
    initializedWidgets[widgetId] = init(widgetId);
  });
  
  return initializedWidgets;
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      autoInitCommandGuideAmplifiedWidgets();
    });
  } else {
    // DOM is already loaded
    autoInitCommandGuideAmplifiedWidgets();
  }
}

// Default export
export default {
  init,
  autoInitCommandGuideAmplifiedWidgets
};
