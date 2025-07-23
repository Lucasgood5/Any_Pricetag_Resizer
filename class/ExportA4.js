class ExportA4 {
    EXPORT_RESOLUTION = 100 // px per cm
    constructor(Parent, EM, index = 0) {
        this.ExportMenu = EM;
        this.Parent = Parent;
        this.element = document.createElement('div');
        this.element.className = 'export-a4';
        this.Parent.appendChild(this.element);

        this.canvas = document.createElement('canvas');
        this.canvas.width = 21 * this.EXPORT_RESOLUTION;
        this.canvas.height = 29.7 * this.EXPORT_RESOLUTION;
        this.canvas.style.width = '100%'; // Adjust as needed
        this.canvas.style.height = 'auto'; // Maintain aspect ratio
        this.element.appendChild(this.canvas);
        this.computeSlots();

        // Add input for naming the A4 page
        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.placeholder = 'Enter name for this A4';
        this.element.appendChild(this.nameInput);

        // Add button to download this A4 as PNG
        this.downloadButton = document.createElement('button');
        this.downloadButton.textContent = 'Download as PNG';
        this.downloadButton.onclick = () => {
            const name = this.nameInput.value || `export_a4_${index}`;
            this.downloadAsPNG(name);
        };
        this.element.appendChild(this.downloadButton);

        // Add button to print this A4
        this.printButton = document.createElement('button');
        this.printButton.textContent = 'Print';
        this.printButton.onclick = () => {
            this.print();
        };
        this.element.appendChild(this.printButton);

        //When a slot is clicked it should toggle availability
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (event.clientY - rect.top) * (this.canvas.height / rect.height);
            for (let slot of this.slots) {
                if (x >= slot.x && x <= slot.x + slot.width && y >= slot.y && y <= slot.y + slot.height) {
                    slot.available = !slot.available; // Toggle availability
                    this.reDraw(); // Redraw the canvas
                    this.ExportMenu.AssignPriceTagsToCanvas();
                    break;
                }
            }
        });
    }

    computeSlots() {
        const settings = this.ExportMenu.GetSettingsValues();
        this.slots = [];

        let si = 0
        for (let y = 0; y < settings.yMaxCount; y++) for(let x = 0; x < settings.xMaxCount; x++) {
            this.slots.push({
                x: (settings.xMargin * this.EXPORT_RESOLUTION) + x * (settings.width + settings.xGap) * this.EXPORT_RESOLUTION,
                y: (settings.yMargin * this.EXPORT_RESOLUTION) + y * (settings.height + settings.yGap) * this.EXPORT_RESOLUTION,
                width: settings.width * this.EXPORT_RESOLUTION,
                height: settings.height * this.EXPORT_RESOLUTION,
                index: si,
                available: true,
                assignedCanvas: null
            });
            si++;
        }
    }

    getNextFreeSlot() {
        for (let slot of this.slots) {
            if (slot.available && slot.assignedCanvas == null) {
                return slot;
            }
        }
        return null; // No free slots available
    }

    addPriceTag(canvas) {
        const slot = this.getNextFreeSlot();
        if (!slot) { return false; } // No free slot available
        slot.assignedCanvas = canvas;
        return true; // Successfully added the price tag
    }

    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        } else {
            throw new Error('Element not initialized or already removed.');
        }
    }

    resetAssignments() {
        for (let slot of this.slots) {
            slot.assignedCanvas = null;
        }
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
    }

    reDraw() {
        const ctx = this.canvas.getContext('2d');

        const settings = this.ExportMenu.GetSettingsValues();
        // Margin
        ctx.fillStyle = '#444'; 
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = '#888';
        ctx.fillRect(settings.xMargin, settings.yMargin, this.canvas.width - 2 * settings.xMargin, this.canvas.height - 2 * settings.yMargin);
        
        // Draw slots
        for (let slot of this.slots) {
            if (slot.assignedCanvas) {
                ctx.drawImage(slot.assignedCanvas, slot.x, slot.y, slot.width, slot.height);
                continue
            }
            ctx.fillStyle = slot.available ? 'green' : 'darkgray';
            ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
        }
    }

    buildExportCanvas() {
        if(this.exportCanvas) {
            this.exportCanvas.remove(); // Remove previous export canvas if it exists
        }
        this.exportCanvas = document.createElement("canvas");
        this.exportCanvas.width = this.canvas.width;
        this.exportCanvas.height = this.canvas.height;
        const ctx = this.exportCanvas.getContext("2d");
        ctx.fillStyle = '#fff'; // Set background color to white
        ctx.fillRect(0, 0, this.exportCanvas.width, this.exportCanvas.height); // Fill the canvas with white
        for (let slot of this.slots) {
            if (slot.assignedCanvas) {
                ctx.drawImage(slot.assignedCanvas, slot.x, slot.y, slot.width, slot.height);
            }
        }
    }

    downloadAsPNG(name = this.nameInput.value) {
        this.buildExportCanvas();
        const link = document.createElement("a");
        link.download = `${name}.png`;
        link.href = this.exportCanvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    print() {
        this.buildExportCanvas();
        const printWindow = window.open('', '_blank');
        let img = this.exportCanvas.toDataURL('image/png');
        printWindow.document.write(`<style>body, html { margin: 0; padding: 0; overflow: hidden; }</style>`); 
        printWindow.document.write(`<img src="${img}" style="width:100vw;margin:0;">`);
        printWindow.document.write('<script>window.onload = function() { window.print();window.close(); }<\/script>'); // Automatically print when the image loads
        printWindow.document.close(); // Close the document to finish loading
    }
}