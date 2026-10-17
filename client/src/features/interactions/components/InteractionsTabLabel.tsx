import { ProfileTabLabel } from '../../../components/profile/ProfileTabLabel';
import { ProfileType } from '../../../data/types/ProfileType';
import { useGetInteractions } from '../data/interaction-queries';

interface InteractionsTabLabelProps {
  profileType: ProfileType;
  profileId: string;
}

/** The label of the interactions tab, with the number of interactions in a badge. */
export const InteractionsTabLabel = ({ profileType, profileId }: InteractionsTabLabelProps) => {
  const { data: interactions } = useGetInteractions(profileType, profileId);

  return <ProfileTabLabel label="Interactions" count={interactions?.length} />;
};
