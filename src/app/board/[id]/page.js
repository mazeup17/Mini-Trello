'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createTask, updateTask, deleteTask } from '@/app/utils/tasks';
import BoardLoading from '@/app/components/board/BoardLoading';
import BoardError from '@/app/components/board/BoardError';
import TaskColumns from '@/app/components/board/TaskColumns';
import AddTaskModal from '@/app/components/board/AddTaskModal';
import EditTaskModal from '@/app/components/board/EditTaskModal';
import DeleteTaskModal from '@/app/components/board/DeleteTaskModal';
import React from 'react';

export default function BoardPage({ params }) {
  // Unwrap params using React.use() to fix the warning
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the columns
  const columns = [
    { id: 'todo', title: 'À faire' },
    { id: 'in-progress', title: 'En cours' },
    { id: 'done', title: 'Terminé' },
  ];

  useEffect(() => {
    // Fetch board and tasks from API
    const fetchData = async () => {
      try {
        // Fetch board details
        const boardResponse = await fetch(`/api/board/${id}`);
        if (!boardResponse.ok) {
          const status = boardResponse.status;
          throw new Error(`Échec du chargement du tableau (${status})`);
        }
        const boardData = await boardResponse.json();
        setBoard(boardData);

        // Fetch tasks for this board
        const tasksResponse = await fetch(`/api/board/${id}/tasks`);
        if (!tasksResponse.ok) {
          const status = tasksResponse.status;
          const errorText = await tasksResponse.text();
          console.error('Task response error:', errorText);
          throw new Error(
            `Échec du chargement des tâches (${status}): ${errorText}`
          );
        }
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);

        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError({
          message: error.message || 'Impossible de récupérer les données.',
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handlers for task operations
  const handleAddTask = async (taskData) => {
    try {
      const newTask = await createTask(id, taskData);
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (updatedTaskData) => {
    try {
      const updatedTask = await updateTask(
        id,
        updatedTaskData.id,
        updatedTaskData
      );
      setTasks(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(id, taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
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
}
