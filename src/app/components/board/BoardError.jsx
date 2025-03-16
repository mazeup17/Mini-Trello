export default function BoardError({ message }) {
  return (
    <div className='p-4 bg-error/10 border border-error rounded-lg my-4'>
      <h2 className='text-xl font-bold text-error mb-2'>Erreur</h2>
      <p>{message}</p>
    </div>
  );
}
