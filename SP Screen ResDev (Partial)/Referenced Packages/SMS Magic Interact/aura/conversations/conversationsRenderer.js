({
	afterRender: function (component, helper) {
    	this.superAfterRender();
        var conversationAndFilterDiv = component.find("conversationAndFilterDiv");
        var width = conversationAndFilterDiv.getElements()[0].getBoundingClientRect().width;
        if(width < 500){
            $A.util.addClass(conversationAndFilterDiv , 'activitySection');
            component.set("v.componentIsInActivitySection", true);
        }
    }
})