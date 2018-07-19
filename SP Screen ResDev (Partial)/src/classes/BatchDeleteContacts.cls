global with sharing class BatchDeleteContacts implements Database.Batchable<SObject>  {
    /*private List<String> lstCntIds = new List<String>();
    private List<String> lstAcntIds = new List<String>();
    
    public BatchDeleteContacts(List<String> lstTempCntIds,List<String> lstTempActIds){
        system.debug('*****' + lstTempActIds);
        lstCntIds.addAll(lstTempCntIds);
        lstAcntIds.addAll(lstTempActIds);
        system.debug('*****'+lstAcntIds);
    }*/
    
    
    
    global Database.QueryLocator  start(Database.BatchableContext BC)  {
        //return Database.getQueryLocator('Select Id from Contact where Id in: lstCntIds');
        return Database.getQueryLocator('Select Id from Contact where Is_Ready_For_Delete__c != null AND Is_Ready_For_Delete__c = true');
    }
    
    global void execute(Database.BatchableContext BC, List<SObject> scope)  {
        List<Contact> lstDeleteContacts = new List<Contact>();
        Contact cnt;
        for(SObject s : scope){
            cnt = (Contact)s;
            lstDeleteContacts.add(Cnt);
        }
        
        if(lstDeleteContacts != null && lstDeleteContacts.size() > 0){
            delete lstDeleteContacts;
        }
    }
    
    global void finish(Database.BatchableContext BC) {
        /*Set<String> setAcntIds = new Set<String>();
        setAcntIds.addAll(lstAcntIds);
        lstAcntIds.clear();
        lstAcntIds.addAll(setAcntIds);
        BatchDeleteAccounts b =new BatchDeleteAccounts(lstAcntIds);
        Database.executeBatch(b,1);*/
        BatchDeleteAccounts b =new BatchDeleteAccounts();
        Database.executeBatch(b,1);
    }
}