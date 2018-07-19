({
    doInit : function(component, event, helper) {
        var i;
        helper.getScheldulerData(component, helper);
        var daysList = [];
        for(i=1;i<32;i++){
            daysList.push(i);
        }
        component.set('v.daysList',daysList);
        var monthsDaysList = [];
        for(i =1; i< 32; i++) {
            if(i%10===1 && i!==11) {
                monthsDaysList.push(i+'st');
            } else if(i%10===2 && i!==12) {
                monthsDaysList.push(i+'nd');
            } else if(i%10===3 && i!==13) {
                monthsDaysList.push(i+'rd');
            } else {
                monthsDaysList.push(i+'th');
            }
        }
        component.set('v.monthsDaysList',monthsDaysList);
        var daysSelected = [];
        for(i=0;i<7;i++){
            daysSelected.push(0);
        }
        component.set('v.daysSelected',daysSelected);
        var monthsSelected = [];
        for(i=0;i<12;i++){
            monthsSelected.push(0);
        }
        component.set('v.monthsSelected', monthsSelected);
    },
    tabToggle : function(component, event, helper) {
        var hiddenSpace;
        var tab = event.target.id;
        if(tab === 'Single'){
            component.set('v.isRecurring',false);
            hiddenSpace = component.find('hiddenSpace');
            $A.util.removeClass(hiddenSpace,'recurringHeight');
        } else {
            component.set('v.isRecurring',true);
            hiddenSpace = component.find('hiddenSpace');
            $A.util.addClass(hiddenSpace,'recurringHeight');
        }
        helper.editScheduleInfoText(component,event,helper);
    },
    cancel : function(component,event,helper){
        var modalDiv = component.find('Modal');
        modalDiv.dismissModal();
    },
    schedule : function(component,event,helper){
        var notification = component.find("NotificationManager");
        var recursType = component.get('v.frequency');
        var isRecurring = component.get('v.isRecurring');
        var jobName = component.get('v.schedulerName');
        if(!jobName) {
            jobName = 'My Schedule';
        }
        var time = component.get('v.time');
        var hours = (time.split(' ')[1].toLowerCase() === "am" ? 0 + parseInt(time.split(':')[0],10) : 12 + parseInt(time.split(':')[0],10)).toString();
        if(hours === "12" || hours === "24"){
        	hours = (parseInt(hours,10)-12).toString();
        }
        var minutes = time.split(':')[1].split(' ')[0];
        var startDate = component.get('v.startDate');
        var startDateObj = {
            "smagicinteract__Date__c" : startDate
        };
        //var notification = component.find('NotificationManager');
        var endDate = component.get('v.endDate');
        var endDateObj = {
        	"smagicinteract__Date__c" : endDate
        };
        var selectedDaysArray;
        var selectedMonthsMonthly;
        var selectedMonthsYearly;
        var selectedDays = component.get('v.daysSelected');
        var monthsSelected = component.get('v.monthsSelected');
        if(recursType === 'Weekly'){
            selectedDaysArray = helper.getSelectedArrayForDay(helper,selectedDays);
        } else if(recursType === 'Monthly' ){
            selectedMonthsMonthly = helper.getSelectedStringForMonth(helper,monthsSelected);
        } else if (recursType == 'Yearly'){
            selectedMonthsYearly =  helper.getSelectedStringForMonth(helper,monthsSelected);
        }
        var dayOfMonth = component.get('v.dayOfMonth');
        var variableDay = component.get('v.repeatAfter');
        var scheduleObject = {
            'jobName'           : jobName,
            'recursType' 		 : recursType,
            'isRecurring' 		 : isRecurring,
            'timeInHours' 		 : hours,
            'timeInMinutes' 	 : minutes,
            'timeInSeconds'		 : 0,
            'startDateObj' 		 : startDateObj,
            'endDateObj' 		 : endDateObj,
            'recursTypeForDaily' : 'Variable Day',
            'recursTypeMonthly'  : 'selectedMonths',
            'recursTypeYearly'   : 'selectedMonths',
            'selectedDays'		 : selectedDaysArray,
            'selectedMonthsMonthly' : selectedMonthsMonthly,
            'selectedMonthsYearly' : selectedMonthsYearly,
            'variableDay'  		 : variableDay,
            'selectedDayForMonth1' : dayOfMonth
        };
        var action = component.get("c.getCronExpression");
        action.setParams({
            scheduleObject : JSON.stringify(scheduleObject)
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnVal = response.getReturnValue();
                if (returnVal && returnVal.responseTO) {
                    if(returnVal.responseTO.status === "SUCCESS"){
                    	var scheduleObject = JSON.parse(response.getParam('scheduleObject'));
                        scheduleObject.CRON_EXP = returnVal.cronExpression;
                        var scheduleEvent = component.getEvent("scheduleEvent");
                        scheduleEvent.setParams({scheduleObject : scheduleObject,
                                                 scheduleMessage : component.get('v.scheduleMessage'),
                                                 scheduledMessage : component.get('v.scheduledMessage')
                                                });
                        scheduleEvent.fire();
                        var modalDiv = component.find('Modal');
        				modalDiv.closeModal();
                    } else {
                        helper.showErrorString(component,helper,returnVal.responseTO.errResponseObj.code);
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    editedTiming : function(component,event,helper){
        helper.editScheduleInfoText(component,event,helper);
    },
    selectDay : function(component,event,helper){
        var alldays = component.get('v.allDays');
        if(!alldays){
            var id = event.target.id;
            helper.toggleSelection(component,'v.daysSelected',id);
        }
        helper.editScheduleInfoText(component,event,helper);
    },
    allDays : function(component,event,helper){
        var allDays = component.get("v.allDays");
        var daysSelected = component.get('v.daysSelected');
        if(allDays){
            component.set('v.daysSelected',helper.selectAllDays(component,daysSelected));
        } else {
            component.set('v.daysSelected',helper.resetAllDays(component,daysSelected));   
        }
        helper.editScheduleInfoText(component,event,helper);
    },
    selectMonthly : function(component,event,helper){
        var allMonths = component.get("v.allMonths")
        if(!allMonths){
            var id = event.target.id;
            helper.toggleSelection(component,'v.monthsSelected',id);
        }
        helper.editScheduleInfoText(component,event,helper);
    },
    allMonthsToggle : function(component,event,helper){
        var allMonths = component.get('v.allMonths');
        var monthsSelected = component.get('v.monthsSelected');
        if(allMonths){
            component.set('v.monthsSelected',helper.selectAllMonths(component,monthsSelected));
        } else {
            component.set('v.monthsSelected',helper.resetAllMonths(component,monthsSelected));   
        }
        helper.editScheduleInfoText(component,event,helper);
    },
    selectFrequency : function(component,event,helper){
        var frequency = component.get('v.frequency');
        var weekDiv = component.find('weekButtonList');
        var monthDiv = component.find('monthButtonList');
        var repeatAfter = component.get('v.repeatAfter');
        var freqDiv = component.find('frequencyDiv');
        if(frequency == 'Daily') {
            component.set('v.frequencyValue', 'Day');
            component.set('v.repeatAfter', '1');
            helper.hideDiv(weekDiv);
            helper.hideDiv(monthDiv);
            freqDiv.getElements()[0].style.display = 'inline-block';
        }
        else if(frequency == 'Weekly') {
            helper.showDiv(weekDiv);
            helper.hideDiv(monthDiv);
            freqDiv.getElements()[0].style.display = 'none';
        }
        else if(frequency == 'Monthly'){
            helper.showDiv(monthDiv);
            helper.hideDiv(weekDiv);
            freqDiv.getElements()[0].style.display = 'none';
        }
        else if(frequency == 'Yearly') {
            helper.showDiv(monthDiv);
            helper.showDiv(freqDiv);
            helper.hideDiv(weekDiv);
            component.set('v.frequencyValue', 'Year');
            component.set('v.repeatAfter', '1');
            freqDiv.getElements()[0].style.display = 'inline-block';
        }
        helper.editScheduleInfoText(component,event,helper);
    },
    endDateCheckBox : function(component,event,helper){
        var bool = component.get('v.endDateEnable');
        var dateDiv = component.find('endDate');
        var div = component.find('endDateContent');
        if(bool){
            $A.util.removeClass(dateDiv, 'endDateDivEnable');
            helper.hideDiv(div);
        } else {
            $A.util.addClass(dateDiv, 'endDateDivEnable');
            helper.showDiv(div);
        }
        component.set('v.endDate',null);
        helper.editScheduleInfoText(component,event,helper);
    },
    frequencyChange : function(component,event,helper){
        var repeatAfter = component.get('v.repeatAfter');
        var frequency = component.get('v.frequencyValue');
        if(repeatAfter > 1 && (frequency.indexOf('s') === -1)){
            component.set('v.frequencyValue', frequency+'s');
        } else if (repeatAfter === '1' && (frequency.indexOf('s') !== -1)){
            component.set('v.frequencyValue',frequency.substring(0, frequency.length-1));
        }
        helper.editScheduleInfoText(component,event,helper);
    },
    changeFooterText : function(component,event,helper){
        helper.editScheduleInfoText(component,event,helper);
    },
    checkStartDate : function(component,event,helper){
        helper.editScheduleInfoText(component,event,helper);
    },
    checkEndDate : function(component,event,helper){
        helper.editScheduleInfoText(component,event,helper);
    },
    openModal : function(component,event,helper){
        helper.openModal(component,event,helper);
    },
    resetSchedule : function(component,event,helper){
    	helper.resetSchedule(component,helper);
        helper.editScheduleInfoText(component,event,helper);
    },
    showOnlyValidMonths : function(component,event,helper){
    	helper.unSelectUnvalidMonths(component,helper);
        helper.editScheduleInfoText(component,event,helper);
    }
})