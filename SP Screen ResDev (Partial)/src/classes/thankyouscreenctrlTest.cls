@IsTest
public class thankyouscreenctrlTest {
    public static testmethod void method1(){
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
                                 username='u1543546@testorg.com');
        
        insert testUser;
        
        system.runAs(testUser){
            Account act = new Account();
            act.Name = 'test name';
            insert act;
            
            Contact cnt = new Contact();
            cnt.AccountId = act.Id;
            cnt.LastName = 'test last';
            cnt.MailingStreet = 'test street';
            cnt.MailingCity = 'sydney';
            cnt.MailingState = 'NSW';
            cnt.MailingPostalCode = '2000';
            insert cnt;
            
            Opportunity opp = new Opportunity();
            opp.Contact__c = cnt.Id;
            opp.AccountId = act.Id;
            opp.Name = 'test opportunity';
            opp.StageName = 'Enquiry';
            opp.CloseDate = System.today();
            insert opp;
            
            WorkType wt = new WorkType();
            wt.EstimatedDuration = 25;
            wt.Name = 'Installation';
            insert wt;
            
            WorkOrder wrd = new WorkOrder();
            wrd.Opportunity__c = opp.Id;
            wrd.AccountId = act.Id;
            wrd.ContactId = cnt.Id;
            wrd.WorkTypeId = wt.Id;
            insert wrd;
            
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
            servs.ParentRecordId = wrd.Id;
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
            
            ApexPages.currentPage().getParameters().put('wrdOrdrId',wrd.Id);
            ApexPages.currentPage().getParameters().put('cntId',cnt.Id);
            
            thankyouscreenctrl tc = new thankyouscreenctrl();
            tc.assignResource();
        }
    }
}