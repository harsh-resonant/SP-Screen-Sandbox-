({
    doInit: function(component, event, helper) {
        var field = component.get("v.field");
        if (field.Type==='BOOLEAN') {
            field.Value = (field.Value === true || field.Value === 'true');
        }
        component.set("v.field", field);
    },
    valueChanged: function (component, event, helper) {
        var field = component.get("v.field");
        if (field.Type==='PICKLIST') {
            var evt = $A.get("e.NVMContactWorld:ControllingPicklistUpdate");
            evt.setParam("picklistFieldName", field.ApiName);
            evt.setParam("picklistValue", field.Value);
            evt.fire();
        }
    },
    fireModelUpdateEvent: function () {
        // Tell the parent that the value has changed
        $A.get("e.NVMContactWorld:LogACallModelUpdate").fire();
    },
    onPicklistUpdated: function (component, event, helper) {
        var field = component.get("v.field");
        var masterPicklistName = event.getParam ("picklistFieldName");
        var masterPicklistValue = event.getParam ("picklistValue");
        if (field.IsDependentPicklist && masterPicklistName === field.ControllingPicklistFieldName)
        {
            console.log (field.ApiName + ': my controller (' + masterPicklistName + ') has been modified to: ' + masterPicklistValue);
            var action = component.get("c.getDependentPicklistValuesFor");
            action.setParams({ "controllingFieldName" : masterPicklistName, 
                              "dependentFieldName" : field.ApiName,
                              "controllingFieldValue" : masterPicklistValue });
            action.setCallback(this, function(response) {
                if(component.isValid() && response.getState() === "SUCCESS") {
                    var options = response.getReturnValue();                
                    var picklistOptions = [];
                    for (i= 0; i < options.length ; i++)
                    {
                        picklistOptions[i] = { Label: options[i].Label, Value: options[i].Value};
                    }
                    field.Options = picklistOptions;
                    console.log (picklistOptions);
                    component.set("v.field", field);
                }
            });
            $A.enqueueAction(action);
        }
    }
})