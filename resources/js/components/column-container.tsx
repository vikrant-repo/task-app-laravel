// Make sure the file exists at ../icons/TrashIcon.tsx or update the path accordingly


import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Column, Id, Task } from "@/types";
import TaskCard from "./task-card";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  editColumnName: (id: Id, newName: string) => void;
  createTask: (columnId: Id) => void;
  tasks: Task[];
  removeTask: (id: Id) => void;
  editTask: (id: Id, task: string) => void;
}

const ColumnContainer = (props: Props) => {
  const {
    column,
    deleteColumn,
    editColumnName,
    createTask,
    tasks,
    removeTask,
    editTask,
  } = props;
  const [editMode, setEditMode] = useState(false);

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    listeners,
    transform,
    transition,
    attributes,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    border: isDragging ? "2px solid #F2C618" : "2px solid #e5e5e5;",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor xl:w-[350px] w-[300px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        className="bg-mainBakgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between focus-visible:ring-2 focus-visible:ring-gradientBorder focus-visible:outline-none focus:ring-offset-0"
      >
        <div className="flex gap-2 justify-center focus-visible:ring-2 focus-visible:ring-gradientBorder focus-visible:outline-none focus:ring-offset-0">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full focus-visible:ring-2">
            {tasks?.length}
          </div>
          {!editMode && column.title}

          {editMode && (
            <input
              className="focus:border-gradientBorder border rounded outline-none"
              type="text"
              autoFocus
              value={column.title}
              onChange={(e) => editColumnName(column.id, e.target.value)}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <div className="flex gap-2">
          <button
            className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2 focus-visible:ring-2 focus-visible:ring-gradientBorder focus-visible:outline-none focus:ring-offset-0"
            onClick={() => setEditMode(true)}
          >
            <EditIcon />
          </button>
          <button
            className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2 focus-visible:ring-2 focus-visible:ring-gradientBorder focus-visible:outline-none focus:ring-offset-0"
            onClick={() => deleteColumn(column.id)}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      <div className="flex flex-grow flex-col gap-4 overflow-x-hidden overflow-y-auto p-2">
        <SortableContext items={taskIds}>
          {tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              removeTask={removeTask}
              editTask={editTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBakgroundColor hover:text-gradientBorder active:bg-black focus-visible:ring-2 focus-visible:ring-gradientBorder focus-visible:outline-none focus:ring-offset-0"
        onClick={() => createTask(column.id)}
      >
        <PlusIcon /> Add task
      </button>
    </div>
  );
};

export default ColumnContainer;
