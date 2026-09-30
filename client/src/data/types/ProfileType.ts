// The kinds of profile, like the server's ProfileType.
export type ProfileType = 'trainee' | 'organisation';

// The path of each kind of profile in the API.
export const PROFILE_PATHS: Record<ProfileType, string> = { trainee: 'trainees', organisation: 'organisations' };
