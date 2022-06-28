import * as cheerio from "cheerio";

export default class CheerioUtil {
  private $: cheerio.CheerioAPI;
  constructor(htmlContent: string) {
    this.$ = cheerio.load(htmlContent);
  }
  getValueBySelector(selector: string) {
    return this.$(selector);
  }
}
