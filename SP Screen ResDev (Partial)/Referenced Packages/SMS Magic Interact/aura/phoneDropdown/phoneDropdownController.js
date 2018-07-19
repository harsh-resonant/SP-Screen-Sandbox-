({
	doInit : function(component, event, helper) {
		var recordId = component.get("v.recordId");
		var action = component.get("c.loadPhoneNumberData");
		var providedFieldApiNames = component.get('v.phoneFieldCSV');
		action.setParams({
			recId : recordId,
            requestContext: "",
            providedFieldApiNames: providedFieldApiNames || ""
		});
		action.setCallback(this, function(response) {
			var state = response.getState();
            var isSelectedValueSet = false;
            if (state === "SUCCESS") {
                var returnVal = response.getReturnValue();
                if (returnVal && returnVal.responseTO.status === "SUCCESS"
                    && returnVal.picklistOptionList && returnVal.picklistOptionList[0]) {
                    var defaultSelectedPhoneNumber = component.get("v.defaultSelectedPhoneNumber");
                    var usFormatNumber;
                    if(!defaultSelectedPhoneNumber) {
                        defaultSelectedPhoneNumber = returnVal.picklistOptionList[0].value;
                    }
                    if(defaultSelectedPhoneNumber && defaultSelectedPhoneNumber.length >= 10) {
                        if(defaultSelectedPhoneNumber.startsWith('(')) {
                            usFormatNumber = defaultSelectedPhoneNumber;
                        } else {
                            usFormatNumber = '('+defaultSelectedPhoneNumber.substring(defaultSelectedPhoneNumber.length-10, defaultSelectedPhoneNumber.length-7) +') '+
                                defaultSelectedPhoneNumber.substring(defaultSelectedPhoneNumber.length-7, defaultSelectedPhoneNumber.length-4) +'-'+
                                defaultSelectedPhoneNumber.substring(defaultSelectedPhoneNumber.length-4, defaultSelectedPhoneNumber.length)
                        }
                    }
                    returnVal.picklistOptionList = returnVal.picklistOptionList.map(function(val) {
                        val.label = val.value + ' (' + val.label + ')';
                        
                        if(!isSelectedValueSet && (val.value === defaultSelectedPhoneNumber || val.value === usFormatNumber)) {
                            component.set('v.selectedPhoneNumber', val.label);
                            component.find('phoneFieldSelect').set('v.value', val.value + ':' + val.name);
                            component.getEvent('phoneFieldSelectionEvent').fire({value: val.name});
                            isSelectedValueSet = true;
                        }
                        val.value = val.value + ':' + val.name;
                        return val;
                    });
                    if(!isSelectedValueSet) {
                        component.set('v.selectedPhoneNumber', returnVal.picklistOptionList[0].label);
                        component.find('phoneFieldSelect').set('v.value', returnVal.picklistOptionList[0].value);
                        component.getEvent('phoneFieldSelectionEvent').fire({value: returnVal.picklistOptionList[0].name});
                    }
                    component.set("v.items", returnVal.picklistOptionList);
                } else {
                    component.set('v.selectedPhoneNumber', undefined);
                    component.set("v.items", []);
                    component.getEvent('phoneFieldSelectionEvent').fire({value: undefined});
                }
            } else {
                component.set('v.selectedPhoneNumber', undefined);
                component.set("v.items", []);
                component.getEvent('phoneFieldSelectionEvent').fire({value: undefined});
            }
		});
		$A.enqueueAction(action);
	},
	onPhoneFieldSelection: function(component, event, helper) {
		var selectedValue = component.find("phoneFieldSelect").get("v.value");
        var items = component.get("v.items");
		var phoneFieldSelectionEvent = component.getEvent('phoneFieldSelectionEvent');
        for(var i=0; i <items.length ; i += 1) {
            if(items[i].value === selectedValue) {
                component.set('v.selectedPhoneNumber', items[i].label);
                if(phoneFieldSelectionEvent) phoneFieldSelectionEvent.fire({value: items[i].name});
            }
        }
	}
})