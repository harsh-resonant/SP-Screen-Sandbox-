({
    validate : function(component, event, helper) {
        var evt;
        var from = component.get("v.from");
        var to = component.get("v.to");

        if(!from && !to) {
            component.set("v.errorMessage", "");
            evt = component.getEvent("dateRangeEvent");
            evt.setParams({
                message: 'CLEAR'
            });
            evt.fire();
        } else if(from && new Date(from) == 'Invalid Date') {
            component.set("v.errorMessage", $A.get('$Label.smagicinteract.invalid_range'));
            evt = component.getEvent("dateRangeEvent");
            evt.setParams({ message: 'INVALID' });
            evt.fire();
        } else if(to && new Date(to) == 'Invalid Date') {
            component.set("v.errorMessage", $A.get('$Label.smagicinteract.invalid_range'));
            evt = component.getEvent("dateRangeEvent");
            evt.setParams({ message: 'INVALID' });
            evt.fire();
        } else if(from && to && from > to) {
            component.set("v.errorMessage", $A.get('$Label.smagicinteract.invalid_range'));

            evt = component.getEvent("dateRangeEvent");
            evt.setParams({
                from: from,
                to: to,
                message: 'INVALID'
            });
            evt.fire();
        } else {
            component.set("v.errorMessage", "");

            evt = component.getEvent("dateRangeEvent");
            evt.setParams({
                from: from,
                to: to,
                message: 'SUCCESS'
            });
            evt.fire();
        }
    },
    resetData : function(component, event, helper) {
        var source = event.getParam("source");
        if(source === 'filterPanelComponent') {
            component.set("v.from", "");
            component.set("v.to", "");
            component.set("v.errorMessage", "");
            var evt = component.getEvent("dateRangeEvent");
            evt.setParams({
                message: 'CLEAR'
            });
            evt.fire();
        }
    }
});