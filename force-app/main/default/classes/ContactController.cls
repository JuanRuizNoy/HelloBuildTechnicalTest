public with sharing class ContactController {
    @TestVisible
    private static Boolean throwError = false;
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        try {
            List<Contact> contacts = [SELECT Id, Name, Email, Phone FROM Contact LIMIT 100];
            return (contacts != null) ? contacts : new List<Contact>();
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching contacts: ' + e.getMessage());
        }
    }
}

