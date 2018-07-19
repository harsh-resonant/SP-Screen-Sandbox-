@isTest
private class spscreenv2_Test{
    static testMethod void spscreenv2() {
        
        Profile pf = [SELECT Id FROM Profile WHERE Name = 'System Administrator'];
       
       //create userrole for to create user in test class
       UserRole ur = new UserRole(Name = 'International');
       insert ur;
       
       //create user in test class
       User testUser = new User(alias = 'u1', 
                                email='u1@testorg.com',
                                emailencodingkey='UTF-8', 
                                lastname='Testing', 
                                languagelocalekey='en_US',
                                localesidkey='en_US', 
                                UserRoleId = ur.Id, 
                                ProfileId = pf.Id,
                                country='United States',
                                timezonesidkey='America/Los_Angeles', 
                                username='u1345@testorg.com');
       
       insert testUser;

System.runas(testUser){
        Account acc = new Account();
        acc.Name = 'test';
        insert acc;
        
        Contact con = new Contact();
        con.FirstName = 'test';
        con.LastName = 'test';
        con.AccountId = acc.Id;
        con.MailingCity = 'test';
        con.MailingState = 'test';
        con.MailingCountry = 'test';
        con.MailingPostalcode = '5261';
        con.MailingStreet = 'test';
        insert con;
        
        Opportunity opp = new Opportunity();
        opp.Name = 'test';
        opp.Accountid = acc.Id;
        opp.StageName = 'close won';
        opp.CloseDate = System.Today();
        opp.Contact__c = con.Id;
        insert opp;
    
        WorkType wrk = new WorkType();
        wrk.Name = 'Free Consultation';
        wrk.EstimatedDuration = 5;
        wrk.DurationType = 'Hours';
        insert wrk;
        
        Workorder wrkordr = new Workorder();
        wrkordr.city = 'sydney';
        wrkordr.State = 'New South Wales';
        wrkordr.street = 'test';
        wrkordr.postalcode = '2000';
        wrkordr.Opportunity__c = opp.Id;
        wrkordr.WorkTypeid = wrk.id;
        wrkordr.Contactid = con.Id;
        wrkordr.Subject = wrk.Name;
        wrkordr.Security_Doors__c = 1;
        wrkordr.Flyscreen_Window_or_Door__c = 1;
        wrkordr.Steel_Door_Windows__c = 1;
        wrkordr.Security_Screens__c = 1;
        wrkordr.Flyscreen_Retractable__c = 1;
        wrkordr.Diamond_Grille__c = 1;
  
        insert wrkordr;
        
           OperatingHours  ophr = new OperatingHours();
           ophr.Name = 'Sales Reps Calendar';
           ophr.TimeZone = 'Australia/Sydney';
           insert ophr;
           
           ServiceTerritory st = new ServiceTerritory();
           st.Name = 'test territory';
           st.OperatingHoursId = ophr.Id;
           st.IsActive = true;
           insert st;
           
           ServiceResource src = new ServiceResource();
           src.Name = 'test name';
           src.RelatedRecordId = testUser.Id;
           src.IsActive = true;
           insert src;
           
           ServiceTerritoryMember stm = new ServiceTerritoryMember();
           stm.ServiceTerritoryId = st.Id;
           stm.EffectiveStartDate = system.now();
           stm.EffectiveEndDate = system.now().addDays(10);
           stm.OperatingHoursId = ophr.Id;
           stm.ServiceResourceId = src.Id;
           stm.TerritoryType = 'P';
           insert stm;
           
           ServiceAppointment  servs = new ServiceAppointment();
           servs.DueDate = System.Today()+50;
           servs.EarliestStartTime = System.Now();
           servs.ParentRecordId = wrkordr.Id;
           servs.ArrivalWindowStartTime = system.now();
           servs.ArrivalWindowEndTime = system.now().addDays(10);
           servs.SchedStartTime = system.now();
           servs.SchedEndTime = system.now().addDays(10);
           servs.ServiceTerritoryId = st.Id;
           insert servs;
           
           AssignedResource ar = new AssignedResource();
           ar.ServiceAppointmentId = servs.Id;
           ar.ServiceResourceId = src.Id;
           insert ar;
        
        List<Workorder> lstWrkOrdr1 = [Select Id,city,State,street,postalcode,Latitude,Longitude,GeocodeAccuracy from Workorder where Id=: wrkordr.Id];
        
        
        FSL__Scheduling_Policy__c fsl = new FSL__Scheduling_Policy__c();
        fsl.Name = 'High Intensity';
        insert fsl;
        
        Custom_Service_Call__c csr = new Custom_Service_Call__c();
        csr.Name = 'Service Call';
        csr.ClientId__c = '3MVG99S6MzYiT5k9F3kCT3qclTCB5TLiiPu0s8R6tKtDWpWtANl6Z2lpgIWnFkmItpXh1CaxWaUmwvasIomVb';
        csr.Client_Secret__c = '2645737069529832656';
        csr.Password_With_Token__c = 'SpScreens228vr8iCZapH8vl5k8DohzBXS';
        csr.User_Name__c = 'danielle@spscreens.com.au.resdev';
        csr.End_Point_Url__c = 'https://test.salesforce.com/services/oauth2/token';
        insert csr;
        
        test.Starttest();
        
            Test.setCurrentPageReference(new PageReference('Page.spscreenvfv2')); 
            System.currentPageReference().getParameters().put('wrdOrdrId', wrkordr.Id);
            System.currentPageReference().getParameters().put('oppId', opp.Id);
            System.currentPageReference().getParameters().put('pageNum', '4');
            Test.setMock(HttpCalloutMock.class, new MockHttpResponses());
            ServiceResponse rsc = new ServiceResponse();
            
            spscreenv2 spv = new spscreenv2();
            spv.getAppointmentslots();
            spv.bookappointment();
           
            //ScheduleAppointment_wrapper obj_ScheduleAppointment_wrapper = new ScheduleAppointment_wrapper();
            spv.obj_ScheduleAppointment_wrapper.FirstName = 'test';
            spv.obj_ScheduleAppointment_wrapper.LastName = 'test';
            spv.obj_ScheduleAppointment_wrapper.MobilePhone = '1234567890';
            spv.obj_ScheduleAppointment_wrapper.HomePhone = '1234567890';
            spv.obj_ScheduleAppointment_wrapper.Email = 'Dhrudeep@resonantcloud.info';
            spv.obj_ScheduleAppointment_wrapper.State = 'gujarat';
            spv.obj_ScheduleAppointment_wrapper.Suburb = 'ahmedabad';
            spv.obj_ScheduleAppointment_wrapper.PostalCode = '380007';            
            spv.obj_ScheduleAppointment_wrapper.StreetAddress = 'test';
            spv.getStates();
            spv.getContactfromEmail();
            spv.getLocationData(lstWrkOrdr1[0].ID);
            spv.createAccount();
            spv.createContact(acc);
            spv.createWorkorder();
          //  spv.getAppointmentslots();
            spv.moveToStep3();
            spv.moveToStep4();
            spv.moveToStep2FromStep3();
            spv.moveToStep1FromStep2();
            spv.setForm1Values();
            spv.setForm2Values();
            spv.updateworkorder();
            spv.getTerrMap();
           //spv.cancelAppointment();
           // spv.makeWebServiceCall();
            
        test.Stoptest();
        }
    }
    
     static testMethod void spscreenv212() {
        
        Account acc = new Account();
        acc.Name = 'test';
        insert acc;
        
        Opportunity opp = new Opportunity();
        opp.Name = 'test';
        opp.Accountid = acc.Id;
        opp.StageName = 'close won';
        opp.CloseDate = System.Today();
        insert opp;
        
        WorkType wrk = new WorkType();
        wrk.Name = 'Free Consultation';
        wrk.EstimatedDuration = 5;
        wrk.DurationType = 'Hours';
        insert wrk;
       
        test.Starttest();
            spscreenv2 spv = new spscreenv2();
            spv.obj_ScheduleAppointment_wrapper.FirstName = 'test';
            spv.obj_ScheduleAppointment_wrapper.LastName = 'test';
            spv.obj_ScheduleAppointment_wrapper.MobilePhone = '1234567890';
            spv.obj_ScheduleAppointment_wrapper.HomePhone = '1234567890';
            spv.obj_ScheduleAppointment_wrapper.Email = 'Dhrudeep@resonantcloud.info';
            spv.obj_ScheduleAppointment_wrapper.State = 'gujarat';
            spv.obj_ScheduleAppointment_wrapper.Suburb = 'ahmedabad';
            spv.obj_ScheduleAppointment_wrapper.PostalCode = '380007';            
            spv.obj_ScheduleAppointment_wrapper.StreetAddress = 'test';
            
            //ScheduleAppointment_wrapper obj_ScheduleAppointment_wrapper = new ScheduleAppointment_wrapper();
            
            // spv.getStates();
            spv.getContactfromEmail();
            
        test.Stoptest();
    }
    
    static testMethod void spscreenv21() {
        
         Account acc = new Account();
        acc.Name = 'test';
        insert acc;
        
        Contact con = new Contact();
        con.FirstName = 'test';
        con.LastName = 'test';
        con.AccountId = acc.Id;
        con.MailingCity = 'test';
        con.MailingState = 'test';
        con.MailingCountry = 'test';
        con.MailingPostalcode = '5261';
        con.MailingStreet = 'test';
        insert con;
        
        Opportunity opp = new Opportunity();
        opp.Name = 'test';
        opp.Accountid = acc.Id;
        opp.StageName = 'close won';
        opp.CloseDate = System.Today();
        opp.Contact__c = con.Id;
        insert opp;
    
        WorkType wrk = new WorkType();
        wrk.Name = 'Free Consultation';
        wrk.EstimatedDuration = 5;
        wrk.DurationType = 'Hours';
        insert wrk;
        
        Workorder wrkordr = new Workorder();
        wrkordr.city = 'sydney';
        wrkordr.State = 'New South Wales';
        wrkordr.street = 'test';
        wrkordr.postalcode = '2000';
        wrkordr.Opportunity__c = opp.Id;
        wrkordr.WorkTypeid = wrk.id;
        wrkordr.Contactid = con.Id;
        wrkordr.Subject = wrk.Name;
        insert wrkordr;
        
        
        List<Workorder> lstWrkOrdr1 = [Select Id,city,State,street,postalcode,Latitude,Longitude,GeocodeAccuracy from Workorder where Id=: wrkordr.Id];
       
        test.Starttest();
        
            Test.setCurrentPageReference(new PageReference('Page.spscreenvfv2')); 
            System.currentPageReference().getParameters().put('cntId',con.Id );
            System.currentPageReference().getParameters().put('actId', Acc.Id);
            System.currentPageReference().getParameters().put('wrdOrdrId', wrkordr.Id);
         
           
            spscreenv2 spv = new spscreenv2();
            
            
            spv.obj_ScheduleAppointment_wrapper.FirstName = 'test';
            spv.obj_ScheduleAppointment_wrapper.LastName = 'test';
            spv.obj_ScheduleAppointment_wrapper.MobilePhone = '1234567890';
            spv.obj_ScheduleAppointment_wrapper.HomePhone = '1234567890';
            spv.obj_ScheduleAppointment_wrapper.Email = 'Dhrudeep@resonantcloud.info';
            spv.obj_ScheduleAppointment_wrapper.State = 'gujarat';
            spv.obj_ScheduleAppointment_wrapper.Suburb = 'ahmedabad';
            spv.obj_ScheduleAppointment_wrapper.PostalCode = '380007';            
            spv.obj_ScheduleAppointment_wrapper.StreetAddress = 'test';
            
            //ScheduleAppointment_wrapper obj_ScheduleAppointment_wrapper = new ScheduleAppointment_wrapper();
            
            // spv.getStates();
            spv.getContactfromEmail();
            
        test.Stoptest();
    }
    
    static testMethod void spscreenv12() {
        
        Profile pf = [SELECT Id FROM Profile WHERE Name = 'System Administrator'];
       
       //create userrole for to create user in test class
       UserRole ur = new UserRole(Name = 'International');
       insert ur;
       
       //create user in test class
       User testUser = new User(alias = 'u1', 
                                email='u1@testorg.com',
                                emailencodingkey='UTF-8', 
                                lastname='Testing', 
                                languagelocalekey='en_US',
                                localesidkey='en_US', 
                                UserRoleId = ur.Id, 
                                ProfileId = pf.Id,
                                country='United States',
                                timezonesidkey='America/Los_Angeles', 
                                username='u112@testorg.com');
       
       insert testUser;

System.runas(testUser){
        Account acc = new Account();
        acc.Name = 'test';
        insert acc;
        
        Contact con = new Contact();
        con.FirstName = 'test';
        con.LastName = 'test';
        con.AccountId = acc.Id;
        con.MailingCity = 'test';
        con.MailingState = 'test';
        con.MailingCountry = 'test';
        con.MailingPostalcode = '5261';
        con.MailingStreet = 'test';
        insert con;
        
        Opportunity opp = new Opportunity();
        opp.Name = 'test';
        opp.Accountid = acc.Id;
        opp.StageName = 'close won';
        opp.CloseDate = System.Today();
        opp.Contact__c = con.Id;
        insert opp;
    
    Opportunity opp1 = new Opportunity();
        opp1.Name = 'test 1';
        opp1.Accountid = acc.Id;
        opp1.StageName = 'close won';
        opp1.CloseDate = System.Today();
        opp1.Contact__c = con.Id;
        insert opp1;
    
        WorkType wrk = new WorkType();
        wrk.Name = 'Free Consultation';
        wrk.EstimatedDuration = 5;
        wrk.DurationType = 'Hours';
        insert wrk;
        
        Workorder wrkordr = new Workorder();
        wrkordr.city = 'sydney';
        wrkordr.State = 'New South Wales';
        wrkordr.street = 'test';
        wrkordr.postalcode = '2000';
        wrkordr.Opportunity__c = opp.Id;
        wrkordr.WorkTypeid = wrk.id;
        wrkordr.Contactid = con.Id;
        wrkordr.Subject = wrk.Name;
        insert wrkordr;
        
           OperatingHours  ophr = new OperatingHours();
           ophr.Name = 'Sales Reps Calendar';
           ophr.TimeZone = 'Australia/Sydney';
           insert ophr;
           
           ServiceTerritory st = new ServiceTerritory();
           st.Name = 'test territory';
           st.OperatingHoursId = ophr.Id;
           st.IsActive = true;
           insert st;
           
           ServiceResource src = new ServiceResource();
           src.Name = 'test name';
           src.RelatedRecordId = testUser.Id;
           src.IsActive = true;
           insert src;
           
           ServiceTerritoryMember stm = new ServiceTerritoryMember();
           stm.ServiceTerritoryId = st.Id;
           stm.EffectiveStartDate = system.now();
           stm.EffectiveEndDate = system.now().addDays(10);
           stm.OperatingHoursId = ophr.Id;
           stm.ServiceResourceId = src.Id;
           stm.TerritoryType = 'P';
           insert stm;
           
           ServiceAppointment  servs = new ServiceAppointment();
           servs.DueDate = System.Today()+50;
           servs.EarliestStartTime = System.Now();
           servs.ParentRecordId = wrkordr.Id;
           servs.ArrivalWindowStartTime = system.now();
           servs.ArrivalWindowEndTime = system.now().addDays(10);
           servs.SchedStartTime = system.now();
           servs.SchedEndTime = system.now().addDays(10);
           servs.ServiceTerritoryId = st.Id;
           insert servs;
           
           AssignedResource ar = new AssignedResource();
           ar.ServiceAppointmentId = servs.Id;
           ar.ServiceResourceId = src.Id;
           insert ar;
        
        List<Workorder> lstWrkOrdr1 = [Select Id,city,State,street,postalcode,Latitude,Longitude,GeocodeAccuracy from Workorder where Id=: wrkordr.Id];
        
        
        FSL__Scheduling_Policy__c fsl = new FSL__Scheduling_Policy__c();
        fsl.Name = 'High Intensity';
        insert fsl;
        
        Custom_Service_Call__c csr = new Custom_Service_Call__c();
        csr.Name = 'Service Call';
        csr.ClientId__c = '3MVG99S6MzYiT5k9F3kCT3qclTCB5TLiiPu0s8R6tKtDWpWtANl6Z2lpgIWnFkmItpXh1CaxWaUmwvasIomVb';
        csr.Client_Secret__c = '2645737069529832656';
        csr.Password_With_Token__c = 'SpScreens228vr8iCZapH8vl5k8DohzBXS';
        csr.User_Name__c = 'danielle@spscreens.com.au.resdev';
        csr.End_Point_Url__c = 'https://test.salesforce.com/services/oauth2/token';
        insert csr;
        
        
        
            Test.setCurrentPageReference(new PageReference('Page.spscreenvfv2')); 
            System.currentPageReference().getParameters().put('wrdOrdrId', wrkordr.Id);
            System.currentPageReference().getParameters().put('oppId', opp.Id);
            System.currentPageReference().getParameters().put('cntId', con.Id);
            System.currentPageReference().getParameters().put('actId', acc.Id);
            Test.setMock(HttpCalloutMock.class, new MockHttpResponses());
            ServiceResponse rsc = new ServiceResponse();
            
            spscreenv2 spv = new spscreenv2();
            //spv.getAppointmentslots();
            //spv.bookappointment();
           
            //ScheduleAppointment_wrapper obj_ScheduleAppointment_wrapper = new ScheduleAppointment_wrapper();
            spv.obj_ScheduleAppointment_wrapper.FirstName = 'test';
            spv.obj_ScheduleAppointment_wrapper.LastName = 'test';
            spv.obj_ScheduleAppointment_wrapper.MobilePhone = '1234567890';
            spv.obj_ScheduleAppointment_wrapper.HomePhone = '1234567890';
            spv.obj_ScheduleAppointment_wrapper.Email = 'Dhrudeep@resonantcloud.info';
            spv.obj_ScheduleAppointment_wrapper.State = 'gujarat';
            spv.obj_ScheduleAppointment_wrapper.Suburb = 'ahmedabad';
            spv.obj_ScheduleAppointment_wrapper.PostalCode = '380007';            
            spv.obj_ScheduleAppointment_wrapper.StreetAddress = 'test';
            
            
            
           spv.cancelAppointment();
            
        
        }
    }
    
    static testMethod void spscreenv22() {
        
        Profile pf = [SELECT Id FROM Profile WHERE Name = 'System Administrator'];
       
       //create userrole for to create user in test class
       UserRole ur = new UserRole(Name = 'International');
       insert ur;
       
       //create user in test class
       User testUser = new User(alias = 'u1', 
                                email='u1@testorg.com',
                                emailencodingkey='UTF-8', 
                                lastname='Testing', 
                                languagelocalekey='en_US',
                                localesidkey='en_US', 
                                UserRoleId = ur.Id, 
                                ProfileId = pf.Id,
                                country='United States',
                                timezonesidkey='America/Los_Angeles', 
                                username='u1345435@testorg.com');
       
       insert testUser;

System.runas(testUser){
        Account acc = new Account();
        acc.Name = 'test';
        insert acc;
        
        Contact con = new Contact();
        con.FirstName = 'test';
        con.LastName = 'test';
        con.AccountId = acc.Id;
        con.MailingCity = 'test';
        con.MailingState = 'test';
        con.MailingCountry = 'test';
        con.MailingPostalcode = '5261';
        con.MailingStreet = 'test';
        con.email = 'abchd@hfhf.com';
        insert con;
        
        Lead l =new Lead();
        l.Company = 'test';
        l.email = 'abchd@hfhf.com';
        l.LastName = 'test last name';
        insert l;
             
        Opportunity opp = new Opportunity();
        opp.Name = 'test';
        opp.Accountid = acc.Id;
        opp.StageName = 'close won';
        opp.CloseDate = System.Today();
        opp.Contact__c = con.Id;
        insert opp;
    
    Opportunity opp1 = new Opportunity();
    opp1.Name = 'test 1';
    opp1.Accountid = acc.Id;
    opp1.StageName = 'close won';
    opp1.CloseDate = System.Today();
    opp1.Contact__c = con.Id;
    insert opp1;
    
        WorkType wrk = new WorkType();
        wrk.Name = 'Free Consultation';
        wrk.EstimatedDuration = 5;
        wrk.DurationType = 'Hours';
        insert wrk;
        
        Workorder wrkordr = new Workorder();
        wrkordr.city = 'sydney';
        wrkordr.State = 'New South Wales';
        wrkordr.street = 'test';
        wrkordr.postalcode = '2000';
        wrkordr.Opportunity__c = opp.Id;
        wrkordr.WorkTypeid = wrk.id;
        wrkordr.Contactid = con.Id;
        wrkordr.Subject = wrk.Name;
        wrkordr.Security_Doors__c = 1;
        wrkordr.Flyscreen_Window_or_Door__c = 1;
        wrkordr.Steel_Door_Windows__c = 1;
        wrkordr.Security_Screens__c = 1;
        wrkordr.Flyscreen_Retractable__c = 1;
        wrkordr.Diamond_Grille__c = 1;
        insert wrkordr;
        
           OperatingHours  ophr = new OperatingHours();
           ophr.Name = 'Sales Reps Calendar';
           ophr.TimeZone = 'Australia/Sydney';
           insert ophr;
           
           ServiceTerritory st = new ServiceTerritory();
           st.Name = 'test territory';
           st.OperatingHoursId = ophr.Id;
           st.IsActive = true;
           insert st;
           
           ServiceResource src = new ServiceResource();
           src.Name = 'test name';
           src.RelatedRecordId = testUser.Id;
           src.IsActive = true;
           insert src;
           
           ServiceTerritoryMember stm = new ServiceTerritoryMember();
           stm.ServiceTerritoryId = st.Id;
           stm.EffectiveStartDate = system.now();
           stm.EffectiveEndDate = system.now().addDays(10);
           stm.OperatingHoursId = ophr.Id;
           stm.ServiceResourceId = src.Id;
           stm.TerritoryType = 'P';
           insert stm;
           
           ServiceAppointment  servs = new ServiceAppointment();
           servs.DueDate = System.Today()+50;
           servs.EarliestStartTime = System.Now();
           servs.ParentRecordId = wrkordr.Id;
           servs.ArrivalWindowStartTime = system.now();
           servs.ArrivalWindowEndTime = system.now().addDays(10);
           servs.SchedStartTime = system.now();
           servs.SchedEndTime = system.now().addDays(10);
           servs.ServiceTerritoryId = st.Id;
           insert servs;
           
           AssignedResource ar = new AssignedResource();
           ar.ServiceAppointmentId = servs.Id;
           ar.ServiceResourceId = src.Id;
           insert ar;
        
        List<Workorder> lstWrkOrdr1 = [Select Id,city,State,street,postalcode,Latitude,Longitude,GeocodeAccuracy from Workorder where Id=: wrkordr.Id];
        
        
        FSL__Scheduling_Policy__c fsl = new FSL__Scheduling_Policy__c();
        fsl.Name = 'High Intensity';
        insert fsl;
        
        Custom_Service_Call__c csr = new Custom_Service_Call__c();
        csr.Name = 'Service Call';
        csr.ClientId__c = '3MVG99S6MzYiT5k9F3kCT3qclTCB5TLiiPu0s8R6tKtDWpWtANl6Z2lpgIWnFkmItpXh1CaxWaUmwvasIomVb';
        csr.Client_Secret__c = '2645737069529832656';
        csr.Password_With_Token__c = 'SpScreens228vr8iCZapH8vl5k8DohzBXS';
        csr.User_Name__c = 'danielle@spscreens.com.au.resdev';
        csr.End_Point_Url__c = 'https://test.salesforce.com/services/oauth2/token';
        insert csr;
        
        
        
            Test.setCurrentPageReference(new PageReference('Page.spscreenvfv2')); 
            System.currentPageReference().getParameters().put('wrdOrdrId', wrkordr.Id);
            System.currentPageReference().getParameters().put('oppId', opp.Id);
            System.currentPageReference().getParameters().put('cntId', con.Id);
            System.currentPageReference().getParameters().put('actId', acc.Id);
            Test.setMock(HttpCalloutMock.class, new MockHttpResponses());
            ServiceResponse rsc = new ServiceResponse();
            
            spscreenv2 spv = new spscreenv2();
            //spv.getAppointmentslots();
            //spv.bookappointment();
           
            //ScheduleAppointment_wrapper obj_ScheduleAppointment_wrapper = new ScheduleAppointment_wrapper();
            spv.obj_ScheduleAppointment_wrapper.FirstName = 'test';
            spv.obj_ScheduleAppointment_wrapper.LastName = 'test';
            spv.obj_ScheduleAppointment_wrapper.MobilePhone = '1234567890';
            spv.obj_ScheduleAppointment_wrapper.HomePhone = '1234567890';
            spv.obj_ScheduleAppointment_wrapper.Email = 'Dhrudeep@resonantcloud.info';
            spv.obj_ScheduleAppointment_wrapper.State = 'gujarat';
            spv.obj_ScheduleAppointment_wrapper.Suburb = 'ahmedabad';
            spv.obj_ScheduleAppointment_wrapper.PostalCode = '380007';            
            spv.obj_ScheduleAppointment_wrapper.StreetAddress = 'test';
            
            
            
           spv.cancelAppointment();
            
        
        }
    }
}