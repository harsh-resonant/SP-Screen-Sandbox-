({
	afterRender: function (component, helper) {
    	this.superAfterRender();
        var popoverBody = component.find('popoverBody').getElements()[0];
        var height = component.get("v.height");
        var width = component.get("v.width");
        var left = component.get("v.left");
        popoverBody.style.height = height;
        popoverBody.style.width = width;
        popoverBody.style.left = left;
	}
})