import { LightningElement } from 'lwc';
import getCaseData from '@salesforce/apex/CaseControllerSUM.getCaseData';

export default class CaseSummarySUM extends LightningElement {
    title = "케이스 목록";
    categoryLabels = {
        list1: "긴급 케이스",
        list2: "일반 케이스"
    };
    objectApiName = "Case";
    apexMethod = getCaseData;

    categoryStyles = {
        list1: "red",
        list2: "orange"
    };

    columns = {
        list1: [
            { label: "케이스 번호", fieldName: "CaseNumber" }, // 📌 첫 번째 컬럼이 네비게이션 필드로 자동 설정됨
            { label: "가맹점명", fieldName: "Account.Name" },
            { label: "발생일", fieldName: "CreatedDate" }
        ],
        list2: [
            { label: "케이스 번호", fieldName: "CaseNumber" }, // 📌 첫 번째 컬럼이 네비게이션 필드로 자동 설정됨
            { label: "가맹점명", fieldName: "Account.Name" },
            { label: "발생일", fieldName: "CreatedDate" }
        ]
    };
    connectedCallback() {
        console.log("✅ CaseSummarySUM connectedCallback 실행됨!");
        console.log("categoryStyles 값:", this.categoryStyles);
    }
}
