({
    doInit : function(component, event, helper) {
        var recipientItem = component.get("v.recipientItem");
        if(recipientItem && recipientItem.objectName) {
            var iconName = 'account:contact:lead:case:opportunity:campaign:user'.includes(recipientItem.objectName.toLowerCase()) ?
                recipientItem.objectName.toLowerCase() : 'custom';
            iconName = 'standard:' + iconName;
            if(recipientItem.objectName.toLowerCase()=== 'smagicinteract__incoming_sms__c' || recipientItem.objectName.toLowerCase()=== 'smagicinteract__smsmagic__c'){
                iconName = 'custom:custom12';
            }
            component.set("v.objectIcon", iconName);
        } else {
            component.set("v.objectIcon", 'standard:custom');
        }
    }
})