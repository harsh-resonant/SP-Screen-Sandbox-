({
    getRecipientData: function getRecipientData(component) {
        var action = component.get('c.loadRecordData');
		var recordId = component.get('v.recordId');
        var headerDiv = component.find('headerDiv');
        if(!recordId){
            component.set('v.name', undefined);
            component.set('v.isOptout', false);
            component.set('v.iconName', undefined);
            
            $A.util.addClass(headerDiv,'slds-hide');
            $A.util.removeClass(headerDiv,'slds-show');
            return;
        }
        $A.util.addClass(headerDiv,'slds-show');
        $A.util.removeClass(headerDiv,'slds-hide');
		action.setParams({
			requestContext: null,
			recId: recordId
		});
		action.setCallback(this, function (response) {
			var state = response.getState();
			var recipientDto = response.getReturnValue();
			var iconName;
			if (state === 'SUCCESS' && recipientDto &&
				recipientDto.conversationsList && recipientDto.conversationsList[0]) {
				component.set('v.name',
					recipientDto.conversationsList[0].recordName);
				component.set('v.isOptout',
					recipientDto.conversationsList[0].isOptedOut);
                iconName = recipientDto.conversationsList[0].objectName && 'account:contact:lead:case:opportunity:campaign:user'
					.includes(recipientDto.conversationsList[0].objectName.toLowerCase()) ?
					recipientDto.conversationsList[0].objectName.toLowerCase() :
					'custom';
				iconName = 'standard:' + iconName;
                if(recipientDto.conversationsList[0].objectName.toLowerCase() === 'smagicinteract__smsmagic__c' || recipientDto.conversationsList[0].objectName.toLowerCase() === 'smagicinteract__incoming_sms__c')
                {
                    iconName = 'custom:custom12';
                }
				component.set('v.iconName', iconName);
			}
		});
		$A.enqueueAction(action);
    }
})