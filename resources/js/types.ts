export type Id = string | number;

export type Column = {
  name: boolean;
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};
