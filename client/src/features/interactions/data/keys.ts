import { ProfileType } from '../Interaction';

const INTERACTIONS_QUERY_KEY = 'interactions';

export const interactionKeys = {
  list: (profileType: ProfileType, profileId: string) =>
    [INTERACTIONS_QUERY_KEY, 'list', profileType, profileId] as const,
};
