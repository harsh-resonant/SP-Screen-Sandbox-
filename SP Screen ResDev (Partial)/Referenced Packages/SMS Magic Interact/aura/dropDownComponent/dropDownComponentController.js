({
    togglePopOver : function(component, event, helper) {
        var isOpen;
        var toggleEvent;
        helper.togglePopOver(component, event, helper);
        isOpen = component.get('v.isOpen');
        component.set('v.isOpen', !isOpen);
        toggleEvent = $A.get('e.smagicinteract:toggleEvent');
        toggleEvent.setParam('isActive', !isOpen);
        toggleEvent.fire();
        
    },
    doInit : function(component, event, helper) {
        var popoverBody = component.find('popoverBody');
        var pos = component.get('v.position');
        if(pos){
            pos = pos.toLowerCase();
            if(pos === 'up'){
                $A.util.addClass(popoverBody , 'openUp');
                $A.util.removeClass(popoverBody , 'openDown');
            } else {
            	$A.util.addClass(popoverBody , 'openDown');
            	$A.util.removeClass(popoverBody , 'openUp');
        	}
        }
        var body = component.get('v.body');
        if(body && body.length){
            component.set('v.isBodyPassed',true)
        }
        var defaultValue = component.get("v.defaultValue");
        var onChange;
        if(defaultValue){
        	component.set('v.value', defaultValue);
            helper.fireOnChangeEvent(component);
        }
        
    },
    selectItem : function(component,event,helper) {
        var selectedValue, onChange;
		var isBodyPassed;
        isBodyPassed = component.get('v.isBodyPassed');
		if(!isBodyPassed) {
			selectedValue = event.currentTarget.id;
			component.set('v.value', selectedValue);
		}
		helper.togglePopOver(component);
		helper.fireOnChangeEvent(component);
    },
    closeDropdown : function(component, event, helper) {
        var toggleEvent;
        var popoverBody;
        var backgroundDiv;
        component.set('v.isOpen', false);
        toggleEvent = $A.get('e.smagicinteract:toggleEvent');
        toggleEvent.setParam('isActive', false);
        toggleEvent.fire();
		popoverBody = component.find('popoverBody');
        $A.util.addClass(popoverBody, 'slds-hide');
        backgroundDiv = component.find('backgroundDiv');
        $A.util.addClass(backgroundDiv, 'slds-hide');
	}
})