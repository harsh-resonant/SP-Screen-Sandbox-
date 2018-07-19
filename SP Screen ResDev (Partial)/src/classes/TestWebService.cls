public class TestWebService{
    public TestWebService(){
                                //You will get "clientId","clientSecret" when creating connected app in salesforce
        String clientId = '3MVG99S6MzYiT5k9F3kCT3qclTCB5TLiiPu0s8R6tKtDWpWtANl6Z2lpgIWnFkmItpXh1CaxWaUmwvasIomVb';
        String clientSecret = '2645737069529832656';

        //We can also store our username password in custom setting.
        String username='danielle@spscreens.com.au.resdev';//salesforce username 
        String password='SpScreens228vr8iCZapH8vl5k8DohzBXS';//EUe4eHjMxXb8UFco1SPcpsZL9';//salesforce password
        // Generating the Access Token
        HttpRequest req = new HttpRequest();
        req.setMethod('POST');
        req.setEndpoint('https://test.salesforce.com/services/oauth2/token');// this is the OAuth endpoint where this request will be hit
        req.setBody('grant_type=password&client_id='+clientId+'&client_secret='+clientSecret+'&username='+username+'&password='+password);
        
        Http http = new Http();
        HTTPResponse res = http.send(req);
        String str = res.getBody();
        system.debug('Gaurang: Testing response' + str);
        
        Wrapper wrapObj = new Wrapper(); 
        wrapObj = (Wrapper)Json.deserialize(str,Wrapper.class);
        String accessToken = wrapObj.access_token;
        String instanceUrl = wrapObj.instance_url;
        
        System.debug('Access Token :' + accessToken ); 
        System.debug('Istance URL :' + instanceUrl ); 
        
        //----------------Code started to make actual call
        
        CallFSLWebService(accessToken,instanceUrl  );
        
       
    }
    Public void  CallFSLWebService(String AccessToken,String URL)
    {
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        
        req.setMethod('POST');
        //req.setEndpoint(wrapObj.instance_url+'/services/apexrest/Account/getAccountById?name=champaKAli');
        
        req.setEndpoint(URL+'/services/apexrest/GetTimeSlots');
        req.setHeader('Authorization', 'OAuth '+AccessToken);
        
        req.setHeader('Content-Type', 'application/json');
        req.setBody('{"saId":"08p0l0000000jPYAAY","policyId":"a1c28000002rHW4AAM"}');
        HTTPResponse res = http.send(req);
        
        System.debug('***Response***** ' + res.getBody());
    }
    public class Wrapper{
        String id;
        String instance_url;
        String access_token;
        String issued_at;
        String signature;
    }
}