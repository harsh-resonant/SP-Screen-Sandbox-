({
	changeHeaderState : function (component) {
        var context = component.get('v.context');
        component.set('v.isHeaderVisible', context ? !(context.isDetailPage || context.isActivitySection) : true);
    },
    setRecordId : function(component, event) {
		var recordData = event.getParam("recordData");
        if (!recordData) {
            return;
        }
        if (recordData.recordId) {
            component.set("v.recordData", recordData);
        } else {
            component.find("conversationListComponent").reloadOnIncoming(recordData);
        }
	},
    toggleClass : function(component, event) {
        var isTrue = event.getParam("isTrue");
        var conversation = component.find("conversation");
        if (isTrue) {
            $A.util.addClass(conversation, 'third-panel-display');
        } else {
            $A.util.removeClass(conversation, 'third-panel-display');
        }
	},
    showHeader: function showHeader(component) {
        var context = component.get('v.context');
        if(context.isDetailPage || context.isActivitySection) {
            component.set('v.isHeaderVisible', true);
        }
    },
    hideHeader: function hideHeader(component) {
        var context = component.get('v.context');
        if(context.isDetailPage || context.isActivitySection) {
            component.set('v.isHeaderVisible', false);
        }
    }
});