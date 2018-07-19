@isTest
global class MockHttpResponses implements HttpCalloutMock{
    global HTTPResponse respond(HTTPRequest req) {
        System.debug('--------herereq---------'+req);
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"foo":"bar"}');
        res.setStatusCode(200);
        
        String jsonRes = '';
        if((req.getEndpoint().contains('/GetTimeSlots') )){
            System.debug('--------herereqinif---------'+req);
            jsonRes = '{"Starttime":"11:00 PM","Startdatetime":"2018-05-23T23:00:00.000Z","Slotid":"Zlrtq08i817aI9h","SlotDatetime":"2018-05-23T13:00:00.000Z","SlotDatefull":"05/23/2018 23:00:00","SlotDate":"2018-05-23","Endtime":"1:00 AM","endSlotDatetime":"2018-05-23T15:00:00.000Z","Enddatetime":"2018-05-24T01:00:00.000Z","Datetoshow":"23-05-2018"},{"Starttime":"1:00 AM","Startdatetime":"2018-05-24T01:00:00.000Z","Slotid":"PkyB27iUT9P9zqi","SlotDatetime":"2018-05-23T15:00:00.000Z","SlotDatefull":"05/24/2018 01:00:00","SlotDate":"2018-05-24","Endtime":"3:00 AM","endSlotDatetime":"2018-05-23T17:00:00.000Z","Enddatetime":"2018-05-24T03:00:00.000Z","Datetoshow":"24-05-2018"},{"Starttime":"7:00 PM","Startdatetime":"2018-05-28T19:00:00.000Z","Slotid":"HhQN2kx7uZj55kr","SlotDatetime":"2018-05-28T09:00:00.000Z","SlotDatefull":"05/28/2018 19:00:00","SlotDate":"2018-05-28","Endtime":"9:00 PM","endSlotDatetime":"2018-05-28T11:00:00.000Z","Enddatetime":"2018-05-28T21:00:00.000Z","Datetoshow":"28-05-2018"}';
        } if(req.getEndpoint().contains('/oauth2/token')){
            System.debug('--------herereqiniftokenif---------'+req);
            jsonRes ='{"access_token": "00D0l000000DDFD!AQsAQKWf8Ex3iej_EdOuByIM8pPbI7scgwyf90WIXVZu7w9MbI_GCuSmZONDnG9NdGg.RmVcSzVeGRQVYtwqVbCLA_5GrFQG","instance_url": "https://cs58.salesforce.com","id": "https://test.salesforce.com/id/00D0l000000DDFDEA4/00528000002Pb6lAAC","token_type": "Bearer","issued_at": "1526013628597","signature": "8xkbOMn6zbivqF/oUxozezxHWmOJ/sTOSNVXCdWpL88="}';
        }
        System.debug('--------herereqinif---------'+jsonRes );
        res.setBody(jsonRes);        
        res.setStatusCode(200);
        return res;
    }
}