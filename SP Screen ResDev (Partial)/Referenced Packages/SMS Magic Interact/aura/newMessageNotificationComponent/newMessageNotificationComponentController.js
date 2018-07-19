({
	doInit : function(component, event, helper) {
		var newIncomingRecords = component.get("v.newIncomingRecords");
        if(newIncomingRecords.length === 1){
            if(newIncomingRecords[0].objectName.toLowerCase() === "incoming sms"){
                var lookupMessages = component.find("lookupMessages");
                $A.util.addClass(lookupMessages,'slds-hide');
                var noLookupMessages = component.find("noLookupMessages");
                $A.util.removeClass(noLookupMessages,'slds-hide');
            }
        }
	}
})