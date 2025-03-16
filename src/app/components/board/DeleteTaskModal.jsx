'use client';

import { useState, useEffect } from 'react';

export default function DeleteTaskModal({ onDeleteTask }) {
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deletingTask, setDeletingTask] = useState(false);

  const handleConfirmDelete = () => {
    if (taskToDelete && !deletingTask) {
      setDeletingTask(true);

      setTimeout(() => {
        onDeleteTask(taskToDelete.id);
        document.getElementById('delete-task-modal').close();
        setTaskToDelete(null);
        setDeletingTask(false);
      }, 300);
    }
  };

  // Méthode pour ouvrir la modal avec les données de la tâche
  const openModal = (task) => {
    setTaskToDelete(task);
    document.getElementById('delete-task-modal').showModal();
  };

  // Exposer la méthode openModal
  useEffect(() => {
    window.openDeleteTaskModal = openModal;

    return () => {
      delete window.openDeleteTaskModal;
    };
  }, []);

  return (
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
            onClick={() => document.getElementById('delete-task-modal').close()}
            disabled={deletingTask}
          >
            Annuler
          </button>
          <button
            type='button'
            className='btn btn-error'
            onClick={handleConfirmDelete}
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
  );
}
