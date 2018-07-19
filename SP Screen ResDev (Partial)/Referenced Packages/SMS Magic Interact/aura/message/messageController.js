({
    init : function(component, event, helper) {
        var message = component.get("v.message");
        component.set("v.CRMActions", {CRMActionsList:[]});
        if(!message) {
            return;
        }
        var lastDateInIteration = component.get("v.lastDateInIteration");
        var newdateString = message.sentDateString;
        if(newdateString){
        	var newdateList =newdateString.split(" ");
        	if(lastDateInIteration){
            	if(lastDateInIteration === newdateList[0]){
            	    var dateDiv =  component.find('dateLine');
            	    $A.util.addClass(dateDiv, "slds-hide");
            	}
        	}
            component.set('v.lastDateInIteration', newdateList[0]);
            var date = new Date(newdateList[0]);
            var formattedDateString = date.toString().split('00')[0];
        	component.set('v.dateString', formattedDateString);
        	component.set('v.timeString', newdateList[1]+' '+newdateList[2]);
        }
        //var lookupinfoList = message.lookupInfoList;
        var messageInfoList = [];
        var senderId = message.senderID;
        var mobileNumber = message.mobileNo;
        if(senderId){
            var sendrIdLabel = $A.get("$Label.smagicinteract.SENDERID");
            var senderIdObject = {value : sendrIdLabel,
                                  label : senderId,
                                  name  : "" }
            messageInfoList.unshift(senderIdObject);
        }
        if(mobileNumber){
            var mobileNumberLabel = $A.get("$Label.smagicinteract.MOBILENUMBER");
            var mobileNumberObject = {
                value: mobileNumberLabel,
                label: mobileNumber,
                name: ""
            };
            messageInfoList.unshift(mobileNumberObject);
        }
        component.set('v.messageInfoList', messageInfoList);
        //message.lookupInfoList = lookupinfoList;
        if(message.attachedFilesList) {
        message.attachedFilesList = message.attachedFilesList.map(function(url) {
            return {
                type : helper.getMediaType(url),
                path : helper.getMediaUrl(url)
            };
        });
        component.set("v.message", message);
        }
        helper.addCRMAction(component);
    },
    addStarToMessage : function(component, event) {
        var action = component.get("c.changeStar");
        var messageId = event.currentTarget.id;
        var message = component.get("v.message");
        var notification = component.find("NotificationManager");

        if(!message || !messageId) {
            return;
        }

        if (message.isStarred) {
            message.isStarred = false;
        } else {
            message.isStarred = true;
        }
        component.set("v.message", message);

        action.setParams({recordId: messageId});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                var returnValue = response.getReturnValue();
                if(returnValue) {
                    var responseTO = returnValue.responseTO;
                    if(responseTO) {
                        if(responseTO.status === 'Failed') {
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
                if (message.isStarred) {
                    message.isStarred = false;
                } else {
                    message.isStarred = true;
                }
                component.set("v.message", message);
            }
        });
        $A.enqueueAction(action);
    },
    openModal : function(component, event) {
        var i = event.currentTarget.id;
        var compEvent = component.getEvent("multimediaPreviewEvent");
        var message = component.get("v.message");
        var multimedia = message.attachedFilesList[i];
        compEvent.setParams({multimedia : multimedia });
		compEvent.fire();
    },
    resendFailedSMS : function(component, event) {
        var messageId = event.currentTarget.id;
        if(!messageId) {
            return;
        }
        var notification = component.find("NotificationManager");

        var action = component.get("c.resendSMS");
        action.setParams({recordId: messageId});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                var returnValue = response.getReturnValue();
                if(returnValue) {
                    var responseTO = returnValue.responseTO;
                    if(responseTO) {
                        if(responseTO.status === 'Success') {
                            $A.get('e.smagicinteract:reloadConversation').fire();
                        } else if(responseTO.status === 'Failed') {
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
    performCRMActions : function(component, event, helper) {
        var action = event.currentTarget.id;
        var CRMActions = component.get("v.CRMActions");
        var recordId = component.get("v.recordId");
        var message =  component.get("v.message");
        var notification = component.find("NotificationManager");
        
        if(!action || !recordId || !CRMActions) {
            notification.showNotification('utility:error', 'toast', 'error', $A.get('$Label.smagicinteract.unable_to_perform_crm_action'), '5000');
            return;
        }
        if(action === 'viewRecord') {
            helper.viewRecord(component, recordId);
        }
        if(action === 'editRecord') {
            helper.editRecord(component, CRMActions.messageId);
        }
        if(action === 'createLead') {
            helper.createLead(component, recordId, CRMActions.messageId, message);
        }
        if(action === 'createTask') {
            helper.createTask(component, recordId, CRMActions.messageId, message, CRMActions.sObjectName);
        }
        if(action === 'createEvent') {
            helper.createEvent(component, recordId, CRMActions.messageId, message, CRMActions.sObjectName);
        }
        if(action === 'createCase') {
            helper.createCase(component, recordId, CRMActions.messageId, message, CRMActions.sObjectName);
        }
        if(action === 'createContact') {
            helper.createContact(component, recordId, CRMActions.messageId, message);
        }
        if(action === 'createAccount') {
            helper.createAccount(component, recordId, CRMActions.messageId, message);
        }
        if(action === 'createOpportunity') {
            helper.createOpportunity(component, recordId, CRMActions.messageId, message, CRMActions.sObjectName);
        }
    },
    onMessageInfoPopoverTrigger: function (component, event, helper) {
        var messageInfoPopover = component.find('messageInfoPopover');
        if (helper.isLastVisibleMessage(component)) {
            messageInfoPopover.set('v.position', 'top-left');
        } else {
            messageInfoPopover.set('v.position', 'bottom-left');
        }
    },
    onCrmActionPopoverTrigger: function (component, event, helper) {
        var crmActionPopover = component.find('crmActionPopover');
        if (helper.isLastVisibleMessage(component)) {
            crmActionPopover.set('v.position', 'top-left');
        } else {
            crmActionPopover.set('v.position', 'bottom-left');
        }
    }
})