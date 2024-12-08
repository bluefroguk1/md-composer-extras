import { apiInitializer } from "discourse/lib/api";
import I18n from "I18n";
import { iconNode } from "discourse-common/lib/icon-library";

export default apiInitializer("0.11.1", (api) => {
  const currentLocale = I18n.currentLocale();

  I18n.translations[currentLocale].js.underline_button_title = settings.underline_button;

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
    ];

    buttons.forEach((button) => toolbar.addButton(button));
  });

  api.decorateCookedElement(
    async (elem, helper) => {
      const id = helper ? `post_${helper.getModel().id}` : "composer";
      applyHighlight(elem, id);
    },
    { id: "wrap-mark" }
  );
});
