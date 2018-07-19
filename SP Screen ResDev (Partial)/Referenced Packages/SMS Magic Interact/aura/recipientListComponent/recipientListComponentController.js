({
    /*doInit : function(component, event, helper) {
        helper.loadRecipientList(component, event, helper, false);
    },*/
    refreshRecipientList : function(component, event, helper) {
        var refresh = event.getParam("refresh");
        var source = event.getParam("source");
        var incomingRecord = event.getParam("info");
        if(source === 'incoming' && refresh) {
            helper.loadNewRecipientRecords(component, event, helper, incomingRecord.Id);
        }
    },
    loadRecipientList : function(component, event, helper) {
    		var context;
            helper.addSpinner(component);
            component.set("v.allRecipientLoaded",false);
            component.set("v.pageNumber",-1);
            component.set("v.recipientList",null);
            component.set("v.loadedRecords",null);
            context = component.get('v.context');
            helper.loadRecipientList(component, event, helper, !context.isSf1 && !context.isHomeSection && !context.isActivitySection);
            component.set("v.isCampaignMemberDisplayed", false);
    },
    scroll : function(component, event, helper) {
        var scrollDiv = component.find("recipientList");
        var pageNumber = component.get("v.pageNumber");
        if (scrollDiv.getElements()[0].scrollTop + scrollDiv.getElements()[0].clientHeight > scrollDiv.getElements()[0].scrollHeight -15 && pageNumber > -1) {
            if(!component.get("v.isNewPageBeingLoaded") && !component.get("v.allRecipientLoaded")){
                component.set("v.isNewPageBeingLoaded",true);
                var displayLoadingText = component.find("loadText");
                $A.util.addClass(displayLoadingText,'slds-show');
                $A.util.removeClass(displayLoadingText,'slds-hide');
                helper.loadRecipientList(component, event, helper, true);
            }
        }
    },
    selectRecord : function(component, event, helper) {
        var selectedId = event.currentTarget.id;
        var context = component.get("v.context");
        if(context.isSf1 || context.isHomeSection) {
            component.getEvent("recipientRecordChanged").setParams({isClickedInSF1 : true}).fire();
        }
        
        //701 is Campaign object prefix
        if(selectedId && selectedId.startsWith('701')) {
            helper.toggleCampaignMembers(component, helper, selectedId);
        }
        component.set("v.selectedRecipientId", selectedId);
    },
    fireRecipientRecordChanged : function(component, event, helper) {
        var recordChangedEvent = component.getEvent("recipientRecordChanged");
        var recordId = component.get("v.selectedRecipientId");
        var selectedRecipientListType = component.get("v.selectedRecipientListType");
        var unreadCount = component.get("v.recipientUnreadCount");
        recordChangedEvent.setParams({recordId : recordId,
                                      unreadCount: unreadCount,
                                      objectName: selectedRecipientListType
                                     });
        recordChangedEvent.fire();
    }
})