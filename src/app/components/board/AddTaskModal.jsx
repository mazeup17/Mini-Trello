'use client';

import { useState, useEffect } from 'react';

export default function AddTaskModal({ onAddTask }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [columnId, setColumnId] = useState(null);

  const resetForm = () => {
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim() || !columnId) return;

    const taskData = {
      title: newTaskTitle,
      description: newTaskDescription.trim() || null,
      status: columnId,
    };

    onAddTask(taskData);
    resetForm();
    document.getElementById('create-task-modal').close();
  };

  // Méthode pour ouvrir la modal avec les données de colonne
  const openModal = (colId) => {
    setColumnId(colId);
    resetForm();
    document.getElementById('create-task-modal').showModal();
  };

  // Exposer la méthode openModal
  useEffect(() => {
    window.openAddTaskModal = openModal;

    return () => {
      delete window.openAddTaskModal;
    };
  }, []);

  return (
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
            onClick={() => document.getElementById('create-task-modal').close()}
          >
            Annuler
          </button>
          <button
            type='button'
            className='btn btn-primary'
            onClick={handleCreateTask}
          >
            Créer
          </button>
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>Fermer</button>
      </form>
    </dialog>
  );
}
