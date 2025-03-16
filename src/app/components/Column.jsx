import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FaPlus } from 'react-icons/fa';
import Task from './Task';

const Column = ({ id, title, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className='bg-base-200 rounded-lg p-4 w-80 transition-height duration-300 ease-out'
    >
      <div className='flex justify-between items-center mb-4'>
        <h2 className='font-bold text-lg'>{title}</h2>
        <span className='badge'>{tasks.length}</span>
      </div>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='transition-all duration-300 ease-out'>
          {tasks.map((task) => (
            <Task
              key={task.id}
              {...task}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      </SortableContext>

      {/* Zone de drop vide avec une hauteur minimale */}
      {tasks.length === 0 && (
        <div
          className='min-h-[100px] border-2 border-dashed border-gray-300 
                      rounded-lg flex items-center justify-center text-gray-400
                      transition-opacity duration-200 ease-in-out'
        >
          Déposez des tâches ici
        </div>
      )}

      <button
        className='btn btn-ghost btn-sm w-full mt-2 text-gray-500'
        onClick={() => onAddTask(id)}
      >
        <FaPlus className='mr-2' /> Ajouter une carte
      </button>
    </div>
  );
};

export default Column;
