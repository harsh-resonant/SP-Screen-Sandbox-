({
    doInit: function (component) {
        var body = component.get("v.body");
        if (body && body.length) {
            component.set("v.isBodyPassed", true);
        }
    },
    onPositionChange: function (component, event, helper) {
        helper.positionPopover(component);
    },
    togglePopOver: function (component, event, helper) {
        helper.togglePopOver(component, event, helper);
    },
    openPopover: function (component, event, helper) {
        helper.togglePopOver(component, event, helper);
    },
    selectItem: function (component, event, helper) {
        var onChange;
        component.set("v.value", event.target.id);
        onChange = component.get("v.onChange");
        $A.enqueueAction(onChange);
        helper.togglePopover(component, event, helper);
    }
})