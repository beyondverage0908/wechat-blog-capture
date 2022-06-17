import * as cheerio from "cheerio";

export default {
  getText(content: string) {
    const $ = cheerio.load(content);
    return $("#js_content").text();
  },
};
