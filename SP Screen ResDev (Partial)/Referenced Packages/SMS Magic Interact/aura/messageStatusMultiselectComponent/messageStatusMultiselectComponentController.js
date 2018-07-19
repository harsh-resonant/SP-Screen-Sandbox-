({
    init : function(component, event, helper) {
        var items = component.get("v.items");
        var recordId = component.get("v.recordId");
        var notification = component.find("NotificationManager");
        component.set("v.items", []);
        
        if(recordId) {
            var action = component.get("c.getDeliveryStatusOptions");
            action.setParams({recordId: recordId});
            action.setCallback(this, function(response) {
                var state = response.getState();
                if(state === "SUCCESS") {
                    var returnValue = response.getReturnValue();
                    if(returnValue) {
                        var responseTO = returnValue.responseTO;
                        if(responseTO) {
                            if(responseTO.status === 'Success') {
                                component.set("v.items", returnValue.picklistOptionList);
                            } else if(responseTO.status === 'Failed') {
                                var errResponseObj = responseTO.errResponseObj;
                                if(errResponseObj) {
                                    notification.showNotification('utility:error', 'toast', 'error', errResponseObj.code, '5000');
                    }
                            } else {
                                notification.showNotification('utility:error', 'toast', 'error', $A.get('$Label.smagicinteract.unexpected_error'), '5000');
                            }
                        } else {
                            notification.showNotification('utility:error', 'toast', 'error', $A.get('$Label.smagicinteract.unexpected_error'), '5000');
                        }
                    }
                } else if(state === "ERROR") {
                    var str = response.getError();
                    if(str && str.length) {
                        notification.showNotification('utility:error', 'toast', 'error', str[0].message, '5000');
                    }
                } else {
                    notification.showNotification('utility:error', 'toast', 'error', $A.get('$Label.smagicinteract.unexpected_error'), '5000');
                }
            });
            $A.enqueueAction(action);
        }
    },
    getValues : function(component, event, helper) {
        var comboBox = component.find("comboBox");
        if(comboBox) {
            var messageStatusList = comboBox.get("v.values");
            var cmpEvt = component.getEvent("getMessageStatusList");
            cmpEvt.setParams({responseList : messageStatusList});
            cmpEvt.fire();
        }
    },
    resetData : function(component, event, helper) {
        var comboBox = component.find("comboBox");
        var source = event.getParam("source");
        if(comboBox && source === 'filterPanelComponent') {
            comboBox.resetDataList();
        }
    }
})