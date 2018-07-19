({
	checkTime : function(time) {
		var timeWithoutChar = time.split(' ');
        if(timeWithoutChar.length < 2){
            return false;
        }
        var splittedTime = timeWithoutChar[0].split(':');
        if(splittedTime.length < 2){
            return false;
        }
        if(splittedTime[0] >12 || splittedTime[1] >= 60 ){
            return false
        }
        return true;
	},
    correctFormat : function(time) {
        var minutes;
        if(!time){
            return '';
        }
        var timeSplit = time.split(':');
        if(timeSplit.length > 1){
        minutes = timeSplit[1].length === 2 ? timeSplit[1] : (timeSplit[1].length === 1 ? '0' + timeSplit[1] : timeSplit[1].substring(0,2));
        } else {
            return time;
        }
        return timeSplit[0] +':'+ minutes;
    }
})