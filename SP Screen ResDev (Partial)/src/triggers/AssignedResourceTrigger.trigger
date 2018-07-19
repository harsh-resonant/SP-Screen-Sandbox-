trigger AssignedResourceTrigger on AssignedResource (before insert,after insert,before update,after update,before delete,after delete,after undelete) {
    
   if(trigger.IsAfter && trigger.IsUpdate){
        updateparentrecord();       
    }
  
    public static void updateparentrecord(){
       // List<AssignedResource> ServiceAppointmentToUpdate= new List<ServiceAppointment>();
        Map<Id,ServiceAppointment> mapServiceAppointment;
         Map<Id,AssignedResource> mapAssignedResources;
        Set<Id> setServiceAppointmentIds= new Set<Id>();
        set<id> setAssignedResourceIds= new Set<Id>();
        set<id>setServiceResources=new set<id>();
        
        for(AssignedResource ar: trigger.new){
           // verify Assigned Resource is New
           if(ar.ServiceAppointment!=null) 
                setServiceAppointmentIds.add(ar.ServiceAppointmentid);
                setAssignedResourceIds.add(ar.id);
            	setServiceResources.add(ar.ServiceResourceid);
             system.debug('^^^^^^AssignedResource '+ar);
        }
        //get related ServiceAppointment details
        if(!setServiceAppointmentIds.isEmpty()){
          mapServiceAppointment= new Map<Id,ServiceAppointment>([select id,Subject,Duration,Accountid,Contactid from ServiceAppointment where id  in:setServiceAppointmentIds]);
        System.debug('mapServiceAppointment: '+mapServiceAppointment);
        }
        
        //get resource details
        if(!setServiceResources.isEmpty()){
          mapAssignedResources= new Map<Id,AssignedResource>([select id,ServiceResource.RelatedRecordid ,ServiceAppointmentid
                                                              from AssignedResource 
                                                             where id  in:setServiceAppointmentIds and ServiceResource.RelatedRecordid in:setServiceResources]);
        System.debug('AssignedResource: '+mapAssignedResources);
        }
        
        
        //List<ServiceAppointment> lstServiceAppointments=[select id,Subject,Duration,DurationType from ServiceAppointment where id in:ServiceAppointmentids];
         // Update Service Appointment
         // 
         //  accout
         list<account> lstaccounts= new list<account>(); 
        if(mapServiceAppointment!=null && !mapServiceAppointment.isEmpty()){
            for(ServiceAppointment s:mapServiceAppointment.values()){
                for(AssignedResource assign:mapAssignedResources.values()){
                    if(s.id== assign.ServiceAppointmentid){
                        //mapping field
                        Account a= new Account(id=s.accountid,ownerid=assign.ServiceResource.RelatedRecordid);
                         lstaccounts.add(a);
                        system.debug('^^^^^^lstaccounts '+lstaccounts); 
						 
                        
                    }
                }
           }
        }
        if(lstaccounts.size()>0) update lstaccounts;
        
        }
    

}