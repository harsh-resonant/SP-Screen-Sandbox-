@isTest
public class ScheduleBatchFilterAppointmentTest {
    public static testmethod void method1(){
        Test.startTest();
        String jobId = System.schedule('testBasicScheduledApex', '0 0 0 3 9 ? 2022', new ScheduleBatchFilterAppointment());
        Test.stopTest();
    }
}