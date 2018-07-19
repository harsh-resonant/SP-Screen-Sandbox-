({
	doInit: function (component, event, helper) {
		helper.getRecipientData(component);
	},
	onRecordIdChange: function onRecordIdChange(component, event, helper) {
        component.set("v.isfilterChanged",false);
		helper.getRecipientData(component);
	},
	openConversationTimeline: function (component, event, helper) {
		component.getEvent("openConversationTimeline").fire();
	},
	openConversationFilter: function (component, event, helper) {
		component.getEvent("openConversationFilter").fire();
	},
    getPaginationCriteria : function(component, event, helper) {
        var isfilterChanged = event.getParam("isfilterChanged");
        component.set("v.isfilterChanged", isfilterChanged);
    },
	openPanel: function (component, event, helper) {},
	delegateDropdownAction: function (component, event, helper) {},
    openRecipientSection : function (component, event, helper) {
        $A.get("e.smagicinteract:refreshEvent").setParams({source:'conversationHeader',
                                                           refresh: true
                                                          }).fire();
    }
})