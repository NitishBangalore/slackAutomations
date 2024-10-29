const { Modal, Blocks, Elements, Bits } = require("slack-block-builder");

module.exports = (message) =>
  Modal({ title: "Build Started", callbackId: "android-build" })
    .blocks(
      Blocks.Section({
        text: message
      })
    )
    .close("Close :bl:")
    .buildToJSON();
