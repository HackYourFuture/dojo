import { QueryClient, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePicture, uploadPicture } from '../api/api';

import { ProfilePicture } from '../ProfilePicture';
import { ProfileType } from '../../../data/types/ProfileType';
import { organisationKeys } from '../../organisations/data/keys';
import { searchKeys } from '../../search/data/keys';
import { traineeKeys } from '../../trainee-profile/data/keys';

// Where each kind of profile is cached.
const PROFILE_KEYS: Record<ProfileType, (profileId: string) => QueryKey> = {
  trainee: traineeKeys.details,
  organisation: organisationKeys.details,
};

const updatePictureQueries = (
  queryClient: QueryClient,
  profileType: ProfileType,
  profileId: string,
  picture: ProfilePicture
) => {
  // Merged instead of reloading the profile, because its edit form diffs against the cached one.
  queryClient.setQueryData<ProfilePicture>(
    PROFILE_KEYS[profileType](profileId),
    (profile) => profile && { ...profile, ...picture }
  );
  // Search results never reload on their own, and the old thumbnail no longer exists. Not awaited, so the dialog
  // closes without waiting for an open search to reload.
  queryClient.resetQueries({ queryKey: searchKeys.all() });
};

/** Hook to upload a new picture for a trainee or an organisation. */
export const useUploadPicture = (profileType: ProfileType, profileId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (picture: Blob) => uploadPicture(profileType, profileId, picture),
    onSuccess: (picture) => updatePictureQueries(queryClient, profileType, profileId, picture),
  });
};

/** Hook to delete the picture of a trainee or an organisation. */
export const useDeletePicture = (profileType: ProfileType, profileId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pictureUrl: string) => deletePicture(pictureUrl),
    onSuccess: () =>
      updatePictureQueries(queryClient, profileType, profileId, { pictureUrl: null, thumbnailUrl: null }),
  });
};
