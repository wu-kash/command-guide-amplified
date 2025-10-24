# Guide Widget

A lightweight, reusable guide widget for creating interactive templates with variable substitution and copy functionality.

## Installation

### NPM
```bash
npm install copy-guide-widget
```

### CDN
```html
<script src="https://unpkg.com/copy-guide-widget/dist/copy-guide-widget.min.js"></script>
```

### Manual
Download the latest release and include the script:
```html
<script src="copy-guide-widget.js"></script>
```

**Note:** When using the browser script, the functions are available under the `CopyGuideWidget` global object.

## Quick Start

### 1. Include the script
```html
<script src="copy-guide-widget.js"></script>
```

### 2. Create your HTML structure
```html
<div id="my-guide">
    <input type="text" id="guideVar-IMAGE_NAME" value="my-service">
    <input type="text" id="guideVar-PORT" value="8080">
    <div class="guide-text">
        docker build -t {IMAGE_NAME} .
        docker run -p {PORT}:{PORT} {IMAGE_NAME}
    </div>
</div>
```

### 3. Initialize the widget
```javascript
const widget = CopyGuideWidget.initGuideWidget('my-guide');
```

## Key Features

- **Reusable**: Apply to any element with the right structure
- **Multiple instances**: Have 20+ widgets on the same page
- **Auto-detection**: Finds variables and template automatically
- **Utility methods**: Copy, download, get/set variables
- **Lightweight**: No dependencies, minimal code
- **TypeScript support**: Full type definitions included
- **Multiple formats**: UMD, ES modules, CommonJS
- **Auto-initialization**: Automatically finds and initializes widgets

## HTML Structure

The wrapper expects this structure:

```html
<div id="container">
    <!-- Variable inputs with IDs like guideVar-VARIABLE_NAME -->
    <input type="text" id="guideVar-IMAGE_NAME" value="default">
    <input type="text" id="guideVar-PORT" value="8080">
    
    <!-- Template text element -->
    <div class="guide-text" id="guideText">
        Your template with {PLACEHOLDERS} here
    </div>
</div>
```

## Styling

The wrapper doesn't include any CSS - you can style the elements however you want. The examples include basic styling for reference.

## Multiple Widgets

You can have multiple widgets on the same page:

```html
<div id="docker-guide">
    <!-- Docker template -->
</div>

<div id="nodejs-guide">
    <!-- Node.js template -->
</div>

<div id="api-guide">
    <!-- API template -->
</div>
```

```javascript
const dockerWidget = initGuideWidget('docker-guide');
const nodejsWidget = initGuideWidget('nodejs-guide');
const apiWidget = initGuideWidget('api-guide');
```

## Advanced Usage

### Custom Variable Detection
The wrapper automatically detects variables from:
- Input IDs: `guideVar-VARIABLE_NAME`
- Input IDs: `var-VARIABLE_NAME`
- Data attributes: `data-variable="VARIABLE_NAME"`
- Name attributes: `name="VARIABLE_NAME"`

### Template Detection
The wrapper looks for templates in:
- Elements with class `guide-text`
- Elements with ID `guideText`
- Elements with attribute `data-template`

## Module Usage

### ES Modules
```javascript
import { initGuideWidget, autoInitGuideWidgets } from 'copy-guide-widget';

const widget = initGuideWidget('my-guide');
```

### CommonJS
```javascript
const { initGuideWidget, autoInitGuideWidgets } = require('copy-guide-widget');

const widget = initGuideWidget('my-guide');
```

### TypeScript
```typescript
import { initGuideWidget, GuideWidgetInstance } from 'copy-guide-widget';

const widget: GuideWidgetInstance | null = initGuideWidget('my-guide');
```

## API Reference

### `initGuideWidget(containerId: string): GuideWidgetInstance | null`

Initialize a guide widget on a container element.

**Parameters:**
- `containerId` - The ID of the container element

**Returns:** GuideWidgetInstance or null if container not found

### `autoInitGuideWidgets(): Record<string, GuideWidgetInstance | null>`

Auto-initialize all elements with `data-guide-widget` attribute.

**Returns:** Object containing all initialized widgets

### GuideWidgetInstance Methods

- `getText()` - Get current text content
- `updateText()` - Manually update text with current variables
- `getTemplate()` - Get original template
- `getVariables()` - Get all variable values as object
- `setVariable(name, value)` - Set a variable value
- `copy()` - Copy current text to clipboard (returns Promise)
- `download(filename?)` - Download current text as file

## Integration

This package is perfect for:
- Documentation sites
- Tutorial pages
- Setup guides
- API documentation
- Any page needing multiple customizable guides

The package is lightweight and can be easily integrated into existing projects without conflicts.
