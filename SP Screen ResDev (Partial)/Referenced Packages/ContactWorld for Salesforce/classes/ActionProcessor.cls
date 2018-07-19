/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class ActionProcessor implements Database.Batchable<SObject> {
    global ActionProcessor() {

    }
    global void execute(Database.BatchableContext BC, List<NVMContactWorld__Background_Action__c> scope) {

    }
    global void finish(Database.BatchableContext BC) {

    }
    global Database.QueryLocator start(Database.BatchableContext BC) {
        return null;
    }
global interface IActionHandler {
    void execute(NVMContactWorld__Background_Action__c param0);
}
}
