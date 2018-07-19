({
	getFieldsList : function(component, actionName, outputList, objectName, fieldName) {
        var action = component.get("c." + actionName);
        
        var comboBox = component.find(outputList);
        if(comboBox) {
            comboBox.resetDataList();
        }
        var notification = component.find("NotificationManager");
        if(objectName) {
            action.setParams({requestContext: '', objectName: objectName});
        } else {
            action.setParams({requestContext: ''});
        }
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var fieldList = response.getReturnValue();
                var tempArr = fieldName ? fieldName.split(',') : [];
                if(Array.isArray(fieldList)) {
                    fieldList = fieldList.map(function(item) {
                        tempArr.forEach(function(val) {
                            if(val === item.name) {
                                item.defaultSelected = true;
                            }
                        });
                        return item;
                    });
                    component.set("v."+outputList, fieldList);
                }
            } else if (Array.isArray(response.getError()) && response.getError().length) {
                notification.showNotification('utility:error', 'toast', 'error', response.getError()[0].message, '5000');
            }
        });
        $A.enqueueAction(action);
	},
    getNameFromSelectOption : function(component, auraId) {
        var list = component.find(auraId).get("v.values");
        if(Array.isArray(list) && list.length) {
            return list[0].name;
        }
        return '';
    },
    readMessageObjectConfig : function(component, helper, objectName) {
        var action = component.get("c.getMessageObjectConfig");
        var notification = component.find("NotificationManager");
        action.setParams({requestContext: '', objectName: objectName});
        action.setCallback(this, function(response) {
            var state = response.getState();
            var messageConfig = {};
            var preSelectedMobileFields;
            if (state === "SUCCESS") {
                messageConfig = response.getReturnValue() || {};
                component.set("v.messageConfigId", messageConfig.id);
                if(messageConfig.configName) {
                    component.set("v.configName", messageConfig.configName);
                }
                var tempArr = messageConfig.objectFieldConfigList || [];
                if(Array.isArray(tempArr)) {
                    tempArr.forEach(function(val) {
                        preSelectedMobileFields = preSelectedMobileFields ? preSelectedMobileFields +','+ val.fieldName : val.fieldName;
                    });
                }
            } else if (Array.isArray(response.getError()) && response.getError().length) {
                notification.showNotification('utility:error', 'toast', 'error', response.getError()[0].message, '5000');
            }
            helper.getFieldsList(component, 'getNameFields', "allNameFields", objectName, messageConfig.nameField);
            helper.getFieldsList(component, 'getAllOptOutFields', "allOptOutFields", objectName, messageConfig.optOutField);
            helper.getFieldsList(component, 'getOptOutOperators', "allOptOutOperators", undefined, messageConfig.optOutOperator);
            helper.getFieldsList(component, 'getOptOutFieldValues', "allOptOutFieldValues", undefined, messageConfig.optOutFieldValue);
            helper.getFieldsList(component, 'getAllPhoneFields' , "allMobileFields", objectName, preSelectedMobileFields);
        });
        $A.enqueueAction(action);
    },
    resetData : function(component) {
        component.find('allNameFields').resetDataList();
        component.find('allOptOutFields').resetDataList();
        component.find('allOptOutOperators').resetDataList();
        component.find('allOptOutFieldValues').resetDataList();
        component.find('allMobileFields').resetDataList();
        component.set('v.allNameFields', []);
        component.set('v.allOptOutFields', []);
        component.set('v.allOptOutOperators', []);
        component.set('v.allOptOutFieldValues', []);
        component.set('v.allMobileFields', []);
    },
    getUrlParameter : function(val) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i = i+1) {
            var pair = vars[i].split("=");
            if (pair[0] === val) {
                return decodeURIComponent(pair[1]);
            }
        }
        return null;
    }
})