@isTest
public class ContactControllerTest {
    
    @isTest
    static void testGetContactsSuccess() {
        List<Contact> testContacts = new List<Contact>();
        for (Integer i = 0; i < 50; i++) {
            testContacts.add(new Contact(
                FirstName = 'Test',
                LastName = 'Contact' + i,
                Email = 'test' + i + '@example.com',
                Phone = '123-456-7890'
            ));
        }
        insert testContacts;
        
        Test.startTest();
        List<Contact> contacts = ContactController.getContacts();
        Test.stopTest();
        
        System.assertNotEquals(contacts, null, 'Contacts should not be null');
        System.assertEquals(50, contacts.size(), 'Expected 50 contacts to be returned');
    }

    @isTest
    static void testGetContactsNoData() {
        Test.startTest();
        List<Contact> contacts = ContactController.getContacts();
        Test.stopTest();
        
        System.assertNotEquals(contacts, null, 'Contacts should not be null');
        System.assertEquals(0, contacts.size(), 'Expected 0 contacts to be returned');
    }

    @isTest
    static void testGetContactsException() {
        ContactController.throwError = true;

        try {
            Test.startTest();
            List<Contact> contacts = ContactController.getContacts();
            Test.stopTest();
            System.assert(false, 'Expected an exception to be thrown');
        } catch (AuraHandledException e) {
            System.assertEquals('Error fetching contacts: Simulated Exception', e.getMessage(), 'Expected a specific error message');
        } finally {
            ContactController.throwError = false;
        }
    }
    
    @isTest
    static void testGetContactsWithLimit() {

        List<Contact> testContacts = new List<Contact>();
        for (Integer i = 0; i < 150; i++) {
            testContacts.add(new Contact(
                FirstName = 'Test',
                LastName = 'Contact' + i,
                Email = 'test' + i + '@example.com',
                Phone = '123-456-7890'
            ));
        }
        insert testContacts;
        
        Test.startTest();
        List<Contact> contacts = ContactController.getContacts();
        Test.stopTest();

        System.assertNotEquals(contacts, null, 'Contacts should not be null');
        System.assertEquals(100, contacts.size(), 'Expected up to 100 contacts to be returned due to LIMIT clause');
    }
}
