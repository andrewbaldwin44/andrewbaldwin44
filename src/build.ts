import fs from "fs";

import Handlebars from "handlebars";
import { registerAllHelpers } from "./helpers";
registerAllHelpers(Handlebars);

import { techStack } from "./data";

function buildReadme() {
  const templateSource = fs.readFileSync("./readme_template.hbs", { encoding: "utf-8" });
  const template = Handlebars.compile(templateSource);

  const output = template({ techStack });
  fs.writeFileSync("./README.md", output);
}

buildReadme();
