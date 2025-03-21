global class ContractRenewalScheduler implements Schedulable {
    global void execute(SchedulableContext sc) {
        System.debug('매일 새벽 2시에: 재계약 기회 판별 절차 시작');

        ContractRenewalBatch batch = new ContractRenewalBatch();
        Database.executeBatch(batch, 200); 
    }
}