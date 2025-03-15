import Navbar from './Navbar';

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className='p-4'>
        <h2 className='text-2xl font-bold'>Dashboard</h2>
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
}
