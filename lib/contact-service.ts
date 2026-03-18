export interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message: string;
  createdAt: string;
  processed: boolean;
}

const mockContacts: Contact[] = [];

export const contactService = {
  getAllContacts: async (): Promise<Contact[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockContacts];
  },

  submitContactForm: async (data: Omit<Contact, 'id' | 'createdAt' | 'processed'>): Promise<Contact> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newContact: Contact = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      processed: false
    };
    mockContacts.push(newContact);
    return newContact;
  },

  getContactById: async (id: string): Promise<Contact> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const contact = mockContacts.find(c => c.id === id);
    if (!contact) throw new Error('Contact not found');
    return contact;
  },

  deleteContact: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockContacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    mockContacts.splice(index, 1);
  }
};
