/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class CallDetails {
    global NVMContactWorld.CallDetails.FromCaller fromCaller {
        get;
    }
    global String id {
        get;
    }
    global List<NVMContactWorld.CallDetails.Links> links {
        get;
    }
    global Boolean recordCall {
        get;
    }
    global String recordingStatus {
        get;
    }
    global NVMContactWorld.CallDetails.Regarding regarding {
        get;
    }
    global NVMContactWorld.CallDetails.CallResult result {
        get;
    }
    global String status {
        get;
    }
    global NVMContactWorld.CallDetails.ToCaller toCaller {
        get;
    }
    global CallDetails() {

    }
global class CallResult {
    global String code {
        get;
    }
    global String party {
        get;
    }
    global String reason {
        get;
    }
    global CallResult() {

    }
}
global class FromCaller {
    global String agentId {
        get;
    }
    global String presentedClid {
        get;
    }
    global String telephoneNumber {
        get;
    }
    global FromCaller() {

    }
}
global class Links {
    global String href {
        get;
    }
    global String rel {
        get;
    }
    global Links() {

    }
}
global class Regarding {
    global String reference {
        get;
    }
    global Regarding() {

    }
}
global class ToCaller {
    global String telephoneNumber {
        get;
    }
    global ToCaller() {

    }
}
}
