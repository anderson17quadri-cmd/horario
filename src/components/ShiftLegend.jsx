import { SHIFTS } from '../scheduleConfig';
export default function ShiftLegend() {
  const items = ['MANHA','NOITE','PAO','FOLGA','FOLGA_A','FERIAS'];
  return (
    <div className='flex flex-wrap gap-2 p-3 bg-white rounded-xl shadow-sm mx-2 mb-2'>
      {items.map(key => (
        <div key={key} className='flex items-center gap-1'>
          <span className={'w-4 h-4 rounded '+SHIFTS[key].color.split(' ')[0]}></span>
          <span className='text-xs text-gray-600'>{SHIFTS[key].label}</span>
        </div>
      ))}
    </div>
  );
}