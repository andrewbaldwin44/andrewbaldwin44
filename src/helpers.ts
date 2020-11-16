import { SafeString } from "handlebars";

const helpers = [
  {
    name: "print_item",
    fn: function (name: string, slug: string) {
      const url = `https://raw.githubusercontent.com/andrewbaldwin44/andrewbaldwin44/master/images/${slug}.png`;
      return new SafeString(`<img src="${url}" alt="${name}" height="40px">`);
    },
  },
];

export const registerAllHelpers = (instance: any) => {
  helpers.forEach((helper) => instance.registerHelper(helper.name, helper.fn));
};
