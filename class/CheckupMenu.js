class checkupMenu extends AnyComponent{
    constructor(parent) {
        super();
        this.parent = parent;
        this.element = document.createElement('div');
        this.element.className = 'checkup-menu';
        this.parent.appendChild(this.element);

        this.totalIndicator = document.createElement('div');
        this.totalIndicator.className = 'total-indicator';
        this.totalIndicator.textContent = 'Total Price Tags: 0';
        this.element.appendChild(this.totalIndicator);

        this.regenerateButton = document.createElement('button');
        this.regenerateButton.textContent = 'Reset Checkup';
        this.regenerateButton.onclick = () => this.regenerate();
        this.element.appendChild(this.regenerateButton);

        this.PriceTagsList = document.createElement('ul');
        this.PriceTagsList.className = 'price-tags-list';
        this.element.appendChild(this.PriceTagsList);

        this.PTList = [];
    }

    regenerate() {
        // Logic to regenerate the checkup content from imported images
        this.PTList.forEach(pt => pt.remove());
        this.PTList = [];
        let ImportMenu = this.parent.importMenu;
        let importedImages = ImportMenu.getImportedImages();
        for(let importedImage of importedImages) {
            let settings = importedImage.getSettingsValues();
            importedImage.redrawOverlay(false); // Redraw without overlay
            for (let y = 0; y < settings.yMaxCount; y++) for(let x = 0; x<settings.xMaxCount; x++) {
                let pt = new PotentialPriceTag(this.PriceTagsList, importedImage.canvas, 
                    (settings.xMargin*ImportedImage.IMPORT_RESOLUTION) + x * (settings.width + settings.xGap) * ImportedImage.IMPORT_RESOLUTION,
                    (settings.yMargin*ImportedImage.IMPORT_RESOLUTION) + y * (settings.height + settings.yGap) * ImportedImage.IMPORT_RESOLUTION,
                    settings.width * ImportedImage.IMPORT_RESOLUTION,
                    settings.height * ImportedImage.IMPORT_RESOLUTION,
                    this)
                this.PTList.push(pt);
            }
            importedImage.redrawOverlay(true); // Redraw with overlay
        }
    }

    show() {
        this.regenerate();
        this.computeTotal();
        super.show();
    }

    computeTotal() {
        this.totalIndicator.textContent = `Total Price Tags: ${this.getSelectedPriceTags().length}`;
        return this.getSelectedPriceTags().length;
    }

    getSelectedPriceTags() {
        return this.PTList.filter(pt => pt.element.classList.contains('selected'));
    }
}