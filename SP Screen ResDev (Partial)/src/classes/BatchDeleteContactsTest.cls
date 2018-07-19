@isTest
public class BatchDeleteContactsTest {
	public static testmethod void method1(){
        Contact cnt = new Contact();
        cnt.LastName = 'Delete Account';
        cnt.Is_Ready_For_Delete__c = true;
        insert cnt;
        
        
        Test.startTest();
        BatchDeleteContacts b =new BatchDeleteContacts();
		Database.executeBatch(b,1);
        Test.stopTest();
    }
}