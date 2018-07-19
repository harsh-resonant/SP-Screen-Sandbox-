global with sharing class spscreenv1
{
    public Integer propmovebackwardtostep1 {get;set;}
    public Integer propmovebackwardtostep2 {get;set;}
    public Integer propmoveforwardtostep2 {get;set;}
    public Integer propmoveforwardtostep3 {get;set;}    
    public Integer currentprop {get;set;}
    public List<PostalCodes__c> obj_list_PostalCodes {get;set;}
    public String Current_postalcode_and_area  {get;set;}
    public Opportunity obj_currentOpportunity  {get;set;} 
    public ScheduleAppointment_wrapper obj_ScheduleAppointment_wrapper {get;set;}
    public String WorkOrder_devRecordTypeId {get;set;}
    public WorkOrder obj_currentworkorder {get;set;}
    public List<WorkType> obj_currentworktype {get;set;}
    public List<FSL.AppointmentBookingSlot> slots {get;set;}
    public List<SlotWrapper> obj_list_slot {get;set;}
    public String index {get;set;}
    public ServiceAppointment sa {get;set;}
    public String schedulingPolicyId {get;set;}
    public List<FSL.TimeInterval> timeinterval {get;set;}
    public Contact obj_currentcontact{get;set;}
    public SlotWrapper obj_current_slotwrapper {get;set;}
    
    public AssignedResource obj_currentresource  {get;set;}
    public spscreenv1()
    {
        currentprop = 1;
        obj_currentresource = new AssignedResource();
        obj_currentcontact = new Contact();
        obj_list_PostalCodes  = new List<PostalCodes__c>();
        obj_currentOpportunity  = new Opportunity();
        obj_currentworkorder  = new WorkOrder();
        obj_currentworktype = new List<WorkType>();
        slots =  new List<FSL.AppointmentBookingSlot>();
        obj_list_slot = new List<SlotWrapper>();
        timeinterval = new List<FSL.TimeInterval>();
        obj_current_slotwrapper  = new SlotWrapper();
        getworktype();
        WorkOrder_devRecordTypeId = Schema.SObjectType.WorkOrder.getRecordTypeInfosByName().get('Sales Quote').getRecordTypeId();
        sa = new ServiceAppointment();
        
        obj_ScheduleAppointment_wrapper  = new ScheduleAppointment_wrapper();
    }
    public void movebackwardtostep1()
    {
        // from 2 to 1 works on step 2 for prev
        currentprop =1;
    
    }
    public void movebackwardtostep2()
    {
        currentprop =2;
        // from 3 to 2 works on step 3 for prev
         
    }
    public List<SelectOption> getbindpostalcode()
    {
        List<SelectOption> options = new List<SelectOption>();
        obj_list_PostalCodes  = [select Name,Code__c,Name_And_Code__c from PostalCodes__c];
        if((obj_list_PostalCodes!=null)&&(obj_list_PostalCodes.size()>0))
        {
            for(PostalCodes__c obj:obj_list_PostalCodes)
            {
               options.add(new SelectOption(obj.Name,obj.Name_And_Code__c)); 
            }
        }
        return options;
            
        
    }
    public void getAppointmentslots()
    {
        OperatingHours abOperatingHours = [SELECT Name, Id, (SELECT EndTime, StartTime, Type, DayOfWeek FROM TimeSlots) FROM OperatingHours WHERE Name = 'Gold Appointments Calendar' limit 1];
        sa = [Select id, EarliestStartTime, DueDate from ServiceAppointment where ParentRecord.id=:obj_currentworkorder.id limit 1];
        //schedulingPolicyId=[select id from FSL__Scheduling_Policy__c where Name='Customer first' limit 1].Id;
        schedulingPolicyId=[select id from FSL__Scheduling_Policy__c where Name='High Intensity' limit 1].Id;        
        Timezone tz = UserInfo.getTimeZone();
        slots = FSL.AppointmentBookingService.GetSlots(sa.Id, schedulingPolicyId, abOperatingHours, tz,  'SORT_BY_DATE', false);
          
        if((slots!=null)&&(slots.size()>0))
        {
            for(Integer i =0;i<slots.size();i++)
            {
                 
                UniqueIdGenerator obj_UniqueIdGenerator = new UniqueIdGenerator();                  
                SlotWrapper obj_slot = new SlotWrapper();
                Datetime mydatetime1 = slots[i].Interval.Start;
                Datetime mydatetime2 = slots[i].Interval.Finish;
                obj_slot.Startdatetime =slots[i].Interval.Start;
                obj_slot.Enddatetime =  slots[i].Interval.Finish;
                obj_slot.SlotDatefull = String.valueOf(mydatetime1.format('EEEE MMM dd  yyyy')); 
                obj_slot.SlotDate = Date.newInstance(mydatetime1.year(),mydatetime1.month(),mydatetime1.day());
                obj_slot.Datetoshow = mydatetime1.format('d-MM-YYYY'); 
                obj_slot.SlotDatetime = mydatetime1;
                obj_slot.endSlotDatetime= mydatetime2;
                obj_slot.Endtime = String.valueOf(mydatetime2.format('h:mm a'));
                obj_slot.Starttime = String.valueOf(mydatetime1.format('h:mm a'));
                obj_slot.Slotid = obj_UniqueIdGenerator.generateRandomString(15);
                obj_list_slot.add(obj_slot); 
            }
        }        
               
    }
    public void getresource()
    {
       obj_currentresource = [select id,ServiceAppointmentId,ServiceResourceId, ServiceResource.Name from AssignedResource where ServiceAppointmentId =:sa.id limit 1];
    } 
    
    public void bookappointment()
    {
    
        Timezone tz = UserInfo.getTimeZone();
        System.debug('tz :- '+ tz);
        for(SlotWrapper obj :obj_list_slot)
        {
            if(obj.Slotid==index)
            {
                obj_current_slotwrapper=obj;
                break;
            }
        }
        obj_ScheduleAppointment_wrapper.dateandtime = obj_current_slotwrapper.SlotDatefull;
       currentprop =4;
       obj_currentOpportunity.StageName= 'Appointment booked';
       obj_currentOpportunity.Appointment_Date__c = Date.newInstance(obj_current_slotwrapper.Startdatetime.year(),obj_current_slotwrapper.Startdatetime.month(),obj_current_slotwrapper.Startdatetime.day());
       update obj_currentOpportunity;
       System.Debug('obj_currentOpportunity :-'+obj_currentOpportunity);
        System.Debug('obj_current_slotwrapper '+obj_current_slotwrapper);
        sa.ArrivalWindowStartTime = obj_current_slotwrapper.Startdatetime.addSeconds(tz.getOffset(obj_current_slotwrapper.Startdatetime) / -1000);
        sa.ArrivalWindowEndTime = obj_current_slotwrapper.Enddatetime.addSeconds(tz.getOffset(obj_current_slotwrapper.Enddatetime) / -1000);
        update sa;
        FSL.ScheduleResult scheduleResult = FSL.ScheduleService.Schedule(schedulingPolicyId, sa.Id);
        if (scheduleResult != null)
        {
            System.debug('SA was scheduled successfully on: ' + scheduleResult.Service.SchedStartTime + ' GMT');
        }
        else
        {
            System.debug('Service was not scheduled.');
        } 
       
       
       getresource();
      
    }
    public void moveforwardtostep2()
    {
        
        currentprop =2;
       getContactfromEmail();
        
        // from 1 to 2 works on step 1 next
        
    }
    public void movebackwardtostep3()
    {
        currentprop =3;
        // from 4 to 3 works on step 4 for prev
         
    }
    public void moveforwardtostep3()
    {
        currentprop =3;
        addpromocode();
        
        // from 2 to 3 works on step 2 next
        
    }
    public void moveforwardtostep4()
    {
        System.Debug('index :- '+index);
        currentprop =4;
        //bookappointment();
        // from 3 to 4
        
    }
    public void getworktype()
    {
        obj_currentworktype = [Select ID,name from WorkType where name=:'Measure and Quote'];
        
    }
    public void getContactfromEmail()
    {
        
        List<Contact> obj_current_contact = new List<Contact>();
       
        obj_current_contact = [select id,Firstname,Lastname,Account.id,Account.name from Contact where Email=:obj_ScheduleAppointment_wrapper.Email OR (Firstname=:obj_ScheduleAppointment_wrapper.FirstName and Lastname=:obj_ScheduleAppointment_wrapper.LastName) limit 1];
        System.debug('Contact is ' + obj_current_contact);
        if((obj_current_contact!=null)&&(obj_current_contact.size()>0))
        {
            if(obj_ScheduleAppointment_wrapper.HomePhone != null && obj_ScheduleAppointment_wrapper.HomePhone.trim() != ''){
                obj_current_contact[0].Phone = obj_ScheduleAppointment_wrapper.HomePhone;
                obj_current_contact[0].HomePhone = obj_ScheduleAppointment_wrapper.HomePhone;
            }
            obj_current_contact[0].MobilePhone = obj_ScheduleAppointment_wrapper.MobilePhone;
            obj_current_contact[0].MailingState = obj_ScheduleAppointment_wrapper.State;
            obj_current_contact[0].MailingCity= obj_ScheduleAppointment_wrapper.Suburb;
            obj_current_contact[0].MailingPostalCode= obj_ScheduleAppointment_wrapper.PostalCode;            
            obj_current_contact[0].MailingStreet = obj_ScheduleAppointment_wrapper.StreetAddress;
            
            update obj_current_contact;
            
            Account obj_current_account = new Account();
            obj_current_account.id= obj_current_contact[0].Account.id;
            obj_current_account.name = obj_current_contact[0].Account.name;
            
            //Update account address
            obj_current_account.Phone = obj_ScheduleAppointment_wrapper.MobilePhone;
            obj_current_account.BillingCity=obj_ScheduleAppointment_wrapper.Suburb;
            obj_current_account.BillingState=obj_ScheduleAppointment_wrapper.State;
            obj_current_account.BillingPostalCode=obj_ScheduleAppointment_wrapper.PostalCode;
            obj_current_account.BillingStreet=obj_ScheduleAppointment_wrapper.StreetAddress;
            update obj_current_account;

            // create opportunity 
            createOpportunity(obj_current_contact[0],obj_current_account,'Existing Business');
            
        }
        else
        {
            // create new Account and  contact and Opportunity
            List<Account> obj_account_list1 = new List<Account>();
            obj_account_list1 = [select id,name from Account where name=:obj_ScheduleAppointment_wrapper.FirstName +' '+obj_ScheduleAppointment_wrapper.LastName limit 1];
            system.debug('*********' + obj_account_list1);
            if((obj_account_list1!=null)&&(obj_account_list1.size()>0))
            {
                createContact(obj_account_list1[0]);
            }
            else
            {
                createAccount();
            }
             
        }
    }
    public void createOpportunity(Contact objcontact,Account objaccount ,String Type)
    {
            Date mydate = System.today();
            mydate = mydate.addDays(7);
            obj_currentcontact=objcontact;
            Opportunity obj_new_opportunity = new Opportunity();
            obj_new_opportunity.StageName='Enquiry'; 
            obj_new_opportunity.CloseDate = mydate;
            obj_new_opportunity.Name = objaccount.name; // need to be changed            
            obj_new_opportunity.Type =Type;
            obj_new_opportunity.Contact__c =objcontact.id;
            obj_new_opportunity.Accountid= objaccount.id;
            if((obj_new_opportunity.id==null)||(obj_new_opportunity.id==''))
            {
                insert obj_new_opportunity;
            }
            
            obj_currentOpportunity = obj_new_opportunity;
            createWorkorder();
    }
    public void createAccount()
    {
        if(obj_ScheduleAppointment_wrapper!=null)
        {
            // insert account 
            
            Account obj_account = new Account();
            obj_account.name=obj_ScheduleAppointment_wrapper.FirstName +' '+obj_ScheduleAppointment_wrapper.LastName;
            obj_account.Phone = obj_ScheduleAppointment_wrapper.MobilePhone;
            obj_account.BillingCity=obj_ScheduleAppointment_wrapper.Suburb;
            obj_account.BillingState=obj_ScheduleAppointment_wrapper.State;
            obj_account.BillingPostalCode=obj_ScheduleAppointment_wrapper.PostalCode;
            obj_account.BillingStreet=obj_ScheduleAppointment_wrapper.StreetAddress;
            obj_account.AccountSource = 'SP Screens Website'; 
            system.debug(obj_account);
            if((obj_account.id==null)||(obj_account.id==''))
            {           
                insert obj_account;
            }
           /* obj_account = [Select id,name,Phone,BillingCity,BillingState,BillingPostalCode,BillingStreet from Account where Phone =:obj_ScheduleAppointment_wrapper.HomePhone limit 1];
            if(obj_account!=null)
            {
                
            }
            else
            {
                 
            }*/
            
            createContact(obj_account);                    
            
        }
    }
    public void createWorkorder()
    {
        Workorder obj_workorder = new Workorder();
        
        obj_workorder.RecordTypeId = WorkOrder_devRecordTypeId;
        obj_workorder.Opportunity__c = obj_currentOpportunity.id;
        obj_workorder.WorkTypeid = obj_currentworktype[0].id;
        obj_workorder.Contactid =obj_currentcontact.id;
        if((obj_workorder.id==null)||(obj_workorder.id==''))
        {
            insert obj_workorder;
        }
        system.debug(obj_workorder);
        obj_currentworkorder = obj_workorder;
        /*List<WorkOrder> lstWorkOrdr = [select id,Latitude,Longitude,GeocodeAccuracy from Workorder where id=: obj_currentworkorder.Id];
        system.debug(lstWorkOrdr);
        if(lstWorkOrdr != null && lstWorkOrdr.size() > 0){
            WorkOrder tempWrdOrd = lstWorkOrdr[0];
            if(tempWrdOrd.Latitude == null || tempWrdOrd.Longitude == null || tempWrdOrd.GeocodeAccuracy == null || tempWrdOrd.GeocodeAccuracy == 'Unknown'){
                currentprop = 1;
                ApexPages.Message myMsg = new ApexPages.Message(ApexPages.Severity.ERROR,'Please enter valid address');
				ApexPages.addMessage(myMsg);
            }else {
                currentprop = 2;
            }
        }*/
    }
    public void updateworkorder()
    {
        if((obj_ScheduleAppointment_wrapper.SecurityDoors!=null)&&(obj_ScheduleAppointment_wrapper.SecurityDoors!=''))
        {
            obj_currentworkorder.Security_Doors__c = Integer.valueOf(obj_ScheduleAppointment_wrapper.SecurityDoors);
        }
        if((obj_ScheduleAppointment_wrapper.FlyscreenWindoworDoor!=null)&&(obj_ScheduleAppointment_wrapper.FlyscreenWindoworDoor!=''))
        {
            obj_currentworkorder.Flyscreen_Window_or_Door__c= Integer.valueOf(obj_ScheduleAppointment_wrapper.FlyscreenWindoworDoor);
        }
        if((obj_ScheduleAppointment_wrapper.SteelDoorWindows!=null)&&(obj_ScheduleAppointment_wrapper.SteelDoorWindows!=''))
        {
            obj_currentworkorder.Steel_Door_Windows__c= Integer.valueOf(obj_ScheduleAppointment_wrapper.SteelDoorWindows);
        }
        if((obj_ScheduleAppointment_wrapper.SecurityScreens!=null)&&(obj_ScheduleAppointment_wrapper.SecurityScreens!=''))
        {
             obj_currentworkorder.Security_Screens__c= Integer.valueOf(obj_ScheduleAppointment_wrapper.SecurityScreens);
        }
        if((obj_ScheduleAppointment_wrapper.FlyscreenRetractable!=null)&&(obj_ScheduleAppointment_wrapper.FlyscreenRetractable!=''))
        {
            obj_currentworkorder.Flyscreen_Retractable__c= Integer.valueOf(obj_ScheduleAppointment_wrapper.FlyscreenRetractable);
        }
        if((obj_ScheduleAppointment_wrapper.DiamondGrille!=null)&&(obj_ScheduleAppointment_wrapper.DiamondGrille!=''))
        {
            obj_currentworkorder.Diamond_Grille__c= Integer.valueOf(obj_ScheduleAppointment_wrapper.DiamondGrille);
        }
         obj_currentworkorder.Important_Notes__c = obj_ScheduleAppointment_wrapper.ImportantNotes;
         obj_currentworkorder.Customer_onsite__c = obj_ScheduleAppointment_wrapper.confirm;
         update obj_currentworkorder;
         
    }
    public void createContact(Account obj_current_account)
    {
        if(obj_ScheduleAppointment_wrapper!=null)
        {
           
            
            // insert contact
            contact obj_contact = new contact();
            obj_contact.FirstName =obj_ScheduleAppointment_wrapper.FirstName;
            obj_contact.LastName =obj_ScheduleAppointment_wrapper.LastName;
            obj_contact.MobilePhone = obj_ScheduleAppointment_wrapper.MobilePhone;
            obj_contact.HomePhone = obj_ScheduleAppointment_wrapper.HomePhone;
            obj_contact.Phone= obj_ScheduleAppointment_wrapper.HomePhone;
            obj_contact.AccountId= obj_current_account.id;
            obj_contact.Email = obj_ScheduleAppointment_wrapper.Email;
            obj_contact.MailingState = obj_ScheduleAppointment_wrapper.State;
            obj_contact.MailingCity=obj_ScheduleAppointment_wrapper.Suburb;
            obj_contact.MailingCountry = 'Australia';
            obj_contact.MailingPostalCode=obj_ScheduleAppointment_wrapper.PostalCode;            
            obj_contact.MailingStreet = obj_ScheduleAppointment_wrapper.StreetAddress;
            if((obj_contact.id==null)||(obj_contact.id==''))
            {
                insert obj_contact;
            }            
            obj_currentcontact = obj_contact;
            createOpportunity(obj_contact,obj_current_account,'New Business');
            
        }
    }
    
    public void addpromocode()
    {
        getAppointmentslots();
        obj_currentOpportunity.Promo_code__c = obj_ScheduleAppointment_wrapper.PromoCode ;
        update obj_currentOpportunity;
        updateworkorder();
        
        
    }
}