import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditIcon, TrashIcon } from "lucide-react";
import { Id, Task } from "@/types";

interface TaskBarProps {
  task: Task;
  removeTask: (id: Id) => void;
  editTask: (id: Id, task: string) => void;
}

const TaskCard = (props: TaskBarProps) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editTaskMode, setEditTaskMode] = useState(false);
  const { task, removeTask, editTask } = props;

  const {
    setNodeRef,
    listeners,
    transform,
    transition,
    attributes,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editTaskMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    border: isDragging ? "1px solid #F2C618" : "1px solid #1e1e1e",
  };

  const toggleEditMode = () => {
    setEditTaskMode(!editTaskMode);
    setMouseIsOver(false);
  };

  if (editTaskMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={toggleEditMode}
        className="bg-mainBakgroundColor p-2.5 h-[50px] min-h-[50px] items-center text-left flex rounded-xl hover:ring-2 hover:ring-inset hover:ring-gradientBorder cursor-grab relative focus-visible:ring-2 focus-visible:ring-gradientBorder focus-visible:outline-none focus:ring-offset-0 "
      >
        <input
          className="focus:border-gradientBorder border rounded outline-none px-2 focus-visible:ring-2 focus-visible:ring-gradientBorder focus-visible:outline-none focus:ring-offset-0"
          type="text"
          autoFocus
          value={task.content}
          onChange={(e) => editTask(task.id, e.target.value)}
          onBlur={() => setEditTaskMode(false)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            setEditTaskMode(false);
          }}
        />
      </div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-mainBakgroundColor p-2.5 h-[50px] min-h-[50px] items-center text-left flex rounded-xl hover:ring-2 hover:ring-inset hover:ring-gradientBorder cursor-grab relative focus:active:border-gradientColor border-1"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <div>
        {!editTaskMode && task.content}
        {editTaskMode && (
          <input
            className="focus:border-gradientBorder focus:active:border-gradientColor border rounded outline-none px-2"
            type="text"
            autoFocus
            value={task.content}
            onChange={(e) => editTask(task.id, e.target.value)}
            onBlur={() => setEditTaskMode(false)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditTaskMode(false);
            }}
          />
        )}
      </div>
      {mouseIsOver && (
        <>
          <button
            className="stroke-white absolute left-64 bg-columnBackgroundColor p-2 rounded-md opacity-60 hover:opacity-100 focus:active:border-gradientColor outline-none"
            onClick={() => setEditTaskMode(true)}
          >
            <EditIcon />
          </button>
          <button
            className="stroke-white absolute right-2 bg-columnBackgroundColor p-2 rounded-md opacity-60 hover:opacity-100 focus:active:border-gradientColor outline-none"
            onClick={() => removeTask(task.id)}
          >
            <TrashIcon />
          </button>
        </>
      )}
    </div>
  );
};

export default TaskCard;
