public class UniqueIdGenerator{
    
    public String generateRandomString(Integer len) {
        Integer idx;
        String chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        String randStr = '';
        while (randStr.length() < len){
           idx = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());      
           randStr += chars.substring(idx, idx+1);       
        }    
        return randStr; 
    }

}