({
	showHideDiv : function(shownDiv, hidenDiv) {
		$A.util.removeClass(shownDiv , 'display-none');
        $A.util.addClass(hidenDiv , 'display-none');
	},
    closeThirdSection : function(component, event, helper) {
        component.find("conversationComponent").set("v.isFilterOpen", false);
        var conversationAndFilterDiv = component.find("conversationAndFilterDiv");
        $A.util.removeClass(conversationAndFilterDiv , 'show-filter');
        if(component.get("v.componentIsInActivitySection")) {
        	var conversationDiv = component.find("conversationDiv");
           	var filterDiv = component.find("filterDiv");
           	helper.showHideDiv(conversationDiv, filterDiv);
        }
    },
    executeAction : function(action, success, err) {
        action.setCallback(this, function (response) {
            var responseDto;
            var state = response.getState();
            if (state === "SUCCESS" && typeof success === 'function') {
                responseDto = response.getReturnValue();
                if (responseDto) {
                    success(responseDto);
                }
			} else if (state === "ERROR" && typeof err === 'function') {
				var errors = response.getError();
				if (errors) {
					if (errors[0] && errors[0].message) {
						err(errors[0].message);
					}
				} else {
					err("Something Went Wrong");
				}
			}
        });
        $A.enqueueAction(action);
    }
})