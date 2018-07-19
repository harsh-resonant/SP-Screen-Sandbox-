({
	afterRender: function (component, helper) {
    	this.superAfterRender();
        helper.setvariant(component);
       	helper.setNubbin(component);
        var width = component.get("v.width");
        if(width){
        	var tooltiptextId = component.find("tooltiptextId").getElements()[0];
           	tooltiptextId.style.width = width; 
        }
        
    }
})