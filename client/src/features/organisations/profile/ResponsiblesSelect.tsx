import { ProfileMultiSelect } from '../../trainee-profile/profile/components/ProfileMultiSelect';
import { Responsible } from '../Organisation';
import { useGetUsers } from '../../admin/users/data/user-queries';

interface ResponsiblesSelectProps {
  value: Responsible[];
  isEditing: boolean;
  onChange: (responsibles: Responsible[]) => void;
}

/** The users responsible for the organisation, picked from the active users. The first one picked is the primary. */
export const ResponsiblesSelect = ({ value, isEditing, onChange }: ResponsiblesSelectProps) => {
  // The users are only needed to pick from.
  const { data: users = [], isLoading } = useGetUsers({ enabled: isEditing });

  // Inactive users cannot be picked, but stay when they already are responsible.
  const options: Responsible[] = users
    .filter((user) => user.isActive || value.some((responsible) => responsible.id === user.id))
    .map((user) => ({ id: user.id, name: user.name, thumbnailUrl: user.thumbnailUrl }));

  return (
    <ProfileMultiSelect
      name="responsibles"
      label="Responsible"
      options={options}
      value={value}
      getOptionLabel={(responsible) => responsible.name}
      getOptionKey={(responsible) => responsible.id}
      loading={isLoading}
      isEditing={isEditing}
      onChange={onChange}
    />
  );
};
