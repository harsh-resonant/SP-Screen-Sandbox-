public class CallFSLSchedule {
    
    @future
    public static void callschedule(id serviceid,datetime ArrivalWindowEndTime,datetime ArrivalWindowStartTime){
    
    //for(ServiceAppointment s:lstServiceAppointments){
        
        if(ArrivalWindowEndTime!=null &&
           ArrivalWindowStartTime!=null
          ){
              system.debug('*****scheduleResult 111');
            id schedulingPolicyId=[select id from FSL__Scheduling_Policy__c where Name='High Intensity' limit 1].Id; 
			FSL.ScheduleResult scheduleResult = FSL.ScheduleService.Schedule(schedulingPolicyId, serviceid);
			system.debug('*****scheduleResult222 '+scheduleResult);
          }
    	//}
    }

}