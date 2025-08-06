
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
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Column, Id, Task } from "@/types";
import ColumnContainer from "./column-container";
import TaskCard from "./task-card";

function TaskContainer(props: { columns: Column[]; createColumn: (data: { name: string }) => void; deleteColumn: (id: Id) => void; updateColumn: (id: Id, name: string) => void }) {
  const { createColumn, columns, deleteColumn , updateColumn } = props;
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
console.log('Columns:', columns);
  const [tasks, setTasks] = useState<Task[]>([]);

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
                  createTask={createTask}
                  removeTask={removeTask}
                  editTask={editTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
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
                createTask={createTask}
                removeTask={removeTask}
                editTask={editTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )} key={""}              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                removeTask={removeTask}
                editTask={editTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
     </>
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: 12,
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function removeTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function editTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
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

    // setColumns((columns) => {
    //   const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

    //   const overColumnIndex = columns.findIndex((col) => col.id === overId);

    //   return arrayMove(columns, activeColumnIndex, overColumnIndex);
    // });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

export default TaskContainer;