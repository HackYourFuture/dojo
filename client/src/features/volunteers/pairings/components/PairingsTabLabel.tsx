import { ProfileTabLabel } from '../../../../components/profile/ProfileTabLabel';
import { useGetMentorPairings } from '../data/pairing-queries';

interface PairingsTabLabelProps {
  volunteerId: string;
}

/** The label of the pairings tab, with the number of pairings in a badge. */
export const PairingsTabLabel = ({ volunteerId }: PairingsTabLabelProps) => {
  const { data: pairings } = useGetMentorPairings(volunteerId);

  return <ProfileTabLabel label="Pairings" count={pairings?.length} />;
};
