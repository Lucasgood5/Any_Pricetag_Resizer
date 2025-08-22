// Group settings into 4 blocks for compact layout
const createSettingsBlock = (labelText, inputs) => {
    const block = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = labelText;
    block.appendChild(label);

    inputs.forEach(input => block.appendChild(input));
    return block;
};

class SettingsInput {
    constructor(parent, additionalClass = '') {
        this.parent = parent;
        this.element = document.createElement('div');
        this.element.className = 'settings-input ' + additionalClass;
        this.parent.appendChild(this.element);

        // Determine if this is for export settings
        const isExportSettings = additionalClass.includes('export-settings');
        
        // Margins block
        this.xMargin = document.createElement('input');
        this.xMargin.type = 'number';
        this.xMargin.placeholder = 'X Margin';
        this.xMargin.value = isExportSettings ? 0.5 : 0.575;
        this.xMargin.onchange = () => this.onSettingsChange();

        this.yMargin = document.createElement('input');
        this.yMargin.type = 'number';
        this.yMargin.placeholder = 'Y Margin';
        this.yMargin.value = isExportSettings ? 0.5 : 1.07;
        this.yMargin.onchange = () => this.onSettingsChange();

        const marginsBlock = createSettingsBlock('Margins:', [this.xMargin, this.yMargin]);
        this.element.appendChild(marginsBlock);

        // Size block
        this.widthInput = document.createElement('input');
        this.widthInput.type = 'number';
        this.widthInput.placeholder = 'Width';
        this.widthInput.value = isExportSettings ? 3.8 : 3.81;
        this.widthInput.onchange = () => this.onSettingsChange();

        this.heightInput = document.createElement('input');
        this.heightInput.type = 'number';
        this.heightInput.placeholder = 'Height';
        this.heightInput.value = 2.12;
        this.heightInput.onchange = () => this.onSettingsChange();

        const sizeBlock = createSettingsBlock('Size:', [this.widthInput, this.heightInput]);
        this.element.appendChild(sizeBlock);

        // Gap block
        this.xGap = document.createElement('input');
        this.xGap.type = 'number';
        this.xGap.placeholder = 'X Gap';
        this.xGap.value = isExportSettings ? 0.25 : 0.15;
        this.xGap.onchange = () => this.onSettingsChange();

        this.yGap = document.createElement('input');
        this.yGap.type = 'number';
        this.yGap.placeholder = 'Y Gap';
        this.yGap.value = isExportSettings ? 0.25 : 0;
        this.yGap.onchange = () => this.onSettingsChange();

        const gapBlock = createSettingsBlock('Gap:', [this.xGap, this.yGap]);
        this.element.appendChild(gapBlock);

        // Max Count block
        this.xMaxCount = document.createElement('input');
        this.xMaxCount.type = 'number';
        this.xMaxCount.placeholder = 'X Max Count';
        this.xMaxCount.value = 5;
        this.xMaxCount.onchange = () => this.onSettingsChange();

        this.yMaxCount = document.createElement('input');
        this.yMaxCount.type = 'number';
        this.yMaxCount.placeholder = 'Y Max Count';
        this.yMaxCount.value = 13;
        this.yMaxCount.onchange = () => this.onSettingsChange();

        const maxCountBlock = createSettingsBlock('Max Count:', [this.xMaxCount, this.yMaxCount]);
        this.element.appendChild(maxCountBlock);
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