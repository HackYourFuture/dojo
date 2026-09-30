export interface ContactPersonResponse {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  jobTitle: string | null;
  notes: string | null;
}

// Adding and editing both send every field.
export type ContactPersonRequest = Omit<ContactPersonResponse, 'id'>;
