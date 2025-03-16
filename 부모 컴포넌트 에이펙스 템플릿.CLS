public with sharing class /OBJECT/ControllerSUM {
    @AuraEnabled(cacheable=true)
    public static Map<String, List</OBJECT/>> get/OBJECT/Data() {
        Map<String, List</OBJECT/>> result = new Map<String, List</OBJECT/>>();
        String currentUserId = UserInfo.getUserId();

        List</OBJECT/> list0 = [ //원하는 숫자 입력
            SELECT
            FROM /OBJECT/
            WHERE  OwnerId = :currentUserId
        ];
        
        result.put('list0', list0); //위에서 만든 list 이름 넣기
result.put('',);
        return result;
    }
}

/OBJECT/ 를 해당 오브젝트 API 이름으로 바꾸기
만약 같은 오브젝트에서 리스트가 더 추가 된다면 추가 작성. 