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
        this.generateButton.textContent = 'Download All as PNG';
        this.generateButton.onclick = () => {
            this.downloadAllAsPNG();
        };
        this.element.appendChild(this.generateButton);

        // Button to print all A4 pages
        this.printAllButton = document.createElement('button');
        this.printAllButton.textContent = 'Print All';
        this.printAllButton.onclick = () => {
            this.printAll();
        };
        this.element.appendChild(this.printAllButton);

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
    // Print all A4 pages
    printAll() {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<style>body, html { margin: 0; padding: 0; overflow: hidden; }</style>`);
        this.canvas.forEach((canvas) => {
            canvas.buildExportCanvas();
            const img = canvas.exportCanvas.toDataURL('image/png');
            printWindow.document.write(`<img src="${img}" style="width:100vw;margin:0;">`);
        });
        printWindow.document.write('<script>window.onload = function() { window.print();window.close(); }<\/script>'); // Automatically print when the image loads
        printWindow.document.close();
    }

    // Download all as individual PNGs
    downloadAllAsPNG() {
        this.canvas.forEach((canvas, index) => {
            canvas.downloadAsPNG()
        });
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
                if (canvasIndex >= this.canvas.length) {
                    this.canvas.push(new ExportA4(this.outputDiv, this, canvasIndex));
                }
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
}