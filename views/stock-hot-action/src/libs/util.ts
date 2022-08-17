/**
 * 访问券商的证券页面
 * @param code
 */
export const openLinkCodeByWindow = (code: string) => {
  window.open(`http://quote.eastmoney.com/concept/${code}.html`, "_blank");
};
