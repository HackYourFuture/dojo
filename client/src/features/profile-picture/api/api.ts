import { PROFILE_PATHS, ProfileType } from '../../../data/types/ProfileType';

import { ProfilePicture } from '../ProfilePicture';
import axios from 'axios';

// Replaces the current picture of the profile, and returns the URLs of the new one.
export const uploadPicture = async (profileType: ProfileType, profileId: string, picture: Blob) => {
  const formData = new FormData();
  formData.append('picture', picture, 'picture.png');
  const { data } = await axios.put<ProfilePicture>(`/api/${PROFILE_PATHS[profileType]}/${profileId}/picture`, formData);
  return data;
};

// The URL of a picture is also the endpoint that deletes it.
export const deletePicture = async (pictureUrl: string) => {
  await axios.delete(pictureUrl);
};
