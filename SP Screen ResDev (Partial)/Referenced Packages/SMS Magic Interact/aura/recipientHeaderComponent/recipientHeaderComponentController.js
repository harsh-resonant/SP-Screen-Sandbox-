({
	setDefaultOption : function(component, event, helper) {
        var conversationType = component.get("v.conversationType");
        var selectedType = conversationType.find(function (type) {
			return type.defaultSelected === true;
		});
        if(selectedType) {
            component.set('v.selectedConversationType',selectedType);
        }
	},
    onSelection : function(component, event, helper) {
    	var conversationType;
		var selectedType;
		conversationType = component.get('v.conversationType');
		selectedType = conversationType.find(function (type) {
			return type.name === event.currentTarget.id;
		});

		if(selectedType) {
			component.find('lookupList').closeDropdown();
            component.set('v.selectedConversationType',selectedType);
        }
    },
    toggleTextSearchPanel : function(component, event, helper) {
    	var openSearchPanel = component.get("v.openSearchPanel");
        if(openSearchPanel){
            component.set("v.openSearchPanel",false);
            component.set("v.searchText",null);
        	helper.applyRecipientFilter(component, event, helper);
        } else {
            component.set("v.openSearchPanel",true);
        }
    },
    fireLoadRecipientEvent : function(component) {
        var selectedType = component.get("v.selectedConversationType");
        var changedConversationTypeEvent = component.getEvent("changedConversationType");
        changedConversationTypeEvent.setParams({data:selectedType});
        changedConversationTypeEvent.fire();
    },
    applyRecipientFilter : function(component, event, helper) {
        var searchUnreadOnly = event.currentTarget.id  === 'true';
        component.set("v.searchUnreadOnly", searchUnreadOnly);
        helper.applyRecipientFilter(component, event, helper);
    },
    applyTextFilter : function(component, event, helper) {
        if(event.getParam('keyCode') === 13) {
            helper.applyRecipientFilter(component, event, helper);
        }
    },
    addLogic : function(component, event, helper) {
    },
    openPanel : function(component, event, helper) {
    }
})