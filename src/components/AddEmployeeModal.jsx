import { useState } from 'react';
export default function AddEmployeeModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl'>
        <h2 className='text-lg font-bold text-gray-800 mb-4'>Adicionar Funcionário</h2>
        <input type='text' placeholder='Nome' value={name} onChange={e=>setName(e.target.value)} className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-400' autoFocus />
        <div className='flex gap-2'>
          <button onClick={onClose} className='flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm'>Cancelar</button>
          <button onClick={()=>{if(name.trim()){onAdd(name.trim());onClose();}}} className='flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-bold'>Adicionar</button>
        </div>
      </div>
    </div>
  );
}