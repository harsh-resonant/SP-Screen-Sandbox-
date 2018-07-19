({
    doInit : function(component, event, helper) {
        var iconName	= component.get("v.iconName").toLowerCase();
        var variant		= component.get("v.variant").toLowerCase();
        var state		= component.get("v.state").toLowerCase();
        var duration	= component.get("v.duration");
        var text		= component.get("v.text");
        var bodyComp 		= component.get("v.bodyComp");
        if(bodyComp){
            var defaultDiv = component.find("defaultDiv");
            $A.util.addClass(defaultDiv,'slds-hide');
            var bodyDiv = component.find("bodyDiv");
            $A.util.addClass(bodyDiv,'slds-show');
            $A.util.removeClass(bodyDiv,'slds-hide');
        }
        duration		= parseInt(duration, 10);
        helper.showNotifier(component, helper, iconName, variant, state, text, duration);
    },
    hideNotifier : function(component, event, helper) {
        helper.hideNotifier(component);
    }
})