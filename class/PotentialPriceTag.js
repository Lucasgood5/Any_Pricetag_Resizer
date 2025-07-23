class PotentialPriceTag {
    constructor(parent, importedImage, startX = 0, startY = 0, width = 210, height = 297, CM) {
        this.parent = parent;
        this.CM = CM; // CheckupMenu instance
        this.importedImage = importedImage;
        this.element = document.createElement('div');
        this.element.className = 'potential-price-tag';
        this.parent.appendChild(this.element);

        this.trueCanvas = document.createElement('canvas');
        this.trueCanvas.className = 'true-canvas';
        this.trueCanvas.width = width;
        this.trueCanvas.height = height;
        this.trueCanvas.style.width = '100%'; // Adjust as needed  
        // this.trueCanvas.style.height = 'auto'; // Maintain aspect ratio
        this.element.appendChild(this.trueCanvas);

        let Tctx = this.trueCanvas.getContext('2d');
        Tctx.drawImage(this.importedImage, startX, startY, width, height, 0, 0, width, height);

        let empty = this.checkEmptyness();
        if (empty) {
            this.element.classList.add('empty');
        } else {
            this.element.classList.add('not-empty');
            this.element.classList.add('selected');
        }
        CM.computeTotal();
        
        this.element.onclick = () => {
            if (this.element.classList.contains('selected')) {
                this.element.classList.remove('selected');
            } else {
                this.element.classList.add('selected');
            }
            CM.computeTotal();
        };
    }

    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        } else {
            throw new Error('Element not initialized or already removed.');
        }
    }

    // Look if the Tctx is empty / Totally White
    checkEmptyness() {
        let Tctx = this.trueCanvas.getContext('2d');
        let imageData = Tctx.getImageData(0, 0, this.trueCanvas.width, this.trueCanvas.height);
        let data = imageData.data;

        let threshold = 196

        for (let i = 0; i < data.length; i += 4) {
            if (data[i] < threshold || data[i + 1] < threshold || data[i + 2] < threshold) {
                return false; // Found a non-white pixel
            }
        }
        return true;
    }

    getCanvas() {
        return this.trueCanvas;
    }
}