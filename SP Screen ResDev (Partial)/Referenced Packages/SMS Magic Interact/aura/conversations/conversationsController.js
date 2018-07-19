({
    doInit : function(component, event, helper) {
        var action;
        var contextDataCmp;
        var context = component.get('v.context');
        if(!context) {
            action = component.get("c.getUiThemeDisplayed");
            contextDataCmp = component.find('contextDataCmp');
            helper.executeAction(action, contextDataCmp.setUIContextFromTheme);
        } else if(!context.isLightning && !context.isClassic && !context.isSf1) {
            action = component.get("c.getUiThemeDisplayed");
            contextDataCmp = component.find('contextDataCmp');
            helper.executeAction(action, contextDataCmp.setUIContextFromTheme);
        }
    },
	openConversationDetail : function() {},
    openConversationFilter : function(component, event, helper) {
        if(component.find("openConversationFilter").get("v.isDisplayed")){
            helper.closeThirdSection(component, event, helper);
            event.setParam("isHidden", true);
            component.find("openConversationFilter").set("v.isDisplayed", false);
        } else {
            component.find("conversationComponent").set("v.isFilterOpen", true);
            var conversationAndFilterDiv = component.find("conversationAndFilterDiv");
            $A.util.addClass(conversationAndFilterDiv, 'show-filter');
            if(component.get("v.componentIsInActivitySection")){
                var conversationDiv = component.find("conversationDiv");
                var filterDiv = component.find("filterDiv");
                helper.showHideDiv(filterDiv, conversationDiv);
            }
            setTimeout(function () {
            	component.find("openConversationFilter").set("v.isDisplayed", true);
            }, 250);
    	}
    },
    openConversationTimeline : function() {},
    closeThirdSection : function(component, event, helper) {
        helper.closeThirdSection(component, event, helper);
    },
    onContextChange: function onContextChange(component) {
        var context = component.find('contextDataCmp').get('v.context');
        component.set('v.context', context);
    },
    changeContextClasses : function changeContextClasses(component) {
    	var context = component.get("v.context");
        if(context){
            if(context.isLightning){
                component.set("v.uiContextClass", "ui-context--lightning");
            } else if (context.isClassic){
                component.set("v.uiContextClass", "ui-context--classic");
            } else if(context.isSf1){
                component.set("v.uiContextClass", "ui-context--sf1");
            }
            if(context.isDetailPage){
                component.set("v.embededContextClass", "embeded-context--detail");
            } else if (context.isCustomTab){
                component.set("v.embededContextClass", "embeded-context--customTab");
            } else if(context.isActivitySection){
                component.set("v.embededContextClass", "embeded-context--activitySection");
            } else if(context.isHomeSection){
                component.set("v.embededContextClass", "embeded-context--homeSection");
            }
        }

    }
});