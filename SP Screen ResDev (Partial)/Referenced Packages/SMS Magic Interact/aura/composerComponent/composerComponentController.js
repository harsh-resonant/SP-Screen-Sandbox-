({
    doInit: function (component, event, helper) {
        var action;
        var recordId;
        var sObjectName;
        var contextDataCmp;
        var context = component.get('v.context');
        if(!context) {
            action = component.get("c.getUiThemeDisplayed");
            contextDataCmp = component.find('contextDataCmp');
            helper.executeAction(action, contextDataCmp.setUIContextFromTheme);
        } else if(!context.isLightning && !context.isClassic && !context.isSf1) {
            action = component.get("c.getUiThemeDisplayed");
            contextDataCmp = component.find('contextDataCmp');
            helper.executeAction(action, contextDataCmp.setUIContextFromTheme);
        }
        recordId = component.get('v.recordId');
        sObjectName = component.get('v.sObjectName');
        helper.getComposerData(component, recordId, sObjectName)
    },
    onRecordIdChange: function onRecordIdChange(component, event, helper) {
        var recordId = component.get('v.recordId');
        var sObjectName = component.get('v.sObjectName');
        helper.resetComposer(component, helper, true);
        helper.removeFile(component);
        helper.getComposerData(component, recordId, sObjectName)
    },
    onEmoticonSelection: function (component, event, helper) {
        var messageBody;
        var messageText;
        var cursorPos;
        var UTF16Encoding = 2;
        var selectedEmoticon = event.getParam('value');
        var longSmsCharLimit = component.get('v.longSmsCharLimit');
        var composer;
        if (selectedEmoticon) {
            messageText = component.get('v.messageText');
            cursorPos = component.get('v.cursorPos') || 0;
            messageText = cursorPos ? messageText.slice(0, cursorPos) + selectedEmoticon + messageText.slice(cursorPos) : selectedEmoticon;
            component.set('v.cursorPos', cursorPos + 2);
            if (messageText.length > longSmsCharLimit)
                return;

            component.set('v.encoding', UTF16Encoding);
            messageBody = component.find('messageBody').getElement();
            messageBody.value = messageText;
            component.set('v.messageText', messageBody.value);
            helper.updateLengthOfSMS(component, messageText, UTF16Encoding);
            if (messageBody.selectionStart) {
                messageBody.focus();
                messageBody.setSelectionRange(cursorPos + 2, cursorPos + 2);
            } else {
                messageBody.focus();
            }
        }
    },
    onKeyUpEvent: function (component, event, helper) {
        setTimeout($A.getCallback(function () {
            var templateText;
            var messageBody = component.find('messageBody').getElement();
            var messageText = messageBody.value;
            component.set('v.messageText', messageText);
            component.set('v.cursorPos', messageBody.selectionEnd);
            var longSmsCharLimit = component.get('v.longSmsCharLimit');
            if (messageText && messageText.length <= longSmsCharLimit) {
                templateText = component.find('templateDropup').get('v.templateText');
                if (messageText !== templateText) {
                    component.set('v.isCustomTemplate', true);
                    component.find("templateDropup").resetTemplateIconHoverText();
                } else {
                    component.set('v.isCustomTemplate', false);
                    component.find("templateDropup").setTemplateIconHoverText();
                }
            } else if (messageText && messageText.length > longSmsCharLimit) {
                messageText = messageText.substring(0, longSmsCharLimit);
                messageBody.value = messageText;
                component.set('v.messageText', messageBody.value);
                component.set('v.isCustomTemplate', true);
                component.find("templateDropup").resetTemplateIconHoverText();
            } else {
                messageBody.value = '';
                component.set('v.messageText', messageBody.value);
                component.set('v.numberOfSms', 0);
                component.set('v.isCustomTemplate', true);
                component.find("templateDropup").resetTemplateIconHoverText();
            }
            helper.updateMessageEncoding(component, messageText);
            helper.updateLengthOfSMS(component, messageText);
        }), 10);
    },
    openFileUploadPanel: function (component, event, helper) {
        var inputElement = component.find('fileinput').getElement();
        inputElement.click();
    },
    inputButtonClick: function (component, event, helper) {
        var fileInput = component.find('fileinput').getElement();
        var notification = component.find('NotificationManager');
        if (fileInput) {
            var file = fileInput.files[0];
            if (!file) {
                notification.showNotification('utility:error', 'toast',
                    'error',
                    $A.get('$Label.smagicinteract.NO_MEDIA_FILE_SELECTED'),
                    '10000');
            } else if (file.size > 500000) {
                notification.showNotification('utility:error', 'toast',
                    'error', $A
                    .get('$Label.smagicinteract.FILE_SIZE_EXCEED'),
                    '10000');
            } else {
                var fr = new FileReader();
                fr.readAsDataURL(file);
                fr.onload = $A.getCallback(function () {
                    helper.upload(component, event, helper, file, fr.result);
                });
            }
        }
        component.find('fileinput').getElement().value = '';
    },
    removeFile: function (component, event, helper) {
        helper.removeFile(component);
    },
    sendMsg: function (component, event, helper) {
        var embedContext = component.get('v.embedContext');
        helper.sendMsg(component, helper, typeof embedContext === 'string' && embedContext.toLowerCase() === 'action'? 1189 : null);
    },
    onTemplateSelection: function (component, event, helper) {
        var messageBody;
        var selectedTemplate = event.getParam('value');
        var encoding = 1;
        component.set('v.selectedTemplateId', selectedTemplate.id);
        messageBody = component.find('messageBody').getElement();
        messageBody.value = selectedTemplate.templateText;
        component.set('v.messageText', messageBody.value);
        component.set('v.cursorPos', messageBody.value.length);
        component.set('v.encoding', encoding);
        helper.updateLengthOfSMS(component, selectedTemplate.templateText, encoding);
    },
    onSenderIdSelection: function (component, event, helper) {
        var senderId = event.getParam('value');
        component.set('v.senderId', senderId);
    },
    openMergeFieldPanel: function (component, event, helper) {},
    recordResponseAction: function (component, event, helper) {
        var source = event.getParam('source');
        var responseList = event.getParam('responseList');
        if (source === 'senderId')
            component.set('v.senderId', responseList[0].label);
    },
    onPhoneFieldSelection: function (component, event, helper) {
        var phoneField = event.getParam('value');
        component.set('v.phoneField', phoneField);
    },
    startDrag: function startDrag(component, event, helper) {
        var draggable = component.find('messageBody').getElement();
        var startHeight = draggable.clientHeight;
        // var pX = event.pageX;
        var pY = event.pageY;

        document.addEventListener('mouseup', removeEventListener);
        document.addEventListener('mousemove', resizeComposer);

        function removeEventListener(e) {
            document.removeEventListener('mouseup', removeEventListener);
            document.removeEventListener('mousemove', resizeComposer);
        }

        function resizeComposer(e) {
            //var mx = (e.pageX - pX);
            var my = (e.pageY - pY);
            // draggable.style.top = my / 2 + 'px';
            draggable.style.height = startHeight - my + 'px';
            //draggable.style.left = mx / 2;
            //draggable.style.width = startWidth - mx;
        }
    },
    onContextChange: function onContextChange(component, event, helper) {
        var context = component.find('contextDataCmp').get('v.context');
        component.set('v.context', context);
    },
    onComposerClick: function onComposerClick(component, event, helper) {
        var messageBody = component.find('messageBody').getElement();
        component.set('v.cursorPos', messageBody.selectionEnd);
    }
})