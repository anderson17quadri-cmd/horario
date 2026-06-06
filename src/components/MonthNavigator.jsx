const MONTHS=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
export default function MonthNavigator({ year, month, onChange }) {
  function prev() { if(month===0) onChange(year-1,11); else onChange(year,month-1); }
  function next() { if(month===11) onChange(year+1,0); else onChange(year,month+1); }
  return (
    <div className='flex items-center justify-center gap-6 py-3 bg-white rounded-xl shadow-sm mx-2 mb-2'>
      <button onClick={prev} className='text-2xl font-bold text-gray-500 px-2'>‹</button>
      <div className='text-center'>
        <div className='text-lg font-bold text-gray-800'>{MONTHS[month]}</div>
        <div className='text-sm text-gray-400'>{year}</div>
      </div>
      <button onClick={next} className='text-2xl font-bold text-gray-500 px-2'>›</button>
    </div>
  );
}