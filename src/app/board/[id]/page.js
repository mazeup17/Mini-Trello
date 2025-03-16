'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FaExclamationTriangle,
  FaLock,
  FaUserShield,
  FaServer,
  FaHome,
} from 'react-icons/fa';

export default function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await fetch(`/api/board/${id}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw { status: response.status, message: errorData.error };
        }

        const data = await response.json();
        setBoard(data);
      } catch (error) {
        console.error('Erreur lors du chargement du board:', error);

        // Déterminer le type d'erreur en fonction du statut HTTP
        switch (error.status) {
          case 401:
            setError({
              type: 'unauthorized',
              title: 'Non authentifié',
              message: 'Veuillez vous connecter pour accéder à ce tableau.',
              icon: <FaUserShield className='text-5xl text-warning mb-4' />,
              redirect: true,
            });
            break;
          case 403:
            setError({
              type: 'forbidden',
              title: 'Accès refusé',
              message: "Vous n'avez pas l'autorisation d'accéder à ce tableau.",
              icon: <FaLock className='text-5xl text-error mb-4' />,
              redirect: true,
            });
            break;
          case 404:
            setError({
              type: 'notFound',
              title: 'Tableau introuvable',
              message: "Ce tableau n'existe pas ou a été supprimé.",
              icon: (
                <FaExclamationTriangle className='text-5xl text-warning mb-4' />
              ),
            });
            break;
          default:
            setError({
              type: 'server',
              title: 'Erreur serveur',
              message: 'Une erreur est survenue lors du chargement du tableau.',
              icon: <FaServer className='text-5xl text-error mb-4' />,
            });
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBoard();
    }
  }, [id]);

  // Effet pour gérer la redirection
  useEffect(() => {
    if (error?.redirect) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, router]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[60vh]'>
        <div className='card w-96 bg-base-100 shadow-xl'>
          <div className='card-body items-center text-center'>
            <div className='loading loading-spinner loading-lg text-primary mb-4'></div>
            <h2 className='card-title text-2xl'>Chargement en cours</h2>
            <p>Récupération des données du tableau...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-[60vh]'>
        <div className='card w-96 bg-base-100 shadow-xl'>
          <div className='card-body items-center text-center'>
            {error.icon}
            <h2 className='card-title text-2xl mb-2'>{error.title}</h2>
            <p className='mb-4'>{error.message}</p>

            {error.redirect && (
              <div className='alert alert-warning mt-2 mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='stroke-current shrink-0 h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
                <span>
                  Redirection vers la page d'accueil dans quelques secondes
                </span>
              </div>
            )}

            <div className='card-actions justify-center'>
              <button
                className='btn btn-primary'
                onClick={() => router.push('/')}
              >
                <FaHome className='mr-2' /> Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className='flex justify-center items-center min-h-[60vh]'>
        <div className='card w-96 bg-base-100 shadow-xl'>
          <div className='card-body items-center text-center'>
            <FaExclamationTriangle className='text-5xl text-warning mb-4' />
            <h2 className='card-title text-2xl mb-2'>Données introuvables</h2>
            <p className='mb-4'>
              Les données du tableau n'ont pas pu être chargées.
            </p>
            <div className='card-actions justify-center'>
              <button
                className='btn btn-primary'
                onClick={() => router.push('/')}
              >
                <FaHome className='mr-2' /> Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4'>
      <h1 className='text-3xl font-bold mb-6'>{board.name}</h1>
      <div>{/* Ici vous pourrez afficher les tâches du board */}</div>
    </div>
  );
}
