
import { useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Column, Id, Task } from "@/types";
import ColumnContainer from "./column-container";
import TaskCard from "./task-card";

interface TaskContainerProps {
  columns: Column[];
  tasks: Task[];
  createTask: (data: { column_id: Id; title: string }) => void;
  createColumn: (data: { name: string }) => void;
  deleteColumn: (id: Id) => void;
  deleteTask: (id: Id) => void;
  updateColumn: (id: Id, name: string) => void;
  updateTask: (id: Id, title: string, column_id: Id) => void;
}

function TaskContainer(props:TaskContainerProps ) {
  const { columns, tasks, createColumn, deleteColumn , updateColumn , createTask , updateTask , deleteTask } = props;
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <>
      <div className="flex items-end justify-end mb-4">
            <button
              onClick={createNewColumn}
              className="bg-blue-500 text-white px-4 py-2 rounded">Add Category</button>
        </div>
      <div
        className="
          m-auto
          flex
          min-h-[70vh]
          w-full
          flex-col
          items-center
          overflow-x-auto
          overflow-y-hidden
          px-[40px]
          mb-[50px]
      "
      >

        
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="m-auto flex gap-4">
            <div className="flex gap-4">
              <SortableContext items={columnsId}>
                {columns.map((col) => (
                  <ColumnContainer
                    key={col.id.toString()}
                    column={col}
                    deleteColumn={deleteColumn}
                    editColumnName={updateColumnName}
                    createTask={createTaskFn}
                    removeTask={deleteTask}
                    editTask={updateTaskFn}
                    tasks={tasks.filter((task) => task.column_id === col.id)}
                  />
                ))}
              </SortableContext>
            </div>
          </div>

          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  editColumnName={updateColumnName}
                  createTask={createTaskFn}
                  removeTask={deleteTask}
                  editTask={updateTaskFn}
                  tasks={tasks.filter(
                    (task) => task.column_id === activeColumn.id
                  )} key={""}              />
              )}
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  removeTask={deleteTask}
                  editTask={updateTaskFn}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </>
  );

function createTaskFn(column_id: Id) {
  createTask({     
    column_id,
    title: `Task ${tasks.length + 1}` });
}

function createNewColumn() {
  createColumn({name: `Column ${columns.length + 1}`});
}

function updateColumnName(id: Id, name: string) {
  if (debounceTimers.current[id]) {
    clearTimeout(debounceTimers.current[id]);
  }
  debounceTimers.current[id] = setTimeout(async () => {
    updateColumn(id, name);
    delete debounceTimers.current[id];
  }, 1000);
}

function updateTaskFn(id: Id, title: string, column_id: Id) {
  if (debounceTimers.current[id]) {
    clearTimeout(debounceTimers.current[id]);
  }
  debounceTimers.current[id] = setTimeout(async () => {
    updateTask(id, title, column_id);
    delete debounceTimers.current[id];
  }, 1000);
}

function onDragStart(event: DragStartEvent) {
  if (event.active.data.current?.type === "Column") {
    setActiveColumn(event.active.data.current.column);
    return;
  }

  if (event.active.data.current?.type === "Task") {
    setActiveTask(event.active.data.current.task);
    return;
  }
}

function onDragEnd(event: DragEndEvent) {
  setActiveColumn(null);
  setActiveTask(null);

  const { active, over } = event;
  if (!over) return;

  const activeId = active.id;
  const overId = over.id;

  if (activeId === overId) return;

  const isActiveAColumn = active.data.current?.type === "Column";
  if (!isActiveAColumn) return;
}

function onDragOver(event: DragOverEvent) {
  const { active, over } = event;
  if (!over) return;

  const activeId = active.id;
  const overId = over.id;

  if (activeId === overId) return;

  const isActiveATask = active.data.current?.type === "Task";

  if (!isActiveATask) return;

  const isOverAColumn = over.data.current?.type === "Column";

  if (isActiveATask && isOverAColumn) {
    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    tasks[activeIndex].column_id = overId;
    updateTaskFn(activeId, tasks[activeIndex].title, overId);
  }
}
}

export default TaskContainer;