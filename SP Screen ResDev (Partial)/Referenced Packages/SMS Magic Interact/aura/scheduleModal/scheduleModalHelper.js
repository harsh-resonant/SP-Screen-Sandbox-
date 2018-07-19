({
    getScheldulerData : function(component, helper){
    	var action = component.get("c.loadScheduleData");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnVal = response.getReturnValue();
                if (returnVal) {
                    if(returnVal.responseTO &&  returnVal.responseTO.status === "SUCCESS"){
                    	if(returnVal.timeZone){
                     		component.set("v.orgTimeZoneLabel",returnVal.timeZone.label); 
                        	component.set("v.orgTimeZoneID",returnVal.timeZone.value); 
                    	}
                        if(returnVal.messagePermission){
                            component.set("v.canScheduleMessage",returnVal.messagePermission.canScheduleMessage); 
                        	component.set("v.canScheduleRecurringMessage",returnVal.messagePermission.canScheduleRecurringMessage);
                        }
                        if(typeof returnVal.dayOfWeek === "number" && returnVal.dayOfWeek > -1 && returnVal.dayOfWeek < 7){
                            helper.toggleSelection(component,'v.daysSelected',returnVal.dayOfWeek);
                        }
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    hideDiv : function(div) {
        $A.util.removeClass(div, 'slds-show');
        $A.util.addClass(div, 'slds-hide');
    },
    showDiv : function(div) {
        $A.util.removeClass(div, 'slds-hide');
        $A.util.addClass(div, 'slds-show');
    },
    formattedDate : function(helper,date) {
        if(helper.isValidDate(date)){
         	var formattedDate = new Date(date).toDateString().split(' ');
            return formattedDate[1]+ ' '+formattedDate[2] + ', '+formattedDate[3];
        } else {
            return '';
        }
    },
    getSelectedArrayForDay : function(helper,daysArray){
        var selectedArray = [];
        for (var i=0;i < daysArray.length; i++) {
            if(daysArray[i] === 1){  
                selectedArray.push(helper.getDayValue(i));
            }
        }
        return selectedArray;
    },
    getSelectedStringForMonth : function(helper,daysArray){
        var selectedArray = [];
        for (var i=0;i < daysArray.length; i++) {
            if(daysArray[i] === 1){
                selectedArray.push(helper.getMonthValue(i));
            }
        }
        if(selectedArray.length > 0){
           return selectedArray.join(','); 
        }
        return '';
    },
    editScheduleInfoText : function(component, event, helper){
        var isNotError = helper.validateData(component, event, helper);
        if(!isNotError){
           return;
        }
        component.set('v.disableSchedule', false);
        var scheduleinfo = component.find("scheduleinfo");
        $A.util.addClass(scheduleinfo, 'bold-text');
        $A.util.removeClass(scheduleinfo, 'error-text');
        var isRecurring = component.get('v.isRecurring');
        //var selectedTimeText = '';
        var continous;
        var key;
        var months;
        var lastMonth;
        var label;
        var scheduledLabel;
        var argumentList = [];
        var scheduleMessage = '';
        var scheduledMessage = '';
        if(!isRecurring){
        	label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_SINGLE");
            scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_SINGLE");
            argumentList.push(helper.formattedDate(helper,component.get('v.startDate')));
            argumentList.push(component.get('v.time') + ', '+component.get('v.orgTimeZoneLabel'));
            scheduleMessage = helper.format(label,argumentList);
            scheduledMessage = helper.format(scheduledLabel,argumentList);
        } else {
            if(component.get('v.frequency') === 'Daily'){                            
            	label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_DAILY_WITHOUTENDDATE");
                scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_DAILY_WITHOUTENDDATE");
            	argumentList.push(component.get('v.repeatAfter'));
                argumentList.push(helper.formattedDate(helper,component.get('v.startDate')));
                if(component.get('v.endDateEnable')){
                    label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_DAILY");
                	scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_DAILY");
            	argumentList.push(helper.formattedDate(helper,component.get('v.endDate')));
                }
                argumentList.push(component.get('v.time') + ', '+component.get('v.orgTimeZoneLabel'));
            	scheduleMessage = helper.format(label,argumentList);
                scheduledMessage = helper.format(scheduledLabel,argumentList);
            }
            if(component.get('v.frequency') === 'Weekly'){
                if(component.get('v.allDays')){
                	label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_WEEKLY_ALLDAYS_WITHOUTENDDATE");
                    scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_WEEKLY_ALLDAYS_WITHOUTENDDATE");
                    argumentList.push(helper.formattedDate(helper,component.get('v.startDate')));
                    if(component.get('v.endDateEnable')){
                	label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_WEEKLY_ALLDAYS");
                    scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_WEEKLY_ALLDAYS");
                    argumentList.push(helper.formattedDate(helper,component.get('v.endDate')));
                	}
                    argumentList.push(component.get('v.time') + ', '+component.get('v.orgTimeZoneLabel'));
                    scheduleMessage = helper.format(label,argumentList);
                    scheduledMessage = helper.format(scheduledLabel,argumentList);
                } else {
                    label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_WEEKLY_WITHOUTENDDATE");
                    scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_WEEKLY_WITHOUTENDDATE");
                    argumentList.push(helper.geti18nofSelectedArray(component.get('v.daysSelected'),helper.getDaysLabel()));
                    argumentList.push(helper.formattedDate(helper,component.get('v.startDate')));
                    if(component.get('v.endDateEnable')){
                		label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_WEEKLY");
                    	scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_WEEKLY");
                    argumentList.push(helper.formattedDate(helper,component.get('v.endDate')));
                	}
                    argumentList.push(component.get('v.time') + ', '+component.get('v.orgTimeZoneLabel'));
                    scheduleMessage = helper.format(label,argumentList);
                    scheduledMessage = helper.format(scheduledLabel,argumentList);
                }
            }
            if(component.get('v.frequency') === 'Monthly'){
                if(component.get('v.allMonths')){
                	label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_MONTHLY_ALLMONTHS_WITHOUTENDDATE");
                    scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_MONTHLY_ALLMONTHS_WITHOUTENDDATE");
                    argumentList.push(component.get('v.monthsDaysList')[component.get('v.dayOfMonth')-1]);
                    argumentList.push(helper.formattedDate(helper,component.get('v.startDate')));
                    if(component.get('v.endDateEnable')){
                		label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_MONTHLY_ALLMONTHS");
                    	scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_MONTHLY_ALLMONTHS");
                    argumentList.push(helper.formattedDate(helper,component.get('v.endDate')));
                	}
                    argumentList.push(component.get('v.time') + ', '+component.get('v.orgTimeZoneLabel'));
                    scheduleMessage = helper.format(label,argumentList);
                    scheduledMessage = helper.format(scheduledLabel,argumentList);
                } else {
                    label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_MONTHLY_WITHOUTENDDATE");
                    scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_MONTHLY_WITHOUTENDDATE");
                    argumentList.push(component.get('v.monthsDaysList')[component.get('v.dayOfMonth')-1]);
                    argumentList.push(helper.geti18nofSelectedArray(component.get('v.monthsSelected'),helper.getMonthsLabel()));
                    argumentList.push(helper.formattedDate(helper,component.get('v.startDate')));
                    if(component.get('v.endDateEnable')){
                		label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_MONTHLY");
                    	scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_MONTHLY");
                    argumentList.push(helper.formattedDate(helper,component.get('v.endDate')));
                	}
                    argumentList.push(component.get('v.time') + ', '+component.get('v.orgTimeZoneLabel'));
                    scheduleMessage = helper.format(label,argumentList);
                    scheduledMessage = helper.format(scheduledLabel,argumentList);
                }
            }
            if(component.get('v.frequency') === 'Yearly'){
                if(component.get('v.allMonths')){
                	label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_YEARLY_ALLMONTHS_WITHOUTENDDATE");
                   	scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_YEARLY_ALLMONTHS_WITHOUTENDDATE");
                    argumentList.push(component.get('v.repeatAfter'));
                    argumentList.push(component.get('v.monthsDaysList')[component.get('v.dayOfMonth')-1]);
                    argumentList.push(helper.formattedDate(helper,component.get('v.startDate')));
                    if(component.get('v.endDateEnable')){
                		label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_YEARLY_ALLMONTHS");
                    	scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_YEARLY_ALLMONTHS");
                    argumentList.push(helper.formattedDate(helper,component.get('v.endDate')));
                	}
                    argumentList.push(component.get('v.time') + ', '+component.get('v.orgTimeZoneLabel'));
                    scheduleMessage = helper.format(label,argumentList);
                    scheduledMessage = helper.format(scheduledLabel,argumentList);
                } else {
                    label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_YEARLY_WITHOUTENDDATE");
                    scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_YEARLY_WITHOUTENDDATE");
                    argumentList.push(component.get('v.repeatAfter'));
                    argumentList.push(component.get('v.monthsDaysList')[component.get('v.dayOfMonth')-1]);
                    argumentList.push(helper.geti18nofSelectedArray(component.get('v.monthsSelected'),helper.getMonthsLabel()));
                    argumentList.push(helper.formattedDate(helper,component.get('v.startDate')));
                    if(component.get('v.endDateEnable')){
                		label = $A.get("$Label.smagicinteract.SCHEDULE_MESSAGE_RECURRING_YEARLY");
                    	scheduledLabel = $A.get("$Label.smagicinteract.SCHEDULED_MESSAGE_RECURRING_YEARLY");
                    argumentList.push(helper.formattedDate(helper,component.get('v.endDate')));
                	}
                    argumentList.push(component.get('v.time') + ', '+component.get('v.orgTimeZoneLabel'));
                	scheduleMessage = helper.format(label,argumentList);
                    scheduledMessage = helper.format(scheduledLabel,argumentList);
                }
            }
        }
        component.set('v.scheduleMessage', scheduleMessage);
        component.set('v.scheduledMessage', scheduledMessage);
    },
    openModal : function(component, event, helper){
        var modal = component.find('Modal');
        modal.openModal();
    },
    checkTime : function(component, time){
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
    isNoneSelected : function(selectedMap){
        for(var key in selectedMap){
            if(selectedMap[key] === 1){
                return false;
            }
        }
        return true;
    },
    validateData : function(component,event,helper){
    	var recursType = component.get('v.frequency');
        var isRecurring = component.get('v.isRecurring');
        var time = component.get('v.time');
        if(!time){
            helper.showInfoString(component,helper,$A.get("$Label.smagicinteract.SC_ENTER_TIME"));
            return false;
        } else if(!helper.checkTime(component, time)){
            helper.showErrorString(component,helper,$A.get("$Label.smagicinteract.SC_INCORRECT_TIME"));
            return false;
        }
        var startDate = component.get('v.startDate') ;
        if(!startDate){
            helper.showInfoString(component,helper,$A.get("$Label.smagicinteract.SC_ENTER_STARTDATE"));
        	return false;
        } else if (!helper.isValidDate(startDate)){
			helper.showErrorString(component,helper,$A.get("$Label.smagicinteract.SC_INCORRECT_STARTDATE"));
            return false;
        }
        if(!isRecurring){
            return true;
        }
        var endDate = component.get('v.endDate');
        if(component.get('v.endDateEnable')){
            if(!endDate){
               helper.showInfoString(component,helper,$A.get("$Label.smagicinteract.SC_ENTER_ENDDATE"));
               return false;
            } else if(!helper.isValidDate(endDate)){
				helper.showErrorString(component,helper,$A.get("$Label.smagicinteract.SC_INCORRECT_ENDDATE"));
                return false;
        }
        }
        var selectedDays = component.get('v.daysSelected');
        if(recursType === 'Weekly'){
            if(helper.isNoneSelected(selectedDays)){
                helper.showInfoString(component,helper,$A.get("$Label.smagicinteract.SC_INCORRECT_WEEKDAY"));
            	return false;
            }
        }
        var monthsSelected = component.get('v.monthsSelected');
        if(recursType === 'Monthly' || recursType === 'Yearly'){
            if(helper.isNoneSelected(monthsSelected)){
                helper.showInfoString(component,helper,$A.get("$Label.smagicinteract.SC_INCORRECT_MONTHSVALUE"));
            	return false;
            }
        }
        return true;
    },
    isValidDate : function (date) {
        var valid = true;
        if(!date) {
            return false;
        }
        var splittedDate = date.split('-');
        var year	= splittedDate[0];
        var month   = splittedDate[1];
        var day  	= splittedDate[2];

        if(isNaN(month) || isNaN(day) || isNaN(year)) return false;

        if((month < 1) || (month > 12)) valid = false;
        else if((day < 1) || (day > 31)) valid = false;
        else if(((month == 4) || (month == 6) || (month == 9) || (month == 11)) && (day > 30)) valid = false;
        else if((month == 2) && (((year % 400) == 0) || ((year % 4) == 0)) && (day < 30)) valid = true;
        else if((month == 2) && ((year % 100) == 0) && (day < 29)) valid = true;
        else if((month == 2) && (day > 28)) valid = false;

    return valid;
	},
    resetSchedule : function(component,helper){
        component.set('v.startDate','');
        component.set('v.endDate',null);
        component.set('v.time','12:00 pm');
        component.set('v.frequency','Daily');
        component.set('v.frequencyValue','Day');
        component.set('v.daysSelected',helper.resetAllDays(component,component.get('v.daysSelected')));
        component.set('v.monthsSelected', helper.resetAllMonths(component,component.get('v.monthsSelected')));
        //component.set('v.monthSelectedYearly', helper.resetAll(component.get('v.monthSelectedYearly')));
        component.set('v.isRecurring',false);
        component.set('v.allDays',false);
        component.set('v.repeatAfter',1);
        component.set('v.dayOfMonth','1');
        component.set('v.schedulerName','');
        component.set('v.cronExpression','');
    },
    selectAllDays : function (component,list){
        for (var i=0;i < list.length; i++) {
            list[i] = 1;
            var div = component.find(i);
                $A.util.addClass(div, 'ButtonSelected');
                $A.util.removeClass(div, 'buttonUnSelected');
            }
        return list;
    },
    selectAllMonths : function (component,list){
        for (var i=0;i < list.length; i++) {
            list[i] = 1;
            var div = component.find('0'+i);
            $A.util.addClass(div, 'ButtonSelected');
            $A.util.removeClass(div, 'buttonUnSelected');
        }
        return list;
    },
    resetAllDays : function (component,list){
        for (var i=0;i < list.length; i++) {
            list[i] =0;
            var div = component.find(i);
                $A.util.removeClass(div, 'ButtonSelected');
                $A.util.addClass(div, 'buttonUnSelected');
            }
        return list;
    },
    resetAllMonths : function (component,list){
        for (var i=0;i < list.length; i++) {
            list[i] =0;
            var div = component.find('0'+i);
            $A.util.removeClass(div, 'ButtonSelected');
            $A.util.addClass(div, 'buttonUnSelected');
        }
        return list;
    },
    toggleSelection : function (component,listName,id){
        var div = component.find(id);
        var list = component.get(listName);
        var parsedInt = parseInt(id,10);
        if(parsedInt !== null && parsedInt > -1){
            if(list[parsedInt]){
                list[parsedInt] = 0;
            $A.util.removeClass(div, 'ButtonSelected');
            $A.util.addClass(div, 'buttonUnSelected');
        } else {
            	list[parsedInt] =1;
            $A.util.addClass(div, 'ButtonSelected');
            $A.util.removeClass(div, 'buttonUnSelected');
        }
        }
        component.set(listName,list);
    },
    format : function(string, argumentList) {
    	var outerArguments = argumentList;
    	return string.replace(/\{(\d+)\}/g, function() {
        	return outerArguments[arguments[1]];
    	});
	},
    geti18nofSelectedArray : function(selectionArray, labelMap) {
    	var selectedArray = [];
        var continuous = false;
        var lastmonth;
        var key;
        for(key = 0; key < selectionArray.length ; key++){
            if(selectionArray[key] === 1){
                if(!continuous){
                    lastmonth = labelMap[key];
                }
                continuous = true;
            } else {
                if(continuous){
                    if(lastmonth !== labelMap[key-1]){
                    	selectedArray.push(lastmonth+'-'+labelMap[key-1]);
                    } else {
                        selectedArray.push(lastmonth);
                    }
                }
                continuous = false;
            }
        }
        if(continuous){
            if(lastmonth !== labelMap[key-1]){
                selectedArray.push(lastmonth+'-'+labelMap[key-1]);
            } else {
                selectedArray.push(lastmonth);
            }
        }
        if(selectedArray.length > 0 ){
           return selectedArray.join(','); 
        }
        return '';
	},
    getDaysLabel : function(){
        var daysLabel = {};
        daysLabel['0'] = $A.get("$Label.smagicinteract.SC_MON");
        daysLabel['1'] = $A.get("$Label.smagicinteract.SC_TUE");
        daysLabel['2'] = $A.get("$Label.smagicinteract.SC_WED");
        daysLabel['3'] = $A.get("$Label.smagicinteract.SC_THU");
        daysLabel['4'] = $A.get("$Label.smagicinteract.SC_FRI");
        daysLabel['5'] = $A.get("$Label.smagicinteract.SC_SAT");
        daysLabel['6'] = $A.get("$Label.smagicinteract.SC_SUN");
        return daysLabel;
    },
    getMonthsLabel : function(){
        var monthsLabel = {};
        monthsLabel['0'] = $A.get("$Label.smagicinteract.SC_JAN");
        monthsLabel['1'] = $A.get("$Label.smagicinteract.SC_FEB");
        monthsLabel['2'] = $A.get("$Label.smagicinteract.SC_MAR");
        monthsLabel['3'] = $A.get("$Label.smagicinteract.SC_APR");
        monthsLabel['4'] = $A.get("$Label.smagicinteract.SC_MAY");
        monthsLabel['5'] = $A.get("$Label.smagicinteract.SC_JUN");
        monthsLabel['6'] = $A.get("$Label.smagicinteract.SC_JUL");
        monthsLabel['7'] = $A.get("$Label.smagicinteract.SC_AUG");
        monthsLabel['8'] = $A.get("$Label.smagicinteract.SC_SEP");
        monthsLabel['9'] = $A.get("$Label.smagicinteract.SC_OCT");
        monthsLabel['10'] = $A.get("$Label.smagicinteract.SC_NOV");
        monthsLabel['11'] = $A.get("$Label.smagicinteract.SC_DEC");
        return monthsLabel;
    },
    getDayValue : function(dayNumber){
        if(dayNumber === null){
            return '';
        }
        if(dayNumber === 0){
            return 'MON';
        } else if (dayNumber === 1){
            return 'TUE';
        } else if (dayNumber === 2){
            return 'WED';
        } else if (dayNumber === 3){
            return 'THU';
        } else if (dayNumber === 4){
            return 'FRI';
        } else if (dayNumber === 5){
            return 'SAT';
        } else if (dayNumber === 6){
            return 'SUN';
        } 
        return '';
    },
 	getMonthValue : function(monthNumber){
        if(monthNumber === null){
            return '';
        }
        if(monthNumber === 0){
            return 'JAN';
        } else if (monthNumber === 1){
            return 'FEB';
        } else if (monthNumber === 2){
            return 'MAR';
        } else if (monthNumber === 3){
            return 'APR';
        } else if (monthNumber === 4){
            return 'MAY';
        } else if (monthNumber === 5){
            return 'JUN';
        } else if (monthNumber === 6){
            return 'JUL';
        } else if (monthNumber === 7){
            return 'AUG';
        } else if (monthNumber === 8){
            return 'SEP';
        } else if (monthNumber === 9){
            return 'OCT';
        } else if (monthNumber === 10){
            return 'NOV';
        } else if (monthNumber === 11){
            return 'DEC';
        } 
        return '';
    },
    unSelectUnvalidMonths : function(component,helper){
        var dayOfMonth = component.get('v.dayOfMonth');
        var monthsSelected = component.get('v.monthsSelected');
        var div;
        if(dayOfMonth > 29) {
            monthsSelected[1] = 0;
            component.set('v.allMonths',false);
            div = component.find('01');
            $A.util.removeClass(div, 'ButtonSelected');
            $A.util.addClass(div, 'buttonUnSelected');
        } 
        if(dayOfMonth > 30){
            monthsSelected[3] = 0;
            div = component.find('03');
            $A.util.removeClass(div, 'ButtonSelected');
            $A.util.addClass(div, 'buttonUnSelected');
            monthsSelected[5] = 0;
            div = component.find('05');
            $A.util.removeClass(div, 'ButtonSelected');
            $A.util.addClass(div, 'buttonUnSelected');
            monthsSelected[8] = 0;
            div = component.find('08');
            $A.util.removeClass(div, 'ButtonSelected');
            $A.util.addClass(div, 'buttonUnSelected');
            monthsSelected[10] = 0;
            div = component.find('010');
            $A.util.removeClass(div, 'ButtonSelected');
            $A.util.addClass(div, 'buttonUnSelected');
        }
        component.set('v.monthsSelected',monthsSelected);
    },
    showInfoString: function(component,helper,infoString){
        var scheduleinfo = component.find("scheduleinfo");
        $A.util.removeClass(scheduleinfo, 'bold-text');
        $A.util.removeClass(scheduleinfo, 'error-text');
        component.set('v.disableSchedule', true);
        component.set('v.scheduleMessage', infoString);  
    },
    showErrorString : function(component,helper,errorString){
    	var scheduleinfo = component.find("scheduleinfo");
        $A.util.removeClass(scheduleinfo, 'bold-text');
        $A.util.addClass(scheduleinfo, 'error-text');
        component.set('v.disableSchedule', true);
        component.set('v.scheduleMessage', errorString);
    }
})