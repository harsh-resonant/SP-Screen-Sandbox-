({
	togglePopOver : function(component, event, helper) {
        var popoverBody = component.find('popoverBody');
        var backgroundDiv = component.find('backgroundDiv');
        $A.util.toggleClass(popoverBody, 'slds-hide');
        $A.util.toggleClass(backgroundDiv, 'slds-hide');
    },
    fireOnChangeEvent : function(component, event, helper) {
        var onChange = component.get('v.onChange')
        if(onChange){
            $A.enqueueAction(onChange);
        }
    }
})