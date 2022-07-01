export interface Stock {
  name?: String;
  code?: String;
  price?: String;
  percent?: String;
  time?: String;
  desc?: String;
  descLink?: String;
}

export interface Category {
  category?: String;
  number?: Number;
  stocks?: Stock[];
}
