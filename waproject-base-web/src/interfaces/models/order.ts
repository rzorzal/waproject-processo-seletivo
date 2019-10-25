export interface IOrder {
  description: string;
  count: number;
  value: string;

  createdDate?: Date;
  updatedDate?: Date;
  id?: number;
}

