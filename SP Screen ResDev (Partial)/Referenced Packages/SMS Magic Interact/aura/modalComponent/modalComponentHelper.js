({
    checkAttributes : function(component, event, helper) {
        var dialogDiv = component.find('dialogDiv');
        var headerDiv = component.find("headerDiv");
        var modalType = component.get("v.modalType").toLowerCase();
        var headerTheme = component.get("v.headerTheme");
        var headerClass = "";
        if(modalType === "prompt") {
            $A.util.addClass(dialogDiv, "slds-modal_prompt");
            if(headerTheme) {
                headerClass = "slds-theme--"+headerTheme+" slds-theme--alert-texture";
            } else {
                headerClass = "slds-theme--info slds-theme--alert-texture";
            }
            $A.util.addClass(headerDiv, headerClass);
        } else {
            $A.util.removeClass(dialogDiv, "slds-modal_prompt");
            $A.util.removeClass(headerDiv, "slds-theme--alert-texture");
        }
        headerClass = "";
        if(headerTheme) {
            headerClass = "slds-theme--"+headerTheme;
        }
        $A.util.addClass(headerDiv, headerClass);
        var modalSize = component.get("v.modalSize");
        if(modalSize && modalSize === "large") {
            modalSize = modalSize.toLowerCase();
            //XXX- Proper naming convention
            $A.util.addClass(dialogDiv, "slds-modal--large");
        } else {
            $A.util.removeClass(dialogDiv, "slds-modal--large");
        }
        var header = component.get("v.header");
        var headerText = component.get("v.headerText");
        var headerComp = component.get("v.headerComp");
        if(header || headerText || (headerComp && headerComp.length)) {
            $A.util.removeClass(headerDiv, "slds-modal__header--empty");
            if(!headerText){
                var textDiv = component.find('headerText');
                $A.util.addClass(textDiv,'slds-hide');
            }
            
        } else {
            $A.util.addClass(headerDiv, "slds-modal__header--empty");
        }
        var footerComp = component.get("v.footerComp");
        var dismissButtonLabel = component.get("v.dismissButtonLabel");
        var closeButtonLabel = component.get("v.closeButtonLabel");
        var footerDiv = component.find('footerDiv');
        if((footerComp && footerComp.length) || dismissButtonLabel || closeButtonLabel) {
            var footerButtonDiv = component.find('footerButtonDiv');
            if(footerComp && footerComp.length) {
                helper.hideDiv(footerDiv);
                helper.showDiv(component.find('footerCompDiv'));
            } else {
                helper.hideDiv(component.find('footerCompDiv'));
                helper.showDiv(footerButtonDiv);
                helper.showDiv(footerDiv);
                var dismissButton = component.find('dismissButton');
                if(dismissButtonLabel) {
                    $A.util.addClass(dismissButton, "inline");
                } else {
                    $A.util.addClass(dismissButton, "displayNone");
                }
                var closeButton = component.find('closeButton');
                if(closeButtonLabel) {
                    $A.util.addClass(closeButton, "inline");
                } else {
                    $A.util.addClass(closeButton, "displayNone");
                }
            }
        } else {
            helper.hideDiv(footerDiv);
        }
    },
    showModal : function(component, event, helper){
        var modalDiv = component.find('modalDiv');
        helper.showDiv(modalDiv);
    },
    showModalParams : function(component, event, helper){
        var modalDiv = component.find('modalDiv');
        helper.showDiv(modalDiv);
        var params = event.getParam("arguments");
        component.set("v.header", params.header);
        component.set("v.headerText", params.headerText);
        component.set("v.bodyComp", params.bodyComp);
        component.set("v.footerComp", params.footerComp);
        component.set("v.modalSize", params.modalSize);
        component.set("v.dismissButtonLabel", params.dismissButtonLabel);
        component.set("v.closeButtonLabel", params.closeButtonLabel);
        component.set("v.modalType", params.modalType);
        var theme = component.get("v.headerTheme");
        var headerDiv = component.find("headerDiv");
        var headerClass = "";
        if(theme) {
            headerClass = "slds-theme--"+theme;
        } else {
            headerClass = "slds-theme--error";
        }
        $A.util.removeClass(headerDiv, headerClass);
        component.set("v.headerTheme", params.headerTheme);
        helper.checkAttributes(component, event, helper);
    },
    dismissModal : function(component, event, helper) {
        var reasonString ;
        var fireEvent = component.getEvent("ModalComponent");
        if(event.getParam){
            var params = event.getParam("arguments");
            reasonString = params ? params.dismissReason : '';
        }
        fireEvent.setParams({
            dismissReason 	: reasonString,
            eventType 		: "dismiss"
        });
        fireEvent.fire();
        var modalDiv = component.find('modalDiv');
        helper.hideDiv(modalDiv);
    },
    closeModal : function(component, event, helper) {
        var data;
        var fireEvent = component.getEvent("ModalComponent");
        if(event.getParam){
            var params = event.getParam("arguments");
            data = params ? params.data : {};
        }
        fireEvent.setParams({
            data : data,
            eventType : "close"
        });
        fireEvent.fire();
        var modalDiv = component.find('modalDiv');
        helper.hideDiv(modalDiv);
    },
    showDiv : function (div) {
        $A.util.removeClass(div, "slds-hide");
        $A.util.addClass(div, "slds-show");
    },
    hideDiv : function (div) {
        $A.util.removeClass(div, "slds-show");
        $A.util.addClass(div, "slds-hide");
    },
    checkKeys : function (component,event,helper,keymap){
        var keypressed = component.get("v.exitString");
        var keylist = keypressed.split('+');
        if(keymap[keylist[0]] && (keylist[1] ? keymap[keylist[1]] : true)){
            helper.dismissModal(component, event, helper);
        }
        component.set("v.pressedString",keymap);
    }
})