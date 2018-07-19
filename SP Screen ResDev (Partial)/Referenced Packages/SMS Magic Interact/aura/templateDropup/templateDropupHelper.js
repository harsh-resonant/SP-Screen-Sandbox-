({
	dispatchTemplateSelectionEvent: function (component, selectedTemplate, resolvedTemplateText) {
		var templateSelectionEvent;
		component.set('v.templateText', resolvedTemplateText || selectedTemplate.smagicinteract__Text__c);
		templateSelectionEvent = component.getEvent('templateSelectionEvent');
		templateSelectionEvent.setParam('value', {
			id: selectedTemplate.Id,
			templateText: resolvedTemplateText || selectedTemplate.smagicinteract__Text__c
		});
		templateSelectionEvent.fire();
    },
    setToolTipTextdefault : function(component){
        component.set("v.toolTipHoverText",$A.get("$Label.smagicinteract.INSERT_TEMPLATE"));
        var toolTip = component.find("toolTip");
        $A.util.removeClass(toolTip , 'selectedTemp');
    },
    setTemplateIconHoverText : function(component){
    	component.set("v.toolTipHoverText" , $A.get("$Label.smagicinteract.SELECTED_TEMPLATE")+': '+component.get("v.selectedTemplate"));
        var toolTip = component.find("toolTip");
        $A.util.addClass(toolTip , 'selectedTemp');
	}
})