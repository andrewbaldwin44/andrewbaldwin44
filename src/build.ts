import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import fs from "fs";

import Handlebars from "handlebars";
import { registerAllHelpers } from "./helpers";
registerAllHelpers(Handlebars);

import { Solution, monthMap, compareSolutionsByDate, mentorUrl } from "./scrape";
import { techStack } from "./data";

axios.get(mentorUrl).then((response: AxiosResponse) => {
  const $ = cheerio.load(response.data);

  const solutions = <Solution[]>(<unknown>$("a.solution")
    .map((_i, solution) => {
      const el$ = $(solution);
      const date = el$.find("div.published-at").text().trim().split(" ");

      return {
        title: el$.find("div.title").text(),
        track: el$.find("div.track").text().slice(0, -6),
        date_obj: new Date(`${date[2]}-${monthMap.get(date[0])}-${date[1]}`),
      };
    })
    .toArray());

  solutions.sort(compareSolutionsByDate);

  const mentoredCount = $("div.count").text();

  buildReadme(solutions, mentoredCount);
});

function buildReadme(solutions: Solution[], mentoredCount: string) {
  const templateSource = fs.readFileSync("./readme_template.hbs", { encoding: "utf-8" });
  const template = Handlebars.compile(templateSource);

  const data = {
    mentoredCount: mentoredCount,
    solutions: solutions.slice(0, 5),
    techStack,
  };

  const output = template(data);
  fs.writeFileSync("./README.md", output);
}
