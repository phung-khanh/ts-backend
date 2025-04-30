import { ICategory } from "./category.interface";

export interface IProduct extends Document {
  id: number;
  name: string;
  image: Array<string>;
  price: number;
  salePrice: number;
  view: number;
  category: ICategory[];
  brand: string[];
  description: string;
  posts: string;
}
