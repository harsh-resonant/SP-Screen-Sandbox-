global class ScheduleBatchFilterAppointment implements Schedulable{
	global void execute(SchedulableContext sc){
        BatchFilterAppointment b = new BatchFilterAppointment ();
        database.executebatch(b,1);
    }
}