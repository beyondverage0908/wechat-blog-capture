export interface Stock {
  name: string;
  code: string;
  percent: string;
  price: string;
  desc: string;
  descLink: string;
}
export interface Category {
  category: string;
  number: number;
  stocks: Stock[];
}
