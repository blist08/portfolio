trigger InspectionTrigger on Regular_Inspection__c (before update) {
    if (Trigger.isBefore) {
        if (Trigger.isUpdate) {
            String systemAdminProfileId = null;

            // 시스템 어드민 프로필 ID 가져오기
            List<Profile> profiles = [SELECT Id FROM Profile WHERE ID = '00ebm000009UJZXAA4' LIMIT 1];
            if (!profiles.isEmpty()) {
                systemAdminProfileId = profiles[0].Id;
            }

            // 점검 완료 상태일 때 특정 필드만 수정 가능하도록 제한
            Set<String> allowedFields = new Set<String>{'OwnerId', 'Contact__c', 'LastModifiedById', 'Name', 'Survey_Question_Response__c','inspect_time__c','inspect_start__c','inspect_end__c'};
            for (Regular_Inspection__c rec : Trigger.new) {
                Regular_Inspection__c oldRec = Trigger.oldMap.get(rec.Id);
                if (oldRec.inspect_Status__c == '점검 완료' && (systemAdminProfileId == null || UserInfo.getProfileId() != systemAdminProfileId)) {
                    for (String fieldName : rec.getPopulatedFieldsAsMap().keySet()) {
                        if (!allowedFields.contains(fieldName) && rec.get(fieldName) != oldRec.get(fieldName)) {
                            rec.addError('점검 완료 후엔 데이터를 수정할 수 없습니다.');
                        }
                    }
                }
            }
        }
    }
}