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

    processImportedFile(content, file) {
        let fileType = file.type;
        let fileName = file.name;
        if (fileType.startsWith('image/')) {
            return this.processImportedImage(content, file, fileName);
        }
        console.warn('Unsupported file type:', fileType);
        alert('Unsupported file type: ' + fileType);
        return false;
    }

    processImportedImage(content, file, fileName) {
        this.imageList.push(new ImportedImage(this.element, content, file));
    }

    getImportedImages() {
        return this.imageList;
    }
}