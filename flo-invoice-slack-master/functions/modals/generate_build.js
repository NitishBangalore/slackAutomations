const { Modal, Blocks, Elements, Bits } = require("slack-block-builder");

module.exports = (options, variants) =>
  Modal({
    title: "Generate Android Build",
    submit: "Generate",
    callbackId: "android-build"
  })
    .blocks(
      Blocks.Input({
        label: "Select branch",
        blockId: "branch",
        optional: false
      }).element(
        Elements.StaticSelect({
          actionId: "branch",
          placeholder: "Select branch from to generate build from"
        })
          .initialOption(Bits.Option().text("develop").value("develop"))
          .options(options.map((option) => Bits.Option({ text: option, value: option })))
      ),
      Blocks.Input({
        label: "Select variant",
        blockId: "variant",
        optional: false
      }).element(
        Elements.StaticSelect({
          actionId: "variant",
          placeholder: "Select variant Eg: QA, Debug, Offline"
        })
          .initialOption(Bits.Option().text("debug").value("debug"))
          .options(variants.map((variant) => Bits.Option({ text: variant, value: variant })))
      ),
      Blocks.Input({
        label: "Base URL",
        blockId: "base_url",
        optional: true,
        hint: "Eg: https://dev.niobooks.in"
      }).element(
        Elements.URLInput({
          actionId: "base_url"
        })
      )
    )
    .close("Never Mind")
    .buildToJSON();
