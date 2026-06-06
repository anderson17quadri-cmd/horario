import { useState } from 'react';
import { getDaysInMonth } from '../scheduleConfig';
export default function SyncFolgaModal({ year, month, schedule, employees, onClose, onApply }) {
  const [emp1, setEmp1] = useState(employees[0]);
  const [emp2, setEmp2] = useState(employees[1]);
  const days = getDaysInMonth(year, month);
  const preview=[];
  for(let d=1;d<=days;d++){if(schedule[emp1]?.[d]==='FOLGA'||schedule[emp1]?.[d]==='FOLGA_A')preview.push(d);}
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl'>
        <h2 className='text-lg font-bold text-gray-800 mb-1'>🔗 Sincronizar Folgas</h2>
        <p className='text-xs text-gray-500 mb-3'>O 2º funcionário folga nos mesmos dias que o 1º.</p>
        <label className='text-sm text-gray-600 mb-1 block'>Referência</label>
        <select value={emp1} onChange={e=>setEmp1(e.target.value)} className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3'>
          {employees.map(e=><option key={e} value={e}>{e}</option>)}
        </select>
        <label className='text-sm text-gray-600 mb-1 block'>A sincronizar</label>
        <select value={emp2} onChange={e=>setEmp2(e.target.value)} className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3'>
          {employees.filter(e=>e!==emp1).map(e=><option key={e} value={e}>{e}</option>)}
        </select>
        {preview.length>0&&<div className='bg-gray-50 rounded-lg p-3 mb-4'><p className='text-xs text-gray-500 mb-1'>Dias de folga para {emp2}:</p><div className='flex flex-wrap gap-1'>{preview.map(d=><span key={d} className='bg-green-100 text-green-700 text-xs rounded-full px-2 py-0.5 font-bold'>{d}</span>)}</div></div>}
        <div className='flex gap-2'>
          <button onClick={onClose} className='flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm'>Cancelar</button>
          <button onClick={()=>{onApply(emp1,emp2);onClose();}} className='flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-bold'>Confirmar</button>
        </div>
      </div>
    </div>
  );
}