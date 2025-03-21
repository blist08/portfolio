global class ContractRenewalBatch implements Database.Batchable<sObject> {
    
    global Database.QueryLocator start(Database.BatchableContext BC) {
    Date sixMonthsFromToday = System.today().addMonths(6);
    
    Integer countContracts = [SELECT COUNT() FROM Contract 
                              WHERE EndDate <= :sixMonthsFromToday
                              AND Status = 'Activated'
                              AND Renewal__c = False];
    
    System.debug('조회된 계약 개수: ' + countContracts);

    return Database.getQueryLocator([
        SELECT Id, AccountId, ContractNumber, EndDate, Renewal__c, OwnerId
        FROM Contract
        WHERE EndDate <= :sixMonthsFromToday
        AND Status = 'Activated'
        AND Renewal__c = False
    ]);
}


    global void execute(Database.BatchableContext BC, List<Contract> contractList) {
        System.debug('받아온 계약서 건수: ' + contractList.size());

        if (contractList.isEmpty()) {
            System.debug('OPPTY 전환할 건수 없음. 배치 종료.');
            return;
        }

        Set<Id> accountIds = new Set<Id>();
        for (Contract c : contractList) {
            System.debug('현재 Contract: ' + c.Id);
            System.debug('AccountId 확인: ' + c.AccountId);

            if (c.AccountId != null) {
                accountIds.add(c.AccountId);
            } else {
                System.debug('AccountId 없는 contracts: ' + c.Id);
            }
        }

        Map<Id, Account> accountMap = new Map<Id, Account>();
        if (!accountIds.isEmpty()) {
            accountMap = new Map<Id, Account>(
                [SELECT Id, Name FROM Account WHERE Id IN :accountIds]
            );
        }

        List<Opportunity> oppList = new List<Opportunity>();
        List<Contract> contractUpdates = new List<Contract>();

        try {
            for (Contract c : contractList) {
                System.debug('계약서를 통해 옵티를 생성합니다 - Contract ID: ' + c.Id);

                String accountName = accountMap.containsKey(c.AccountId) ? accountMap.get(c.AccountId).Name : 'Unknown';
               /*System.debug('Account Map에 존재?: ' + accountMap.containsKey(c.AccountId));
                System.debug('Account Name: ' + accountName);*/

                Date closeDate = (c.EndDate != null) ? c.EndDate : System.today().addMonths(6);

                Opportunity opp = new Opportunity(
                    Name = '가맹재계약 - ' + accountName + ' / 계약번호: ' + c.ContractNumber,
                    StageName = '가맹점 재계약 타당성 검토',
                    CloseDate = closeDate,
                    AccountId = c.AccountId,
                    RecordTypeId = '012bm000004ekQ1AAI', //RECORD TYPE ID 뽑아오면 됨. 쿼리는 SELECT Id, Name, SObjectType FROM RecordType WHERE SObjectType = 'Opportunity'
                    OwnerId = c.OwnerId
                );

                //System.debug('생성 예정 OPPTY 정보: ' + JSON.serialize(opp));
                oppList.add(opp);

                c.Renewal__c = true;
                contractUpdates.add(c);
            }

            //System.debug('생성 예정 OPPTY 개수: ' + oppList.size());

            if (!oppList.isEmpty()) {
                insert oppList;
                //System.debug('OPPTY 생성 성공: ' + oppList.size());
            }

            if (!contractUpdates.isEmpty()) {
                update contractUpdates;
                //System.debug('Contract 업데이트 성공: ' + contractUpdates.size());
            }
        } catch (Exception e) {
            System.debug('예외 발생: ' + e.getMessage());
            System.debug('StackTrace: ' + e.getStackTraceString());
        }
    }
    
    global void finish(Database.BatchableContext BC) {
        System.debug('계약 만료 6개월 전 가맹점 파악 종료');
    }
}