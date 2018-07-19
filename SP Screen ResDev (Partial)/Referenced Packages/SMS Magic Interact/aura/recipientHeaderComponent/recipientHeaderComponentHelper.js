({
	applyRecipientFilter : function(component, event, helper) {
        var searchText = component.get("v.searchText");
        var searchStringEvent = component.getEvent("applyRecipientFilter");
        var searchUnreadOnly = component.get("v.searchUnreadOnly"); //component.find('recipientToggle').get('v.checked');
        component.set('v.searchUnreadOnly', searchUnreadOnly);
        var eventData ={};
        eventData.searchText = searchText;
        eventData.searchUnreadOnly = searchUnreadOnly;
        searchStringEvent.setParams({data:eventData});
        searchStringEvent.fire();
    }
})