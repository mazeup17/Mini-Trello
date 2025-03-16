/**
 * Crée une nouvelle tâche dans la base de données
 * @param {string} boardId - ID du tableau
 * @param {Object} taskData - Données de la tâche
 * @returns {Promise<Object>} - La tâche créée
 */
export const createTask = async (boardId, taskData) => {
  try {
    const response = await fetch(`/api/boards/${boardId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur ${response.status}: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    throw error;
  }
};

/**
 * Met à jour une tâche existante
 * @param {string} boardId - ID du tableau
 * @param {string} taskId - ID de la tâche
 * @param {Object} taskData - Données mises à jour
 * @returns {Promise<Object>} - La tâche mise à jour
 */
export const updateTask = async (boardId, taskId, taskData) => {
  try {
    const response = await fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur ${response.status}: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    throw error;
  }
};
