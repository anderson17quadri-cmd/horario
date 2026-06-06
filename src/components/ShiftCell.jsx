import { SHIFTS } from '../scheduleConfig';
export default function ShiftCell({ value, onChange }) {
  const shift = SHIFTS[value] ?? SHIFTS.VAZIO;
  return (
    <div className={'relative rounded-lg border border-white/50 px-0.5 py-0.5 text-center font-semibold shadow-sm '+shift.color+' min-w-[44px]'}>
      <span className='pointer-events-none'>{shift.label || '—'}</span>
      <select className='absolute inset-0 w-full h-full opacity-0 cursor-pointer' value={value} onChange={e => onChange(e.target.value)}>
        {Object.keys(SHIFTS).map(key => (
          <option key={key} value={key}>{SHIFTS[key].label || '—'}</option>
        ))}
      </select>
    </div>
  );
}