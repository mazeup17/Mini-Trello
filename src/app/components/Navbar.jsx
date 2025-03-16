'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div className='navbar bg-base-100 shadow-sm'>
      <div className='flex-1'>
        <Link href='/' className='btn btn-ghost text-xl'>
          Mini Trello
        </Link>
      </div>
      <div className='flex gap-2'>
        <div className='dropdown dropdown-end'>
          {session ? (
            <>
              <div
                tabIndex={0}
                role='button'
                className='btn btn-ghost btn-circle avatar'
              >
                <div className='w-10 rounded-full'>
                  <img
                    alt={session.user?.name || 'User profile'}
                    src={
                      session.user?.image || 'https://via.placeholder.com/100'
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow'
              >
                <li className='px-4 py-2 text-sm text-gray-500'>
                  Bonjour, {session.user?.name}
                </li>
                <li className='divider my-1'></li>
                <li>
                  <button onClick={() => signOut()}>Déconnexion</button>
                </li>
              </ul>
            </>
          ) : (
            <>
              <div
                tabIndex={0}
                role='button'
                className='btn btn-ghost btn-circle'
              >
                <FaUser size={20} />
              </div>
              <ul
                tabIndex={0}
                className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow'
              >
                <li>
                  <button onClick={() => signIn('google')}>Connexion</button>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
