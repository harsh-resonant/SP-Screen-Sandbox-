global with sharing class BatchDeleteAccounts implements Database.Batchable<SObject>  {
    /*private List<String> lstAcntIds = new List<String>();
    public BatchDeleteAccounts(List<String> lstTempActIds){
        lstAcntIds.addAll(lstTempActIds); 
    }*/
    
    global Database.QueryLocator  start(Database.BatchableContext BC)  {
        return Database.getQueryLocator('Select Id from Account where Is_Ready_For_Delete__c != null AND Is_Ready_For_Delete__c = true');
    }
    
    global void execute(Database.BatchableContext BC, List<SObject> scope)  {
        List<Account> lstDeleteAccounts = new List<Account>();
        Account act;
        for(SObject s : scope){
            act = (Account)s;
            lstDeleteAccounts.add(act);
        }
        
        if(lstDeleteAccounts != null && lstDeleteAccounts.size() > 0){
            delete lstDeleteAccounts;
        }
    }
    
    global void finish(Database.BatchableContext BC) {
        
    }
}