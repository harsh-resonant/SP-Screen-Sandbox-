({
	applyFilter : function(component) {
		var relatedRecordList = component.get("v.relatedRecordList");
        var messageStatusList = component.get("v.messageStatusList");
        var filterStarred = component.get("v.filterStarred");
        var userFilterValue = component.get("v.userSenderFilterValue");
        var from = component.get("v.from");
        var to = component.get("v.to");
        var i;

        var filtercriteriaList = [];
        if(filterStarred) {
            filtercriteriaList.push({ filterType: 'IS_STAR', filterString: filterStarred });
        }
        if(userFilterValue) {
            filtercriteriaList.push({ filterType: 'USER', filterString: userFilterValue });
        }
        if(from) {
            filtercriteriaList.push({ filterType: 'START_DATE', filterString: from });
        }
        if(to) {
            filtercriteriaList.push({ filterType: 'END_DATE', filterString: to });
        }

        if(relatedRecordList && relatedRecordList.length) {
            for(i=0; i<relatedRecordList.length; i+=1) {
                filtercriteriaList.push({ filterType: 'LOOKUP_ID', filterString: relatedRecordList[i].name });
            }
        }
        if(messageStatusList && messageStatusList.length) {
            for(i=0; i<messageStatusList.length; i+=1) {
                filtercriteriaList.push({ filterType: 'DEL_STATUS', filterString: messageStatusList[i].name });
            }
        }
        var isFilterChanged = (component.get("v.defaultUserFilterValue") === userFilterValue) ? Boolean( (relatedRecordList && relatedRecordList.length)|| (messageStatusList && messageStatusList.length)|| filterStarred || from || to) : true;
        component.set("v.isDisabled", !isFilterChanged);
        var paginationCriteriaEvent = $A.get("e.smagicinteract:paginationCriteriaEvent");
        paginationCriteriaEvent.setParams({filtercriteriaList: filtercriteriaList,
                                           isfilterChanged : isFilterChanged
                                          });
        paginationCriteriaEvent.fire();
    },
    waitAfterChange :  function(component, event, helper) {
    	var timeoutId = component.get('v.timeoutId');
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout($A.getCallback(function() {
            component.set('v.timeoutId', '');
        	helper.applyFilter(component, event, helper);
        }), 1000);
        component.set('v.timeoutId', timeoutId);
	},
    resetFilter : function(component, helper){
        component.set("v.relatedRecordList", []);
        component.set("v.messageStatusList", []);
        component.set("v.filterStarred", false);
        component.set("v.userSenderFilterValue", component.get("v.defaultUserFilterValue"));
        component.set("v.from", undefined);
        component.set("v.to", undefined);
        helper.resetUserSenderFilter(component);
		component.set("v.isDisabled", true);
        var appEvent = $A.get("e.smagicinteract:resetDataEvent");
        appEvent.setParams({source: 'filterPanelComponent'});
        appEvent.fire();
	},
    resetUserSenderFilter : function(component) {
        var userFilterValue = component.get("v.defaultUserFilterValue");
        if(userFilterValue === "ownersender") {
            component.set("v.userFilterValue", true);
            component.set("v.senderFilterValue", true);
        } else if(userFilterValue === "sender") {
            component.set("v.userFilterValue", false);
            component.set("v.senderFilterValue", true);
        } else if(userFilterValue === "owner") {
            component.set("v.userFilterValue", true);
            component.set("v.senderFilterValue", false);
        } else {
            component.set("v.userFilterValue", false);
            component.set("v.senderFilterValue", false);
        }
	}
});