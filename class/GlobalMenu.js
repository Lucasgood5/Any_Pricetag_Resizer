// filepath: d:\DEV5\Any_Pricetag_Resizer\class\GlobalMenu.js
class GlobalMenu {
    constructor(parent) {
        this.parent = parent;
        this.element = document.createElement('div');
        this.element.className = 'global-menu';
        this.parent.appendChild(this.element);

        this.currentMenu = null;

        this.createNavigation();

        this.importMenu = new ImporterMenu(this);
        this.checkupMenu = new checkupMenu(this);
        this.exportMenu = new ExportMenu(this);
        this.showMenu(this.importMenu);
    }

    appendChild(child) {
        this.element.appendChild(child);
    }

    createNavigation() {
        const navBar = document.createElement('div');
        navBar.className = 'navigation-bar';
        this.element.appendChild(navBar);

        const importButton = this.createNavButton('Import', () => this.showMenu(this.importMenu));
        const checkupButton = this.createNavButton('Checkup', () => this.showMenu(this.checkupMenu));
        const exportButton = this.createNavButton('Export', () => this.showMenu(this.exportMenu));

        navBar.appendChild(importButton);
        navBar.appendChild(checkupButton);
        navBar.appendChild(exportButton);
    }

    createNavButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.onclick = onClick;
        return button;
    }

    createPlaceholderMenu(name) {
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder-menu';
        placeholder.textContent = `${name} is under construction.`;
        placeholder.style.display = 'none';
        this.parent.appendChild(placeholder);
        return placeholder;
    }

    showMenu(menu) {
        this.importMenu.hide();
        this.checkupMenu.hide();
        this.exportMenu.hide();
        menu.show();
    }
}