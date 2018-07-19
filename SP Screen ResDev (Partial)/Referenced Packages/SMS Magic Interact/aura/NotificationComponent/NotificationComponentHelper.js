({
    showNotifier : function(component, helper, iconName, variant, state, text, duration) {
        component.set("v.iconName", iconName);
        component.set("v.text", text);
        helper.addState(component, variant, state);
        if(duration) {
            setTimeout(function () {
                helper.hideNotifier(component);
            }, duration);
        }
    },
    hideNotifier : function(component) {
        component.destroy(false);
    },
    addState : function(component, variant, state) {
        var cmpTarget = component.find('Notifier');
        if(cmpTarget && state) {
            $A.util.removeClass(cmpTarget, 'slds-hide');
            $A.util.addClass(cmpTarget, 'slds-show');
            var styleClassName = 'slds-notify--' + variant;
            $A.util.addClass(cmpTarget, styleClassName);
            styleClassName = 'slds-theme--' + state;
            $A.util.addClass(cmpTarget, styleClassName);
        }
    }
})