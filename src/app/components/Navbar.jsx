'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className='p-4 bg-gray-800 text-white flex justify-between'>
      <h1 className='text-xl font-bold'>Mini Trello</h1>
      {session ? (
        <div className='flex gap-4'>
          <p>Bienvenue, {session.user?.name}</p>
          <button
            onClick={() => signOut()}
            className='bg-red-500 px-3 py-1 rounded'
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn('google')}
          className='bg-blue-500 px-3 py-1 rounded'
        >
          Connexion
        </button>
      )}
    </nav>
  );
}
