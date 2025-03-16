'use client';
import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

export default function LoginModal() {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
      <div className='bg-base-100 p-8 rounded-lg shadow-xl max-w-md w-full'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          Connexion requise
        </h2>
        <p className='mb-6 text-center'>
          Veuillez vous connecter pour accéder à votre tableau de bord.
        </p>
        <div className='flex justify-center'>
          <button
            onClick={() => signIn('google')}
            className='btn btn-primary gap-2'
          >
            <FaGoogle /> Se connecter avec Google
          </button>
        </div>
      </div>
    </div>
  );
}
