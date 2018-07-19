@isTest
public with sharing class ActionPlanDetailControllerTest {
    public static testMethod void constructorTests(){
        
        Test.StartTest();
        
        System.currentPageReference().getParameters().put( 'id', null );
        ActionPlanDetailController apDetailController = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) );      
        
        ActionPlansTestUtilities testUtil = new ActionPlansTestUtilities();
        ActionPlan__c actionPlan = testUtil.createNewActionPlan( 'accounts', 1 );
        
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        ActionPlanDetailController apDetailController2 = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) );
        
        Test.StopTest();
    }
    
    public static testMethod void checkTasks(){
    
        Test.StartTest();
        
        ActionPlansTestUtilities testUtil = new ActionPlansTestUtilities();
        ActionPlan__c actionPlan = testUtil.createNewActionPlan( 'accounts', 3 );
        
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        ActionPlanDetailController apDetailController = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) );      
        List<APTaskTemplate__c> apTasks = apDetailController.getTasks();
        
        //Checks to see that list of tasks is not empty
        System.assert( !apTasks.isEmpty(), 'task list is empty' );
        
        Test.StopTest();
    }
    
    public static testMethod void checkTaskSize(){
    
        Test.StartTest();
        
        ActionPlansTestUtilities testUtil = new ActionPlansTestUtilities();
        ActionPlan__c actionPlan = testUtil.createNewActionPlan( 'accounts', 3 );
        
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        ActionPlanDetailController apDetailController = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) );      
        
        List<APTaskTemplate__c> apTasks = apDetailController.getTasks();
        Integer numTasks                = apDetailController.getTaskSize();
        
        //Checks to see that list of tasks is not empty
        System.assert( !apTasks.isEmpty(), 'task list is empty' );      
        
        //check that both methods return correct number of task objects
        System.assertEquals( numTasks, apTasks.size() );
        
        Test.StopTest();
    }
    
    public static testMethod void checkCompletedTasks(){
    
        Test.StartTest();
        
        ActionPlansTestUtilities testUtil = new ActionPlansTestUtilities();
        ActionPlan__c actionPlan = testUtil.createNewActionPlan( 'accounts', 3 );
        
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        ActionPlanDetailController apDetailController = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) );      
        Integer completedTasks = apDetailController.getCompleted();
        
        //verifies number of completed tasks
        System.assertEquals( 0, completedTasks );
        
        Test.StopTest();
    }
    
    public static testMethod void checkActionPlanTemplateVersion(){
    
        Test.StartTest();
        
        ActionPlansTestUtilities testUtil   = new ActionPlansTestUtilities();
        ActionPlan__c actionPlan            = testUtil.createNewActionPlan( 'accounts', 2 );
        ActionPlanTemplate__c apTemplate    = testUtil.createNewActionPlanTemplate( 2 );
        
        actionPlan.Action_Plan_Template__c = apTemplate.Id;
        update actionPlan;
        
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        ActionPlanDetailController apDetailController = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) );      
        boolean versionName = apDetailController.getVersion();
        
        //Checks if Action Plan Template has not been changed since the creation of the Action Plan.
        //System.assert( !versionName );        
        
        apTemplate.Name = 'new name';
        update apTemplate;
        
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        apDetailController = new ActionPlanDetailController( new ApexPages.StandardController( actionPlan ) );      
        versionName = apDetailController.getVersion();
        
        //Checks if Action Plan Template has been changed since the creation of the Action Plan.
        //System.assert( versionName ); 
        
        Test.StopTest();
    }
    
    public static testMethod void checkDeleteActionPlan(){
    
        Test.StartTest();
        
        ActionPlansTestUtilities testUtil = new ActionPlansTestUtilities();
        ActionPlan__c actionPlan = testUtil.createNewActionPlan( 'accounts', 2 );
        
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        ActionPlanDetailController apDetailController = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) );      
        apDetailController.deletePlan();
        
        List<ActionPlan__c> actionPlanList = [ select Id from ActionPlan__c where Id =: actionPlan.Id limit 1];
        
        //Checks if Action Plan Template has been changed since the creation of the Action Plan.
        System.assert( actionPlanList.isEmpty(), 'Action Plan was not deleted' );       
        
        Test.StopTest();
    }
    
    public static testMethod void checkGetRelatedObjectName(){
        
        ActionPlansTestUtilities testUtil = new ActionPlansTestUtilities();
        
        ActionPlan__c actionPlan = testUtil.createNewActionPlan( 'accounts', 0 );
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        ActionPlanDetailController APDC = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) ); 
        String name = APDC.getRelatedObjectName();
        System.assert(name != null);
        
        actionPlan = testUtil.createNewActionPlan( 'campaigns', 0 );
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        APDC = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) ); 
        name = APDC.getRelatedObjectName();
        System.assert(name != null);
        
        actionPlan = testUtil.createNewActionPlan( 'cases', 0 );
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        APDC = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) ); 
        name = APDC.getRelatedObjectName();
        System.assert(name != null);
        
        actionPlan = testUtil.createNewActionPlan( 'contacts', 0 );
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        APDC = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) ); 
        name = APDC.getRelatedObjectName();
        System.assert(name != null);
        
        actionPlan = testUtil.createNewActionPlan( 'contracts', 0 );
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        APDC = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) ); 
        name = APDC.getRelatedObjectName();
        System.assert(name != null);
        
        actionPlan = testUtil.createNewActionPlan( 'leads', 0 );
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        APDC = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) ); 
        name = APDC.getRelatedObjectName();
        System.assert(name != null);
        
        actionPlan = testUtil.createNewActionPlan( 'opportunitys', 0 );
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        APDC = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) ); 
        name = APDC.getRelatedObjectName();
        System.assert(name != null);
        
        actionPlan = testUtil.createNewActionPlan( 'workorders', 0 );
        System.currentPageReference().getParameters().put( 'id', actionPlan.Id );
        APDC = new ActionPlanDetailController( new ApexPages.StandardController( new ActionPlan__c() ) ); 
        name = APDC.getRelatedObjectName();
        System.assert(name != null);
    }
}