@isTest
global class MockHttpResponseGenerator implements HttpCalloutMock {
    // Implement this interface method
    global HTTPResponse respond(HTTPRequest req) {
        // Optionally, only send a mock response for a specific endpoint
        // and method.
        //System.assertEquals('http://api.salesforce.com/foo/bar', req.getEndpoint());
        //System.assertEquals('GET', req.getMethod());
        
        //some if else here to support multiple endpoint 
         
        
        // Create a fake response
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"foo":"bar"}');
        res.setStatusCode(200);
        
        if(req.getBody().contains('<Invoice>'))
        res.setBody('[{"Starttime":"11:00 PM","Startdatetime":"2018-05-23T23:00:00.000Z","Slotid":"Zlrtq08i817aI9h","SlotDatetime":"2018-05-23T13:00:00.000Z","SlotDatefull":"05/23/2018 23:00:00","SlotDate":"2018-05-23","Endtime":"1:00 AM","endSlotDatetime":"2018-05-23T15:00:00.000Z","Enddatetime":"2018-05-24T01:00:00.000Z","Datetoshow":"23-05-2018"},{"Starttime":"1:00 AM","Startdatetime":"2018-05-24T01:00:00.000Z","Slotid":"PkyB27iUT9P9zqi","SlotDatetime":"2018-05-23T15:00:00.000Z","SlotDatefull":"05/24/2018 01:00:00","SlotDate":"2018-05-24","Endtime":"3:00 AM","endSlotDatetime":"2018-05-23T17:00:00.000Z","Enddatetime":"2018-05-24T03:00:00.000Z","Datetoshow":"24-05-2018"},{"Starttime":"7:00 PM","Startdatetime":"2018-05-28T19:00:00.000Z","Slotid":"HhQN2kx7uZj55kr","SlotDatetime":"2018-05-28T09:00:00.000Z","SlotDatefull":"05/28/2018 19:00:00","SlotDate":"2018-05-28","Endtime":"9:00 PM","endSlotDatetime":"2018-05-28T11:00:00.000Z","Enddatetime":"2018-05-28T21:00:00.000Z","Datetoshow":"28-05-2018"}]');        
                
        return res;
    }
}