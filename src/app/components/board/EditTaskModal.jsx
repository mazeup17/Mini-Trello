'use client';

import { useState, useEffect } from 'react';

export default function EditTaskModal({ onEditTask }) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');

  const handleSaveEditTask = () => {
    if (!editTaskTitle.trim() || !editingTaskId) return;

    const updatedTask = {
      id: editingTaskId,
      title: editTaskTitle,
      description: editTaskDescription.trim() || null,
    };

    onEditTask(updatedTask);
    document.getElementById('edit-task-modal').close();
    resetForm();
  };

  const resetForm = () => {
    setEditingTaskId(null);
    setEditTaskTitle('');
    setEditTaskDescription('');
  };

  // Méthode pour ouvrir la modal avec les données de la tâche
  const openModal = (task) => {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || '');
    document.getElementById('edit-task-modal').showModal();
  };

  // Exposer la méthode openModal
  useEffect(() => {
    window.openEditTaskModal = openModal;

    return () => {
      delete window.openEditTaskModal;
    };
  }, []);

  return (
    <dialog id='edit-task-modal' className='modal modal-bottom sm:modal-middle'>
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
            onClick={() => {
              document.getElementById('edit-task-modal').close();
              resetForm();
            }}
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
  );
}
