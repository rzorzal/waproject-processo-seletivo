export interface IOrder {
  id?: number;
  description: string;
  count: number;
  value: string;
  createdDate?: Date;
  updatedDate?: Date;
}