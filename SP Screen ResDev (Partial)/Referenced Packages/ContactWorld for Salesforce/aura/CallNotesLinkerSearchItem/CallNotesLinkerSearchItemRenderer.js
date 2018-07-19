({
    render: function(component, helper) {
    var ret = this.superRender();

    var fullName = component.get("v.fullName");
    var nameSnippet = component.get("v.nameSnippet");
    var fullNameFormatted = "";
    
    if (nameSnippet.length >= 2 && fullName.length >= nameSnippet.length)
    {
        var insertPos = 0;
        while (insertPos > -1) {
            fullName = fullName.substr(insertPos, fullName.length);
            var insertPos = fullName.indexOf(nameSnippet);
            if (insertPos > -1) {
                fullNameFormatted += fullName.substr(0, insertPos) + 
                                     '<b>' + 
                                     fullName.substr(insertPos, nameSnippet.length) + 
                                     '</b>';
                insertPos += nameSnippet.length;
            } else {
                fullNameFormatted += fullName;
            }
        }
    }
    else {
        fullNameFormatted = fullName;           
    }
        
    var searchItemRendered = document.createElement("LABEL");
    searchItemRendered.innerHTML = fullNameFormatted;
        
    var container = component.find("container").getElement();
    container.insertBefore(searchItemRendered, container.firstChild);

    return ret;
  }
})