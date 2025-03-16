'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaHome } from 'react-icons/fa';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCorners,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Column from '../../components/Column';
import Task from '../../components/Task';

const BoardPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  // Tasks state (would come from API)
  const [tasks, setTasks] = useState([
    {
      id: 'task1',
      title: 'Créer un design',
      description: 'UI/UX du projet',
      status: 'todo',
    },
    {
      id: 'task2',
      title: 'Implémenter le backend',
      description: "API pour l'application",
      status: 'todo',
    },
    {
      id: 'task3',
      title: 'Configurer CI/CD',
      description: null,
      status: 'in-progress',
    },
    {
      id: 'task4',
      title: 'Documentation',
      description: "Guide d'utilisation",
      status: 'in-progress',
    },
    {
      id: 'task5',
      title: 'Setup du projet',
      description: 'Installation et configuration',
      status: 'done',
    },
  ]);

  // Modal state for adding tasks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskColumn, setNewTaskColumn] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // Define the columns
  const columns = [
    { id: 'todo', title: 'À faire' },
    { id: 'in-progress', title: 'En cours' },
    { id: 'done', title: 'Terminé' },
  ];

  // Setup sensors for drag events
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        // In real app, this would be an API call
        setBoard({
          id,
          name: 'Développement Application Mobile',
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError({
          message: 'Impossible de récupérer les données du tableau.',
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Find which column a task belongs to
  const findColumnOfTask = (taskId) => {
    const task = tasks.find((task) => task.id === taskId);
    return task ? task.status : null;
  };

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

  const handleAddTask = (columnId) => {
    setNewTaskColumn(columnId);
    setNewTaskTitle('');
    setNewTaskDescription('');
    document.getElementById('create-task-modal').showModal();
  };
  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `task${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDescription.trim() || null,
      status: newTaskColumn,
    };

    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
  };

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditingTaskId(taskId);
      setEditTaskTitle(taskToEdit.title);
      setEditTaskDescription(taskToEdit.description || '');
      // Ouvrir le modal d'édition
      document.getElementById('edit-task-modal').showModal();
    }
  };

  const handleSaveEditTask = () => {
    if (!editTaskTitle.trim()) return;

    setTasks(
      tasks.map((task) =>
        task.id === editingTaskId
          ? {
              ...task,
              title: editTaskTitle,
              description: editTaskDescription.trim() || null,
            }
          : task
      )
    );

    // Fermer le modal et réinitialiser l'état
    document.getElementById('edit-task-modal').close();
    setEditingTaskId(null);
  };

  // Ajout des états pour la modal de confirmation de suppression
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deletingTask, setDeletingTask] = useState(false);

  // Fonction de suppression de tâche modifiée
  const handleDeleteTask = (taskId) => {
    // Stocker l'ID de la tâche à supprimer et ouvrir la modal
    const taskToDelete = tasks.find((task) => task.id === taskId);
    setTaskToDelete(taskToDelete);
    document.getElementById('delete-task-modal').showModal();
  };

  // Fonction pour confirmer la suppression
  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setDeletingTask(true);
      setTasks(tasks.filter((task) => task.id !== taskToDelete.id));

      // Fermer la modal après la suppression
      setTimeout(() => {
        document.getElementById('delete-task-modal').close();
        setTaskToDelete(null);
        setDeletingTask(false);
      }, 300);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[60vh]'>
        <div className='loading loading-spinner loading-lg text-primary'></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!board) {
    return <div>Board not found</div>;
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>{board.name}</h1>
        <div className='flex gap-2'>
          <button className='btn btn-outline btn-primary'>Paramètres</button>
          <button className='btn' onClick={() => router.push('/')}>
            <FaHome className='mr-2' /> Tableau de bord
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[]}
      >
        <div className='flex space-x-4 overflow-x-auto pb-4 items-start'>
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.status === column.id)}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask} // Ajout de la fonction de suppression
              activeId={activeId}
            />
          ))}
        </div>
      </DndContext>

      {/* Modal for adding new tasks */}
      <dialog
        id='create-task-modal'
        className='modal modal-bottom sm:modal-middle'
      >
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Nouvelle tâche</h3>
          <div className='form-control mt-4'>
            <label className='label'>
              <span className='label-text'>Titre de la tâche</span>
            </label>
            <input
              type='text'
              placeholder='Entrez le titre de la tâche'
              className='input input-bordered'
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
            />
          </div>

          {/* Nouveau champ pour la description */}
          <div className='form-control mt-4'>
            <label className='label'>
              <span className='label-text'>Description (optionnelle)</span>
            </label>
            <textarea
              placeholder='Entrez une description pour cette tâche'
              className='textarea textarea-bordered h-24'
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
          </div>

          <div className='modal-action'>
            <button
              type='button'
              className='btn'
              onClick={() =>
                document.getElementById('create-task-modal').close()
              }
            >
              Annuler
            </button>
            <button
              type='button'
              className='btn btn-primary'
              onClick={() => {
                handleCreateTask();
                document.getElementById('create-task-modal').close();
              }}
            >
              Créer
            </button>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>Fermer</button>
        </form>
      </dialog>
      <dialog
        id='edit-task-modal'
        className='modal modal-bottom sm:modal-middle'
      >
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Modifier la tâche</h3>
          <div className='form-control mt-4'>
            <label className='label'>
              <span className='label-text'>Titre de la tâche</span>
            </label>
            <input
              type='text'
              placeholder='Titre de la tâche'
              className='input input-bordered'
              value={editTaskTitle}
              onChange={(e) => setEditTaskTitle(e.target.value)}
              required
            />
          </div>

          <div className='form-control mt-4'>
            <label className='label'>
              <span className='label-text'>Description (optionnelle)</span>
            </label>
            <textarea
              placeholder='Description de la tâche'
              className='textarea textarea-bordered h-24'
              value={editTaskDescription}
              onChange={(e) => setEditTaskDescription(e.target.value)}
            />
          </div>

          <div className='modal-action'>
            <button
              type='button'
              className='btn'
              onClick={() => document.getElementById('edit-task-modal').close()}
            >
              Annuler
            </button>
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleSaveEditTask}
            >
              Sauvegarder
            </button>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>Fermer</button>
        </form>
      </dialog>

      {/* Ajouter cette modal de confirmation de suppression */}
      <dialog
        id='delete-task-modal'
        className='modal modal-bottom sm:modal-middle'
      >
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Confirmer la suppression</h3>
          <p className='py-4'>
            {taskToDelete ? (
              <>
                Êtes-vous sûr de vouloir supprimer la tâche{' '}
                <span className='font-semibold'>"{taskToDelete.title}"</span> ?
                <br />
                <span className='text-sm text-warning mt-2 block'>
                  Cette action est irréversible.
                </span>
              </>
            ) : (
              'Êtes-vous sûr de vouloir supprimer cette tâche ?'
            )}
          </p>
          <div className='modal-action'>
            <button
              type='button'
              className='btn'
              onClick={() =>
                document.getElementById('delete-task-modal').close()
              }
              disabled={deletingTask}
            >
              Annuler
            </button>
            <button
              type='button'
              className='btn btn-error'
              onClick={confirmDeleteTask}
              disabled={deletingTask}
            >
              {deletingTask ? (
                <span className='loading loading-spinner loading-sm'></span>
              ) : (
                'Supprimer'
              )}
            </button>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button disabled={deletingTask}>Fermer</button>
        </form>
      </dialog>
    </div>
  );
};

export default BoardPage;
