// Get all user emails in #engineering channel
// var users = [];
// slack.get(`/conversations.members?channel=CNZM817A8`).then((res) => {
//   res.data.members.forEach((userId) => {
//     slack.get(`/users.info?user=${userId}`).then((res) => {
//       users.push(res.data.user?.profile.email);
//     });
//   });
// });

// setTimeout(() => {
//   console.log(users);
// }, 1000);

// Uncomment the below code to log all the workflows for a repository
// github
//   .get("repos/prashant-flobiz/fastlane-test/actions/workflows")
//   .then((response) => console.log(response.data.workflows))
//   .catch((err) => console.error(err));
