({
    doinit	: function(component, event, helper) {
        helper.checkAttributes(component, event, helper);
    },
    showModal : function(component, event, helper){
        helper.showModal(component, event, helper);
    },
    showModalParams : function(component, event, helper){
        helper.showModalParams(component, event, helper);
    },
    dismissModal : function(component, event, helper) {
        helper.dismissModal(component, event, helper);
    },
    closeModal : function(component, event, helper) {
        helper.closeModal(component, event, helper);
    },
    closeClickModal : function(component, event, helper) {
        var keyMap = component.get("v.pressedString");
        var code = event.key || event.code || event.keyIdentifier ;
        if(code == 'Escape'){
            helper.dismissModal(component, event, helper);
        }
        if(event.type == "keydown"){
        	keyMap[code] = true;
            console.log(keyMap[code]);
        } else {
            keyMap[code] = false;
        }
        helper.checkKeys(component,event,helper,keyMap);
    }
})