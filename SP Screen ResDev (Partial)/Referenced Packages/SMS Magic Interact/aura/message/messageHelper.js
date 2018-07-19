({
    getMediaUrl : function(url) {
        /*if(url.includes("https://www.youtube.com/") && url.includes('watch')) {
                url = url.replace(/watch\?v=/i, 'embed/');
            }*/
        if(url.path){
            return url.path;
        }
        return url;
    },
    getMediaType : function(url) {
        /*if(url.includes("https://www.youtube.com/") && (url.includes('/embed/') || url.includes('/watch\?v='))) {
                return 'YOUTUBE';
            }*/
        if(url.type){
            return url.type;
        }
        var extention = url.split('.').pop();
        if(extention) {
            extention = extention.toLowerCase();
        }
        
        var type='FILE';
        if(extention === 'gif') {
            type = 'ANIMATION';
        } else if(extention === 'jpg' || extention === 'png'
                  || extention === 'jpeg' || extention === 'bmp') {
            type = 'IMAGE';
        } else if(extention === 'mp4') {
            type = 'VIDEO';
        }
        return type;
    },
    addCRMAction : function(component) {
        var message = component.get("v.message");
        if(!message) {
            return;
        }
        var objectName = message.objectName ? message.objectName.toLowerCase() : undefined;
        var CRMActionsList = [];
        if(message.direction === 'Inbound') {
            CRMActionsList.push({
                label: $A.get('$Label.smagicinteract.EDIT_TITLE'),
                value: 'editRecord'
            });
        }
        var label = $A.get('$Label.smagicinteract.View_Record');
        if(objectName === 'lead') {
            label = $A.get('$Label.smagicinteract.View_Lead');
        }
        if(objectName === 'contact') {
            label = $A.get('$Label.smagicinteract.View_Contact');
        }
        if(objectName === 'account') {
            label = $A.get('$Label.smagicinteract.View_Account');
        }
        if(objectName === 'case') {
            label = $A.get('$Label.smagicinteract.View_Case');
        }
        if(objectName === 'opportunity') {
            label = $A.get('$Label.smagicinteract.View_Opportunity');
        }
        
        CRMActionsList.push(
            {
                label: label,
                value: 'viewRecord'
            },
            {
                label: $A.get('$Label.smagicinteract.Create_Task'),
                value: 'createTask'
            },
            {
                label: $A.get('$Label.smagicinteract.Create_Event'),
                value: 'createEvent'
            }
        );
        if(objectName === 'contact' || objectName === 'account') {
            CRMActionsList.push({
                label: $A.get('$Label.smagicinteract.Create_Case'),
                value: 'createCase'
            });
        }
        if(objectName === 'lead') {
            CRMActionsList.push({
                label: $A.get('$Label.smagicinteract.Convert_Lead'),
                value: 'viewRecord'
            });
        }
        if(objectName === 'account') {
            CRMActionsList.push({
                label: $A.get('$Label.smagicinteract.Create_Opportunity'),
                value: 'createOpportunity'
            });
        }
        if(!(objectName === 'lead' || objectName === 'contact' || objectName === 'account' || objectName === 'case' || objectName === 'opportunity')) {
        CRMActionsList.push(
            {
                label: $A.get('$Label.smagicinteract.Create_Lead'),
                value: 'createLead'
            },
            {
                label: $A.get('$Label.smagicinteract.Create_Contact'),
                value: 'createContact'
            },
            {
                label: $A.get('$Label.smagicinteract.Create_Account'),
                value: 'createAccount'
                },
                {
                    label: $A.get('$Label.smagicinteract.Create_Case'),
                    value: 'createCase'
            },
            {
                    label: $A.get('$Label.smagicinteract.Create_Opportunity'),
                    value: 'createOpportunity'
            }
        );
        }
        
        var CRMAction = {
            sObjectName: objectName,
            messageId: message.messageId,
            CRMActionsList: CRMActionsList
        };
        component.set("v.CRMActions", CRMAction);
    },
    createTask : function(component, recordId, messageId, message, sObjectName) {
        var url;
        var redirectURL;
        var whoId, whatId;
        if (sObjectName === 'lead' || sObjectName === 'contact') {
            whoId = recordId;
        } else {
            whatId = recordId;
        }
        var defaultFieldValues = {
            'WhoId' : whoId,
            'WhatId' : whatId,
            'Description' : message.messageText
        };
        
        var createRecordEvent = $A.get("e.force:createRecord");
        if(createRecordEvent) {
            createRecordEvent.setParams({
                "entityApiName": "Task",
                "defaultFieldValues": defaultFieldValues
            });
            createRecordEvent.fire();
            /*global sforce:true*/
        } else if(typeof sforce != 'undefined' && sforce.one) {
            sforce.one.createRecord('Task', null, defaultFieldValues); 
        } else {
            try {
                redirectURL = encodeURI('/apex/smagicinteract__RedirectPage?messageId='+messageId+'&recordId='+recordId);
                if (sObjectName === 'lead' || sObjectName === 'contact') {
                    url = '/00T/e?who_id=';
                } else {
                    url = '/00T/e?what_id=';
                }
                url = url + recordId +'&retURL='+redirectURL +'&saveURL='+ redirectURL+ '&tsk6='+ message.messageText;
                window.open(url, 'conversation view', 'width=1000,height=800,scrollbars=yes');
            } catch(e) {}
        }
    },
    createEvent : function(component, recordId, messageId, message, sObjectName) {
        var url;
        var redirectURL;
        var whoId, whatId;
        if (sObjectName === 'lead' || sObjectName === 'contact') {
            whoId = recordId;
        } else {
            whatId = recordId;
        }
        var defaultFieldValues = {
            'WhoId': whoId,
            'WhatId': whatId,
            'Description': message.messageText
        };
        
        var createRecordEvent = $A.get("e.force:createRecord");
        if(createRecordEvent) {
            createRecordEvent.setParams({
                "entityApiName": "Event",
                "defaultFieldValues": defaultFieldValues
            });
            createRecordEvent.fire();
        } else if(typeof sforce != 'undefined' && sforce.one) {
            sforce.one.createRecord('Event', null, defaultFieldValues); 
        } else {
            try {
                redirectURL = encodeURI('/apex/smagicinteract__RedirectPage?messageId='+messageId+'&recordId='+recordId);
                if (sObjectName === 'lead' || sObjectName === 'contact') {
                    url = '/00U/e?who_id=';
                } else {
                    url = '/00U/e?what_id=';
                }
                url = url + recordId +'&retURL='+redirectURL +'&saveURL='+ redirectURL+ '&evt6='+ message.messageText;
                window.open(url, 'conversation view', 'width=1000,height=800,scrollbars=yes');
            } catch(e) {}
        }
    },
    createCase : function(component, recordId, messageId, message, sObjectName) {
        var url;
        var redirectURL;
        var contactId, accountId;
        if (sObjectName === 'contact') {
            contactId = recordId;
        }
        if (sObjectName === 'account') {
            accountId = recordId;
        }
        var defaultFieldValues = {
            'ContactId': contactId,
            'AccountId': accountId,
            'Description': message.messageText
        };
        
        var createRecordEvent = $A.get("e.force:createRecord");
        if(createRecordEvent) {
            createRecordEvent.setParams({
                "entityApiName": "Case",
                "defaultFieldValues": defaultFieldValues
            });
            createRecordEvent.fire();
        } else if(typeof sforce != 'undefined' && sforce.one) {
            sforce.one.createRecord('Case', null, defaultFieldValues);
        } else {
            try {
                redirectURL = encodeURI('/apex/smagicinteract__RedirectPage?messageId='+messageId+'&recordId='+recordId);
                url = '/500/e?';
                if(sObjectName === 'contact') url = url + 'def_contact_id=' + recordId + '&';
                if(sObjectName === 'account') url = url + 'def_account_id=' + recordId + '&';
                
                url = url + 'retURL='+redirectURL +'&saveURL='+ redirectURL+ '&cas15='+ message.messageText;
                window.open(url, 'conversation view', 'width=1000,height=800,scrollbars=yes');
            } catch(e) {}
        }
    },
    createLead : function(component, recordId, messageId, message) {
        var url;
        var redirectURL;
        var defaultFieldValues = {
            'MobilePhone' : message.mobileNo,
            'Description' : message.messageText
        }
        var createRecordEvent = $A.get("e.force:createRecord");
        if(createRecordEvent) {
            createRecordEvent.setParams({
                "entityApiName": "Lead",
                "defaultFieldValues": defaultFieldValues
            });
            createRecordEvent.fire();
        } else if(typeof sforce != 'undefined' && sforce.one) {
            sforce.one.createRecord('Lead', null, defaultFieldValues);
        } else {
            try {
                redirectURL = encodeURI('/apex/smagicinteract__RedirectPage?messageId='+messageId+'&recordId='+recordId);
                url = '/00Q/e?saveURL='+redirectURL+'&retURL='+redirectURL+ '&lea9='+ message.mobileNo +'&lea17='+ message.messageText;
                window.open(url, 'conversation view', 'width=1000,height=800,scrollbars=yes');
            } catch(e) {}
        }
    },
    createAccount : function(component, recordId, messageId, message) {
        var url;
        var redirectURL;
        var createRecordEvent = $A.get("e.force:createRecord");
        var defaultFieldValues = {
            'Phone' : message.mobileNo,
            'Description' : message.messageText
        }
        if(createRecordEvent) {
            createRecordEvent.setParams({
                "entityApiName": "Account",
                "defaultFieldValues": defaultFieldValues
            });
            createRecordEvent.fire();
        } else if(typeof sforce != 'undefined' && sforce.one) {
            sforce.one.createRecord('Account', null, defaultFieldValues); 
        } else {
            try {
                redirectURL = encodeURI('/apex/smagicinteract__RedirectPage?messageId='+messageId+'&recordId='+recordId);
                url = '/001/e?saveURL='+redirectURL+'&retURL='+redirectURL+ '&acc10='+ message.mobileNo +'&acc20='+ message.messageText;
                window.open(url, 'conversation view', 'width=1000,height=800,scrollbars=yes');
            } catch(e) {}
        }
    },
    createOpportunity : function(component, recordId, messageId, message, sObjectName) {
        var url;
        var redirectURL;
        var accountId;
        if(sObjectName === 'account') accountId = recordId;
        
        var defaultFieldValues = {
            'Description' : message.messageText,
            'AccountId' : accountId
        };
        var createRecordEvent = $A.get("e.force:createRecord");
        if(createRecordEvent) {
            createRecordEvent.setParams({
                "entityApiName": "Opportunity",
                "defaultFieldValues": defaultFieldValues
            });
            createRecordEvent.fire();
        } else if(typeof sforce != 'undefined' && sforce.one) {
            sforce.one.createRecord('Opportunity', null, defaultFieldValues);
        } else {
            try {
                redirectURL = encodeURI('/apex/smagicinteract__RedirectPage?messageId='+messageId+'&recordId='+recordId);
                url = '/006/e?';
                if(sObjectName === 'account') {
                    url = url + 'accid=' + accountId + '&';
                }
                url = url + 'saveURL='+redirectURL+'&retURL='+redirectURL+ '&opp14='+ message.messageText;
                window.open(url, 'conversation view', 'width=1000,height=800,scrollbars=yes');
            } catch(e) {}
        }
    },
    createContact : function(component, recordId, messageId, message) {
        var url;
        var redirectURL;
        var defaultFieldValues = {
            'MobilePhone' : message.mobileNo,
            'Description' : message.messageText
        };
        var createRecordEvent = $A.get("e.force:createRecord");
        if(createRecordEvent) {
            createRecordEvent.setParams({
                "entityApiName": "Contact",
                "defaultFieldValues": defaultFieldValues
            });
            createRecordEvent.fire();
        } else if(typeof sforce != 'undefined' && sforce.one) {
            sforce.one.createRecord('Contact', null, defaultFieldValues); 
        } else {
            try {
                redirectURL = encodeURI('/apex/smagicinteract__RedirectPage?messageId='+messageId+'&recordId='+recordId);
                url = '/003/e?saveURL='+redirectURL+'&retURL='+redirectURL+ '&con12='+ message.mobileNo +'&con20='+ message.messageText;
                window.open(url, 'conversation view', 'width=1000,height=800,scrollbars=yes');
            } catch(e) {}
        }
    },
    editRecord : function(component, recordId) {
        var url = '/apex/smagicinteract__IncomingSMS?id=';
        
        url = url + recordId;
        var urlEvent = $A.get("e.force:navigateToURL");
        if(urlEvent) {
            urlEvent.setParams({
                "url": url
            });
            urlEvent.fire();
        } else {
            try{
                window.open(url, 'incomming edit', 'width=1000,height=800,scrollbars=yes');
            } catch(e) {}
        }
    },
    isLastVisibleMessage: function isLastVisibleMessage(component) {
        var containerHeight = component.get('v.containerHeight');
        var message = component.find('message').getElement();
        var scrollTop = component.get('v.scrollTop');
        return message.offsetTop - scrollTop > containerHeight - 150;
    },
    viewRecord : function(component, recordId) {
        var url;
        var returnURL;
        var urlEvent = $A.get("e.force:navigateToURL");
        if(urlEvent) {
            urlEvent.setParams({
                "url": '/'+recordId
            });
            urlEvent.fire();
        } else {
            try {
                returnURL = window.location.href;
                url = '/'+recordId;
                window.open(url, 'conversation view', 'width=1000,height=800,scrollbars=yes');
            } catch(e) {}
        }
    }
})