import { LightningElement, wire, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';

export default class ContactList extends LightningElement {
    @track contacts = [];
    @track error;
    @track isLoading = false;
    @track currentPage = 1;
    @track totalPages = 0;
    @track searchKey = '';

    connectedCallback() {
        this.loadContacts();
    }

    loadContacts() {
        this.isLoading = true;
        getContacts({ searchKey: this.searchKey, page: this.currentPage })
            .then(result => {
                this.contacts = result.contacts;
                this.totalPages = result.totalPages;
                this.isLoading = false;
            })
            .catch(error => {
                this.error = error.body.message;
                this.isLoading = false;
            });
    }

    handleSearch(event) {
        this.searchKey = event.target.value;
        this.currentPage = 1;
        this.loadContacts();
    }

    sortByName() {
        this.contacts.sort((a, b) => a.Name.localeCompare(b.Name));
    }

    sortByEmail() {
        this.contacts.sort((a, b) => a.Email.localeCompare(b.Email));
    }

    sortByPhone() {
        this.contacts.sort((a, b) => a.Phone.localeCompare(b.Phone));
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadContacts();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadContacts();
        }
    }
}
