# Create PWA Icons

You need to create two PNG icon files for your PWA to work on mobile:

## Required Files:
1. `icon-192.png` - 192x192 pixels
2. `icon-512.png` - 512x512 pixels

## Quick Method - Using Online Tool:

1. Go to: https://realfavicongenerator.net/ OR https://www.favicon-generator.org/
2. Upload your logo/icon
3. Generate icons
4. Download the 192x192 and 512x512 PNG files
5. Rename them to `icon-192.png` and `icon-512.png`
6. Place them in `frontend/public/` folder

## Alternative - Use this simple HTML to generate:

Create a file `generate-icons.html` and open in browser:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Generate PWA Icons</title>
</head>
<body>
    <canvas id="canvas192" width="192" height="192"></canvas>
    <canvas id="canvas512" width="512" height="512"></canvas>

    <script>
        function drawIcon(canvas, size) {
            const ctx = canvas.getContext('2d');

            // Blue gradient background
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#2563eb');
            gradient.addColorStop(1, '#1d4ed8');

            // Draw circle
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/2 - 10, 0, Math.PI * 2);
            ctx.fill();

            // Draw letter 'A'
            ctx.fillStyle = 'white';
            ctx.font = `bold ${size * 0.6}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('A', size/2, size/2 + size * 0.05);
        }

        drawIcon(document.getElementById('canvas192'), 192);
        drawIcon(document.getElementById('canvas512'), 512);

        // Right-click on each canvas and "Save image as..." to download
    </script>

    <p>Right-click on each canvas above and select "Save image as..." to download the icons.</p>
    <p>Save as icon-192.png and icon-512.png respectively.</p>
</body>
</html>
```

After creating the icons, your PWA will work on mobile devices!
