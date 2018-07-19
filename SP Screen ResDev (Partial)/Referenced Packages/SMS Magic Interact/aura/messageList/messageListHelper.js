({
    loadData: function (component, helper, shouldReload) {
        var messageList;
        var PageCriteria;
        var loadText;
        var lastMessageLoaded;
        var filtercriteria;
        var paginationCriteria;
        var paginationCriteriaString;
        var recordId = component.get("v.recordId");
        if (!recordId) {
            component.set("v.messageList", []);
            helper.hideSpinner(component);
            return;
        }
        messageList = component.get("v.messageList");
        if (messageList && messageList.length && !shouldReload) {
            lastMessageLoaded = component.get("v.lastMessageLoaded");
            if (lastMessageLoaded) {
                loadText = component.find('loadText');
                $A.util.addClass(loadText, 'slds-hide');
                $A.util.removeClass(loadText, 'slds-show');
                return;
            } else {
                loadText = component.find('loadText');
                $A.util.addClass(loadText, 'slds-show');
                $A.util.removeClass(loadText, 'slds-hide');
                PageCriteria = {};
                PageCriteria.lastRecordID = messageList[0].messageId;
            }
        }
        filtercriteria = component.get("v.filtercriteria");
        paginationCriteria = {
            pageCriteriaObject: PageCriteria,
            filterCrieriaList: filtercriteria
        };
        paginationCriteriaString = JSON.stringify(paginationCriteria);
        helper.getConversationData(component, helper, shouldReload, recordId, paginationCriteriaString);
    },
    getConversationData: function getConversationData(component, helper, shouldReload, recordId, paginationCriteriaString) {
        var notification = component.find("NotificationManager");
        var action;
        action = component.get("c.getConversation");
        action.setParams({
            recordId: recordId,
            jsonPaginationCriteria: paginationCriteriaString
        });
        action.setCallback(this, function (response) {
            var returnVal;
            var pageNumber;
            var newPage;
            var messageList;
            var scrollDiv;
            var scrollEle;
            var clonedmessageList;
            var newConvList;
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.lastDateInIteration', undefined);
                returnVal = response.getReturnValue();
                if (returnVal && returnVal.responseTO && returnVal.responseTO.status === 'Success') {
                    if (!component.get('v.iscometdSetup') && component.get('v.iscometdFileloaded')) {
                        helper.setupCometd(component, helper, recordId, returnVal.sessionID);
                        component.set('v.iscometdSetup', true);
                    }
                    component.set('v.sessionId', returnVal.sessionID);
                    pageNumber = component.get('v.pageNumber');
                    if (pageNumber === -1) {
                        helper.unreadAllMessage(component);
                    }
                    pageNumber = pageNumber + 1;
                    component.set('v.pageNumber', pageNumber);

                    newPage = returnVal.messageList || [];
                    if (newPage) {
                        newPage.reverse();
                        if (newPage.length < 50) {
                            component.set('v.lastMessageLoaded', true);
                        }
                    }
                    messageList = component.get("v.messageList");
                    if (!messageList || shouldReload) {
                        component.set("v.messageList", newPage);
                        helper.unreadAllMessage(component);
                    } else if (!shouldReload) {
                        scrollDiv = component.find("messageList");
                        scrollEle = scrollDiv.getElement();
                        component.set("v.scrolledHeight", scrollEle ? scrollEle.scrollHeight : 0);
                        if (newPage && newPage.length) {
                            clonedmessageList = JSON.parse(JSON.stringify(messageList));
                            newConvList = newPage.concat(clonedmessageList);
                            component.set("v.messageList", newConvList);
                        } else {
                            component.set("v.messageList", []);
                        }
                    }
                } else if (returnVal && returnVal.responseTO && returnVal.responseTO.status === 'Failed' && returnVal.responseTO.errResponseObj) {
                    notification.showNotification('utility:error', 'toast', 'error', returnVal.responseTO.errResponseObj.code, '5000');
                    component.set("v.messageList", []);
                } else {
                    component.set("v.messageList", []);
                }
            } else if (response.getError() && response.getError().length) {
                notification.showNotification('utility:error', 'toast', 'error', response.getError()[0].message, '5000');
                component.set("v.messageList", []);
            } else {
                component.set("v.messageList", []);
            }
            if(component.get("v.pageNumber") <= 0){
                helper.hideSpinner(component);
            }
        });
        $A.enqueueAction(action);
    },
    scrollControl: function (component) {
        var pageNumber = component.get("v.pageNumber");
        if (pageNumber === -1) {
            return;
        }
        var scrolledHeight = component.get("v.scrolledHeight");
        setTimeout($A.getCallback(function () {
            var loadText;
            var scrollDiv;
            var scrollEl;
            var messageContainerEl
            loadText = component.find('loadText');
            $A.util.addClass(loadText, 'slds-hide');
            $A.util.removeClass(loadText, 'slds-show');
            scrollDiv = component.find("messageList");
            scrollEl = scrollDiv.getElement();
            if (pageNumber === 0 && scrollEl) {
                scrollEl.scrollTop = scrollEl ? scrollEl.scrollHeight : 0;
            } else if (pageNumber > 0 && scrollDiv.getElement()) {
                scrollEl.scrollTop = scrollEl ? scrollEl.scrollHeight - scrolledHeight : 0;
            }
            messageContainerEl = component.find('messageList').getElement();
            if (messageContainerEl) {
                component.set('v.clientHeight', messageContainerEl.clientHeight);
            }
        }), 100);
    },
    setupCometd : function(component, helper, recordID, sessionId) {
        var recordId;
        /*global $:true*/
        $.cometd.init({
            url: window.location.protocol+'//'+window.location.hostname+'/cometd/24.0/',
            requestHeaders: { Authorization: 'OAuth '+sessionId}
        });

        $.cometd.subscribe('/topic/IncomingSMSAlert',  $A.getCallback(function(message) {
            recordId = recordID || component.get("v.recordId");
            var selectedKey = Object.keys(message.data.sobject).find(function (key) {
                return typeof message.data.sobject[key] === "string" ? message.data.sobject[key].includes(recordId) : false;
            });
            if (selectedKey) {
                helper.reloadMessage(component, helper, true);
            }
            var appEvent = $A.get("e.smagicinteract:refreshEvent");
            if(appEvent) {
                appEvent.setParams({
                    source: 'incoming',
                    refresh: true,
                    info: message.data.sobject
                });
                appEvent.fire();
            }
            appEvent = $A.get("e.smagicinteract:getConversationCountEvent");
            if(appEvent) {
                appEvent.fire();
            }
        }));
        $.cometd.subscribe('/topic/OutgoingSMSAlert',  $A.getCallback(function(message) {
            recordId = recordID || component.get("v.recordId");
            var selectedKey = Object.keys(message.data.sobject).find(function (key) {
                return typeof message.data.sobject[key] === "string" ? message.data.sobject[key].includes(recordId) : false;
            });
            if (selectedKey) {
                helper.reloadMessage(component, helper, true);
            }
        }));
    },
    reloadMessage: function (component, helper, shouldReload) {
        component.set("v.pageNumber", -1);
        component.set("v.lastMessageLoaded", false);
        component.set("v.scrolledHeight", 0);
        helper.loadData(component, helper, shouldReload);
    },
    loadDataForRecipient: function loadDataForRecipient(component, helper) {
        var recordId;
        var paginationCriteria;
        var paginationCriteriaString;
        component.set("v.pageNumber", -1);
        component.set("v.lastMessageLoaded", false);
        component.set("v.scrolledHeight", 0);
        recordId = component.get("v.recordId");
        if (!recordId) {
			component.set("v.messageList", []);
            helper.hideSpinner(component);
            return;
        }
        paginationCriteria = {
            pageCriteriaObject: null,
            filterCrieriaList: null
        };
        paginationCriteriaString = JSON.stringify(paginationCriteria);
        helper.getConversationData(component, helper, true, recordId, paginationCriteriaString);
    },
    unreadAllMessage: function (component) {
        var markmessageUnread = component.getEvent("responseReceived");
        if(markmessageUnread) {
            markmessageUnread.fire();
        }
    },
    showSpinner : function (component) {
        var spinner = component.find("mySpinner");
        $A.util.addClass(spinner, "slds-show");
        $A.util.removeClass(spinner, "slds-hide");
    },
    hideSpinner : function (component) {
    	var spinner = component.find("mySpinner");
        $A.util.addClass(spinner, "slds-hide");
        $A.util.removeClass(spinner, "slds-show");
    },
    performPushTopicChecks : function (component) {
        var notification = component.find("NotificationManager");
        var action = component.get("c.getPushTopicAccessibililtyResult");
        action.setCallback(this, function (response) {
            var returnVal;
            var state = response.getState();
            if (state === "SUCCESS") {
                returnVal = response.getReturnValue();
                if (returnVal && returnVal.responseTO && returnVal.responseTO.errResponseObj && returnVal.responseTO.status === 'ERROR') {
                    notification.showNotification('utility:warning', 'toast', 'warning', returnVal.responseTO.errResponseObj.code, '15000');
                }
            }
        });
        $A.enqueueAction(action);
    }
})