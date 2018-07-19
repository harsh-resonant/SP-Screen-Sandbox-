({
    loadRecipientList : function(component, event, helper, isRefresh) {
        var notification = component.find("NotificationManager");
        var selectedRecipientListType = component.get("v.selectedRecipientListType");
        if(selectedRecipientListType === undefined){
            helper.hideSpinner(component);
            return;
        }
        var criteriaObject = {};
        var filterList = [];
        filterList.push({filterType:"object" , filterString:selectedRecipientListType});
        filterList.push({filterType:"newonly" , filterString:component.get("v.searchUnreadOnly")});
        criteriaObject.filterCrieriaList = filterList;
        var pageCriteriaObject = {};
        var pageNumber = component.get("v.pageNumber");
        var recipientList = component.get("v.recipientList");
        if(pageNumber !== -1 && recipientList && recipientList.length){
            pageCriteriaObject.lastRecordTime = recipientList[recipientList.length-1].latestTextTime;
            pageCriteriaObject.lastRecordID = recipientList[recipientList.length-1].recordId;
        }
        criteriaObject.pageCriteriaObject = pageCriteriaObject;
        var searchText = component.get("v.searchText");
        if(searchText){
            criteriaObject.searchCriteria = searchText;
        }
        var action = component.get("c.loadConversationRecords");
        action.setParams({requestContext: null, jsonPaginationCriteria : JSON.stringify(criteriaObject)});
        action.setCallback(this, function(response) {
            //if(component.get("v.pageNumber") === -1){
            	helper.hideSpinner(component);
            //}
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnVal = response.getReturnValue();
                if (returnVal) {
                    var responseTO = returnVal.responseTO;
                    if(responseTO) {
                        if(responseTO.status === 'SUCCESS') {
                            pageNumber = component.get("v.pageNumber");
                            component.set("v.pageNumber",pageNumber+1);
                            var conversationsList = returnVal.conversationsList;
                            component.set("v.isNewPageBeingLoaded",false);
                            var displayLoadingText = component.find("loadText");
                            $A.util.addClass(displayLoadingText,'slds-hide');
                            $A.util.removeClass(displayLoadingText,'slds-show');
                            if(!conversationsList){
                                if(pageNumber === -1)  helper.setRecipientListEmpty(component);
                                component.set("v.allRecipientLoaded",true);
                                return;
                            } else if (conversationsList.length < component.get("v.pageSize")){
                                component.set("v.allRecipientLoaded",true);
                            }
                            conversationsList = helper.filterRecordsInList(component,event,helper,conversationsList);
                            var totalUnreadConversation = returnVal.totalUnreadConversation;
                            component.set("v.recipientUnreadCount",totalUnreadConversation);
                            recipientList = component.get("v.recipientList");
                            if(recipientList && recipientList.length){
                                conversationsList = recipientList.concat(conversationsList);
                            }
                            component.set("v.recipientList",conversationsList);
                            if(conversationsList && conversationsList[0] && pageNumber == -1){
                                if(isRefresh) component.set("v.selectedRecipientId", conversationsList[0].recordId);
                            }
                        } else if(responseTO.status === 'FAILURE') {
                            var errResponseObj = responseTO.errResponseObj;
                            if(errResponseObj) {
                                notification.showNotification('utility:error', 'toast', 'error', errResponseObj.code, '5000');
                            }
                            helper.setRecipientListEmpty(component);
                        } else  helper.setRecipientListEmpty(component);
                    } else helper.setRecipientListEmpty(component);
                } else helper.setRecipientListEmpty(component);
            } else {
                var str = response.getError();
                if(str && str.length) {
                    notification.showNotification('utility:error', 'toast', 'error', str[0].message, '5000');
                }
                helper.setRecipientListEmpty(component);
            }
        });
        $A.enqueueAction(action);
    },
    filterRecordsInList : function(component,event,helper,conversationsList){
        var loadedRecords = component.get("v.loadedRecords");
        if(!loadedRecords){
            helper.addRecordsinList(component,conversationsList);
        } else {
            for(var i = conversationsList.length-1; i >-1 ; i--) {
                var obj = conversationsList[i];
                for(var recordId of loadedRecords){
                    if(obj.recordId == recordId){
                        conversationsList.splice(i,1);
                    }
                }
            }
            helper.addRecordsinList(component,conversationsList,loadedRecords);
        }
        return conversationsList;
    },
    addRecordsinList : function(component,conversationsList,loadedRecords){
        var list = [];
        if(loadedRecords){
            list =  loadedRecords;
        }
        for (var recipient of conversationsList) {
            list.push(recipient.recordId);
        }
        component.set("v.loadedRecords",list);
    },
    addSpinner : function(component){
        var cmpEvent = component.getEvent('toggleSpinner');
        if(cmpEvent) {
            cmpEvent.setParams({isActive: true});
            cmpEvent.fire();
        }
    },
    hideSpinner : function(component){
        var cmpEvent = component.getEvent('toggleSpinner');
        if(cmpEvent) {
            cmpEvent.setParams({isActive: false});
            cmpEvent.fire();
        }
    },
    setRecipientListEmpty : function(component){
    	component.set("v.recipientList", []);
        component.set("v.selectedRecipientId", "");
    },
    loadNewRecipientRecords : function(component, event, helper,incomingId) {
    	var notification = component.find("NotificationManager");
        var action = component.get("c.loadIncomingLookupRecords");
        action.setParams({
            requestContext : null,
            incomingId : incomingId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnVal = response.getReturnValue();
                if (returnVal) {
                    var responseTO = returnVal.responseTO;
                    if(responseTO) {
                        if(responseTO.status === 'SUCCESS') {
                            var newRecipientRecords = returnVal.conversationsList;
                            if(newRecipientRecords && newRecipientRecords.length){
                            	helper.addNewRecipientRecords(component, event, helper,newRecipientRecords);
                            }
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
    addNewRecipientRecords : function(component, event, helper, newRecipientRecords) {
    	var recipientRecordList = component.get("v.recipientList");
        var filteredNewRecipientRecords = helper.findNewRecipientRecordOfSelectedObject(component,newRecipientRecords);
        if(!Array.isArray(filteredNewRecipientRecords) || !filteredNewRecipientRecords.length) {
            var newMessageNotification = component.find("newMessageNotification");
            helper.createMessageComponent(component, helper, newRecipientRecords);
            return;
        };
        var isCampaignMemberDisplayed = component.get("v.isCampaignMemberDisplayed");
        if(isCampaignMemberDisplayed) {
            var selectedCampaignId = component.get("v.selectedCampaignId");
            var refreshCampaignMember = false;
            
            if(Array.isArray(recipientRecordList)) {
                filteredNewRecipientRecords.forEach(function(val) {
                    if(val.recordId === selectedCampaignId) {
                        refreshCampaignMember = true;
                        return;
                    }
                    for(var i=1; i<recipientRecordList.length; i++) {
                        if(recipientRecordList[i].recordId === val.recordId) {
                            refreshCampaignMember = true;
                            return;
                        }
                    }
                });
            }
            if(refreshCampaignMember) {
                helper.findCampaignMembers(component, helper, selectedCampaignId);
            }
            return;
        }
        var filteredOldRecipientRecords = helper.filteredOldRecipientRecords(helper,newRecipientRecords,recipientRecordList);
        if(recipientRecordList && recipientRecordList.length){
            for(var i=0 ; i < filteredNewRecipientRecords.length ; i++){
                recipientRecordList.unshift(filteredNewRecipientRecords[i]);
            }
            component.set("v.recipientList",recipientRecordList);
        } else{
            component.set("v.recipientList",filteredNewRecipientRecords);
            component.set("v.selectedRecipientId",filteredNewRecipientRecords[0].recordId);
        }
    },
    findNewRecipientRecordOfSelectedObject : function(component, newRecipientRecords) {
        var filteredRecipientList = [];
        var i;
        var selectedRecipientListType = component.get("v.selectedRecipientListType");
        if(selectedRecipientListType === "*"){
            return newRecipientRecords;
        } else if (selectedRecipientListType === ""){
            for(i = 0 ;i < newRecipientRecords.length ; i = i + 1){
                if(newRecipientRecords[i].objectName.toLowerCase() === "incoming sms"){
            		filteredRecipientList.push(newRecipientRecords[i]);
                }
            }
        } else {
            for (i = 0; i < newRecipientRecords.length; i = i + 1){
                if(newRecipientRecords[i].objectName.toLowerCase() === selectedRecipientListType.toLowerCase()){
            		filteredRecipientList.push(newRecipientRecords[i]);
            	}
            }
        }
        return filteredRecipientList;
    },
    filteredOldRecipientRecords : function(helper, newRecipientRecords, oldRecipientRecords){
        var index;
        var i;
        for(i = 0 ; i < newRecipientRecords.length ; i = i + 1){
            index = helper.findindex(oldRecipientRecords , newRecipientRecords[i]);
            if(index != -1) {
            	oldRecipientRecords.splice(index, 1);
            }
        }    
    },
    findindex : function(oldRecipientRecords, newRecipientRecord){
        var i;
        for(i = 0; i<oldRecipientRecords.length ; i = i+1){
            if(oldRecipientRecords[i].recordId === newRecipientRecord.recordId){
                return i;
            }
        }
        return -1;
    },
    createMessageComponent : function(component, helper, newIncomingRecords){
        $A.createComponent(
    		"smagicinteract:newMessageNotificationComponent",
     		{
                "newIncomingRecords": newIncomingRecords,
            },
            function(newcmp, status, errorMessage){
                //Add the new button to the body array
                if (status === "SUCCESS") {
                    helper.createNotificationComponent(component, newcmp);
                }
            }
        );
    },
    createNotificationComponent: function (component, newcmp) {
        $A.createComponent(
            "smagicinteract:NotificationComponent",
            {
                iconName: "utility:info",
                variant: "toast",
                state: "info",
                text: "",
                duration: "5000",
                bodyComp: newcmp

            },
            function (notifiCmp, status, errorMessage) {
                if (status === "SUCCESS") {
                    var notifications = component.get('v.notifications');
                    notifications.push(notifiCmp);
                    component.set('v.notifications', notifications);
                }
            }
        );
    },
    toggleCampaignMembers : function(component, helper, selectedId) {
        var isCampaignMemberDisplayed = component.get("v.isCampaignMemberDisplayed");
        var recipientList = component.get("v.recipientList");
        var tempRecipientList = component.get("v.tempRecipientList");
        if(isCampaignMemberDisplayed) {
            //hide campaign members 
            component.set("v.recipientList", tempRecipientList);
            component.set("v.tempRecipientList", []);
            component.set("v.selectedCampaignId", undefined);
            component.set("v.isCampaignMemberDisplayed", false);
            return;
        }
        //show campaign members 
        component.set("v.isCampaignMemberDisplayed", true);
        component.set("v.tempRecipientList", recipientList);
        
        helper.findCampaignMembers(component, helper, selectedId);
    },
    findCampaignMembers : function(component, helper, selectedId) {
        if(!selectedId) {
            return;
        }
        var responseTO;
        helper.addSpinner(component);
        var campRecord;
        var notification = component.find("NotificationManager");
        var recipientList = component.get("v.recipientList");
        if(Array.isArray(recipientList)) {
            recipientList.forEach(function(val) {
                if(selectedId === val.recordId) {
                    campRecord = val;
                }
            })
        }
        component.set("v.selectedCampaignId", selectedId);
        var action = component.get("c.loadCampaignMembers");
        action.setParams({requestContext: null, campId: campRecord.recordId, newOnly: component.get("v.searchUnreadOnly")});
        action.setCallback(this, function(response) {
            helper.hideSpinner(component);
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnVal = response.getReturnValue();
                if (returnVal) {
                    responseTO = returnVal.responseTO;
                    if(responseTO) {
                        if(responseTO.status === 'SUCCESS') {
                            var conversationsList = returnVal.conversationsList;
                            var tempList = [];
                            tempList.push(campRecord);
                            if(Array.isArray(conversationsList)) {
                                tempList = tempList.concat(conversationsList);
                            }
                            component.set("v.recipientList", tempList);
                        }
                    }
                }
            } else if(responseTO.status === 'FAILURE') {
                var errResponseObj = responseTO.errResponseObj;
                if(errResponseObj) {
                    notification.showNotification('utility:error', 'toast', 'error', errResponseObj.code, '5000');
                }
            }
        });
        $A.enqueueAction(action);
    }
})