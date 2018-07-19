public with sharing class spscreenv2 {
    public Account actObj;
    public Contact cntObj;
    public Opportunity oppObj;
    public WorkOrder wrkordObj;
    public ServiceAppointment saObj;
    public AssignedResource assrsrcObj;
    public String actId;
    public String cntId;
    public String oppId;
    public String wrdOrdrId;
    public ScheduleAppointment_wrapper obj_ScheduleAppointment_wrapper {get;set;}
    public List<WorkType> obj_currentworktype {get;set;}
    public String WorkOrder_devRecordTypeId {get;set;}
    public List<SlotWrapper> obj_list_slot {get;set;}
    public ServiceAppointment sa {get;set;}
    public List<FSL.AppointmentBookingSlot> slots {get;set;}
    public String schedulingPolicyId {get;set;}
    public AssignedResource obj_currentresource  {get;set;}
    public SlotWrapper obj_current_slotwrapper {get;set;}
    public String index {get;set;}
    public Wrapper wrapObj {get;set;}
    public String resrcName {get;set;}
    public String slotDate {get;set;}
    public STring displayRsrcName {get;set;}
    public List<String> AETdatetime {get;set;}
    public Custom_Service_Call__c cscObj {get;set;}
    
    public spscreenv2() {
        cscObj = Custom_Service_Call__c.getInstance('Service Call');
        AETdatetime = new List<String>();
        wrapObj = new Wrapper();
        obj_ScheduleAppointment_wrapper  = new ScheduleAppointment_wrapper();
        obj_list_slot = new List<SlotWrapper>();
        sa = new ServiceAppointment();
        slots =  new List<FSL.AppointmentBookingSlot>();
        obj_currentresource = new AssignedResource();
        saObj = new ServiceAppointment();
        assrsrcObj = new AssignedResource();
        obj_current_slotwrapper  = new SlotWrapper();

        WorkOrder_devRecordTypeId = Schema.SObjectType.WorkOrder.getRecordTypeInfosByName().get('Free Consultation').getRecordTypeId();
        obj_currentworktype = new List<WorkType>();
        obj_currentworktype = [Select ID,name,FSL_Days_to_Start__c,FSL_Days_to_Due__c from WorkType where name=:'Free Consultation'];

        if(ApexPages.currentPage().getParameters().get('actId') != null){
            actId = ApexPages.currentPage().getParameters().get('actId');
            actObj = [Select id from Account where id=: actId];
        }else{
            actObj = new Account();
        }

        if(ApexPages.currentPage().getParameters().get('cntId') != null){
            cntId = ApexPages.currentPage().getParameters().get('cntId');
            setForm1Values();
        }else{
            cntObj = new Contact();
        }

        if(ApexPages.currentPage().getParameters().get('oppId') != null){
            oppId = ApexPages.currentPage().getParameters().get('oppId');
            oppObj = [Select Id,Name from Opportunity where Id=: oppId];
        }else{
            oppObj = new Opportunity();
        }

        if(ApexPages.currentPage().getParameters().get('wrdOrdrId') != null){
            wrdOrdrId = ApexPages.currentPage().getParameters().get('wrdOrdrId');
            wrkordObj = [Select Id from WorkOrder where Id=: wrdOrdrId];
        }else{
            wrkordObj = new WorkOrder();
        }
        if(ApexPages.currentPage().getParameters().get('pageNum') != null && ApexPages.currentPage().getParameters().get('pageNum') == '4'){
            sa = [Select id, EarliestStartTime, DueDate from ServiceAppointment where ParentRecord.id=:wrdOrdrId limit 1];
        }
        if(ApexPages.currentPage().getParameters().get('pageNum') != null && ApexPages.currentPage().getParameters().get('pageNum') == '3'){
            sa = [Select id, EarliestStartTime, DueDate,ServiceTerritoryId from ServiceAppointment where ParentRecord.id=:wrdOrdrId limit 1];
            if(sa.ServiceTerritoryId != null){
            	getAppointmentslots();    
            }
        }
        if(ApexPages.currentPage().getParameters().get('pageNum') != null && ApexPages.currentPage().getParameters().get('pageNum') == '2'){
            setForm2Values();
        }
        System.debug('Account Id ::::::' + actId);
        System.debug('Contact Id ::::::' + cntId);
        System.debug('Opp Id ::::::' + oppId);
        System.debug('WorkOrder Id ::::::' + wrdOrdrId);
        
    }
    
    public List<SelectOption> getStates() {
        List<SelectOption> options = new List<SelectOption>();
        options.add(new SelectOption('0','-- Select State --'));
        options.add(new SelectOption('ACT','Australian Capital Territory'));
        options.add(new SelectOption('NSW','New South Wales'));
        options.add(new SelectOption('NT','Northern Territory'));
        options.add(new SelectOption('QLD','Queensland'));
        options.add(new SelectOption('SA','South Australia'));
        options.add(new SelectOption('TAS','Tasmania'));
        options.add(new SelectOption('VIC','Victoria'));
        options.add(new SelectOption('WA','Western Australia'));
        return options;
    }
    
    public PageReference getContactfromEmail(){
        System.debug('------Id------'+cntId+' '+actId);
        if((cntId == null || cntId.trim() == '') && (actId == null || actId.trim() == '')){
            system.debug('Inside IF :::::::::::::');
            //List<Contact> obj_current_contact = [select id,Firstname,Lastname,Account.id,Account.name,MobilePhone,MailingState,MailingCity,MailingPostalCode,MailingStreet from Contact where Email=:obj_ScheduleAppointment_wrapper.Email OR (Firstname=:obj_ScheduleAppointment_wrapper.FirstName and Lastname=:obj_ScheduleAppointment_wrapper.LastName) limit 1];
            List<Contact> obj_current_contact = [select id,Firstname,Lastname,AccountId,Account.name,MobilePhone,MailingState,MailingCity,MailingPostalCode,MailingStreet from Contact where Email != null AND Email=:obj_ScheduleAppointment_wrapper.Email Order By Createddate DESC limit 1];
            System.debug('Contact is ' + obj_current_contact);
            
            if(obj_current_contact!=null && obj_current_contact.size()>0){
                system.debug('Contact Phone' + obj_current_contact[0].MobilePhone);
                system.debug('Wrapper Phone' + obj_ScheduleAppointment_wrapper.MobilePhone);
                if(obj_current_contact[0].MobilePhone != obj_ScheduleAppointment_wrapper.MobilePhone && obj_current_contact[0].MailingState != obj_ScheduleAppointment_wrapper.State && obj_current_contact[0].MailingPostalCode != obj_ScheduleAppointment_wrapper.PostalCode && obj_current_contact[0].MailingCity.toUpperCase() != obj_ScheduleAppointment_wrapper.Suburb.toUpperCase() && obj_current_contact[0].MailingStreet.toUpperCase() != obj_ScheduleAppointment_wrapper.StreetAddress.toUpperCase()){
                    Account act = [Select Id,Name From Account where Id=: obj_current_contact[0].AccountId];
                    actId = act.Id;
					system.debug('ACCOUNT ID IS ::::::::' + actId);
                    Contact tempCnt = createContact(act);
                    cntId = tempCnt.Id;
					system.debug('CONTACT ID IS ::::::::' + cntId);
                    Opportunity tempOpp = createOpportunity(tempCnt,act,'New Business');
                    oppId = tempOpp.Id;
					system.debug('Opportunity ID IS ::::::::' + oppId);
                    Workorder tempWork = createWorkorder();
                    wrdOrdrId = tempWork.Id;
					system.debug('Workorder ID IS ::::::::' + wrdOrdrId);
                }else if(obj_current_contact[0].MobilePhone == obj_ScheduleAppointment_wrapper.MobilePhone && obj_current_contact[0].MailingState == obj_ScheduleAppointment_wrapper.State && obj_current_contact[0].MailingPostalCode == obj_ScheduleAppointment_wrapper.PostalCode && obj_current_contact[0].MailingCity.toUpperCase() == obj_ScheduleAppointment_wrapper.Suburb.toUpperCase() && obj_current_contact[0].MailingStreet.toUpperCase() == obj_ScheduleAppointment_wrapper.StreetAddress.toUpperCase()){
                    cntId = obj_current_contact[0].Id;
                    actId = obj_current_contact[0].AccountId;
                    Account act = [Select Id,Name From Account where Id=: obj_current_contact[0].AccountId];
                    updateContact(obj_current_contact[0]);
                    //Account accnt = new Account(Id= obj_current_contact[0].Account.id);
                    //accnt.name = obj_current_contact[0].Account.name;
                    //updateAccount(accnt);
                    //create opportunity 
                    if(oppId == null || oppId.trim() == ''){
                        Opportunity tempOpp = createOpportunity(obj_current_contact[0],act,'Existing Business');
                        oppId = tempOpp.Id;
                        Workorder tempWork = createWorkorder();
                        wrdOrdrId = tempWork.Id;
                    }
                }else{
					Account act = [Select Id,Name From Account where Id=: obj_current_contact[0].AccountId];
					Contact tempCnt = createContact(act);
					system.debug('Contact :::::' + tempCnt);
					cntId = tempCnt.Id;
					actId = act.Id;
					Opportunity tempOpp = createOpportunity(tempCnt,act,'New Business');
					oppId = tempOpp.Id;
					Workorder tempWork = createWorkorder();
					wrdOrdrId = tempWork.Id;
				}                            
            }else{
                // create new Account and  contact and Opportunity
                /*List<Account> obj_account_list1 = [select id,name from Account where name=:obj_ScheduleAppointment_wrapper.FirstName +' '+obj_ScheduleAppointment_wrapper.LastName limit 1];
                system.debug('*********' + obj_account_list1);
                if(obj_account_list1!=null && obj_account_list1.size() > 0){
                    Contact tempCnt = createContact(obj_account_list1[0]);
                    Opportunity tempOpp = createOpportunity(tempCnt,obj_account_list1[0],'New Business');
                    oppId = tempOpp.Id;
                    Workorder tempWork = createWorkorder();
                    wrdOrdrId = tempWork.Id;
                }*/
                Account tempAct = createAccount();
                system.debug('Account :::::' + tempAct);
                Contact tempCnt = createContact(tempAct);
                system.debug('Contact :::::' + tempCnt);
                cntId = tempCnt.Id;
                actId = tempAct.Id;
                Opportunity tempOpp = createOpportunity(tempCnt,tempAct,'New Business');
                oppId = tempOpp.Id;
                Workorder tempWork = createWorkorder();
                wrdOrdrId = tempWork.Id;
            }
        }else if(cntId != null && cntId.trim() != '' && actId != null && actId.trim() != '') {
            system.debug('Inside ELSE IF :::::::::::::');
            updateContact(cntObj);
            updateAccount(actObj);
            /*WorkOrder tempWork = new WorkOrder(Id=wrdOrdrId);
            tempWork.city = obj_ScheduleAppointment_wrapper.Suburb;
            tempWork.State = obj_ScheduleAppointment_wrapper.State;
            tempWork.street = obj_ScheduleAppointment_wrapper.StreetAddress;
            tempWork.postalcode = obj_ScheduleAppointment_wrapper.PostalCode;
            update tempWork;
            wrdOrdrId = tempWork.Id;*/
        }    
        System.debug(wrdOrdrId);
        
        //List<Workorder> lstWrkOrdr = [Select Id,city,State,street,postalcode,Latitude,Longitude,GeocodeAccuracy from Workorder where Id=: wrdOrdrId];
        //System.debug(lstWrkOrdr[0].postalcode+' '+lstWrkOrdr[0].State+' '+lstWrkOrdr[0].Latitude+' '+lstWrkOrdr[0].Longitude+' '+lstWrkOrdr[0].GeocodeAccuracy+' '+lstWrkOrdr[0].GeocodeAccuracy);
        String showErr = 'No';
        
        //----------------- New code to start validating City, postal code and Suburb ------------------
        String strState =  obj_ScheduleAppointment_wrapper.State != null  ? String.ValueOf(obj_ScheduleAppointment_wrapper.State).toUpperCase() : '';
        String strPostalCode =  obj_ScheduleAppointment_wrapper.PostalCode != null  ? String.ValueOf(obj_ScheduleAppointment_wrapper.PostalCode).toUpperCase() : '';
        String strCity =  obj_ScheduleAppointment_wrapper.Suburb != null  ? String.ValueOf(obj_ScheduleAppointment_wrapper.Suburb).toUpperCase() : '';
        
        system.debug(' three values '+ strState + ' ' + strPostalCode + ' '+ strCity);
        List<Address_Validator__c> lstAddVal = [select Id,Name from Address_Validator__c where State__c =:strState and Postal_Code__c =:strPostalCode and City__c =: strCity ]; 
        
        if(lstAddVal == null || lstAddVal.isEmpty() ){    
            showErr = 'Yes';
        }
        //------------------End of New code to start validating City, postal code and Suburb ------------
        /*if(lstWrkOrdr != null && lstWrkOrdr.size() > 0){
            system.debug('Latitude :' +lstWrkOrdr[0].Latitude );
            system.debug('Longitude :' + lstWrkOrdr[0].Longitude );
            system.debug('Accuraccy :' + lstWrkOrdr[0].GeocodeAccuracy );
            
            if(lstWrkOrdr[0].Latitude == null || lstWrkOrdr[0].Longitude == null || lstWrkOrdr[0].GeocodeAccuracy == null || lstWrkOrdr[0].GeocodeAccuracy == 'Unknown'){
                showErr = 'Yes';
            }
        }*/ 
        System.debug('Error Code ::::::::' + showErr);
        PageReference pg = Page.spscreenvfv2;
        pg.setRedirect(true);
        pg.getParameters().put('actId',actId);
        pg.getParameters().put('cntId',cntId);
        pg.getParameters().put('oppId',oppId);
        pg.getParameters().put('wrdOrdrId',wrdOrdrId);
        pg.getParameters().put('showErr',showErr);
        if(showErr == 'Yes'){
            pg.getParameters().put('pageNum','1');
        }else if(showErr == 'No'){
            pg.getParameters().put('pageNum','2');
        }        
        return pg;
    }
    
    
   public List<String> getLocationData(Id wrkordid){
        List<Workorder> lstWrkOrdr1 = [Select Id,city,State,street,postalcode,Latitude,Longitude,GeocodeAccuracy from Workorder where Id=: wrkordid];
        List<String> s = new List<String>();
        s.add(String.valueof(lstWrkOrdr1[0].Latitude));
        s.add(String.valueof(lstWrkOrdr1[0].Longitude));
        s.add(String.valueof(lstWrkOrdr1[0].GeocodeAccuracy));
        return s;
   }

    public void updateContact(Contact cnt){
        if(cnt != null){
           /* if(obj_ScheduleAppointment_wrapper.HomePhone != null && obj_ScheduleAppointment_wrapper.HomePhone.trim() != ''){
                cnt.Phone = obj_ScheduleAppointment_wrapper.HomePhone;
                cnt.HomePhone = obj_ScheduleAppointment_wrapper.HomePhone;
            }
            cnt.MobilePhone = obj_ScheduleAppointment_wrapper.MobilePhone;*/
            cnt.MailingState = obj_ScheduleAppointment_wrapper.State;
            cnt.MailingCity= obj_ScheduleAppointment_wrapper.Suburb;
            cnt.MailingPostalCode= obj_ScheduleAppointment_wrapper.PostalCode;            
            cnt.MailingStreet = obj_ScheduleAppointment_wrapper.StreetAddress;            
            update cnt;
        }
    }

    public void updateAccount(Account act){
        if(act != null){
            //Update account address
            //act.Phone = obj_ScheduleAppointment_wrapper.MobilePhone;
            act.BillingCity=obj_ScheduleAppointment_wrapper.Suburb;
            act.BillingState=obj_ScheduleAppointment_wrapper.State;
            act.BillingPostalCode=obj_ScheduleAppointment_wrapper.PostalCode;
            act.BillingStreet=obj_ScheduleAppointment_wrapper.StreetAddress;
            update act;
        }
    }

    public Account createAccount(){
        Account obj_account;
        if(obj_ScheduleAppointment_wrapper!=null){
            // insert account
            obj_account = new Account();
            obj_account.name=obj_ScheduleAppointment_wrapper.FirstName +' '+obj_ScheduleAppointment_wrapper.LastName;
            obj_account.Phone = obj_ScheduleAppointment_wrapper.MobilePhone;
            obj_account.BillingCity=obj_ScheduleAppointment_wrapper.Suburb;
            obj_account.BillingState=obj_ScheduleAppointment_wrapper.State;
            obj_account.BillingPostalCode=obj_ScheduleAppointment_wrapper.PostalCode;
            obj_account.BillingStreet=obj_ScheduleAppointment_wrapper.StreetAddress;
            obj_account.AccountSource = 'SP Screens Website'; 
            system.debug(obj_account);
            if((obj_account.id==null)||(obj_account.id=='')){           
                insert obj_account;
            }
        }
        return obj_account;
    }

    public Contact createContact(Account obj_current_account){
        Contact obj_contact;
        system.debug('*****' + obj_ScheduleAppointment_wrapper);
        if(obj_ScheduleAppointment_wrapper!=null){
            // insert contact
            obj_contact = new Contact();
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
            if((obj_contact.id==null)||(obj_contact.id=='')){
                insert obj_contact;
            }    
            //createOpportunity(obj_contact,obj_current_account,'New Business');
        }
        return obj_contact;
    }

    public Opportunity createOpportunity(Contact objcontact,Account objaccount ,String Type){
            Date mydate = System.today();
            mydate = mydate.addDays(7);
            Opportunity obj_new_opportunity = new Opportunity();
            obj_new_opportunity.StageName='Enquiry'; 
            obj_new_opportunity.CloseDate = mydate;
            obj_new_opportunity.Name = objaccount.name; // need to be changed            
            obj_new_opportunity.Type =Type;
            obj_new_opportunity.Contact__c =objcontact.id;
            obj_new_opportunity.Accountid= objaccount.id;
            if((obj_new_opportunity.id==null)||(obj_new_opportunity.id=='')){
                insert obj_new_opportunity;
            }
            return obj_new_opportunity;
            //createWorkorder();
    }

    public Workorder createWorkorder(){
        Workorder obj_workorder = new Workorder();        
        obj_workorder.RecordTypeId = WorkOrder_devRecordTypeId;
        obj_workorder.Opportunity__c = oppId;
        obj_workorder.WorkTypeid = obj_currentworktype[0].id;
        obj_workorder.Contactid = cntId;
        obj_workorder.Subject = oppObj.Name +' - ' + obj_currentworktype[0].Name;
        if(obj_workorder.id==null || obj_workorder.id==''){
            insert obj_workorder;
        }
        return obj_workorder;
    }

    public void getAppointmentslots(){
        //OperatingHours abOperatingHours = [SELECT Name, Id, (SELECT EndTime, StartTime, Type, DayOfWeek FROM TimeSlots) FROM OperatingHours WHERE Name = 'Gold Appointments Calendar' limit 1];
        sa = [Select id, EarliestStartTime, DueDate from ServiceAppointment where ParentRecord.id=:wrdOrdrId limit 1];
        //schedulingPolicyId=[select id from FSL__Scheduling_Policy__c where Name='Customer first' limit 1].Id;
        schedulingPolicyId=[select id from FSL__Scheduling_Policy__c where Name='High Intensity' limit 1].Id;        
        Timezone tz = UserInfo.getTimeZone();
        /*System.debug('SA ID :::::::::::::' + sa.Id);
        System.debug('POLICY ID :::::::::::::' + schedulingPolicyId);
        System.debug('OPERATING HOURS :::::::::::::' + abOperatingHours);
        System.debug('TIMEZONE :::::::::::::' + tz);*/
        
        
        String reqJson = '{"saId":"' + sa.Id + '","policyId" : "' + schedulingPolicyId + '"}';
        System.debug('Request JSON  is ::::' + reqJson);
        String response = '';
        
        String clientId = cscObj.ClientId__c;
        String clientSecret = cscObj.Client_Secret__c;
        String username = cscObj.User_Name__c;
        String password = cscObj.Password_With_Token__c;
        String endPoint = cscObj.End_Point_Url__c;
        /*String clientId = '3MVG99S6MzYiT5k9F3kCT3qclTCB5TLiiPu0s8R6tKtDWpWtANl6Z2lpgIWnFkmItpXh1CaxWaUmwvasIomVb';
        String clientSecret = '2645737069529832656';

        //We can also store our username password in custom setting.
        String username='danielle@spscreens.com.au.resdev';//salesforce username 
        String password='SpScreens228vr8iCZapH8vl5k8DohzBXS';//EUe4eHjMxXb8UFco1SPcpsZL9';//salesforce password*/
        // Generating the Access Token
        HttpRequest req = new HttpRequest();
        req.setMethod('POST');
        req.setEndpoint(endPoint);// this is the OAuth endpoint where this request will be hit
        req.setBody('grant_type=password&client_id='+clientId+'&client_secret='+clientSecret+'&username='+username+'&password='+password);
        
        Http http = new Http();
        HTTPResponse res = http.send(req);
        String str = res.getBody();
        system.debug('Gaurang: Testing response' + str);
        
        //Wrapper wrapObj = new Wrapper(); 
        wrapObj = (Wrapper)Json.deserialize(str,Wrapper.class);
        //String accessToken = wrapObj.access_token;
        //String instanceUrl = wrapObj.instance_url;
        
        Http http1 = new Http();
        HttpRequest req1 = new HttpRequest();
        
        req1.setMethod('POST');
        
        req1.setEndpoint(wrapObj.instance_url+'/services/apexrest/GetTimeSlots');
        req1.setHeader('Authorization', 'OAuth '+wrapObj.access_token);
        
        req1.setHeader('Content-Type', 'application/json');
        req1.setBody(reqJson);
        //req1.setBody('{"saId":"08p0l0000000jPYAAY","policyId":"a1c28000002rHW4AAM"}');
        HTTPResponse res1 = http1.send(req1);
        response = res1.getBody();
        system.debug('Response is :::::::' + response);
        
        ServiceResponse srobj = (ServiceResponse) SYSTEM.JSON.deserialize(response,ServiceResponse.class);
        if(srobj.lstSlot != null && srobj.lstSlot.size() > 0){
            obj_list_slot = srobj.lstSlot; 
            /*for(SlotWrapper dt : obj_list_slot){
                datetime thisDT = dt.SlotDate;
                System.debug(thisDT);
                String myDateAET = thisDT.format('yyyy-MM-dd HH:mm:ss', 'AET'); 
                System.debug(myDateAET);
                AETdatetime.add(myDateAET);
                
            }*/
            system.debug(LoggingLevel.ERROR, obj_list_slot);
        }      
        
    }

    public pagereference bookappointment(){
        
        Timezone tz = UserInfo.getTimeZone();
        System.debug('tz :- '+ tz);
        for(SlotWrapper obj :obj_list_slot){
            if(obj.Slotid==index){
                obj_current_slotwrapper=obj;
                break;
            }
        }
        obj_ScheduleAppointment_wrapper.dateandtime = obj_current_slotwrapper.SlotDatefull;
        
        String reqJson = '{"saId":"' + sa.Id + '","arrivalStart":"' + obj_current_slotwrapper.Startdatetime + '","arrivalEnd":"'+obj_current_slotwrapper.Enddatetime + '"}';
        String reqJson1 = '{"saId":"' + sa.Id + '","policyId" : "' + schedulingPolicyId + '"}';
        System.debug('*****' +reqJson);
        String response = '';
        Http http1 = new Http();
        
        HttpRequest req = new HttpRequest();
        
        req.setMethod('DELETE');
        
        req.setEndpoint(wrapObj.instance_url+'/services/apexrest/GetTimeSlots');
        req.setHeader('Authorization', 'OAuth '+wrapObj.access_token);
        
        req.setHeader('Content-Type', 'application/json');
        req.setBody(reqJson);
        HTTPResponse res = http1.send(req);
        
        HttpRequest req1 = new HttpRequest();
        
        req1.setMethod('PUT');
        
        req1.setEndpoint(wrapObj.instance_url+'/services/apexrest/GetTimeSlots');
        req1.setHeader('Authorization', 'OAuth '+wrapObj.access_token);
        
        req1.setHeader('Content-Type', 'application/json');
        req1.setBody(reqJson1);
        HTTPResponse res1 = http1.send(req1);
        response = res1.getBody();
        system.debug('Response is :::::::' + response);
        
        system.debug('Index is :::::' + index);
        
        
        Opportunity tempOpp = new Opportunity(Id=oppId);
        tempOpp.StageName= 'Appointment booked';
        if(!test.isRunningTest()){
            tempOpp.Appointment_Date__c = Date.newInstance(obj_current_slotwrapper.Startdatetime.year(),obj_current_slotwrapper.Startdatetime.month(),obj_current_slotwrapper.Startdatetime.day());
        } else{
            tempOpp.Appointment_Date__c = Date.newInstance(System.Today().year(),System.Today().month(),System.Today().day());
        }
        update tempOpp;
        
        system.debug('Start Time ::::::::' + obj_current_slotwrapper.Startdatetime);
        system.debug('End Time ::::::::' + obj_current_slotwrapper.Enddatetime);
        
        
         sa.ArrivalWindowStartTime = obj_current_slotwrapper.Startdatetime;
        sa.ArrivalWindowEndTime = obj_current_slotwrapper.Enddatetime;
        //sa.EarliestStartTime = obj_current_slotwrapper.Startdatetime;
       // sa.SchedStartTime = null;
        //sa.SchedEndTime = null;
        //sa.Subject = oppObj.Name +' - ' + obj_currentworktype[0].Name;
        //update sa;
        
        //sa.ArrivalWindowStartTime = obj_current_slotwrapper.Startdatetime.addSeconds(tz.getOffset(obj_current_slotwrapper.Startdatetime) / -1000);
        //sa.ArrivalWindowEndTime = obj_current_slotwrapper.Enddatetime.addSeconds(tz.getOffset(obj_current_slotwrapper.Enddatetime) / -1000);
        //sa.Subject = oppObj.Name +' - ' + obj_currentworktype[0].Name;
        //update sa;
        
        /*FSL.ScheduleResult scheduleResult = FSL.ScheduleService.Schedule(schedulingPolicyId, sa.Id);
        if (scheduleResult != null){
            System.debug('SA was scheduled successfully on: ' + scheduleResult.Service.SchedStartTime + ' GMT');
        } else {
            System.debug('Service was not scheduled.');
        } */
       
       /*if(!test.isRunningTest()){
           List<AssignedResource> lst = [select id,ServiceAppointmentId,ServiceResourceId, ServiceResource.Name from AssignedResource where ServiceAppointmentId =:sa.id limit 1];
            if(lst != null && lst.size() > 0){
                resrcName = lst[0].ServiceResource.Name;
            }
            System.debug('Resource Name is ::::::::' + lst[0].ServiceResource.Name);
        }*/
        return moveToStep4();
    }

    /*public void getresource(){
       //obj_currentresource = [select id,ServiceAppointmentId,ServiceResourceId, ServiceResource.Name from AssignedResource where ServiceAppointmentId =:sa.id limit 1];
    }*/
    
    public PageReference moveToStep3(){
        Opportunity tempOpp = New Opportunity(Id= oppId);
        tempOpp.Promo_code__c = obj_ScheduleAppointment_wrapper.PromoCode ;
        update tempOpp;
        
        if(!test.isRunningTest()){
            updateworkorder();
        }
        
        PageReference pg = Page.spscreenvfv2;
        pg.setRedirect(true);
        pg.getParameters().put('actId',actId);
        pg.getParameters().put('cntId',cntId);
        pg.getParameters().put('oppId',oppId);
        pg.getParameters().put('wrdOrdrId',wrdOrdrId);
        pg.getParameters().put('showErr','No');        
        pg.getParameters().put('pageNum','3');
        return pg;
    }

    public PageReference moveToStep4(){
        PageReference pg = Page.thankyouscreen;
        pg.getParameters().put('wrdOrdrId',wrdOrdrId);
        pg.getParameters().put('cntId',cntId);
        pg.getParameters().put('saId',sa.Id);
        pg.getParameters().put('policyId',schedulingPolicyId);
        /*if(obj_current_slotwrapper.SlotDatefull != null){
            pg.getParameters().put('slotDate',EncodingUtil.urlEncode(obj_current_slotwrapper.SlotDatefull, 'UTF-8'));    
        }*/
        /*PageReference pg = Page.spscreenvfv2;
        pg.setRedirect(true);
        pg.getParameters().put('actId',actId);
        pg.getParameters().put('cntId',cntId);
        pg.getParameters().put('oppId',oppId);
        pg.getParameters().put('wrdOrdrId',wrdOrdrId);
        pg.getParameters().put('showErr','No');       
        
        if(resrcName != null){
            System.debug('Inside STEP 4 IF :::::::::::::::::::');
            System.debug('Value of :'+ EncodingUtil.urlEncode(resrcName, 'UTF-8'));
            pg.getParameters().put('resrcName',EncodingUtil.urlEncode(resrcName, 'UTF-8'));
        }
        system.debug('***********' + obj_current_slotwrapper.SlotDatefull);
        if(obj_current_slotwrapper.SlotDatefull != null){
            pg.getParameters().put('slotDate',EncodingUtil.urlEncode(obj_current_slotwrapper.SlotDatefull, 'UTF-8'));    
        }
                
        pg.getParameters().put('pageNum','4');*/
        return pg;
    }

    public PageReference moveToStep2FromStep3(){
        
        PageReference pg = Page.spscreenvfv2;
        pg.setRedirect(true);
        pg.getParameters().put('actId',actId);
        pg.getParameters().put('cntId',cntId);
        pg.getParameters().put('oppId',oppId);
        pg.getParameters().put('wrdOrdrId',wrdOrdrId);
        pg.getParameters().put('showErr','No');        
        pg.getParameters().put('pageNum','2');
        return pg;
    }

    public PageReference moveToStep1FromStep2(){
        setForm1Values();
        PageReference pg = Page.spscreenvfv2;
        pg.setRedirect(true);
        pg.getParameters().put('actId',actId);
        pg.getParameters().put('cntId',cntId);
        pg.getParameters().put('oppId',oppId);
        pg.getParameters().put('wrdOrdrId',wrdOrdrId);
        pg.getParameters().put('showErr','No');        
        pg.getParameters().put('pageNum','1');
        return pg;
    }
    public void setForm1Values(){
        cntObj = [Select Id,AccountId,Account.Name,FirstName,LastName,MobilePhone,Phone,HomePhone,Email,MailingState,MailingCity,MailingPostalCode,MailingStreet from Contact where Id=: cntId];
        obj_ScheduleAppointment_wrapper.FirstName = cntObj.FirstName;
        obj_ScheduleAppointment_wrapper.LastName = cntObj.LastName;
        obj_ScheduleAppointment_wrapper.MobilePhone = cntObj.MobilePhone;
        obj_ScheduleAppointment_wrapper.HomePhone = cntObj.HomePhone;
        obj_ScheduleAppointment_wrapper.Email = cntObj.Email;
        obj_ScheduleAppointment_wrapper.State = cntObj.MailingState;
        obj_ScheduleAppointment_wrapper.Suburb = cntObj.MailingCity;
        obj_ScheduleAppointment_wrapper.PostalCode = cntObj.MailingPostalCode;            
        obj_ScheduleAppointment_wrapper.StreetAddress = cntObj.MailingStreet;
    }

    public void setForm2Values(){
        WorkOrder tempWork = [Select Id,Opportunity__r.Promo_code__c,Security_Doors__c,Flyscreen_Window_or_Door__c,Steel_Door_Windows__c,Security_Screens__c,Flyscreen_Retractable__c,Diamond_Grille__c,Important_Notes__c,Customer_onsite__c From Workorder where Id=: wrdOrdrId];
        if(tempWork.Security_Doors__c !=null){
            obj_ScheduleAppointment_wrapper.SecurityDoors = String.valueOf(tempWork.Security_Doors__c);
        }
        if(tempWork.Flyscreen_Window_or_Door__c!=null){
            obj_ScheduleAppointment_wrapper.FlyscreenWindoworDoor = String.valueOf(tempWork.Flyscreen_Window_or_Door__c);
        }
        if(tempWork.Steel_Door_Windows__c!=null){
            obj_ScheduleAppointment_wrapper.SteelDoorWindows = String.valueOf(tempWork.Steel_Door_Windows__c);
        }
        if(tempWork.Security_Screens__c!=null){
            obj_ScheduleAppointment_wrapper.SecurityScreens = String.valueOf(tempWork.Security_Screens__c);
        }
        if(tempWork.Flyscreen_Retractable__c!=null){
            obj_ScheduleAppointment_wrapper.FlyscreenRetractable = String.valueOf(tempWork.Flyscreen_Retractable__c);
        }
        if(tempWork.Diamond_Grille__c!=null){
            obj_ScheduleAppointment_wrapper.DiamondGrille = String.valueOf(tempWork.Diamond_Grille__c);
        }
        obj_ScheduleAppointment_wrapper.ImportantNotes = tempWork.Important_Notes__c;
        obj_ScheduleAppointment_wrapper.confirm = tempWork.Customer_onsite__c;
        obj_ScheduleAppointment_wrapper.PromoCode = tempWork.Opportunity__r.Promo_code__c;
    }

    public void updateworkorder(){
        WorkOrder tempWork = new WorkOrder(Id=wrdOrdrId);
        if((obj_ScheduleAppointment_wrapper.SecurityDoors!=null)&&(obj_ScheduleAppointment_wrapper.SecurityDoors!='')){
            tempWork.Security_Doors__c = Integer.valueOf(obj_ScheduleAppointment_wrapper.SecurityDoors);
        }
        if((obj_ScheduleAppointment_wrapper.FlyscreenWindoworDoor!=null)&&(obj_ScheduleAppointment_wrapper.FlyscreenWindoworDoor!='')){
            tempWork.Flyscreen_Window_or_Door__c= Integer.valueOf(obj_ScheduleAppointment_wrapper.FlyscreenWindoworDoor);
        }
        if((obj_ScheduleAppointment_wrapper.SteelDoorWindows!=null)&&(obj_ScheduleAppointment_wrapper.SteelDoorWindows!='')){
            tempWork.Steel_Door_Windows__c= Integer.valueOf(obj_ScheduleAppointment_wrapper.SteelDoorWindows);
        }
        if((obj_ScheduleAppointment_wrapper.SecurityScreens!=null)&&(obj_ScheduleAppointment_wrapper.SecurityScreens!='')){
             tempWork.Security_Screens__c= Integer.valueOf(obj_ScheduleAppointment_wrapper.SecurityScreens);
        }
        if((obj_ScheduleAppointment_wrapper.FlyscreenRetractable!=null)&&(obj_ScheduleAppointment_wrapper.FlyscreenRetractable!='')){
            tempWork.Flyscreen_Retractable__c= Integer.valueOf(obj_ScheduleAppointment_wrapper.FlyscreenRetractable);
        }
        if((obj_ScheduleAppointment_wrapper.DiamondGrille!=null)&&(obj_ScheduleAppointment_wrapper.DiamondGrille!='')){
            tempWork.Diamond_Grille__c= Integer.valueOf(obj_ScheduleAppointment_wrapper.DiamondGrille);
        }
         tempWork.Important_Notes__c = obj_ScheduleAppointment_wrapper.ImportantNotes;
         tempWork.Customer_onsite__c = obj_ScheduleAppointment_wrapper.confirm;
         update tempWork;
        
       /*List<ServiceAppointment> lstServcAppnts = [Select Id,ServiceTerritoryId,ServiceTerritory.Name from ServiceAppointment where ParentRecordId != null AND ParentRecordId =: wrdOrdrId];
        if(lstServcAppnts != null && lstServcAppnts.size() > 0 && lstServcAppnts[0].ServiceTerritoryId != null){
            String terrName = lstServcAppnts[0].ServiceTerritory.Name.toUpperCase();
            Map<String,Territories_Mapping__c> mapTerrMaps = Territories_Mapping__c.getall();
            Map<String,String> mapTechToSalesTerr = new Map<String,String>();
            if(mapTerrMaps != null && mapTerrMaps.size() > 0){
                for(String str : mapTerrMaps.keySet()){
                    mapTechToSalesTerr.put(mapTerrMaps.get(str).Technician_Territory__c.toUpperCase(),mapTerrMaps.get(str).Sales_Territory__c.toUpperCase());
                }
                System.debug(LoggingLevel.ERROR,mapTechToSalesTerr);
                if(mapTechToSalesTerr != null && mapTechToSalesTerr.size() > 0 && mapTechToSalesTerr.keySet().contains(terrName)){
                    map<String,String> mapTempTerr = getTerrMap();
                    system.debug(LoggingLevel.ERROR,mapTempTerr);
                    //String salesTerrId = mapTempTerr.get(mapTechToSalesTerr.get(terrName));
                    if(mapTempTerr != null && mapTempTerr.size() > 0 && mapTempTerr.containsKey(mapTechToSalesTerr.get(terrName))){
                        system.debug(LoggingLevel.ERROR,'Id is ::::::' + mapTempTerr.get(mapTechToSalesTerr.get(terrName)));
                        lstServcAppnts[0].ServiceTerritoryId = mapTempTerr.get(mapTechToSalesTerr.get(terrName));
                    	update lstServcAppnts;
                    }                    
                }
            }
        }*/
    }
    
    public map<String,String> getTerrMap(){
        List<ServiceTerritory> lstServcTerr = [Select Id,Name from ServiceTerritory where IsActive = True];
        map<String,String> mapTerrNameToId = new Map<String,String>();
        if(lstServcTerr != null && lstServcTerr.size() > 0){
            for(ServiceTerritory st : lstServcTerr){
                if(!mapTerrNameToId.containsKey(st.Name)){
                    mapTerrNameToId.put(st.Name.toUpperCase(), st.Id);
                }
            }
        }
        return mapTerrNameToId;
    }
    
    public PageReference cancelAppointment(){
        Group grp = [select Id from Group where Type = 'Queue' AND DeveloperNAME = 'Sales_Lead_Queue'];
        List<ServiceAppointment> lstServcAppnts = [Select Id from ServiceAppointment where ParentRecordId != null AND ParentRecordId =: wrdOrdrId];
        if(lstServcAppnts != null && lstServcAppnts.size() > 0){
            delete lstServcAppnts;
        }
        
        System.debug(wrdOrdrId);
        WorkOrder tempWork = [Select Id,Opportunity__r.Promo_code__c,Security_Doors__c,Flyscreen_Window_or_Door__c,Steel_Door_Windows__c,Security_Screens__c,Flyscreen_Retractable__c,Diamond_Grille__c,Important_Notes__c,Customer_onsite__c From Workorder where Id=: wrdOrdrId];
        
        
        cntObj = [Select Id,AccountId,Account.Name,FirstName,LastName,MobilePhone,Phone,HomePhone,Email,MailingState,MailingCity,MailingPostalCode,MailingStreet from Contact where Id=: cntId];
        List<Lead> lstLeads = [Select Id,firstName,LastName,Email from Lead where Email != null  AND Email =: cntObj.Email limit 1];
        /*if(lstLeads != null && lstLeads.size() > 0){
            Task t = new Task();
            t.whoId = lstLeads[0].Id;
            t.subject = 'This lead has come through website but no appointment booked.';
            t.priority = 'Medium';
            insert t;
        }else{*/
            System.debug('Inside Lead ELSE ::::::::');
            Lead l = new Lead();
            l.firstName = cntObj.firstName;
            l.lastName = cntObj.lastName;
            l.Email = cntObj.Email;
            l.company = cntObj.Account.Name;
            l.LeadSource = 'SP Screens Website';
            l.Lead_Type__c = 'Click Here Webpage';
            l.MobilePhone= cntObj.MobilePhone; 
            l.Phone = cntObj.HomePhone;
            l.Street = cntObj.MailingStreet; 
            l.State = cntObj.MailingState;
            l.City=cntObj.MailingCity;
            l.Country = 'Australia';
            l.PostalCode=cntObj.MailingPostalCode;
            l.Flyscreen_Retractable__c = tempWork.Flyscreen_Retractable__c;
            l.Flyscreen_Window_or_Door__c = tempWork.Flyscreen_Window_or_Door__c;
            l.Security_Doors__c = tempWork.Security_Doors__c;
            l.Security_Screens__c = tempWork.Security_Screens__c;
            l.Steel_Door_Windows__c = tempWork.Steel_Door_Windows__c;
            l.Diamond_Grille__c = tempWork.Diamond_Grille__c;
            l.Specific_requests_and_notes__c = tempWork.Important_Notes__c;
            //l.Important_Notes__c = tempWork.Important_Notes__c;
            l.Customer_onsite__c = tempWork.Customer_onsite__c;
            if(grp != null){
            	l.OwnerId = grp.Id;    
            }
            insert l;    
            system.debug(l);
        //}
        
        cntObj.Is_Ready_For_Delete__c = true;
        update cntObj;
        
        WorkOrder wrd = new WorkOrder(Id=wrdOrdrId);
        delete wrd;
        
        system.debug(oppId);
        Opportunity opps = new Opportunity(Id=oppId);
        delete opps;
        
        List<String> lstAcntIds = new List<String>();
        List<Opportunity> lstOpps = [Select Id,accountId,StageName from Opportunity where accountId != Null AND AccountId =: actId];
        System.debug('List Opps :::::::::::::' + lstOpps.size());
        if(lstOpps != null && lstOpps.size() > 0){
            map<Id,List<Opportunity>> mapTempActIdToOpps = new map<Id,List<Opportunity>>();
            for(Opportunity op: lstOpps){
                if(!mapTempActIdToOpps.containsKey(op.accountId)){
                    mapTempActIdToOpps.put(op.accountId, new List<Opportunity>());
                }
                mapTempActIdToOpps.get(op.accountId).add(op);
            }
            
            for(Id i: mapTempActIdToOpps.keySet()){
                Integer cnt = 0;
                for(Opportunity o : mapTempActIdToOpps.get(i)){
                    if(o.stageName != null && o.stageName != 'Enquiry'){
                        cnt++;
                    }
                }
                if(cnt == 0){
                    lstAcntIds.add(i);
                }
            }
        }else if(lstOpps == null || lstOpps.size() == 0){
            lstAcntIds.add(actId);
        }
        
        
        if(lstAcntIds != null && lstAcntIds.size() > 0){
            List<Account> lstAcnt = new List<Account>();
            for(String str : lstAcntIds){
                Account act = new Account(Id=str);
                act.Is_Ready_For_Delete__c = true;
                lstAcnt.add(act);
            }
            update lstAcnt;
        }
        
        if(!Test.isRunningTest()){
            BatchDeleteContacts cntBtch = new BatchDeleteContacts();
        	Database.executeBatch(cntBtch,1);
            //BatchDeleteAccounts b =new BatchDeleteAccounts(new List<String>{actId});
            //Database.executeBatch(b,1);
        }
        PageReference pg = Page.CancelAppointmentScreen;
        pg.setRedirect(true);
        return pg;
    }
    
    /*public static void sleep(Long milliSeconds)
   {
       System.debug('Waiting start');
       Long timeDiff = 0;
       DateTime firstTime = System.now();
       do
       {
           timeDiff = System.now().getTime() - firstTime.getTime();
       }
       while(timeDiff <= milliSeconds);
       System.debug('Waiting End');
   }*/
    
   /* public static void makeWebServiceCall(){
        String sfdcURL = URL.getSalesforceBaseUrl().toExternalForm();
        String restAPIURL = sfdcURL + '/services/apexrest/GetTimeSlots';
        
        HttpRequest httpRequest = new HttpRequest();  
        httpRequest.setMethod('POST');   
        httpRequest.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());        
        httpRequest.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionID()); 
        httpRequest.setEndpoint(restAPIURL);
        httpRequest.setHeader('Content-Type', 'application/json');
        httpRequest.setBody('{"saId":"08p0l0000000jPYAAY","policyId":"a1c28000002rHW4AAM"}');
        String response = '';
        try {  
            Http http = new Http();   
            HttpResponse httpResponse = http.send(httpRequest);  
            if (httpResponse.getStatusCode() == 200 ) {  
                response = httpResponse.getBody();  
            } else {  
                System.debug(' httpResponse ' + httpResponse.getBody() ); 
            }   
        } catch( System.Exception e) {  
            System.debug('ERROR: '+ e);  
            throw e;  
        } 
        system.debug('Response is :::::::' + response);
    }*/
    
    public class Wrapper{
        String id;
        String instance_url;
        String access_token;
        String issued_at;
        String signature;
    }
}