export type Item = {
  item: {
    seq: string;
    description: string;
    itembank: string;
    appref: {
      name: string;
      url: string;
      "conn-params": { [key in string]: string }[];
    }[];
  }[];
};

export type ResponseBody = {
  user: string;
  email: string;
  navigation: number[];
  items: Item[];
};
