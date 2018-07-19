({
	getObjects : function(component, event, helper) {
        helper.getFieldsList(component, 'getSObjectList', "allObjects");
	},
    selectObjectName : function(component, event, helper) {
        var objectName = helper.getNameFromSelectOption(component, 'allObjects');
        if(objectName) {
            component.set("v.objectName", objectName);
            helper.readMessageObjectConfig(component, helper, objectName);
        } else {
            component.set("v.objectName", '');
            helper.resetData(component);
        }
    },
    saveConfiguration : function(component, event, helper) {
        var configName = component.get("v.configName");
        var objectName = component.get("v.objectName");
        var messageConfigId = component.get("v.messageConfigId");
        var nameField = helper.getNameFromSelectOption(component, 'allNameFields');
        var optOutField = helper.getNameFromSelectOption(component, 'allOptOutFields');
        var optOutOperator = helper.getNameFromSelectOption(component, 'allOptOutOperators');
        var optOutFieldValue = helper.getNameFromSelectOption(component, 'allOptOutFieldValues');
        var notification = component.find("NotificationManager");
        var msg;

        if(!configName || !objectName || !nameField) {
            if (!configName) {
                msg = $A.get("$Label.smagicinteract.enter_configuration_name");
            } else if (!nameField) {
                msg = $A.get("$Label.smagicinteract.SELECT_NAME_FIELD");
            } else {
                msg = $A.get("$Label.smagicinteract.OPT_OTPTSETGS_CNTRLR_SEL_OBJ");
            }

            notification.showNotification('utility:error', 'toast', 'error', msg, '5000');
            return;
        }

        var messageConfig = {
            id: messageConfigId,
            configName: configName,
            nameField: nameField,
            objectName: objectName,
            optOutField: optOutField,
            optOutOperator: optOutOperator,
            optOutFieldValue: optOutFieldValue,
            objectFieldConfigList : []
        };
        var list = component.find("allMobileFields").get("v.values");
        if(Array.isArray(list) && list.length) {
            list.forEach(function(val) {
                messageConfig.objectFieldConfigList.push({
                    id: '',
                    configName: objectName + '_' + val.name,
                    fieldName: val.name,
                    fieldPurpose: 'Outgoing',
                    fieldType: 'API Name'
                });
            });
        }
        var action = component.get("c.upsertMessageObjectConfig");
        action.setParams({requestContext: '', messageObjectConfigInfoJson: JSON.stringify(messageConfig)});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var retVal = response.getReturnValue();
                if(retVal.status === 'SUCCESS') {
                    notification.showNotification('utility:success', 'toast', 'success', $A.get("$Label.smagicinteract.CONFIG_SAVED"), '5000');
                } else if(retVal.status === 'FAILURE') {
                    var errResponseObj = retVal.errResponseObj;
                    if(errResponseObj && errResponseObj.code) {
                        notification.showNotification('utility:error', 'toast', 'error', errResponseObj.code, '5000');
                    }
                }
            } else if (Array.isArray(response.getError()) && response.getError().length) {
                notification.showNotification('utility:error', 'toast', 'error', response.getError()[0].message, '5000');
            }
        });
        $A.enqueueAction(action);
    },
    cancel : function(component, event, helper) {
        var retUrl = helper.getUrlParameter("retURL");
        /*global sforce:true*/
        if(typeof sforce != 'undefined' && sforce.one) {
            sforce.one.back(true);
        } else if(retUrl && retUrl.trim()) {
                window.location.href = retUrl;
            } else {
                window.history.back();
            }
    }
});