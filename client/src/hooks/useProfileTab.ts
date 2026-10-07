import { useNavigate, useParams } from 'react-router';

// The open tab of a profile, kept in the URL: the first tab is the profile path itself, the others add their name to it.
export const useProfileTab = (profilePath: string, tabs: string[]) => {
  const { tab } = useParams();
  const navigate = useNavigate();
  // An unknown tab in the URL opens the first one.
  const activeTab = tabs.find((name) => name === tab) ?? tabs[0];

  // Replaces the history entry, so a profile stays one Back step (deleting it relies on that), and keeps the scroll position.
  const setActiveTab = (newTab: string) => {
    navigate(newTab === tabs[0] ? profilePath : `${profilePath}/${newTab}`, {
      replace: true,
      preventScrollReset: true,
    });
  };

  return [activeTab, setActiveTab] as const;
};
