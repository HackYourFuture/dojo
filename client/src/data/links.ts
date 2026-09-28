// The HackYourFuture Slack workspace.
const SLACK_TEAM_ID = 'T0EJTUQ87';

/**
 * A link that opens the profile of a Slack member in the Slack app.
 */
export const getSlackUserUrl = (slackId: string) => `slack://user?team=${SLACK_TEAM_ID}&id=${slackId}`;
