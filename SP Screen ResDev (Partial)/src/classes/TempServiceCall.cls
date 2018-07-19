global class TempServiceCall {
    webservice static void getCapacity(Id plicyId,Id saId){
        system.debug('*****' + plicyId);
        system.debug('*****' + saId);
        FSL.ScheduleResult scheduleResult = FSL.ScheduleService.Schedule(plicyId, saId);
    }
}