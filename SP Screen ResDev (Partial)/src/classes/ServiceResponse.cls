global class ServiceResponse {
    public List<SlotWrapper> lstSlot {get;set;}
    
    public ServiceResponse(){
        lstSlot = new List<SlotWrapper>();
    }
}