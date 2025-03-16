public with sharing class CaseControllerSUM {
    @AuraEnabled(cacheable=true)
    public static Map<String, List<Case>> getCaseData() {
        Map<String, List<Case>> result = new Map<String, List<Case>>();
        String currentUserId = UserInfo.getUserId();

        List<Case> list1 = [
            SELECT Id, CaseNumber, Priority, CreatedDate, Account.Name 
            FROM Case 
            WHERE Priority = 'High'
            AND AccountId IN (SELECT Id FROM Account WHERE OwnerId = :currentUserId)
        ];
        
        List<Case> list2 = [
            SELECT Id, CaseNumber, Priority, CreatedDate, Account.Name 
            FROM Case 
            WHERE Priority = 'Medium'
            AND AccountId IN (SELECT Id FROM Account WHERE OwnerId = :currentUserId)
        ];

        result.put('list1', list1);
        result.put('list2', list2);

        return result;
    }
}