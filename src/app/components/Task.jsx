import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Ajout de l'icône de suppression

const Task = ({ id, title, description, status, onEditTask, onDeleteTask }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'todo':
        return 'badge-primary';
      case 'in-progress':
        return 'badge-secondary';
      case 'done':
        return 'badge-success';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='card bg-base-100 shadow-sm mb-3 cursor-move hover:scale-[1.02]'
    >
      <div className='card-body p-4'>
        <div className='flex justify-between items-start'>
          <h3 className='card-title text-base'>{title}</h3>
          <div className='flex gap-1'>
            <button
              className='btn btn-ghost btn-xs'
              onClick={(e) => {
                e.stopPropagation(); // Pour éviter de déclencher le drag
                onEditTask(id);
              }}
            >
              <FaEdit />
            </button>
            <button
              className='btn btn-ghost btn-xs text-error'
              onClick={(e) => {
                e.stopPropagation(); // Pour éviter de déclencher le drag
                onDeleteTask(id);
              }}
            >
              <FaTrash />
            </button>
          </div>
        </div>
        {description && <p className='text-sm text-gray-500'>{description}</p>}
        <div className='card-actions justify-end mt-2'>
          <div className={`badge ${getBadgeClass(status)}`}>
            {status === 'todo'
              ? 'À faire'
              : status === 'in-progress'
              ? 'En cours'
              : 'Terminé'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
