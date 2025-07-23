class AnyComponent {
    constructor() {
    }

    appendChild(child) {
        if (!this.element) {
            throw new Error('Element not initialized. Please create an element first.');
        }
        this.element.appendChild(child);
    }

    show() {
        if (this.element) {
            this.element.style.display = 'block';
        } else {
            throw new Error('Element not initialized. Please create an element first.');
        }
    }

    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        } else {
            throw new Error('Element not initialized. Please create an element first.');
        }
    }

    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        } else {
            throw new Error('Element not initialized or already removed.');
        }
    }
}