import { useState } from 'react';
import { getDaysInMonth } from '../scheduleConfig';
export default function VacationModal({ year, month, employees, onClose, onApply }) {
  const [employee, setEmployee] = useState(employees[0]);
  const [startDay, setStartDay] = useState(1);
  const [endDay, setEndDay] = useState(15);
  const days = getDaysInMonth(year, month);
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl'>
        <h2 className='text-lg font-bold text-gray-800 mb-4'>🌴 Férias</h2>
        <label className='text-sm text-gray-600 mb-1 block'>Funcionário</label>
        <select value={employee} onChange={e=>setEmployee(e.target.value)} className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3'>
          {employees.map(e=><option key={e} value={e}>{e}</option>)}
        </select>
        <label className='text-sm text-gray-600 mb-1 block'>Dia início</label>
        <select value={startDay} onChange={e=>setStartDay(Number(e.target.value))} className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3'>
          {Array.from({length:days},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}
        </select>
        <label className='text-sm text-gray-600 mb-1 block'>Dia fim</label>
        <select value={endDay} onChange={e=>setEndDay(Number(e.target.value))} className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4'>
          {Array.from({length:days},(_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}
        </select>
        <div className='flex gap-2'>
          <button onClick={onClose} className='flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm'>Cancelar</button>
          <button onClick={()=>{onApply(employee,startDay,endDay);onClose();}} className='flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-bold'>Aplicar</button>
        </div>
      </div>
    </div>
  );
}