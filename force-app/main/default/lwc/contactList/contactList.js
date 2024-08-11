import { LightningElement, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';

export default class ContactList extends LightningElement {
    @track contacts;
    @track filteredContacts;
    @track error;
    @track isLoading = false;
    @track sortBy = '';
    @track sortDirection = 'asc';
    @track currentPage = 1;
    @track pageSize = 10;
    @track totalPages = 1;
    @track searchKey = '';

    get paginatedContacts() {
        if (!this.filteredContacts) {
            return [];
        }
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredContacts.slice(startIndex, endIndex);
    }

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.currentPage === this.totalPages;
    }

    connectedCallback() {
        this.loadContacts();
    }

    loadContacts() {
        this.isLoading = true;
        getContacts()
            .then(result => {
                if (result) {
                    this.contacts = result;
                    this.filteredContacts = result;
                    this.totalPages = Math.ceil(this.filteredContacts.length / this.pageSize);
                    this.sortContacts();
                }
                this.isLoading = false;
            })
            .catch(error => {
                this.error = error?.body?.message || 'Error loading contacts';
                this.isLoading = false;
            });
    }

    handleSearchChange(event) {
        this.searchKey = event.target.value.toLowerCase();
        this.filterContacts();
    }

    filterContacts() {
        if (this.searchKey) {
            this.filteredContacts = this.contacts.filter(contact =>
                contact.Name.toLowerCase().includes(this.searchKey)
            );
        } else {
            this.filteredContacts = this.contacts;
        }
        this.totalPages = Math.ceil(this.filteredContacts.length / this.pageSize);
        this.currentPage = 1;
        this.sortContacts();
    }

    sortByName() {
        this.sortBy = 'Name';
        this.toggleSortDirection();
        this.sortContacts();
    }

    sortByEmail() {
        this.sortBy = 'Email';
        this.toggleSortDirection();
        this.sortContacts();
    }

    sortByPhone() {
        this.sortBy = 'Phone';
        this.toggleSortDirection();
        this.sortContacts();
    }

    sortContacts() {
        if (!this.filteredContacts) {
            return;
        }
        const isReverse = this.sortDirection === 'desc' ? 1 : -1;
        this.filteredContacts = [...this.filteredContacts].sort((a, b) => {
            if (a[this.sortBy] > b[this.sortBy]) return isReverse;
            if (a[this.sortBy] < b[this.sortBy]) return -isReverse;
            return 0;
        });
        this.totalPages = Math.ceil(this.filteredContacts.length / this.pageSize);
        this.currentPage = 1;
    }

    toggleSortDirection() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage += 1;
        }
    }
}
