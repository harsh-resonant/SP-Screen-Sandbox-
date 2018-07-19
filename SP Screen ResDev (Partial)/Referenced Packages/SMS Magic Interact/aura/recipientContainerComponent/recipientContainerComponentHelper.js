({
	getUnreadCount : function(component, selectedType) {
        var notification = component.find("NotificationManager");
        var action = component.get("c.getUnreadRecords");
        action.setParams({requestContext: null, objectName: selectedType});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnVal = response.getReturnValue();
                if (returnVal) {
                    var responseTO = returnVal.responseTO;
                    if(responseTO) {
                        if(responseTO.status === 'SUCCESS') {
                            component.set("v.unreadCount", returnVal.responseText);
                        } else if(responseTO.status === 'FAILURE') {
                            component.set("v.unreadCount", 0);
                            var errResponseObj = responseTO.errResponseObj;
                            if(errResponseObj) {
                                notification.showNotification('utility:error', 'toast', 'error', errResponseObj.code, '10000');
                            }
                        }
                    }
                }
            } else if(state === "ERROR") {
                var str = response.getError();
                if(str && str.length) {
                    notification.showNotification('utility:error', 'toast', 'error', str[0].message, '5000');
                }
            }
        });
        $A.enqueueAction(action);
    },
    showSpinner : function(component) {
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    hideSpinner : function(component, event) {
        var spinner = component.find("mySpinner");
        $A.util.addClass(spinner, "slds-hide");
    }
})