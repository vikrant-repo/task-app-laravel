export type Id = string | number;

export type Column = {
  name: boolean;
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  column_id: Id;
  title: string;
};
