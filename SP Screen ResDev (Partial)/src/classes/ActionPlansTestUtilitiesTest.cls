@isTest
public with sharing class ActionPlansTestUtilitiesTest {
    static TestMethod void testbatchIds(){
      
      ActionPlansTestUtilities apTestUtil = new ActionPlansTestUtilities();
      
      System.assert( apTestUtil.batchIds('accounts') != null );
    }
    
     static TestMethod void testRandomWord(){
      
      ActionPlansTestUtilities apTestUtil = new ActionPlansTestUtilities();
      
      System.assert( apTestUtil.createRandomWord() != apTestUtil.createRandomWord() );
    }
    /*
	static TestMethod void testcreateNewActionPlanTemplateTask(){
    
		test.startTest();
			ActionPlansTestUtilities apTestUtil = new ActionPlansTestUtilities();	      
			apTestUtil.createNewActionPlanTemplateTask( null,1,new User(),'EMAIL','LOW');
		test.stopTest();
    }   
    
	static TestMethod void testcreateNewActionPlanTask(){
    
		test.startTest();
			ActionPlansTestUtilities apTestUtil = new ActionPlansTestUtilities();	      
			apTestUtil.createNewActionPlanTask( null,1,new User(),'EMAIL','LOW');
		test.stopTest();
    }     

   	static TestMethod void testcreateNewActionPlan(){
    
		test.startTest();
			ActionPlansTestUtilities apTestUtil = new ActionPlansTestUtilities();	      
			apTestUtil.createNewActionPlan( 'REL_OBJECT',0);
		test.stopTest();
    }  */
}