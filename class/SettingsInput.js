class SettingsInput {
    constructor(parent, additionalClass = '') {
        this.parent = parent;
        this.element = document.createElement('div');
        this.element.className = 'settings-input ' + additionalClass;
        this.parent.appendChild(this.element);
        
        this.marginLabel = document.createElement('label');
        this.marginLabel.textContent = 'Margins:';
        this.element.appendChild(this.marginLabel);
        this.xMargin = document.createElement('input');
        this.xMargin.type = 'number';
        this.xMargin.placeholder = 'X Margin';
        this.xMargin.value = 0.575;
        this.xMargin.onchange = () => this.onSettingsChange();
        this.element.appendChild(this.xMargin);
        this.yMargin = document.createElement('input');
        this.yMargin.type = 'number';
        this.yMargin.placeholder = 'Y Margin';
        this.yMargin.value = 1.07;
        this.yMargin.onchange = () => this.onSettingsChange();
        this.element.appendChild(this.yMargin);

        this.sizeLabel = document.createElement('label');
        this.sizeLabel.textContent = 'Size:';
        this.element.appendChild(this.sizeLabel);
        this.widthInput = document.createElement('input');
        this.widthInput.type = 'number';
        this.widthInput.placeholder = 'Width';
        this.widthInput.value = 3.81; // Default width
        this.widthInput.onchange = () => this.onSettingsChange();
        this.element.appendChild(this.widthInput);
        this.heightInput = document.createElement('input');
        this.heightInput.type = 'number';
        this.heightInput.placeholder = 'Height';
        this.heightInput.value = 2.12; // Default height
        this.heightInput.onchange = () => this.onSettingsChange();
        this.element.appendChild(this.heightInput);

        this.gapLabel = document.createElement('label');
        this.gapLabel.textContent = 'Gap:';
        this.element.appendChild(this.gapLabel);
        this.xGap = document.createElement('input');
        this.xGap.type = 'number';
        this.xGap.placeholder = 'X Gap';
        this.xGap.value = 0.15;
        this.xGap.onchange = () => this.onSettingsChange();
        this.element.appendChild(this.xGap);
        this.yGap = document.createElement('input');
        this.yGap.type = 'number';
        this.yGap.placeholder = 'Y Gap';
        this.yGap.value = 0;
        this.yGap.onchange = () => this.onSettingsChange();
        this.element.appendChild(this.yGap);

        this.maxCountLabel = document.createElement('label');
        this.maxCountLabel.textContent = 'Max Count:';
        this.element.appendChild(this.maxCountLabel);
        this.xMaxCount = document.createElement('input');
        this.xMaxCount.type = 'number';
        this.xMaxCount.placeholder = 'X Max Count';
        this.xMaxCount.value = 5; // Default max count
        this.xMaxCount.onchange = () => this.onSettingsChange();
        this.element.appendChild(this.xMaxCount);
        this.yMaxCount = document.createElement('input');
        this.yMaxCount.type = 'number';
        this.yMaxCount.placeholder = 'Y Max Count';
        this.yMaxCount.value = 13; // Default max count
        this.yMaxCount.onchange = () => this.onSettingsChange();
        this.element.appendChild(this.yMaxCount);
    }

    getValues() {
        return {
            xMargin: parseFloat(this.xMargin.value),
            yMargin: parseFloat(this.yMargin.value),
            width: parseFloat(this.widthInput.value),
            height: parseFloat(this.heightInput.value),
            xGap: parseFloat(this.xGap.value),
            yGap: parseFloat(this.yGap.value),
            xMaxCount: parseInt(this.xMaxCount.value),
            yMaxCount: parseInt(this.yMaxCount.value),
            valid: true
        };
    }

    onSettingsChange() {
        this.parent.onSettingsChange(this.getValues());
    }
}