import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, updateRecord, getRecordNotifyChange } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import STAGE_NAME from '@salesforce/schema/Opportunity.StageName';
import SQUARE_FEET from '@salesforce/schema/Opportunity.square_feet__c';
import ID_FIELD from '@salesforce/schema/Opportunity.Id';

export default class OpptyPopupEditor extends LightningElement {
    @api recordId;
    @track isPopupOpen = false;
    @track squareFeet = 0; 

    @wire(getRecord, { recordId: '$recordId', fields: [STAGE_NAME, SQUARE_FEET] })
    wiredOpportunity({ error, data }) {
        if (data) {
            let stageName = data.fields.StageName.value;
            let squareFeetValue = data.fields.square_feet__c ? data.fields.square_feet__c.value : 0;

            this.squareFeet = squareFeetValue;

            // '견적' 상태 & square_feet__c가 0일 때 팝업 실행
            if (stageName === '견적' && squareFeetValue === 0) {
                this.isPopupOpen = true;
            }
        }
    }

    handleSquareFeetChange(event) {
        this.squareFeet = event.target.value;
    }

    saveChanges() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        
        if (this.squareFeet !== undefined) {
            fields[SQUARE_FEET.fieldApiName] = this.squareFeet;
        }

        const recordInput = { fields };
        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Square Feet updated successfully',
                        variant: 'success',
                    })
                );
                this.isPopupOpen = false;
                getRecordNotifyChange([{ recordId: this.recordId }]);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error',
                    })
                );
            });
    }

    closePopup() {
        this.isPopupOpen = false;
    }
}
