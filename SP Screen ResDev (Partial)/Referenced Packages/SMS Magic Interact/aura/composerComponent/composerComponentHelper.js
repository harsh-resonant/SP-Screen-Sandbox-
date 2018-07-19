({
	updateLengthOfSMS: function (component, messageText, encoding) {
		var self = {
			messageText : messageText || component.get('v.messageText') || '',
			encoding : encoding || component.get('v.encoding') || 1
		};
		var numberOfSms;
		var charLimit;
		var longSmsCharLimit = component.get('v.longSmsCharLimit');
		if (self.messageText) {
			var textLen = self.messageText.length;
			if (textLen <= 160 && self.encoding === 1) {
				charLimit = 160;
			} else if (self.encoding === 2) {
				charLimit = 70;
			} else {
				charLimit = 152;
			}
			if (textLen <= longSmsCharLimit) {
				numberOfSms = Math.ceil(textLen / charLimit);
				component.set('v.numberOfSms', numberOfSms);
			}
		}
		if (self.encoding === 2) {
			longSmsCharLimit = 350;
		} else {
			longSmsCharLimit = 700;
		}
		component.set('v.longSmsCharLimit', longSmsCharLimit);
	},
	updateMessageEncoding: function (component, messageText) {
		var i = 0;
		var encoding = 1;
		if (messageText) {
			while (i < messageText.length) {
				if (messageText.charCodeAt(i) > 255) {
					encoding = 2;
					break;
				}
				i = i + 1;
			}
		}
		component.set('v.encoding', encoding);
	},
	upload: function (component, event, helper, file, fileContents) {
		var notification = component.find('NotificationManager');
		var action = component.get('c.uploadFile');
		var self = {
			file : {
				name: file.name,
				url: '',
				type: file.type,
				size: (file.size / 1024).toFixed()
			}
		};
		// component.set('v.file', {});
		component.set('v.file', self.file);
		component.find('progressBar').getElements()[0].style.width = '1%';
		component.find('progressBar').getElements()[0].style.backgroundColor = '#FFFF00';
		component.find('mediaDetails').getElements()[0].style.display = 'inline-block';
		var id = setInterval(frame, 150);
		var width = 1;
		action.setParams({
			requestContext: undefined,
			fileName: self.file.name,
			base64Data: fileContents,
			contentType: self.file.type
		});
		action
			.setCallback(
			this,
			function (response) {
				var state = response.getState();
				clearInterval(id);
				if (state === 'SUCCESS') {
					var returnVal = response.getReturnValue();
					if (returnVal) {
						if (returnVal.statusCode === '201') {
							self.file.url = returnVal.fileURL;
							component.set('v.file', self.file);
							component.find('progressBar')
								.getElements()[0].style.backgroundColor = '#00FF00';
							notification
								.showNotification(
								'utility:success',
								'toast',
								'success',
								$A.get('$Label.smagicinteract.FILE_UPLOAD_SUCCESS'),
								'5000');
						} else if (returnVal.statusCode === '500') {
							notification.showNotification(
								'utility:error', 'toast',
								'error', returnVal.status,
								'5000');
							component.find('progressBar')
								.getElements()[0].style.backgroundColor = '#FF0000';
						}
					}
				} else {
					var str = response.getError();
					if (str && str.length) {
						component.find('progressBar').getElements()[0].style.backgroundColor = '#FF0000';
						notification.showNotification(
							'utility:error', 'toast', 'error',
							str[0].message, '5000');
					}
				}
				component.find('progressBar').getElements()[0].style.width = '100%';
			});
		$A.enqueueAction(action);
		function frame() {
			if (width >= 93) {
				clearInterval(id);
			} else {
				width += 1;
				component.find('progressBar').getElements()[0].style.width = width
					+ '%';
				component.find('progressBar').getElements()[0].style.backgroundColor = '#FFFF00';
			}
		}
	},
	removeFile: function (component) {
        var fileInput = component.find('fileinput');
        if (fileInput) {
        	fileInput = fileInput.getElement();
        }
        if (fileInput) {
        	fileInput.value = '';
        }

        var mediaDetails = component.find('mediaDetails');
        if (mediaDetails) {
        	mediaDetails = mediaDetails.getElements();
        }
        if (mediaDetails && mediaDetails[0]) {
        	mediaDetails[0].style.display = 'none';
        }

		var file = {
			url: '',
			name: '',
			size: 0
		};
		component.set('v.file', file);
		component.set('v.messageType', ' SMS');
	},
	sendMsg: function (component, helper, source) {
		var file;
		var fileUrl = '';
		var senderId;
		var phoneField;
		var templateText;
		var isCustomTemplate;
		var templateId;
		var action;
		// var mmsSubject;
		var sendSpinner;
		var recordId = component.get('v.recordId');
		var notification = component.find('NotificationManager');
		if (!recordId) {
			notification.showNotification('utility:error', 'toast', 'error',
				$A.get('$Label.smagicinteract.NON_SF_OBJECT_ERR'), '5000');
			return;
		}

		file = component.get('v.file');
		if (file) {
			fileUrl = file.url;
		}
		senderId = component.get('v.senderId') || '';
		phoneField = component.get('v.phoneField') || '';
		templateText = component.get('v.messageText') || '';
		if (!phoneField.trim() || (!templateText.trim() && !fileUrl.trim())
			|| !senderId.trim()) {
			notification.showNotification('utility:error', 'toast', 'error', $A
				.get('$Label.smagicinteract.CONV_VIEW_VALIDATION'), '7000');
			return;
		}
		if (!templateText.trim()) {
			templateText = '';
		}
		action = component.get('c.sendMessage');
		isCustomTemplate = component.get('v.isCustomTemplate');
		templateId = isCustomTemplate ? null : component
			.get('v.selectedTemplateId') || null;
		// mmsSubject = component.find('mmsSubject').get('v.value');
		sendSpinner = component.find('sendSpinner');
        $A.util.removeClass(sendSpinner, "slds-hide");
		var context = component.get('v.context');
		var requestContext = helper.getRequestContext(context, source);
		action.setParams({
			requestContext: JSON.stringify(requestContext) || '',
			recId: recordId,
			senderId: senderId,
			phoneField: phoneField,
			templateId: templateId,
			templateText: templateText,
			mmsSubject: '',
			fileUrls: [fileUrl]
		});
		action.setCallback(this, function (response) {
			sendSpinner = component.find('sendSpinner');
        	$A.util.addClass(sendSpinner, "slds-hide");
			var state = response.getState();
			var responseDto = response.getReturnValue();
			var responseTO;
			var messageSentEvent;
			if (state === 'SUCCESS' && responseDto) {
				responseTO = responseDto.responseTO;
				if (responseTO && responseTO.status === 'SUCCESS') {
					messageSentEvent = $A.get('e.smagicinteract:reloadConversation');
					messageSentEvent.fire();
					helper.resetComposer(component, helper, false);
				} else if (responseTO && responseTO.status === 'FAILURE'
					&& responseTO.errResponseObj) {
					notification.showNotification('utility:error', 'toast',
						'error', responseTO.errResponseObj.code, '5000');
				}
			} else {
				var str = response.getError();
				if (str && str.length) {
					notification.showNotification('utility:error', 'toast',
						'error', str[0].message, '5000');
				}
			}
		});
		$A.enqueueAction(action);
	},
	getRequestContext: function getRequestContext(context, source) {
		var requestContext = {};
		if(source) {
			requestContext.Source = source;
		} else if (context && context.isSf1) {
			requestContext.Source = '1187';
		} else if (context && (context.isDetailPage || context.isActivitySection)) {
			requestContext.Source = '1181';
		} else if (context && context.isCustomTab) {
			requestContext.Source = '1185';
		}
		return requestContext;
	},
	getComposerData: function getComposerData(component, recordId, sObjectName) {
		var action = component.get('c.loadComposerData');
		if (!recordId) {
			return;
		}
		action.setParams({
			requestContext: null,
			recordId: recordId,
			objectName: sObjectName
		});
		action
			.setCallback(
			this,
			function (response) {
				var notification;
				var permissions, canSendMessage, responseTO, errResponseObj;
				var status = response.getState();
				var composerResponseDto = response.getReturnValue();
				notification = component.find('NotificationManager');
				if (status === 'SUCCESS' && composerResponseDto) {
					responseTO = composerResponseDto.responseTO;
					if (responseTO && responseTO.status === 'FAILURE') {
						errResponseObj = responseTO.errResponseObj;
						if (errResponseObj) {
							notification
								.showNotification(
								'utility:error',
								'toast',
								'error',
								errResponseObj.code,
								'5000');
						}
						return;
					}
					if (composerResponseDto.templateInfoObject) {
						component
							.find('templateDropup')
							.set('v.templateList',
							composerResponseDto.templateInfoObject.templateList);
						component
							.set('v.longSmsCharLimit',
							composerResponseDto.templateInfoObject.maxMessageSize);
					}
					if (composerResponseDto.mmsInfoObject) {
						component
							.set('v.isMMSEnabled',
							composerResponseDto.mmsInfoObject.isMMSEnabled);
                        component
							.set('v.mmsSupportedFormats',
							composerResponseDto.mmsInfoObject.mmsSupportedFormats);
						component
							.set('v.mmsMaxSizeKB',
							composerResponseDto.mmsInfoObject.mmsMaxSizeKB);
						component
							.set('v.areMultipleFilesSupported',
							composerResponseDto.mmsInfoObject.areMultipleFilesSupported);
						// component.set('',
						// composerResponseDto.mmsInfoObject.status);
						// component.set('',
						// composerResponseDto.mmsInfoObject.statusCode);
					}
					if (composerResponseDto.messagePermission) {
						permissions = composerResponseDto.messagePermission;
						/* global sforce:true */
						if (typeof sforce != 'undefined' && sforce !== null) {
							canSendMessage = permissions.canSendMessageFromSalesforce1 &&
								permissions.canSendMessageFromConvView;
						} else {
							canSendMessage = permissions.canSendMessageFromConvView;
						}
						component.set('v.canSendMessage',
							canSendMessage);
						component.set('v.composerPermissions',
							permissions);
					}
				}
			});
		$A.enqueueAction(action);
	},
	resetComposer: function resetComposer(component, helper, isIdChanged) {
		var messageBody = component.find('messageBody').getElement();
		messageBody.value = '';
		component.set('v.messageText', messageBody.value);
		component.set('v.messageType', ' SMS');
		component.set('v.numberOfSms', 0);
		component.set('v.encoding', 1);
		component.set('v.selectedTemplateId', null);
		if (isIdChanged) {
			component.set('v.phoneField', '');
		}
		component.set('v.isCustomTemplate', true);
		helper.removeFile(component);
		helper.updateLengthOfSMS(component);
		component.find('templateDropup').resetTemplateIconHoverText();
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
});