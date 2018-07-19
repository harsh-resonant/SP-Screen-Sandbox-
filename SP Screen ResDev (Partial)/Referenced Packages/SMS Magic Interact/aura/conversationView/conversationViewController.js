({
    doInit: function (component, event, helper) {
        var action;
        var containerDiv;
        var context;
        var contextDataCmp;
        var embedContext = component.get("v.embedContext");
        if (embedContext) {
            containerDiv = component.find("containerDiv");
            $A.util.addClass(containerDiv, embedContext.toLowerCase() === 'home' ? 'homeSection' : '');
        }
        context = component.get('v.context');
        if(!context ) {
            action = component.get("c.getUiThemeDisplayed");
            contextDataCmp = component.find('contextDataCmp');
            helper.executeAction(action, contextDataCmp.setUIContextFromTheme);
        } else if(!context.isLightning && !context.isClassic && !context.isSf1) {
            action = component.get("c.getUiThemeDisplayed");
            contextDataCmp = component.find('contextDataCmp');
            helper.executeAction(action, contextDataCmp.setUIContextFromTheme);
        }
    },
    updateRecordId : function(component, event) {
    	var recordId  = event.getParam("recordId");
        var isClickedInSF1  = event.getParam("isClickedInSF1");
        if(isClickedInSF1) {
            component.set("v.hideRecipientInSF1", true);
        } else {
    	    component.set("v.recordId", recordId);
        }
    },
    showRecipientSection : function(component, event) {
        var refresh = event.getParam("refresh");
        var source = event.getParam("source");
        if(source === 'conversationHeader' && refresh) {
            component.set("v.hideRecipientInSF1", false);
        }
    },
    updateSObjectName : function(component, event){
        var data = event.getParam("data");
        var sObjectName = data.name;
    	component.set("v.sObjectName", sObjectName);
    },
    openPanel : function(component, event) {
        var containerDiv = component.find("containerDiv");
        if(event.getParam('isHidden')) {
        	$A.util.removeClass(containerDiv, 'widthAdjust');
        } else {
        	$A.util.addClass(containerDiv, 'widthAdjust');
        }
    },
    closePanel : function(component) {
        var containerDiv = component.find("containerDiv");
        $A.util.removeClass(containerDiv, 'widthAdjust');
    },
    onContextChange: function onContextChange(component) {
        var context = component.find('contextDataCmp').get('v.context');
        component.set('v.context', context);
    }
});