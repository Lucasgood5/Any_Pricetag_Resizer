class ImporterMenu extends AnyComponent {
    constructor(Parent) {
        super();
        this.Parent = Parent;
        this.element = document.createElement('div');
        this.element.className = 'importer-menu';
        this.Parent.appendChild(this.element);

        this.addFileButton = document.createElement('button');
        this.addFileButton.textContent = 'Add File';
        this.addFileButton.onclick = () => this.popupFileImportDialog();
        this.element.appendChild(this.addFileButton);

        this.dragDropArea = document.createElement('div');
        this.dragDropArea.className = 'drag-drop-area';
        this.dragDropArea.textContent = 'Drag and drop files here';
        this.dragDropArea.ondragover = (event) => {
            event.preventDefault();
            this.dragDropArea.classList.add('drag-over');
        };
        this.dragDropArea.ondragleave = () => {
            this.dragDropArea.classList.remove('drag-over');
        };
        this.dragDropArea.ondrop = (event) => {
            event.preventDefault();
            this.dragDropArea.classList.remove('drag-over');
            const files = event.dataTransfer.files;
            for (const file of files) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    this.processImportedFile(content, file);
                };
                reader.readAsDataURL(file);
            }
        };
        this.element.appendChild(this.dragDropArea);

        this.imageList = [];
    }

    popupFileImportDialog() { // Trigger file input dialog, accepting images and pdf
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,application/pdf'; // Accept images and PDF files
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    this.processImportedFile(content, file);
                };
                reader.readAsDataURL(file); // Read the file as a data URL
            }
        };
        fileInput.click(); // Trigger the file input dialog
    }

    processImportedFile(content, file, fileName = file.name) {
        let fileType = file.type;
        if (fileType.startsWith('image/')) {
            return this.processImportedImage(content, file, fileName);
        } else if (fileType === 'application/pdf') {
            if (pdfjsLib === undefined) {
                alert('PDF.js library is not loaded. Maybe you\'re offline?');
                return false;
            }
            return this.processImportedPDF(content, file, fileName);
        }
        alert('Unsupported file type: ' + fileType + '\nPlease upload an image or PDF file.');
        return false;
    }

    processImportedImage(content, file, fileName) {
        this.imageList.push(new ImportedImage(this.element, content, file, fileName));
    }

    processImportedPDF(content, file, fileName) {
        pdfjsLib.getDocument({ data: atob(content.split(',')[1]) }).promise.then((pdf) => {
            const totalPages = pdf.numPages;
            for (let pageIndex = 1; pageIndex <= totalPages; pageIndex++) {
                pdf.getPage(pageIndex).then((page) => {
                    const viewport = page.getViewport({ scale: 2 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };

                    page.render(renderContext).promise.then(() => {
                        const imageDataUrl = canvas.toDataURL('image/png');
                        this.processImportedImage(imageDataUrl, file, `${fileName} (page ${pageIndex}/${totalPages})`);
                    });
                });
            }
        }).catch((error) => {
            console.error('Error processing PDF:', error);
            alert('Failed to process PDF file. Please try another file.');
        });
    }

    getImportedImages() {
        return this.imageList;
    }
}