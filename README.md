# Guide Widget Wrapper Approach

This folder contains the wrapper function approach for creating reusable guide widgets that can be applied to any element with a specific structure.

## Files

- `index.html` - Usage example
- `copy-guide-widget.js` - The main wrapper function
- `README.md` - This documentation

## Quick Start

### 1. Include the wrapper script
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
const widget = initGuideWidget('my-guide');
```

## Key Features

- **Reusable**: Apply to any element with the right structure
- **Multiple instances**: Have 20+ widgets on the same page
- **Auto-detection**: Finds variables and template automatically
- **Utility methods**: Copy, download, get/set variables
- **Lightweight**: No dependencies, minimal code

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

## Integration

This approach is perfect for:
- Documentation sites
- Tutorial pages
- Setup guides
- API documentation
- Any page needing multiple customizable guides

The wrapper function is lightweight and can be easily integrated into existing projects without conflicts.
