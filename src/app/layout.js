import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from './components/Navbar';
import './globals.css';
import Providers from './components/Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Mini Trello',
  description: 'Créer des boards pour toi et tes amis',
};

export default function RootLayout({ children }) {
  return (
    <html lang='fr'>
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  );
}
