import { ChangeEvent, Dispatch, SetStateAction } from 'react';

// The change handlers of a profile tab's fields, which set the field named after the input.
export const createFieldChangeHandlers = <Profile extends object>(setProfile: Dispatch<SetStateAction<Profile>>) => {
  // The dropdowns report their value instead of an event.
  const handleValueChange = (name: string, value: string | boolean | null) => {
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleValueChange(event.target.name, event.target.value);
  };

  return { handleValueChange, handleTextChange };
};
