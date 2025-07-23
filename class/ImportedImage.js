class ImportedImage extends AnyComponent {
    static IMPORT_RESOLUTION = 100 // px per cm
    constructor(parent, content, file) {
        super();
        this.parent = parent;
        this.element = document.createElement('div');
        this.element.className = 'imported-image';
        this.parent.appendChild(this.element);

        this.image = document.createElement('img');
        this.image.src = content; // Assuming content is a data URL
        this.image.alt = file.name;
        this.element.appendChild(this.image);
        this.image.style.display = 'none'; // Initially hidden

        this.title = document.createElement('h2');
        this.title.textContent = file.name;
        this.element.appendChild(this.title);
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = 21 * ImportedImage.IMPORT_RESOLUTION; // 21 cm width
        this.canvas.height = 29.7 *ImportedImage.IMPORT_RESOLUTION; // 29.7 cm height
        this.canvas.style.width = '100%'; // Adjust as needed
        this.canvas.style.height = 'auto'; // Maintain aspect ratio
        this.element.appendChild(this.canvas);

        this.isReady = new Promise((resolve) => {
            this.image.onload = () => {
                this.redrawOverlay();
                resolve();
            };
        });

        this.settingsInput = new SettingsInput(this, 'imported-image-settings');
    }

    getContext() {
        return this.canvas.getContext('2d');
    }

    getSettingsValues() {
        return this.settingsInput.getValues();
    }

    onSettingsChange(settings) {
        if (settings.valid !== false) {
            this.redrawOverlay()
        } else {
            alert('Invalid settings. Please check your inputs.');
        }
    }

    redrawOverlay(withOverlay = true) {
        const ctx = this.getContext();
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        if (!withOverlay) return;
        const settings = this.getSettingsValues();
        if (settings?.valid) {
            // Hightlight the margins
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.lineWidth = 5;
            ctx.strokeRect((settings.xMargin *ImportedImage.IMPORT_RESOLUTION)-ctx.lineWidth, (settings.yMargin*ImportedImage.IMPORT_RESOLUTION)-ctx.lineWidth, 
                this.canvas.width - 2 * (settings.xMargin *ImportedImage.IMPORT_RESOLUTION), 
                this.canvas.height - 2 * (settings.yMargin *ImportedImage.IMPORT_RESOLUTION));

            // Hightlight Individual slots
            ctx.strokeStyle = 'rgba(255, 128, 0, 0.5)';
            ctx.lineWidth = 2;
            for(let x = 0; x<settings.xMaxCount; x++) for (let y = 0; y < settings.yMaxCount; y++) {
                ctx.strokeRect(
                    (settings.xMargin *ImportedImage.IMPORT_RESOLUTION) + x * (settings.width + settings.xGap) *ImportedImage.IMPORT_RESOLUTION - ctx.lineWidth,
                    (settings.yMargin *ImportedImage.IMPORT_RESOLUTION) + y * (settings.height + settings.yGap) *ImportedImage.IMPORT_RESOLUTION - ctx.lineWidth,
                    settings.width *ImportedImage.IMPORT_RESOLUTION,
                    settings.height *ImportedImage.IMPORT_RESOLUTION
                );
            }
        } 
    }
}