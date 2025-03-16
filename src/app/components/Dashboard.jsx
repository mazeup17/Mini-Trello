'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoginModal from './LoginModal';
import { fetchBoards, createBoard } from '@/app/utils/board';
import {
  FaPlus,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaEllipsisH,
} from 'react-icons/fa';

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newBoardName, setNewBoardName] = useState('');
  const [creatingBoard, setCreatingBoard] = useState(false);

  // Charger les tableaux depuis l'API
  useEffect(() => {
    const loadBoards = async () => {
      if (session?.user?.id) {
        try {
          setIsLoading(true);
          const boardsData = await fetchBoards(session.user.id);
          setBoards(boardsData);
        } catch (error) {
          console.error('Erreur lors du chargement des tableaux:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      loadBoards();
    }
  }, [session, status]);

  // Fonction pour créer un nouveau tableau
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim() || !session?.user?.id) return;

    setCreatingBoard(true);

    try {
      const newBoard = await createBoard(session.user.id, {
        name: newBoardName,
      });

      // Ajouter le tableau au state
      setBoards([...boards, newBoard]);

      // Fermer la modal et réinitialiser le formulaire
      document.getElementById('create-board-modal').close();
      setNewBoardName('');

      // Rediriger vers la page du nouveau tableau
      router.push(`/board/${newBoard.id}`);
    } catch (error) {
      console.error('Échec de la création du tableau:', error);
      // Ici vous pourriez gérer les erreurs, afficher une notification
    } finally {
      setCreatingBoard(false);
    }
  };

  // Fonction pour naviguer vers un tableau
  const goToBoard = (boardId) => {
    router.push(`/board/${boardId}`);
  };

  // Afficher la modal de connexion si l'utilisateur n'est pas authentifié
  if (status === 'unauthenticated') {
    return <LoginModal />;
  }

  // Si chargement de la session en cours
  if (status === 'loading') {
    return (
      <div className='flex justify-center items-center h-screen'>
        <span className='loading loading-spinner loading-lg text-primary'></span>
      </div>
    );
  }

  return (
    <div className='p-4 max-w-7xl mx-auto'>
      <h2 className='text-3xl font-bold mb-6'>Tableau de bord</h2>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <span className='loading loading-spinner loading-lg text-primary'></span>
        </div>
      ) : (
        <>
          {/* Cartes statistiques */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
            <div className='stats shadow'>
              <div className='stat'>
                <div className='stat-figure text-primary'>
                  <FaClipboardList className='text-3xl' />
                </div>
                <div className='stat-title'>Total des tableaux</div>
                <div className='stat-value text-primary'>{boards.length}</div>
                <div className='stat-desc'>Espaces de travail actifs</div>
              </div>
            </div>

            <div className='stats shadow'>
              <div className='stat'>
                <div className='stat-figure text-secondary'>
                  <FaCheckCircle className='text-3xl' />
                </div>
                <div className='stat-title'>Tâches terminées</div>
                <div className='stat-value text-secondary'>
                  {boards.reduce(
                    (acc, board) => acc + (board.completedTasks || 0),
                    0
                  )}
                </div>
                <div className='stat-desc'>
                  Sur{' '}
                  {boards.reduce(
                    (acc, board) => acc + (board.totalTasks || 0),
                    0
                  )}{' '}
                  tâches
                </div>
              </div>
            </div>

            <div className='stats shadow'>
              <div className='stat'>
                <div className='stat-figure text-accent'>
                  <FaClock className='text-3xl' />
                </div>
                <div className='stat-title'>Tâches en attente</div>
                <div className='stat-value text-accent'>
                  {boards.reduce(
                    (acc, board) =>
                      acc +
                      ((board.totalTasks || 0) - (board.completedTasks || 0)),
                    0
                  )}
                </div>
                <div className='stat-desc'>À compléter</div>
              </div>
            </div>

            <div className='stats shadow'>
              <div className='stat'>
                <div className='stat-figure text-info'>
                  <div className='avatar'>
                    <div className='w-16 rounded-full'>
                      <img
                        src={
                          session?.user?.image ||
                          'https://via.placeholder.com/100'
                        }
                        alt='Avatar'
                      />
                    </div>
                  </div>
                </div>
                <div className='stat-value'>
                  {boards.reduce(
                    (acc, board) => acc + (board.totalTasks || 0),
                    0
                  ) > 0
                    ? Math.round(
                        (boards.reduce(
                          (acc, board) => acc + (board.completedTasks || 0),
                          0
                        ) /
                          boards.reduce(
                            (acc, board) => acc + (board.totalTasks || 0),
                            0
                          )) *
                          100
                      )
                    : 0}
                  %
                </div>
                <div className='stat-title'>Tâches accomplies</div>
                <div className='stat-desc text-info'>Bon travail!</div>
              </div>
            </div>
          </div>

          {/* Vos tableaux */}
          <h3 className='text-2xl font-bold mb-4'>Vos tableaux</h3>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
            {boards.map((board) => (
              <div key={board.id} className='card bg-base-100 shadow-xl'>
                <div className='card-body'>
                  <div className='flex justify-between items-center'>
                    <h2 className='card-title'>{board.name}</h2>
                    <div className='dropdown dropdown-end'>
                      <button tabIndex={0} className='btn btn-ghost btn-xs'>
                        <FaEllipsisH />
                      </button>
                      <ul
                        tabIndex={0}
                        className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
                      >
                        <li>
                          <a>Modifier</a>
                        </li>
                        <li>
                          <a>Supprimer</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className='mt-2'>
                    <progress
                      className='progress progress-primary w-full'
                      value={board.completedTasks || 0}
                      max={board.totalTasks || 0}
                    ></progress>
                    <p className='text-sm mt-1'>
                      {board.completedTasks || 0} sur {board.totalTasks || 0}{' '}
                      tâches terminées
                    </p>
                  </div>
                  <div className='card-actions justify-end mt-4'>
                    <button
                      className='btn btn-primary btn-sm'
                      onClick={() => goToBoard(board.id)}
                    >
                      Voir le tableau
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Carte pour créer un nouveau tableau */}
            <div className='card bg-base-100 shadow-xl'>
              <div className='card-body items-center text-center'>
                <h2 className='card-title'>Créer un nouveau tableau</h2>
                <p>Commencez à organiser vos tâches dès maintenant</p>
                <div className='card-actions justify-center mt-4'>
                  <button
                    className='btn btn-outline btn-primary'
                    onClick={() =>
                      document.getElementById('create-board-modal').showModal()
                    }
                  >
                    <FaPlus className='mr-2' /> Nouveau tableau
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activité récente */}
          <h3 className='text-2xl font-bold mb-4'>Activité récente</h3>
          <div className='card bg-base-100 shadow-xl'>
            <div className='card-body'>
              <div className='overflow-x-auto'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Tableau</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Tâche terminée: "Finaliser le design"</td>
                      <td>Design UX/UI</td>
                      <td>Aujourd'hui, 14:30</td>
                    </tr>
                    <tr>
                      <td>Nouveau tableau créé</td>
                      <td>Planification Stratégique</td>
                      <td>Hier, 09:15</td>
                    </tr>
                    <tr>
                      <td>Tâche ajoutée: "Optimiser le SEO"</td>
                      <td>Projet Marketing</td>
                      <td>Hier, 16:45</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal pour créer un nouveau tableau - using DaisyUI dialog */}
          <dialog
            id='create-board-modal'
            className='modal modal-bottom sm:modal-middle'
          >
            <div className='modal-box'>
              <h3 className='font-bold text-lg'>Créer un nouveau tableau</h3>
              <form onSubmit={handleCreateBoard}>
                <div className='form-control mt-4'>
                  <label className='label'>
                    <span className='label-text'>Nom du tableau</span>
                  </label>
                  <input
                    type='text'
                    placeholder='Entrez le nom du tableau'
                    className='input input-bordered'
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    required
                  />
                </div>
                <div className='modal-action'>
                  <button
                    type='button'
                    className='btn'
                    onClick={() =>
                      document.getElementById('create-board-modal').close()
                    }
                  >
                    Annuler
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary'
                    disabled={creatingBoard}
                  >
                    {creatingBoard ? (
                      <span className='loading loading-spinner loading-sm'></span>
                    ) : (
                      'Créer'
                    )}
                  </button>
                </div>
              </form>
            </div>
            <form method='dialog' className='modal-backdrop'>
              <button>Fermer</button>
            </form>
          </dialog>
        </>
      )}
    </div>
  );
}
