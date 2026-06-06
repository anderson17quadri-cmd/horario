import { useState } from 'react';
import { getDaysInMonth } from '../scheduleConfig';
export default function EmployeeFolgaModal({ employee, year, month, schedule, onClose, onApply }) {
  const days = getDaysInMonth(year, month);
  const [selectedDays, setSelectedDays] = useState(() => {
    const f=[];
    for(let d=1;d<=days;d++){if(schedule[employee]?.[d]==='FOLGA'||schedule[employee]?.[d]==='FOLGA_A')f.push(d);}
    return f;
  });
  function toggle(day){setSelectedDays(prev=>prev.includes(day)?prev.filter(d=>d!==day):[...prev,day]);}
  const firstDow=new Date(year,month,1).getDay();
  const DAYS=['D','S','T','Q','Q','S','S'];
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl'>
        <h2 className='text-lg font-bold text-gray-800 mb-1'>Folgas de {employee}</h2>
        <p className='text-xs text-gray-500 mb-3'>Toca nos dias de folga. O resto preenche automaticamente.</p>
        <div className='grid grid-cols-7 gap-1 mb-4'>
          {DAYS.map((d,i)=><div key={i} className='text-center text-xs font-bold text-gray-400'>{d}</div>)}
          {Array.from({length:firstDow}).map((_,i)=><div key={'e'+i}/>)}
          {Array.from({length:days},(_,i)=>i+1).map(day=>{
            const sel=selectedDays.includes(day);
            return <button key={day} onClick={()=>toggle(day)} className={'rounded-full w-8 h-8 text-xs font-bold mx-auto flex items-center justify-center '+(sel?'bg-green-500 text-white':'bg-gray-100 text-gray-700')}>{day}</button>;
          })}
        </div>
        <div className='flex gap-2'>
          <button onClick={onClose} className='flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm'>Cancelar</button>
          <button onClick={()=>{onApply(employee,selectedDays);onClose();}} className='flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-bold'>Aplicar</button>
        </div>
      </div>
    </div>
  );
}