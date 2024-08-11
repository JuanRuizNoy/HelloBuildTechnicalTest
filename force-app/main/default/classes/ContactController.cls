public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getContacts(String searchKey, Integer page) {
        Integer pageSize = 10;
        Integer offset = (page - 1) * pageSize;

        List<Contact> contacts = [
            SELECT Id, Name, Email, Phone 
            FROM Contact 
            WHERE Name LIKE :('%' + searchKey + '%') 
            LIMIT :pageSize 
            OFFSET :offset
        ];

        Integer totalRecords = [
            SELECT COUNT() 
            FROM Contact 
            WHERE Name LIKE :('%' + searchKey + '%')
        ];
        
        Integer totalPages = (totalRecords + pageSize - 1) / pageSize;

        Map<String, Object> result = new Map<String, Object>();
        result.put('contacts', contacts);
        result.put('totalPages', totalPages);

        return result;
    }
}
