({
    init : function(component, event, helper) {
        var action = component.get('c.loadSenderData');
        var notification = component.find("NotificationManager");
        var i;
        action.setParams({requestContext : ''});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                var returnVal = response.getReturnValue();
                if(returnVal) {
                    var responseTO = returnVal.responseTO;
                    if(responseTO && responseTO.status === 'FAILURE') {
                            var errResponseObj = responseTO.errResponseObj;
                            if(errResponseObj) {
                                notification.showNotification('utility:error', 'toast', 'error', errResponseObj.code, '5000');
                            }
                            return;
                    }
                    var pickList = returnVal.picklistOptionList;
                    if(!pickList){
                        return;
                    } else {
                        component.set("v.senderIdList", pickList);
                        var defaultSelectedSenderId = component.get('v.defaultSelectedSenderId');
                        if(defaultSelectedSenderId) {
                            for(i =0; i<pickList.length; i+=1){
                                if(pickList[i].value === defaultSelectedSenderId){
                                    helper.fireSelectionEvent(component, event, helper, pickList[i].value);
                                    component.set('v.selectedSenderId', pickList[i].label);
                                    return;
                                }
                            }
                        }
                        for(i =0; i<pickList.length; i+=1){
                            if(pickList[i].defaultSelected){
                                helper.fireSelectionEvent(component, event, helper, pickList[i].value);
                                component.set('v.selectedSenderId', pickList[i].label);
                                return;
                            }
                        }
                        helper.fireSelectionEvent(component, event, helper, pickList[0].value);
                        component.set('v.selectedSenderId', pickList[0].label);
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
    selectedSenderId : function(component, event, helper){
        var selectedSenderId = component.find('senderIdDropDown').get('v.value');
        var senderIdList = component.get('v.senderIdList');
        for(var i =0; i<senderIdList.length; i+=1) {
            if(senderIdList[i].value === selectedSenderId){
                helper.fireSelectionEvent(component, event, helper, senderIdList[i].value);
                component.set('v.selectedSenderId', senderIdList[i].label);
                return;
            }
        }
    }
});