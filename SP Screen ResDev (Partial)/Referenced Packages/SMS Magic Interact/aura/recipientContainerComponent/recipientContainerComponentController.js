({
    doInit : function(component, event, helper) {
        var notification = component.find("NotificationManager");
        helper.showSpinner(component);
        var action = component.get("c.loadConversationRecords");
        action.setParams({requestContext: null, criteria : null});
        action.setCallback(this, function(response) {
            var state = response.getState();
            helper.hideSpinner(component);
            if (state === "SUCCESS") {
                var returnVal = response.getReturnValue();
                if (returnVal) {
                    var responseTO = returnVal.responseTO;
                    if(responseTO) {
                        if(responseTO.status === 'SUCCESS') {
                            var lookupObjects = returnVal.lookupObjects;
                            component.find("headerComponent").set("v.conversationType",lookupObjects);
                        } else if(responseTO.status === 'FAILURE') {
                            var errResponseObj = responseTO.errResponseObj;
                            if(errResponseObj) {
                                notification.showNotification('utility:error', 'toast', 'error', errResponseObj.code, '5000');
                            }
                        }
                    }
                }
            } else {
                var str = response.getError();
                if(str && str.length) {
                    notification.showNotification('utility:error', 'toast', 'error', str[0].message, '5000');
                }
            }
        });
        $A.enqueueAction(action);
	},
    loadRecipientListwithType : function(component, event, helper) {
        var data = event.getParam("data");
        var selectedRecipientType = data.name;
        helper.getUnreadCount(component, selectedRecipientType);
        component.set("v.selectedRecipientListType",selectedRecipientType);
    },
    applyRecipientFilter : function(component, event) {
        var data = event.getParam("data");
        var searchText = data.searchText;
        var searchUnreadOnly = data.searchUnreadOnly;
        var recipientsList = component.find('recipientsList');
        recipientsList.set("v.searchText",searchText);
        recipientsList.set("v.searchUnreadOnly",searchUnreadOnly);
    },
    updateUnreadCound : function(component, event, helper) {
        var objectName = component.get("v.selectedRecipientListType");
    	helper.getUnreadCount(component, objectName);
    },
    changeContextClasses : function changeContextClasses(component, event, helper) {
    	var context = component.get("v.context");
        if(context){
            if(context.isLightning){
                component.set("v.uiContextClass","ui-context--lightning");
            } else if (context.isClassic){
                component.set("v.uiContextClass","ui-context--classic");
            } else if(context.isSf1){
                component.set("v.uiContextClass","ui-context--sf1");
            }
            if(context.isDetailPage){
                component.set("v.embededContextClass","embeded-context--detail");
            } else if (context.isCustomTab){
                component.set("v.embededContextClass","embeded-context--customTab");
            } else if(context.isActivitySection){
                component.set("v.embededContextClass","embeded-context--activitySection");
            } else if(context.isHomeSection){
                component.set("v.embededContextClass","embeded-context--homeSection");
            }
        }
    },
    toggleSpinner : function(component, event, helper) {
        var isActive = event.getParam('isActive');
        if(isActive) {
            helper.showSpinner(component);
        } else {
            helper.hideSpinner(component);
        }
    }
})