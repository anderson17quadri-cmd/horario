import { useState, useRef, useEffect } from 'react';
import { EMPLOYEES, getDaysInMonth, generateShiftForDay } from './scheduleConfig';
import MonthNavigator from './components/MonthNavigator';
import ShiftLegend from './components/ShiftLegend';
import ScheduleTable from './components/ScheduleTable';
import AddEmployeeModal from './components/AddEmployeeModal';
import VacationModal from './components/VacationModal';
import EmployeeFolgaModal from './components/EmployeeFolgaModal';
import SyncFolgaModal from './components/SyncFolgaModal';
import ShareModal from './components/ShareModal';
import { Share2, Link2, Palmtree, UserPlus, CalendarDays } from 'lucide-react';

function EmpModal({emp,onClose,onFolga,onRename,onDelete}){
  const [editing,setEditing]=useState(false);
  const [name,setName]=useState(emp);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
        {editing?(
          <>
            <h2 className="text-lg font-bold mb-4">Editar Nome</h2>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4" autoFocus />
            <div className="flex gap-2">
              <button onClick={()=>setEditing(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm">Cancelar</button>
              <button onClick={()=>onRename(emp,name)} className="flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-bold">Guardar</button>
            </div>
          </>
        ):(
          <>
            <h2 className="text-lg font-bold mb-4">{emp}</h2>
            <button onClick={()=>onFolga(emp)} className="w-full py-2 mb-2 rounded-lg bg-green-500 text-white font-bold">Editar Folgas</button>
            <button onClick={()=>setEditing(true)} className="w-full py-2 mb-2 rounded-lg bg-blue-100 text-blue-600 font-bold">Renomear</button>
            <button onClick={()=>onDelete(emp)} className="w-full py-2 mb-2 rounded-lg bg-red-100 text-red-600 font-bold">Excluir</button>
            <button onClick={onClose} className="w-full py-2 rounded-lg border border-gray-200 text-gray-600">Cancelar</button>
          </>
        )}
      </div>
    </div>
  );
}

const SK='shiftflow';
function load(){try{return JSON.parse(localStorage.getItem(SK))||{};}catch{return {};}}
function save(d){localStorage.setItem(SK,JSON.stringify(d));}

function buildWAText(e,sch,year,month){
  const days=getDaysInMonth(year,month);
  const mn=['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const dows=['Dom','Seg','Ter','Qua','Qui','Sex','Sab'];
  const SUN=String.fromCodePoint(0x2600,0xFE0F);
  const CHECK=String.fromCodePoint(0x2705);
  const RED=String.fromCodePoint(0x1F534);
  const B='*';
  let t=B+'HORARIO DE TRABALHO'+B+'\n';
  t+=B+e+B+'\n';
  t+=B+mn[month]+' '+year+B+'\n\n';
  for(let d=1;d<=days;d++){
    const s=sch[e]?.[d]||'';
    if(!s||s==='VAZIO')continue;
    const dow=dows[new Date(year,month,d).getDay()];
    const isWE=new Date(year,month,d).getDay()===0||new Date(year,month,d).getDay()===6;
    const folga=s==='FOLGA'||s==='FOLGA_A'||s==='FERIAS';
    t+=(folga?CHECK:SUN)+' '+B+dow+' '+String(d).padStart(2,'0')+B+' - '+s.toLowerCase()+(isWE?' '+RED:'')+'\n';
  }
  return t;
}

export default function SchedulePage(){
  const [year,setYear]=useState(2026);
  const [month,setMonth]=useState(5);
  const [all,setAll]=useState(load);
  const [emps,setEmps]=useState(EMPLOYEES);
  const [showAdd,setShowAdd]=useState(false);
  const [showVac,setShowVac]=useState(false);
  const [showSync,setShowSync]=useState(false);
  const [showShare,setShowShare]=useState(false);
  const [folgaEmp,setFolgaEmp]=useState(null);
  const [editEmp,setEditEmp]=useState(null);
  const [gen,setGen]=useState(false);
  const tableRef=useRef(null);useEffect(()=>{document.body.style.overflow=(showShare||showAdd||showVac||showSync||editEmp||folgaEmp)?"hidden":"auto";},[showShare,showAdd,showVac,showSync,editEmp,folgaEmp]);
  const mk=year+'-'+month;
  const sch=all[mk]||{};
  function upd(s){const u={...all,[mk]:s};setAll(u);save(u);}
  function onCell(e,d,v){upd({...sch,[e]:{...sch[e],[d]:v}});}
  function onGenerate(){
    setGen(true);
    setTimeout(()=>{
      const na={...all};
      for(let m=0;m<12;m++){
        const k=year+'-'+m;
        const days=getDaysInMonth(year,m);
        const ms={};
        emps.forEach(emp=>{
          ms[emp]={};
          for(let d=1;d<=days;d++){
            const ex=all[k]?.[emp]?.[d];
            ms[emp][d]=(ex&&ex!=='VAZIO')?ex:generateShiftForDay(emp,year,m,d);
          }
        });
        na[k]=ms;
      }
      setAll(na);save(na);setGen(false);
    },100);
  }
  function onSave(){save(all);alert('Guardado!');}
  function onVac(e,s,en){const sc={...sch,[e]:{...sch[e]}};for(let d=s;d<=en;d++)sc[e][d]='FERIAS';upd(sc);}
  function onFolga(e,dias){const tot=getDaysInMonth(year,month);const sc={...sch,[e]:{...sch[e]}};for(let d=1;d<=tot;d++){sc[e][d]=dias.includes(d)?'FOLGA':generateShiftForDay(e,year,month,d);}upd(sc);}
  function onSync(e1,e2){const days=getDaysInMonth(year,month);const sc={...sch,[e2]:{...sch[e2]}};for(let d=1;d<=days;d++){const s=sch[e1]?.[d];if(s==='FOLGA'||s==='FOLGA_A')sc[e2][d]='FOLGA';}upd(sc);}
  function onRename(old,nw){setEmps(p=>p.map(x=>x===old?nw:x));setEditEmp(null);}
  function onDelete(e){setEmps(p=>p.filter(x=>x!==e));setEditEmp(null);}
  function onWA(){
    emps.forEach(e=>{
      const t=buildWAText(e,sch,year,month);
      window.open('https://wa.me/?text='+encodeURIComponent(t));
    });
  }
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-green-500 rounded-xl p-2"><CalendarDays size={22} className="text-white"/></div>
          <div>
            <div className="font-bold text-gray-800">Horarios</div>
            <div className="text-xs text-gray-400">Toque numa celula para editar</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>{window.scrollTo(0,0);setShowShare(true);}} className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 text-green-600"><Share2 size={18}/></button>
          <button onClick={()=>setShowSync(true)} className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600"><Link2 size={18}/></button>
          <button onClick={()=>setShowVac(true)} className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600"><Palmtree size={18}/></button>
          <button onClick={()=>setShowAdd(true)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"><UserPlus size={18}/></button>
        </div>
      </div>
      <MonthNavigator year={year} month={month} onChange={(y,m)=>{setYear(y);setMonth(m);}} />
      <ShiftLegend />
      <div ref={tableRef} style={{width:"max-content",minWidth:"100%"}}>
        <ScheduleTable year={year} month={month} schedule={sch} onChange={onCell} onEmployeeClick={e=>setEditEmp(e)} employees={emps} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 flex gap-2">
        <button onClick={onGenerate} disabled={gen} className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-300 text-gray-600 text-sm">{gen?'A gerar...':'Gerar Auto'}</button>
        <button onClick={onWA} className="flex-1 py-2 rounded-xl bg-green-100 text-green-700 text-sm font-bold">WhatsApp</button>
        <button onClick={onSave} className="flex-1 py-2 rounded-xl bg-green-500 text-white text-sm font-bold">Salvar</button>
      </div>
      {showAdd&&<AddEmployeeModal onClose={()=>setShowAdd(false)} onAdd={n=>setEmps(p=>[...p,n])} />}
      {showVac&&<VacationModal year={year} month={month} employees={emps} onClose={()=>setShowVac(false)} onApply={onVac} />}
      {folgaEmp&&<EmployeeFolgaModal employee={folgaEmp} year={year} month={month} schedule={sch} onClose={()=>setFolgaEmp(null)} onApply={onFolga} />}
      {showSync&&<SyncFolgaModal year={year} month={month} schedule={sch} employees={emps} onClose={()=>setShowSync(false)} onApply={onSync} />}
      {editEmp&&<EmpModal emp={editEmp} onClose={()=>setEditEmp(null)} onFolga={e=>{setFolgaEmp(e);setEditEmp(null);}} onRename={onRename} onDelete={onDelete} />}
      {showShare&&<ShareModal onClose={()=>setShowShare(false)} onWhatsApp={onWA} tableRef={tableRef} year={year} month={month} schedule={sch} employees={emps} />}
    </div>
  );
}
