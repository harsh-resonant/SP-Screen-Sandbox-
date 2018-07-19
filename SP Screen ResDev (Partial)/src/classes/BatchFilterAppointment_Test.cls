@isTest
public class BatchFilterAppointment_Test {
    
    static testMethod void testMethod1() {
        Account objAcc =  new Account();
        objAcc.Name = 'Test Account';
        objAcc.AccountSource = 'SP Screens Website';
        insert objAcc;
        
        Contact objContact =  new Contact();
        
        objContact.AccountId  = objAcc.Id;
        objContact.Email = 'Test@Test.com';
        objContact.LastName = 'Test';
        objContact.MailingCity = 'Test';
        objContact.MailingState = 'Test';
        objContact.MailingCountry = 'Test';
        objContact.MailingStreet = 'Test';
        objContact.MailingPostalCode = 'Test';
        insert objContact;
        
        Opportunity objOpp = new Opportunity();
        objOpp.Name = 'Test Opportunity';
        objOpp.AccountId = objAcc.Id;
        objOpp.Contact__c = objContact.Id;
        objOpp.StageName = 'Enquiry';
        objOpp.Type = 'New Business';
        objOpp.CloseDate = system.today().addDays(5);
        insert objOpp;
        
        WorkType wtype= new WorkType();
        wtype.Name = 'Test';
        wtype.EstimatedDuration = 40.0;
        wtype.DurationType = 'Minutes';
        insert wType;
        
        
        WorkOrder wo = new WorkOrder();
        wo.Opportunity__c = objOpp.Id;
        wo.WorkTypeId = wType.Id;
        insert wo;
        System.debug(objOpp);
        Test.startTest();
        BatchFilterAppointment obj= new BatchFilterAppointment ();
        Database.executeBatch(obj,1);
        
        Test.stopTest();
    }  
    
    static testMethod void testMethod2() {
        Account objAcc =  new Account();
        objAcc.Name = 'Test Account';
        objAcc.AccountSource = 'SP Screens Website';
        insert objAcc;
        
        Contact objContact =  new Contact();
        
        objContact.AccountId  = objAcc.Id;
        objContact.Email = 'Test@Test.com';
        objContact.LastName = 'Test';
        objContact.MailingCity = 'Test';
        objContact.MailingState = 'Test';
        objContact.MailingCountry = 'Test';
        objContact.MailingStreet = 'Test';
        objContact.MailingPostalCode = 'Test';
        insert objContact;
        
        Lead l = new Lead();
        l.Company = 'test company';
        l.lastName = 'test';
        l.Email = 'Test@Test.com';
        insert l;
        
        Opportunity objOpp = new Opportunity();
        objOpp.Name = 'Test Opportunity';
        objOpp.AccountId = objAcc.Id;
        objOpp.Contact__c = objContact.Id;
        objOpp.StageName = 'Enquiry';
        objOpp.Type = 'New Business';
        objOpp.CloseDate = system.today().addDays(5);
        insert objOpp;
        
        
        
        WorkType wtype= new WorkType();
        wtype.Name = 'Test';
        wtype.EstimatedDuration = 40.0;
        wtype.DurationType = 'Minutes';
        insert wType;
        
        
        WorkOrder wo = new WorkOrder();
        wo.Opportunity__c = objOpp.Id;
        wo.WorkTypeId = wType.Id;
        insert wo;
        System.debug(objOpp);
        Test.startTest();
        BatchFilterAppointment obj= new BatchFilterAppointment ();
        Database.executeBatch(obj,1);
        
        Test.stopTest();
    }
}