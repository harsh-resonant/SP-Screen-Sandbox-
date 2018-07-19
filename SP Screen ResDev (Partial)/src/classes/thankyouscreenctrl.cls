public class thankyouscreenctrl {
    public String displayName{get;set;}
    public String firstName {get;set;}
    public ServiceAppointment sa {get;set;}
    public Boolean showFlag {get;set;}
    public String wrdOrdrId {get;set;}
    public Contact cntObj {get;set;}
    public WorkOrder wrkOrdr {get;set;}
    public DateTime strtTime {get;set;}
    public DateTime endTime {get;set;}
    public String saId {get;set;}
    public String policyId {get;set;}
    
    public thankyouscreenctrl(){
        showFlag = false;
        if(ApexPages.currentPage().getParameters().get('wrdOrdrId') != null){
            wrdOrdrId = ApexPages.currentPage().getParameters().get('wrdOrdrId');
            wrkOrdr = [Select Id,Opportunity__c from WorkOrder where Id=: wrdOrdrId];
        }
        if(ApexPages.currentPage().getParameters().get('cntId') != null){
            String cntId = ApexPages.currentPage().getParameters().get('cntId');
            cntObj = [Select id,firstName,AccountId from Contact where id=: cntId];
            firstName = cntObj.firstName;
        }
        if(ApexPages.currentPage().getParameters().get('policyId') != null){
            String policyId = ApexPages.currentPage().getParameters().get('policyId');
        }
        if(ApexPages.currentPage().getParameters().get('saId') != null){
            String cntId = ApexPages.currentPage().getParameters().get('saId');
        }
    }
    
    public void assignResource(){
        sa = [Select id, EarliestStartTime, DueDate,SchedStartTime,ArrivalWindowStartTime,ArrivalWindowEndTime from ServiceAppointment where ParentRecord.id=:wrdOrdrId limit 1];
        List<AssignedResource> obj_currentresource = [select id,ServiceAppointmentId,ServiceResourceId, ServiceResource.Name,ServiceResource.RelatedRecordId from AssignedResource where ServiceAppointmentId =:sa.Id limit 1];
        //system.debug('88888' + obj_currentresource);
        //system.debug('*******' + sa.ArrivalWindowStartTime);
        if(obj_currentresource != null && obj_currentresource.size() > 0 && sa.ArrivalWindowStartTime != null && sa.ArrivalWindowEndTime != null){
            showFlag =true;
            displayName = obj_currentresource[0].ServiceResource.Name;
            strtTime = sa.ArrivalWindowStartTime.addHours(10);
            endTime = sa.ArrivalWindowEndTime.addHours(10);
            system.debug(endTime);
            cntObj.OwnerId = obj_currentresource[0].ServiceResource.RelatedRecordId;
            update cntObj;
            
            Account act = new Account(Id=cntObj.AccountId);
            act.OwnerId = obj_currentresource[0].ServiceResource.RelatedRecordId;
            update act;
            
            Opportunity opp = new Opportunity(Id=wrkOrdr.Opportunity__c);
            opp.OwnerId = obj_currentresource[0].ServiceResource.RelatedRecordId;
            update opp;
        }
    }
    
   /* public void updateAppointment(){
        Custom_Service_Call__c cscObj = Custom_Service_Call__c.getInstance('Service Call');
        String clientId = cscObj.ClientId__c;
        String clientSecret = cscObj.Client_Secret__c;
        String username = cscObj.User_Name__c;
        String password = cscObj.Password_With_Token__c;
        String endPoint = cscObj.End_Point_Url__c;
        
        HttpRequest req = new HttpRequest();
        req.setMethod('POST');
        req.setEndpoint(endPoint);// this is the OAuth endpoint where this request will be hit
        req.setBody('grant_type=password&client_id='+clientId+'&client_secret='+clientSecret+'&username='+username+'&password='+password);
        
        Http http = new Http();
        HTTPResponse res = http.send(req);
        String str = res.getBody();
        Wrapper wrapObj = (Wrapper)Json.deserialize(str,Wrapper.class);
        
        String reqJson = '{"saId":"' + saId + '","policyId" : "' + policyId + '"}';
        HttpRequest req1 = new HttpRequest();
        
        req1.setMethod('PUT');
        
        req1.setEndpoint(wrapObj.instance_url+'/services/apexrest/GetTimeSlots');
        req1.setHeader('Authorization', 'OAuth '+wrapObj.access_token);
        
        req1.setHeader('Content-Type', 'application/json');
        req1.setBody(reqJson);
        HTTPResponse res1 = http.send(req1);
        String response = res1.getBody();
        system.debug('Response is :::::::' + response);
    }
    
    public class Wrapper{
        String id;
        String instance_url;
        String access_token;
        String issued_at;
        String signature;
    }*/
}