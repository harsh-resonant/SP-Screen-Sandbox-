trigger ServiceAppointmentTrigger on ServiceAppointment (after insert,before update) {
    if(Trigger.isAfter && Trigger.isInsert){
        List<Id> lstSAIds = new List<Id>();
        for(ServiceAppointment sa : Trigger.New){
            if(sa.ParentRecordId != null && String.valueOf(sa.ParentRecordId).startsWith('0WO')){
                lstSAIds.add(sa.Id);
            }
        }
        
        List<ServiceAppointment> lstServcAppnts = [Select Id,ServiceTerritoryId,ServiceTerritory.Name,ParentRecordId from ServiceAppointment where ParentRecordId != null AND Id in: lstSAIds];
        
        if(lstServcAppnts != null && lstServcAppnts.size() > 0){
            Map<String,Territories_Mapping__c> mapTerrMaps = Territories_Mapping__c.getall();
            Map<String,String> mapTechToSalesTerr = new Map<String,String>();
            if(mapTerrMaps != null && mapTerrMaps.size() > 0){
                for(String str : mapTerrMaps.keySet()){
                    mapTechToSalesTerr.put(mapTerrMaps.get(str).Technician_Territory__c.toUpperCase(),mapTerrMaps.get(str).Sales_Territory__c.toUpperCase());
                }
                
                map<String,String> mapTempTerr = getTerrMap();
                for(ServiceAppointment sa : lstServcAppnts){
                    if(mapTechToSalesTerr != null && mapTechToSalesTerr.size() > 0 && sa.ServiceTerritoryId != null && sa.ServiceTerritory.Name != null && mapTechToSalesTerr.keySet().contains(sa.ServiceTerritory.Name.toUpperCase())){
                        if(mapTempTerr != null && mapTempTerr.size() > 0 && mapTempTerr.containsKey(mapTechToSalesTerr.get(sa.ServiceTerritory.Name.toUpperCase()))){
                            sa.ServiceTerritoryId = mapTempTerr.get(mapTechToSalesTerr.get(sa.ServiceTerritory.Name.toUpperCase()));                            
                        }                    
                    }
                }
                update lstServcAppnts;     
            }
        }
    }
    
    if(Trigger.isBefore && Trigger.isUpdate){
        List<Id> lstSAIds = new List<Id>();
        for(ServiceAppointment sa : Trigger.New){
            if(sa.ParentRecordId != null && String.valueOf(sa.ParentRecordId).startsWith('0WO')){
                lstSAIds.add(sa.Id);
            }
        }
        
        List<ServiceAppointment> lstServcAppnts = [Select Id,ServiceTerritoryId,ServiceTerritory.Name,ParentRecordId from ServiceAppointment where ParentRecordId != null AND Id in: lstSAIds];
        
        if(lstServcAppnts != null && lstServcAppnts.size() > 0){
            Map<String,Territories_Mapping__c> mapTerrMaps = Territories_Mapping__c.getall();
            Map<String,String> mapTechToSalesTerr = new Map<String,String>();
            if(mapTerrMaps != null && mapTerrMaps.size() > 0){
                for(String str : mapTerrMaps.keySet()){
                    mapTechToSalesTerr.put(mapTerrMaps.get(str).Technician_Territory__c.toUpperCase(),mapTerrMaps.get(str).Sales_Territory__c.toUpperCase());
                }
                
                map<String,String> mapTempTerr = getTerrMap();
                system.debug('********' + mapTechToSalesTerr);
                for(ServiceAppointment sa : lstServcAppnts){
                    if(mapTechToSalesTerr != null && mapTechToSalesTerr.size() > 0 && sa.ServiceTerritoryId != null && sa.ServiceTerritory.Name != null && mapTechToSalesTerr.keySet().contains(sa.ServiceTerritory.Name.toUpperCase())){
                        if(mapTempTerr != null && mapTempTerr.size() > 0 && mapTempTerr.containsKey(mapTechToSalesTerr.get(sa.ServiceTerritory.Name.toUpperCase()))){
                            sa.ServiceTerritoryId = mapTempTerr.get(mapTechToSalesTerr.get(sa.ServiceTerritory.Name.toUpperCase()));                            
                        }                    
                    }
                }
                //update lstServcAppnts;     
            }
        }
    }
    
    private static map<String,String> getTerrMap(){
        List<ServiceTerritory> lstServcTerr = [Select Id,Name from ServiceTerritory where IsActive = True];
        map<String,String> mapTerrNameToId = new Map<String,String>();
        if(lstServcTerr != null && lstServcTerr.size() > 0){
            for(ServiceTerritory st : lstServcTerr){
                if(!mapTerrNameToId.containsKey(st.Name)){
                    mapTerrNameToId.put(st.Name.toUpperCase(), st.Id);
                }
            }
        }
        return mapTerrNameToId;
    }
}