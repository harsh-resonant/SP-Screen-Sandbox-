({
	doInit : function(component, event, helper) {
        helper.showSpinner(component);
		helper.loadData(component, helper);
        helper.performPushTopicChecks(component);
	},
    onRecordIdChange: function onRecordIdChange(component, event, helper) {
        helper.showSpinner(component);
        helper.loadDataForRecipient(component, helper);
    },
	handleMultimediaRequest : function(component, event) {
		var multimedia = event.getParam("multimedia");
		component.find('multimediaPreview').set("v.multimedia", multimedia);
	},
    scroll: function (component, event, helper) {
        var scrollDiv = component.find("messageList").getElement();
        var pageNumber = component.get("v.pageNumber");
        component.set('v.scrollTop', scrollDiv.scrollTop);
        if (scrollDiv && scrollDiv.scrollTop === 0 && pageNumber > -1) {
            helper.loadData(component, helper);
        }
    },
    scrollControl : function(component, event, helper) {
    	helper.scrollControl(component);
    },
    reloadMessage : function(component, event, helper) {
        helper.showSpinner(component);
    	helper.reloadMessage(component, helper, true);
    },
    setupCometd : function(component, event, helper) {
        var sessionId = component.get('v.sessionId');
        if (sessionId) {
            var recordId = component.get('v.recordId');
            helper.setupCometd(component, helper, recordId, sessionId);
            component.set('v.iscometdSetup', true);
        } else {
            component.set('v.iscometdFileloaded', true);
        }
    },
    //reloadMessage : function(component, event, helper) {
    //	helper.reloadMessage(component, helper, true);
    //},
    unreadMessage : function(component, event) {
        var notification = component.find("NotificationManager");
        var filtercriteria = component.get("v.filtercriteria");
        var paginationCriteria;
        if(filtercriteria) {
            paginationCriteria = { filterCrieriaList: filtercriteria }
        }
        var recordId = component.get("v.recordId");
    	var action = component.get("c.markInboundRead");
        action.setParams({recordID : recordId, jsonPaginationCriteria: JSON.stringify(paginationCriteria)});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                var returnVal = response.getReturnValue();
                if(returnVal && returnVal.status === 'Success') {
                var appEvent = $A.get("e.smagicinteract:getConversationCountEvent");
                if(appEvent) appEvent.fire();
                } else if (returnVal && returnVal.errResponseObj && returnVal.status === 'Failed') {
                    notification.showNotification('utility:error', 'toast', 'error', returnVal.errResponseObj.code, '5000');
                }
            } else if (state === "ERROR") {
               var str = response.getError();
               if (str && str.length) {
                    notification.showNotification('utility:error', 'toast', 'error', str[0].message, '5000');
                } 
            }
        });
        $A.enqueueAction(action);
        
    },
    getPaginationCriteria : function(component, event) {
        var filtercriteriaList = event.getParam("filtercriteriaList");
        component.set("v.isFilterApplied", event.getParam("isfilterChanged"));
        if(!filtercriteriaList) {
            return;
        }
        component.set("v.filtercriteria", filtercriteriaList);
    },
    resetFilter : function(component, event) {
    	var appEvent = $A.get("e.smagicinteract:refreshEvent");
        if(appEvent) {
            appEvent.setParams({source:'resetFilter'});
            appEvent.fire();
        }
    }
})