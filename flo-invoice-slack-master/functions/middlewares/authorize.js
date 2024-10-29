const constants = require("../utils/constants");
const { slack, slackMessage } = require("../utils/api_client");
const {
  build: buildPermissions,
  distribute: distributePermissions,
  build,
  distribute
} = require("../utils/permissions");

exports.isAuthorized = async (req, res, next) => {
  if (req.path == "/interact") {
    next();
    return;
  }

  const { user_id, channel_id } = req.body;

  const emails =
    req.path == "/build" || req.path == "/interact" ? build : distribute;

  // Restrict all commands in #mobile-app-testing channel
  if (channel_id != constants.MOBILE_APP_TESTING_ID) {
    res.json(
      slackMessage("Command available only in #mobile-app-testing :nikal:")
    );
    return;
  }

  // Get user info from user_id to verify access
  const slackResponse = await slack.get(`/users.info?user=${user_id}`);

  if (!emails.includes(slackResponse?.data?.user?.profile?.email ?? "")) {
    res.json(slackMessage("Unauthorized Access :teja_bhai_sunshine:"));
    return;
  } else next();
};
