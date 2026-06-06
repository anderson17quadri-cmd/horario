import ShiftCell from './ShiftCell';
import { getDaysInMonth, getDayOfWeek, isHoliday, isWeekend } from '../scheduleConfig';

const MN=['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export default function ScheduleTable({ year, month, schedule, onChange, onEmployeeClick, employees }) {
  const days = getDaysInMonth(year, month);
  return (
    <div>
      <div style={{textAlign:'center',fontWeight:'bold',color:'#374151',fontSize:'15px',margin:'8px 8px 4px'}}>
        {MN[month]} de {year}
      </div>
      <div style={{overflowX:'auto',overflowY:'auto',maxHeight:'calc(100vh - 210px)',margin:'0 8px'}}>
        <table style={{borderCollapse:'collapse',fontSize:'11px',width:'max-content',minWidth:'100%'}}>
          <thead>
            <tr style={{backgroundColor:'#f9fafb',position:'sticky',top:0,zIndex:20}}>
              <th style={{position:'sticky',left:0,zIndex:30,backgroundColor:'#f9fafb',padding:'4px 4px',color:'#6b7280',fontWeight:'500',textAlign:'left',minWidth:'40px',borderBottom:'1px solid #e5e7eb'}}>DIA</th>
              {employees.map(emp => (
                <th key={emp} style={{padding:'4px 2px',color:'#374151',fontWeight:'600',textAlign:'center',minWidth:'52px',borderBottom:'1px solid #e5e7eb',backgroundColor:'#f9fafb'}}>
                  <button onClick={() => onEmployeeClick(emp)} style={{fontSize:'10px',fontWeight:'700',color:'#374151',background:'none',border:'none',cursor:'pointer',textTransform:'uppercase'}}>
                    {emp.slice(0,7)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({length:days},(_,i)=>i+1).map(day => {
              const holiday = isHoliday(year,month,day);
              const weekend = isWeekend(year,month,day);
              const dow = getDayOfWeek(year,month,day);
              return (
                <tr key={day} style={{borderTop:'1px solid #f3f4f6',backgroundColor:holiday?'#fef2f2':weekend?'#f9fafb':'white'}}>
                  <td style={{position:'sticky',left:0,zIndex:10,backgroundColor:holiday?'#fef2f2':weekend?'#f9fafb':'white',padding:'2px 4px'}}>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <span style={{fontWeight:'bold',fontSize:'11px',color:holiday?'#ef4444':weekend?'#f87171':'#374151'}}>{day}{holiday?' 🇵🇹':''}</span>
                      <span style={{fontSize:'9px',color:'#9ca3af'}}>{dow}</span>
                    </div>
                  </td>
                  {employees.map(emp => (
                    <td key={emp} style={{padding:'2px'}}>
                      <ShiftCell value={schedule[emp]?.[day]??'VAZIO'} onChange={val=>onChange(emp,day,val)} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
