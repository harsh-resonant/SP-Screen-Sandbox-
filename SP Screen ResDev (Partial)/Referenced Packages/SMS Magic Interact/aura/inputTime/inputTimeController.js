({
    doInit : function(component, event, helper) {
        var timeList = [];
        var i;
        var obj = {};
        for(i=0;i<12;i++){
            if(i==0){
                timeList.push({
                    label : "12:00 am",
                    value : "12:00 am"
                });
                timeList.push({
                    label : "12:30 am",
                    value : "12:30 am"
                });
            } else {
                timeList.push({
                    label : i +':00 am',
                    value : i +':00 am'
                });
                timeList.push({
                    label : i +':30 am',
                    value : i +':30 am'
                }); 
            }
        }
        for(i=0;i<12;i++){
            if(i==0){
                timeList.push({
                    label : "12:00 pm",
                    value : "12:00 pm"
                });
                timeList.push({
                    label : "12:30 pm",
                    value : "12:30 pm"
                });
            } else {
                timeList.push({
                    label : i +':00 pm',
                    value : i +':00 pm'
                });
                timeList.push({
                    label : i +':30 pm',
                    value : i +':30 pm'
                }); 
            }
        }
        component.set('v.timeList',timeList);
    },
    validateTime : function(component,event,helper){
        var i = component.find('timeInput');
        var value = event.target.value;
        //event.target.value = event.target.value.replace(/[^0-9ampAMP:]+/, '');
        var code = event.key || event.code || event.keyIdentifier ;
        if(!((code >= "0" && code<= "9") ||  code === "a" ||  code === "m" ||  code === "p" ||  code === "A" ||  code === "M" ||  code === "P" || code === "ArrowLeft" || code=== "ArrowRight" || code === " " || code === "Backspace" )){
            event.target.value = value.replace(/[^0-9ampAMP: ]+/, '');
        }
    },
    editedTiming : function(component,event,helper){
        var time = component.get('v.time');
        var timeDiv = component.find('timeDiv');
        if(event.target){
            time = event.target.value;
            time = time ? time.replace(/[ ]+/g, '') : '';
            var timeArray = time.split('p');
            var timeSplit;
            var minutes;
            var formattedTime;
            if(!timeArray){
                time = '';
            }
            else if (timeArray.length >1){
                formattedTime = helper.correctFormat(timeArray[0]);
                time = formattedTime + ' pm';
            } else if(time.split('a').length > 1){
                timeArray = time.split('a');
                formattedTime = helper.correctFormat(timeArray[0]);
                time = formattedTime + ' am';
            }
            component.set('v.time',time);
            event.target.value = time;
        }
        /*if(!time){
            $A.util.removeClass(timeDiv, 'wrong-field');
        } else if(helper.checkTime(time) ){
            $A.util.removeClass(timeDiv, 'wrong-field');
        } else {
            $A.util.addClass(timeDiv, 'wrong-field');
        }*/
    },
 	selectTime : function(component,event,helper){
        var selectedTime = component.find('timeDropdown').get('v.value');
        component.set("v.time",selectedTime);
	} 
})