class ExportMenu extends AnyComponent {
    constructor(parent) {
        super();
        this.parent = parent;
        this.element = document.createElement('div');
        this.element.className = 'export-menu';
        this.parent.appendChild(this.element);

        // Settings input for export
        this.settingsInput = new SettingsInput(this, 'export-settings');

        // Generate button
        this.generateButton = document.createElement('button');
        this.generateButton.textContent = 'Generate';
        this.generateButton.onclick = () => {
            this.downloadAsPNG();
        }
        this.element.appendChild(this.generateButton);

        // Output container
        this.outputDiv = document.createElement('div');
        this.outputDiv.className = 'export-output';
        this.element.appendChild(this.outputDiv);

        this.canvas = []
        
    }

    show() {
        super.show();
        this.AssignPriceTagsToCanvas();
    }

    GetSettingsValues() {
        return this.settingsInput.getValues();
    }

    AssignPriceTagsToCanvas() {
        const CheckUpMenu = this.parent.checkupMenu;
        const selectedPriceTags = CheckUpMenu.getSelectedPriceTags();
        let canvasIndex = 0;
        for(let canvas of this.canvas) {
            canvas.resetAssignments();
        }
        if (this.canvas.length === 0) {
            this.canvas.push(new ExportA4(this.outputDiv, this));
        }
        for (let pt of selectedPriceTags) {
            if(!this.canvas[canvasIndex].addPriceTag(pt.getCanvas())) {
                canvasIndex++;
                this.canvas.push(new ExportA4(this.outputDiv, this));
                if(!this.canvas[canvasIndex].addPriceTag(pt.getCanvas())) {
                    console.error('Failed to add price tag to canvas:', pt);
                }
            }
        }
        for (let canvas of this.canvas) {
            canvas.reDraw();
        }
    }

    onSettingsChange() {
        this.canvas.forEach(c => c.remove());
        this.canvas = [];
        this.AssignPriceTagsToCanvas();
    }

    downloadAsPNG() {
        this.canvas.forEach((canvas, index) => {
            canvas.downloadAsPNG(index);
        });
    }
}