const router = require("express").Router();
const { github, slack, slackMessage } = require("../utils/api_client");
const constants = require("../utils/constants");
const initModal = require("../modals/generate_build");
const buildStartedModal = require("../modals/build_started");

const availableBuildTypes = ["debug", "qa", "offline", "release", "dev", "releaseQa"];

router.post("/distribute", async (req, res) => {
  // API call to trigger manual `workflow_dispatch` event
  github
    .post(constants.DISTRIBUTE_WORKFLOW_URL, { ref: "develop" })
    .then(() =>
      res.json(
        slackMessage(
          "Distribution started, testers will get an e-mail as soon as build generated :dipen-notty:"
        )
      )
    )
    .catch((error) =>
      res.json(slackMessage(`Error: ${error.response?.data?.message ?? "Command Failed :mukul:"}`))
    );
});

router.post("/build", async (req, res) => {
  const { trigger_id } = req.body;
  const branches = (await github.get("/branches?per_page=90")).data.map((branch) => branch.name);
  const tags = (await github.get("/tags")).data.map((tag) => tag.name);

  const options = branches.concat(tags.slice(0, 10));

  const slackModalJson = {
    trigger_id,
    view: initModal(options, availableBuildTypes)
  };

  slack
    .post("views.open", slackModalJson)
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err));
  res.json();
});

router.post("/interact", async (req, res) => {
  const payoad = JSON.parse(req.body.payload);
  const modalState = payoad.view.state.values;

  // Parse modal state
  const { branch, variant, baseUrl } = {
    branch: modalState.branch.branch.selected_option.value,
    variant: modalState.variant.variant.selected_option.value,
    baseUrl: modalState.base_url.base_url.value
  };

  // Build POST data for GitHub workflow trigger
  const buildMessage = `Successfully deployed \`${variant.toUpperCase()}\` build from \`${branch}\`} :rocket:`;
  const data = {
    ref: branch,
    inputs: {
      buildType: variant,
      buildMessage,
      baseUrl
    }
  };

  // API call to trigger manual `workflow_dispatch` event
  github
    .post(constants.BUILD_WORKFLOW_URL, data)
    .then(() =>
      res.json({
        response_action: "update",
        view: buildStartedModal(buildMessage)
      })
    )
    .catch((error) => {
      console.error(error);
      res.json(slackMessage(`Error: ${error.response?.data?.message ?? "Command Failed :mukul:"}`));
    });
});

module.exports = router;
