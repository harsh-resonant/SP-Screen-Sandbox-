({
    doInit : function (component){
    	var defaultTemplate = $A.get("$Label.smagicinteract.INSERT_TEMPLATE");
        component.set("v.toolTipHoverText",defaultTemplate);
	},
	onSelection: function (component, event, helper) {
		var templateList;
		var selectedTemplate;
		var recordId;
		var action;
		var notification;

		templateList = component.get('v.templateList');
		selectedTemplate = templateList.find(function (template) {
			return template.Id === event.target.id;
		});
        component.set("v.selectedTemplate",selectedTemplate.smagicinteract__Name__c);
        helper.setTemplateIconHoverText(component);
		if(selectedTemplate) {
			component.find('dropdownCmp').closeDropdown();
		}

		recordId = component.get('v.recordId')
		if (recordId) {
			action = component.get('c.resolveTemplate');
			action.setParams({
				templateText: selectedTemplate.smagicinteract__Text__c,
				recId: recordId
			});
			notification = component.find("NotificationManager");
			action
				.setCallback(
				this,
				function (response) {
					var state = response.getState();
					var responseDto = response.getReturnValue();
					var responseTO;
					if (state === 'SUCCESS' && responseDto && responseDto.responseTO) {
						responseTO = responseDto.responseTO;
						if (responseTO.status === "FAILURE" && responseTO.errResponseObj) {
							notification.showNotification(
								'utility:error',
								'toast', 'error',
								responseTO.errResponseObj.code,
								'5000');
							 helper.dispatchTemplateSelectionEvent(component, {
								 Id: null,
								 smagicinteract__Text__c: ""
							 });
        					 helper.setToolTipTextdefault(component);
							return;
						}
						helper.dispatchTemplateSelectionEvent(component,
							selectedTemplate,
							responseDto.responseText);
					}
				})
			$A.enqueueAction(action);
		} else {
			helper.dispatchTemplateSelectionEvent(component, selectedTemplate)
		}
	},
    resetTemplateIconHoverText : function (component, event, helper){
            helper.setToolTipTextdefault(component);
    },
    setTemplateIconHoverText : function (component, event, helper){
    	helper.setTemplateIconHoverText(component);
	}
})