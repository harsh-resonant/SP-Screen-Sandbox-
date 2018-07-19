({
    doInit : function(component, event, helper) {
    	var action = component.get("c.getUsersOptions");
        action.setParams({});
        action.setCallback(this, function(response) {
            var notification = component.find("NotificationManager");
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnVal = response.getReturnValue();
                if (returnVal && returnVal.responseTO && returnVal.responseTO.status === 'Success') {
                    var granularityList = returnVal.granularityList;
                    if(granularityList && granularityList.length){
                        for(var i =0 ;i<granularityList.length;i++){
                            if(granularityList[i].defaultSelected){
                                component.set("v.defaultUserFilterValue",granularityList[i].name);
                                component.set("v.userSenderFilterValue", granularityList[i].name);
                                helper.resetUserSenderFilter(component);
                            }
                        }
                    }
                    component.set("v.disableGranularitySelection" , !(returnVal.msgSendPermission ? returnVal.msgSendPermission.canChangeMessageGranularity : false));
                } else if (returnVal && returnVal.responseTO && returnVal.responseTO.status === 'Failed' && returnVal.responseTO.errResponseObj) {
                    notification.showNotification('utility:error', 'toast', 'error', returnVal.responseTO.errResponseObj.code, '5000');
                }
            } else if (response.getError() && response.getError().length) {
                notification.showNotification('utility:error', 'toast', 'error', response.getError()[0].message, '5000');
            }
        });
        $A.enqueueAction(action);
    },
    applyFilter : function(component, event, helper) {
        helper.waitAfterChange(component, event, helper);
	},
    resetAndApplyFilter : function(component, event, helper) {
        helper.resetFilter(component, helper);
        helper.waitAfterChange(component, event, helper);
	},
    resetFilter : function(component, event, helper) {
        helper.resetFilter(component, helper);
	},
    closePanel : function(component, event, helper) {
		component.set("v.isDisplayed", false);
        var closeEvent = component.getEvent('closeThirdSection');
        closeEvent.fire();
	},
    setRelatedRecordList : function(component, event, helper) {
        component.set("v.relatedRecordList", event.getParam('responseList'));
        helper.waitAfterChange(component, event, helper);
	},
    setMessageStatusList : function(component, event, helper) {
		component.set("v.messageStatusList", event.getParam('responseList'));
        helper.waitAfterChange(component, event, helper);
	},
    setDateRange : function(component, event, helper) {
        var from = event.getParam('from');
        var to = event.getParam('to');
        var message = event.getParam('message');
        if(!message) return;
        
        if(message === 'INVALID') {
            //component.set("v.isDisabled", true);
        } else if(message === 'CLEAR') {
            component.set("v.from", undefined);
            component.set("v.to", undefined);
        //component.set("v.isDisabled", false);
        } else if(message === 'SUCCESS') {
        component.set("v.from", from);
        component.set("v.to", to);
            //component.set("v.isDisabled", false);
		helper.waitAfterChange(component, event, helper);
        }
    },
    applyUserSenderFilter : function(component, event, helper) {
        var senderFilterValue = component.get("v.senderFilterValue");
        var userFilterValue = component.get("v.userFilterValue");
        
        var filterValue = 'all';
        if(userFilterValue && senderFilterValue) filterValue = 'ownersender';
        else if(userFilterValue && !senderFilterValue) filterValue = 'owner';
        else if(!userFilterValue && senderFilterValue) filterValue = 'sender';
        component.set("v.userSenderFilterValue", filterValue);
        helper.waitAfterChange(component, event, helper);
    },
    resetFilterFromMessageList : function(component, event, helper) {
        var source = event.getParam("source");
        if(source === 'resetFilter' ) {
        	helper.resetFilter(component, helper);
        	helper.waitAfterChange(component, event, helper);
        }
    }
})