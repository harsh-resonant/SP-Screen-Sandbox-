global with sharing class BatchFilterAppointment implements Database.Batchable<SObject>  {
    private Datetime dt ;
    private List<String> lstAcntIds = new List<String>();
    private List<String> lstCntIds = new List<String>();
    public BatchFilterAppointment(){
        dt = System.Now().addHours(-1);
    }
    
    global Database.QueryLocator  start(Database.BatchableContext BC)  {
        String temp = 'select id,accountId,account.AccountSource from opportunity where account.AccountSource = \'SP Screens Website\' and StageName = \'Enquiry\' AND CreatedDate >=: dt';
        system.debug(temp);
        return Database.getQueryLocator('select id,accountId,account.AccountSource from opportunity where account.AccountSource = \'SP Screens Website\' and StageName = \'Enquiry\' order by createddate desc');
    }
    
    global void execute(Database.BatchableContext BC, List<SObject> scope)  {
        
        try{
            List<String> lstAccountIds = new List<String>();
            List<String> lstOpportunityIds = new List<String>();
            system.debug('Size is :::::::' + scope.size());
            Map<String,List<workOrderWrappr>> mapCntIdToWorkOrd = new Map<String,List<workOrderWrappr>>();
            Map<String,List<Opportunity>> mapAcntIdToLstOpp = new Map<String,List<Opportunity>>();
            Opportunity opp;
            for(SObject s : scope){
                opp = (Opportunity)s;
                if(!mapAcntIdToLstOpp.containsKey(opp.AccountId)){
                    mapAcntIdToLstOpp.put(opp.AccountId, new List<Opportunity>());
                }
                mapAcntIdToLstOpp.get(opp.AccountId).add(opp);
            }
            
            System.debug(mapAcntIdToLstOpp);
            
            if(mapAcntIdToLstOpp != null && mapAcntIdToLstOpp.size() > 0){
                for(String str : mapAcntIdToLstOpp.keySet()){
                    if(mapAcntIdToLstOpp.get(str) != null && mapAcntIdToLstOpp.get(str).size() > 0){
                        if(mapAcntIdToLstOpp.get(str).size() == 1){
                            lstAccountIds.add(str);
                            lstOpportunityIds.add(mapAcntIdToLstOpp.get(str)[0].Id);
                        }
                        if(mapAcntIdToLstOpp.get(str).size() > 1){
                            for(Opportunity op : mapAcntIdToLstOpp.get(str)){
                                lstOpportunityIds.add(op.Id);
                            }
                        }
                    } 
                }
                
                if(lstOpportunityIds != null && lstOpportunityIds.size() > 0){
                    List<WorkOrder> lstWrkOrdrs = [Select Id,Opportunity__c,ContactId,Diamond_Grille__c,Steel_Door_Windows__c,Security_Screens__c,Security_Doors__c,Flyscreen_Window_or_Door__c,Flyscreen_Retractable__c,Important_Notes__c,Customer_onsite__c from WorkOrder where Opportunity__c != null AND Opportunity__c in: lstOpportunityIds];
                    System.debug('WorkOrder :::::' + lstWrkOrdrs.size());
                    if(lstWrkOrdrs != null && lstWrkOrdrs.size() > 0){
                        List<String> lstWrkOrdIds = new List<String>();
                        List<Opportunity> lstDeleteOpps = new List<Opportunity>();
                        
                        for(WorkOrder wor : lstWrkOrdrs){
                            //wor.AccountId = null;
                            lstWrkOrdIds.add(wor.Id);
                            Opportunity op = new Opportunity(Id=wor.Opportunity__c);
                            lstDeleteOpps.add(op);
                            if(!mapCntIdToWorkOrd.containsKey(wor.ContactId)){
                                mapCntIdToWorkOrd.put(wor.ContactId, new List<workOrderWrappr>());
                            }
                            workOrderWrappr wo = new workOrderWrappr();
                            wo.Diamond_Grille = wor.Diamond_Grille__c;
                            wo.Steel_Door_Windows = wor.Steel_Door_Windows__c;
                            wo.Security_Screens = wor.Security_Screens__c;
                            wo.Security_Doors = wor.Security_Doors__c;
                            wo.Flyscreen_Window_or_Door = wor.Flyscreen_Window_or_Door__c;
                            wo.Flyscreen_Retractable = wor.Flyscreen_Retractable__c;
                            wo.Important_Notes = wor.Important_Notes__c;
            				wo.Customer_onsite = wor.Customer_onsite__c;
                            mapCntIdToWorkOrd.get(wor.ContactId).add(wo);
                        }
                        //update lstWrkOrdrs;
                        List<ServiceAppointment> lstServcAppnts = [Select Id from ServiceAppointment where ParentRecordId != null AND ParentRecordId in: lstWrkOrdIds];
                        if(lstServcAppnts != null && lstServcAppnts.size() > 0){
                            System.debug('Service Appointments :::::::' + lstServcAppnts.size());
                            delete lstServcAppnts;
                        }
                        if(lstWrkOrdrs != null && lstWrkOrdrs.size() > 0){
                            if(Schema.sObjectType.WorkOrder.isDeletable()){
                                System.debug('Word Order :::::::' + lstWrkOrdrs.size());
                                delete lstWrkOrdrs;
                            }
                        }
                        if(lstDeleteOpps != null && lstDeleteOpps.size() > 0){
                            System.debug('Opportunity ::::' + lstDeleteOpps.size());
                            delete lstDeleteOpps;
                        }
                    }
                }
                
                if(lstAccountIds != null && lstAccountIds.size() > 0){
                    List<Contact> lstCnts = [Select Id,firstName,LastName,Email,AccountId,Account.Name,mobilephone,phone,MailingState,MailingCity,MailingPostalCode,MailingStreet from Contact where Email != null AND AccountId != null AND AccountId in: lstAccountIds];
                    List<String> lstCntEmails = new List<String>();
                    List<Account> lstDeltAcnts = new List<Account>();
                    Map<String,Contact> mapEmailToContct = new Map<String,Contact>();
                    if(lstCnts != null && lstCnts.size() > 0){
                        for(Contact cnt : lstCnts){
                            if(cnt.Email != null){
                                lstCntEmails.add(cnt.Email);
                                //Account act = new Account(Id=cnt.AccountId);
                                //System.debug('Cnt Id is ::::::' + cnt.AccountId);
                                //lstDeltAcnts.add(act);
                                if(!mapEmailToContct.containsKey(cnt.Email)){
                                    mapEmailToContct.put(cnt.Email,cnt);
                                }
                            }
                            
                        }
                        System.debug('Account List is :::::::' + lstDeltAcnts.size());
                        if(lstCntEmails != null && lstCntEmails.size() > 0){
                            Map<String,Lead> mapEmailToLead = new Map<String,Lead>();
                            List<Lead> lstLeads = [Select Id,firstName,LastName,Email from Lead where Email != null  AND Email in: lstCntEmails];
                            if(lstLeads != null && lstLeads.size() > 0){
                                for(Lead ld : lstLeads){
                                    if(ld.Email != null){
                                        if(!mapEmailToLead.containsKey(ld.Email)){
                                            mapEmailToLead.put(ld.Email,ld);
                                        }
                                    }
                                }
                            }
                            
                            List<Task> lstNewTasks = new List<Task>();
                            List<Lead> lstNewLeads = new List<Lead>();
                            List<Contact> lstUpdateConts = new List<Contact>();
                            Group grp = [select Id from Group where Type = 'Queue' AND DeveloperNAME = 'Sales_Lead_Queue'];
                            for(String str : mapEmailToContct.keySet()){
                                /*if(mapEmailToLead != null && mapEmailToLead.containsKey(str)){
                                    //create task for lead
                                    Task t = new Task();
                                    t.whoId = mapEmailToLead.get(str).Id;
                                    t.subject = 'This lead has come through website but no appointment booked.';
                                    t.priority = 'Medium';
                                    lstNewTasks.add(t);
                                }else if(mapEmailToLead != null && !mapEmailToLead.containsKey(str)){*/
                                    if(mapCntIdToWorkOrd != null && mapCntIdToWorkOrd.size() > 0 && mapCntIdToWorkOrd.containsKey(mapEmailToContct.get(Str).Id) && mapCntIdToWorkOrd.get(mapEmailToContct.get(Str).Id) != null && mapCntIdToWorkOrd.get(mapEmailToContct.get(Str).Id).size() > 0){
                                        for(workOrderWrappr wo : mapCntIdToWorkOrd.get(mapEmailToContct.get(Str).Id)){
                                            //create new lead
                                            Contact cnt = new Contact(Id=mapEmailToContct.get(Str).Id);
                                            cnt.Is_Ready_For_Delete__c = true;
                                            lstUpdateConts.add(cnt);
                                            
                                            Lead l = new Lead();
                                            l.firstName = mapEmailToContct.get(Str).firstName;
                                            l.lastName = mapEmailToContct.get(Str).lastName;
                                            l.Email = mapEmailToContct.get(Str).Email;
                                            l.company = mapEmailToContct.get(Str).Account.Name;
                                            l.LeadSource = 'SP Screens Website';
                                            l.Lead_Type__c = 'Cancelled Webpage';
                                            l.MobilePhone= mapEmailToContct.get(Str).MobilePhone;
                                            l.Phone = mapEmailToContct.get(Str).Phone;
                                            l.Street = mapEmailToContct.get(Str).MailingStreet; 
                                            l.State = mapEmailToContct.get(Str).MailingState;
                                            l.City=mapEmailToContct.get(Str).MailingCity;
                                            l.Country = 'Australia';
                                            l.PostalCode=mapEmailToContct.get(Str).MailingPostalCode;
                                            l.Flyscreen_Retractable__c = wo.Flyscreen_Retractable;
                                            l.Flyscreen_Window_or_Door__c = wo.Flyscreen_Window_or_Door;
                                            l.Security_Doors__c = wo.Security_Doors;
                                            l.Security_Screens__c = wo.Security_Screens;
                                            l.Steel_Door_Windows__c = wo.Steel_Door_Windows;
                                            l.Diamond_Grille__c = wo.Diamond_Grille;
                                            l.Specific_requests_and_notes__c = wo.Important_Notes;
                                            //l.Important_Notes__c = wo.Important_Notes;
            								l.Customer_onsite__c = wo.Customer_onsite;
                                            if(grp != null){
                                                l.OwnerId = grp.Id;    
                                            }
                                            //l.Address = mapEmailToContct.get(Str).mailingaddress;
                                            lstNewLeads.add(l);
                                        }
                                    }
                                //}
                            }
                            
                            /*if(lstNewTasks != null && lstNewTasks.size() > 0){
                                System.debug('Tasks :::::::' + lstNewTasks.size());
                                insert lstNewTasks;
                            }*/
                            
                            if(lstUpdateConts != null && lstUpdateConts.size() > 0){
                                update lstUpdateConts;
                            }
                            if(lstNewLeads != null && lstNewLeads.size() > 0){
                                System.debug('Leads :::::::' + lstNewLeads.size());
                                insert lstNewLeads; 
                            }
                        
                            List<Opportunity> lstOpps = [Select Id,accountId,StageName from Opportunity where accountId != Null AND AccountId in: mapAcntIdToLstOpp.keySet()];
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
                                for(String str : mapAcntIdToLstOpp.keySet()){
                                    lstAcntIds.add(str);
                                }
                            }
                            System.debug('Delete Account Id ::::::' + lstAcntIds);
                            if(lstAcntIds != null && lstAcntIds.size() > 0){
                                List<Account> lstAcnt = new List<Account>();
                                for(String str : lstAcntIds){
                                    Account act = new Account(Id=str);
                                    act.Is_Ready_For_Delete__c = true;
                                    lstAcnt.add(act);
                                }
                                update lstAcnt;
                            }
                        }
                    }
                }
            }
        }Catch (Exception ex){
            system.debug('Message is :::::' + ex.getMessage());
            system.debug('Message is :::::' + ex.getLineNumber());
        }
    }
    
    global void finish(Database.BatchableContext BC) {
        BatchDeleteContacts cntBtch = new BatchDeleteContacts();
        Database.executeBatch(cntBtch,1);
    }
    
    public class workOrderWrappr {
        public Double Diamond_Grille {get;set;}
        public Double Steel_Door_Windows {get;set;}
        public Double Security_Screens {get;set;}
        public Double Security_Doors {get;set;}
        public Double Flyscreen_Window_or_Door {get;set;}
        public Double Flyscreen_Retractable {get;set;}
        public String Important_Notes {get;set;}
        public Boolean Customer_onsite {get;set;}
    }
}