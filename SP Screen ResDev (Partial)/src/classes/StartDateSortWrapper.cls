global class StartDateSortWrapper implements Comparable{
	public SlotWrapper slot;
    public StartDateSortWrapper(SlotWrapper ma) {
        slot = ma;
   }
   
   // Compare My Actions based on the opportunity amount.
   global Integer compareTo(Object compareTo) {
       // Cast argument to StartDateSortWrapper
       StartDateSortWrapper compareToMyAction = (StartDateSortWrapper)compareTo;
       
       // The return value of 0 indicates that both elements are equal.
       Integer returnValue = 0;
       if (slot.Startdatetime > compareToMyAction.slot.Startdatetime) {
           // Set return value to a positive value.
           returnValue = 1;
       } else if (slot.Startdatetime < compareToMyAction.slot.Startdatetime) {
           // Set return value to a negative value.
           returnValue = -1;
       }
       
       return returnValue;      
   }
}