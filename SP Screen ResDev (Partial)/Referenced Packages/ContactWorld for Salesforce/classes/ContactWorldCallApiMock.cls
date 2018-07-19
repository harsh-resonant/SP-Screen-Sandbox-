/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class ContactWorldCallApiMock implements NVMContactWorld.ICallApi, NVMContactWorld.ICallWithPresentedClidApi, NVMContactWorld.IMakeCallWithContextApi {
    global String callStatus {
        get;
        set;
    }
    global Map<String,String> context {
        get;
    }
    global String dialledNumber {
        get;
    }
    global String presentedClid {
        get;
    }
    global String resultCode {
        get;
        set;
    }
    global ContactWorldCallApiMock() {

    }
    global NVMContactWorld.CallDetails GetCallDetails(String id) {
        return null;
    }
    global NVMContactWorld.CallDetails MakeCall(String phoneNumber) {
        return null;
    }
    global NVMContactWorld.CallDetails MakeCall(String phoneNumber, String presentedClid) {
        return null;
    }
    global NVMContactWorld.CallDetails MakeCall(Map<String,String> context) {
        return null;
    }
}
