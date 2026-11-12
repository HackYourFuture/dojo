import { Interaction, InteractionType } from '../Interaction';
import { InteractionRequest, InteractionResponse } from './types';

import { Mentorship } from '../../mentorships/Mentorship';
import { MentorshipCheckin } from '../../mentorships/checkins/MentorshipCheckin';
import { MentorshipCheckinParticipant } from '../../mentorships/checkins/MentorshipCheckinParticipant';
import { MentorshipType } from '../../mentorships/MentorshipType';
import { ProfileType } from '../../../data/types/ProfileType';

export const mapInteractionToDomain = (interaction: InteractionResponse): Interaction => {
  return {
    id: interaction.id,
    date: new Date(interaction.date),
    type: interaction.type,
    title: interaction.title,
    details: interaction.details,
    reporter: {
      id: interaction.reporter.id,
      name: interaction.reporter.name,
      thumbnailUrl: interaction.reporter.thumbnailUrl,
    },
    link: null,
  };
};

export const mapDomainToInteractionRequest = (interaction: Interaction): InteractionRequest => {
  return {
    date: interaction.date.toISOString(),
    type: interaction.type,
    title: interaction.title,
    details: interaction.details,
  };
};

const CHECKIN_TYPES: Record<MentorshipType, InteractionType> = {
  [MentorshipType.TechMentorship]: InteractionType.TechMentorship,
  [MentorshipType.EnglishMentorship]: InteractionType.EnglishMentorship,
  [MentorshipType.HrMentorship]: InteractionType.HRMentorship,
};

// Names only the mentorship's other person, as the profile's own name is already on the page.
const getCheckinTitle = (checkin: MentorshipCheckin, mentorship: Mentorship, profileType: ProfileType) => {
  if (profileType === 'trainee') {
    const mentor = mentorship.volunteer.name;
    return checkin.participant === MentorshipCheckinParticipant.Mentor
      ? `Check-in with mentor ${mentor}`
      : `Check-in with trainee (mentor ${mentor})`;
  }
  const trainee = mentorship.trainee.name;
  return checkin.participant === MentorshipCheckinParticipant.Mentor
    ? `Check-in with mentor (trainee ${trainee})`
    : `Check-in with trainee ${trainee}`;
};

// A check-in as an interaction linked to its mentorship, which is its reporter, so no user can change it here.
export const mapCheckinToInteraction = (
  checkin: MentorshipCheckin,
  mentorship: Mentorship,
  profileType: ProfileType
): Interaction => {
  return {
    id: checkin.id,
    date: checkin.date,
    type: CHECKIN_TYPES[mentorship.type],
    title: getCheckinTitle(checkin, mentorship, profileType),
    details: checkin.notes,
    reporter: { id: mentorship.id, name: 'Mentorship', thumbnailUrl: 'icon:Diversity2' },
    link: mentorship.profilePath,
  };
};
