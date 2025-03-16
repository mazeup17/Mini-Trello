'use client';

import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import Column from '../Column';

export default function TaskColumns({
  tasks,
  setTasks,
  columns,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) {
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  // Setup sensors for drag events
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    // Find the active task for overlay rendering
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    // Skip if no valid drop target or same item
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);

    // Handle dropping on a column
    if (columns.some((col) => col.id === over.id)) {
      // Only update if status is different
      if (activeTask.status !== over.id) {
        setTasks(
          tasks.map((task) =>
            task.id === active.id ? { ...task, status: over.id } : task
          )
        );
      }
      return;
    }

    // Handle dropping on another task (potentially in a different column)
    const overTask = tasks.find((t) => t.id === over.id);
    if (activeTask.status !== overTask.status) {
      setTasks(
        tasks.map((task) =>
          task.id === active.id ? { ...task, status: overTask.status } : task
        )
      );
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // If drop target is a column
    if (columns.some((col) => col.id === overId)) {
      // Already handled in dragOver
      return;
    }

    // Handle reordering within the same column
    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    const overIndex = tasks.findIndex((t) => t.id === overId);

    if (activeIndex !== overIndex) {
      setTasks(arrayMove(tasks, activeIndex, overIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className='flex space-x-4 overflow-x-auto pb-4 items-start'>
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={tasks.filter((task) => task.status === column.id)}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            activeId={activeId}
          />
        ))}
      </div>
    </DndContext>
  );
}
