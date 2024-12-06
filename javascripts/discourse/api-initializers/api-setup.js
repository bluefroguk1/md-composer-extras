import { apiInitializer } from "discourse/lib/api";
import loadScript from "discourse/lib/load-script";
import I18n from "I18n";

async function applyHighlight(element) {
  const highlights = element.querySelectorAll("mark");
  if (!highlights.length) {
    return;
  }
}

// Helper function to get raw text without translation
function getRawText(text) {
  return text.replace(/\[.*?\]/g, '');
}

export default apiInitializer("0.11.1", (api) => {
  const { iconNode } = require("discourse-common/lib/icon-library");
  const currentLocale = I18n.currentLocale();

  // Localization setup - keep only the button titles in translations
  I18n.translations[currentLocale].js.highlight_button_title = settings.highlighter_button;
  I18n.translations[currentLocale].js.underline_button_title = settings.underline_button;
  I18n.translations[currentLocale].js.align_center_button_title = settings.align_center_button;
  I18n.translations[currentLocale].js.align_right_button_title = settings.align_right_button;
  I18n.translations[currentLocale].js.align_justify_button_title = settings.align_justify_button;
  I18n.translations[currentLocale].js.strikethrough_button_title = settings.strikethrough_button;
  I18n.translations[currentLocale].js.superscript_button_title = settings.superscript_button;
  I18n.translations[currentLocale].js.subscript_button_title = settings.subscript_button;
  I18n.translations[currentLocale].js.columns_button_title = settings.columns_button;
  I18n.translations[currentLocale].js.align_left_button_title = settings.align_left_button;
  I18n.translations[currentLocale].js.float_left_button = settings.float_left_button;
  I18n.translations[currentLocale].js.highlighter_text = settings.highlighter_text;

  // Modify the highlighter action
  api.modifyClass("controller:composer", {
    pluginId: "highlight",
    actions: {
      highlightButton() {
        toolbarEvent.applySurround("<mark>", "</mark>", I18n.t("composer.highlighter_text"));
      },
    },
  });

  // Toolbar Button Definitions
  api.onToolbarCreate((toolbar) => {
    const buttons = [
      {
        id: "underline_button",
        group: "fontStyles",
        icon: "underline",
        shortcut: "U",
        title: "underline_button_title",
        perform: (e) => e.applySurround("[u]", "[/u]", settings.underline_text),
      },
      {
        id: "strikethrough_button",
        group: "fontStyles",
        icon: "strikethrough",
        title: "strikethrough_button_title",
        perform: (e) => e.applySurround("<s>", "</s>", settings.strikethrough_text),
      },
      {
        id: "superscript_button",
        group: "fontStyles",
        icon: "superscript",
        title: "superscript_button_title",
        perform: (e) => e.applySurround("<sup>", "</sup>", settings.superscript_text),
      },
      {
        id: "subscript_button",
        group: "fontStyles",
        icon: "subscript",
        title: "subscript_button_title",
        perform: (e) => e.applySurround("<sub>", "</sub>", settings.subscript_text),
      },
      {
        id: "align_left_button",
        group: "extras",
        icon: "align-left",
        title: "align_left_button_title",
        perform: (e) => e.applySurround('[wrap="floatl"]\n', "\n[/wrap]", settings.align_left_text),
      },
      {
        id: "align_center_button",
        group: "extras",
        icon: "align-center",
        title: "align_center_button_title",
        perform: (e) => e.applySurround('[wrap="center"]\n', "\n[/wrap]", settings.align_center_text),
      },
      {
        id: "align_right_button",
        group: "extras",
        icon: "align-right",
        title: "align_right_button_title",
        perform: (e) => e.applySurround('[wrap="right"]\n', "\n[/wrap]", settings.align_right_text),
      },
      {
        id: "align_justify_button",
        group: "extras",
        icon: "align-justify",
        title: "align_justify_button_title",
        perform: (e) => e.applySurround('[wrap="justify"]\n', "\n[/wrap]", settings.align_justify_text),
      },
    ];

    buttons.forEach((button) => toolbar.addButton(button));
  });

  api.addComposerToolbarPopupMenuOption({
    action: (toolbarEvent) => {
      const text = I18n.t("composer.highlighter_text"); // Use translation
      toolbarEvent.applySurround("<mark>", "</mark>", text);
    },
    icon: "highlighter",
    label: "composer.highlight_button_title",
    shortcut: "H",
  });


  api.addComposerToolbarPopupMenuOption({
    action: (toolbarEvent) =>
      toolbarEvent.applySurround('[wrap="columns"]\n', "\n[/wrap]", settings.columns_text),
    icon: "table-columns",
    label: "columns_button_title",
  });

  api.addComposerToolbarPopupMenuOption({
    action: (toolbarEvent) => {
      toolbarEvent.applySurround('[wrap="floatl"]\n', '\n[/wrap]', settings.float_left_text);
    },
    icon: 'indent',
    label: 'float_left_button',
  });

  // Decorate cooked elements with highlight processing
  api.decorateCookedElement(
    async (elem, helper) => {
      const id = helper ? `post_${helper.getModel().id}` : "composer";
      applyHighlight(elem, id);
    },
    { id: "wrap-mark" }
  );
});
