
export const EMPLOYEES = ['Leandro','Anderson','João','Carlos','Ricardo','Juliana','Joaquim','Tiago'];
export const SHIFTS = {
  MANHA:{label:'MANHÃ',color:'bg-pink-200 text-pink-800'},
  NOITE:{label:'NOITE',color:'bg-purple-200 text-purple-800'},
  PAO:{label:'PÃO',color:'bg-blue-200 text-blue-800'},
  FOLGA:{label:'FOLGA',color:'bg-green-200 text-green-800'},
  FOLGA_A:{label:'FOLGA A.',color:'bg-yellow-200 text-yellow-800'},
  FERIAS:{label:'FÉRIAS',color:'bg-emerald-400 text-white'},
  VAZIO:{label:'',color:'bg-gray-100 text-gray-400'},
};
export const PT_HOLIDAYS_2026=['2026-01-01','2026-04-03','2026-04-05','2026-04-25','2026-05-01','2026-06-10','2026-08-15','2026-10-05','2026-11-01','2026-12-01','2026-12-08','2026-12-25'];
export const EMPLOYEE_OFFSETS={Leandro:0,Anderson:2,'João':4,Carlos:6,Ricardo:1,Juliana:3,Joaquim:5,Tiago:7};
export const CYCLE_LENGTH=8;
export function getDaysInMonth(y,m){return new Date(y,m+1,0).getDate();}
export function getDayOfWeek(y,m,d){return ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][new Date(y,m,d).getDay()];}
export function isHoliday(y,m,d){return PT_HOLIDAYS_2026.includes(y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'));}
export function isWeekend(y,m,d){const w=new Date(y,m,d).getDay();return w===0||w===6;}
export function generateShiftForDay(emp,y,m,d){
  const ref=new Date(2026,4,1);
  const tar=new Date(y,m,d);
  const diff=Math.round((tar-ref)/86400000);
  const off=EMPLOYEE_OFFSETS[emp]??0;
  const pos=((diff+off)%8+8)%8;
  if(pos>=6)return 'FOLGA';
  const def={Leandro:'NOITE',Anderson:'NOITE','João':'NOITE',Carlos:'PAO',Ricardo:'MANHA',Juliana:'MANHA',Joaquim:'NOITE',Tiago:'MANHA'};
  return def[emp]??'NOITE';
}
