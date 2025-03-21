import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class Child_Component extends NavigationMixin(LightningElement) {
    @api title;
    @api categoryLabels = {}; 
    @track _categoryStyles = {}; 

    @api 
    get categoryStyles() {
        return this._categoryStyles;
    }
    set categoryStyles(value) {
        if (value && Object.keys(value).length > 0) { 
            this._categoryStyles = value;
        }
    }

    @api objectApiName;
    @api apexMethod;
    @api columns = {}; 

    @track dataLists = {};
    @track showModal = false;
    @track selectedCategory = '';
    @track modalData = [];

    connectedCallback() {
        this.fetchData();
    }

    get categoryData() {
        const safeCategoryStyles = this.categoryStyles || {}; 

        return Object.keys(this.categoryLabels).map(key => ({
            key,
            label: this.categoryLabels[key],
            count: (this.dataLists[key] && this.dataLists[key].length) || 0,
            cssClass: `slds-text-heading_large ${safeCategoryStyles[key] || "default-text"}`
        }));
    }

    async fetchData() {
        try {
            const data = await this.apexMethod();
            this.dataLists = data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
  
    get selectedCategoryLabel() {
        return this.categoryLabels[this.selectedCategory] || '';
    }

    get selectedColumns() {
        return this.columns[this.selectedCategory] || [];
    }

    get formattedModalData() {
        return this.modalData.map(record => {
            let rowData = { 
                id: record.Id || '',  
                fields: []
            };
    
            this.selectedColumns.forEach(col => {
                let value = record[col.fieldName];

                if (col.fieldName.includes('.')) {
                    let fieldParts = col.fieldName.split('.');
                    value = fieldParts.reduce((obj, key) => (obj && obj[key] ? obj[key] : ''), record);
                }
    
                rowData.fields.push({
                    key: col.fieldName,
                    value: value || '',
                    isNavigationTarget: col.isNavigationTarget || false, 
                    recordId: record.Id 
                });
            });
    
            if (rowData.fields.length > 0) {
                rowData.fields[0].isNavigationTarget = true;
            }
    
            return rowData;
        });
    }

    openModal(event) {
        this.selectedCategory = event.target.dataset.category;
        this.modalData = this.dataLists[this.selectedCategory] || [];
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.modalData = [];
    }

    navigateToRecordPage(event) {
        const recordId = event.target.dataset.id;
        if (!recordId) {
            console.error("레코드 ID 없음");
            return;
        }

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: this.objectApiName,
                actionName: 'view'
            }
        });
    }
}
