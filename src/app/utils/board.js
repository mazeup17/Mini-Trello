export async function fetchBoards(userId) {
  const response = await fetch(`/api/boards?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch boards');
  }
  return await response.json();
}

export async function createBoard(userId, boardData) {
  const response = await fetch(`/api/boards`, {
    method: 'POST',
    body: JSON.stringify({
      ...boardData,
      userId: userId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to create board');
  }

  return await response.json();
}
