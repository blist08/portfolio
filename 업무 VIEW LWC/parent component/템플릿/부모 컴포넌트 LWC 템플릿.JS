import { LightningElement } from 'lwc';
import /*메서드 이름*/ from '@salesforce/apex//*에이펙스 템플릿에서 만든 에이펙스 이름.메서드이름*/';

export default class /이름/ extends LightningElement {
    title = "/*LWC 컴포 라벨*/";
    categoryLabels = {
        list/*에이펙스 템플릿에 맞는 list랑 번호 ex: list0*/: "/*각 섹션 이름*/",
    };
    objectApiName = "/*에이펙스 클래스에서의 오브젝트 이름*/";
    apexMethod = /*메서드 이름*/

    get categoryStyles() {  
        return {
            list/*에이펙스 템플릿에 맞는 list랑 번호 ex: list0*/: "blue" // 각 건수 에 적용되는 색깔. *주의! GENERIC CSS에 있는 색상만 적용됨! 
        };
    }

    columns = {
        list/*에이펙스 템플릿에 맞는 list랑 번호 ex: list0*/: [
            { label: "/*모달 내부 첫번째 테이블 헤드 라벨*/", fieldName: "/*해당 필드의 API 이름*/" }, 
            { label: "/*모달 내부 두번째 테이블 헤드 라벨*/", fieldName: "/*해당 필드의 API 이름*/" }
	// 라벨은 위와 같이 추가 가능
        ], 
       
    };
}
