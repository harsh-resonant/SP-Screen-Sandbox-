@isTest
public class BatchDeleteAccountsTest {
    public static testmethod void method1(){
        Account act = new Account();
        act.Name = 'Delete Account';
        act.Is_Ready_For_Delete__c = true;
        insert act;
        
        
        Test.startTest();
        BatchDeleteAccounts b =new BatchDeleteAccounts();
		Database.executeBatch(b,1);
        Test.stopTest();
    }
}