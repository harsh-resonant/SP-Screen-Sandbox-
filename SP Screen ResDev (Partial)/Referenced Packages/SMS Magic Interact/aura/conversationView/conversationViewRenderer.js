({
	afterRender: function (component, helper) {
    	this.superAfterRender();
        var containerDiv = component.find("containerDiv");
        var width = containerDiv.getElements()[0].getBoundingClientRect().width;
        if(width < 500){
            $A.util.addClass(containerDiv , 'activitySection');
        }
    }
})