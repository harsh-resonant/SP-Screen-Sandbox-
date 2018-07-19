({
	doInit : function(component, event, helper) {
        var body = component.get('v.body');
        if(body && body.length){
            component.set('v.isBodyPassed',true)
        }
    },
    onTriggerToggle : function onToggle(component, event, helper) {
        var toolTipText = component.find('tooltiptextId');
        var isOpen = event.getParam('isActive');
        if(isOpen) {
        	$A.util.removeClass(toolTipText, 'show-tooltip');
        } else {
        	$A.util.addClass(toolTipText, 'show-tooltip');
        }
        
    }
})