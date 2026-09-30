// A person at the organisation to get in touch with, like a recruiter or a manager.
export interface ContactPerson {
  readonly id: string;
  name: string;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  jobTitle: string | null;
  notes: string | null;
}
