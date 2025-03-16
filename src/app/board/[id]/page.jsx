'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import BoardLoading from '@/app/components/board/BoardLoading';
import BoardError from '@/app/components/board/BoardError';
import TaskColumns from '@/app/components/board/TaskColumns';
import AddTaskModal from '@/app/components/board/AddTaskModal';
import EditTaskModal from '@/app/components/board/EditTaskModal';
import DeleteTaskModal from '@/app/components/board/DeleteTaskModal';

const BoardPage = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Define the columns
  const columns = [
    { id: 'todo', title: 'À faire' },
    { id: 'in-progress', title: 'En cours' },
    { id: 'done', title: 'Terminé' },
  ];

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

  // Handlers for task operations
  const handleAddTask = (taskData) => {
    const newTask = {
      id: `task${Date.now()}`,
      ...taskData,
    };

    setTasks([...tasks, newTask]);
  };

  const handleEditTask = (updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Pour ouvrir la modal d'ajout de tâche
  const openAddTaskModal = (columnId) => {
    if (window.openAddTaskModal) {
      window.openAddTaskModal(columnId);
    }
  };

  // Pour ouvrir la modal d'édition
  const handleOpenEditModal = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && window.openEditTaskModal) {
      window.openEditTaskModal(task);
    }
  };

  // Pour ouvrir la modal de suppression
  const handleOpenDeleteModal = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && window.openDeleteTaskModal) {
      window.openDeleteTaskModal(task);
    }
  };

  if (loading) {
    return <BoardLoading />;
  }

  if (error) {
    return <BoardError message={error.message} />;
  }

  if (!board) {
    return <BoardError message='Tableau non trouvé' />;
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold'>{board.name}</h1>
      <TaskColumns
        tasks={tasks}
        setTasks={setTasks}
        columns={columns}
        onAddTask={openAddTaskModal}
        onEditTask={handleOpenEditModal}
        onDeleteTask={handleOpenDeleteModal}
      />

      <AddTaskModal onAddTask={handleAddTask} />
      <EditTaskModal onEditTask={handleEditTask} />
      <DeleteTaskModal onDeleteTask={handleDeleteTask} />
    </div>
  );
};

export default BoardPage;
