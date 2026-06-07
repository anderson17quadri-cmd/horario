import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { getDaysInMonth } from '../scheduleConfig';
import html2canvas from 'html2canvas';

const MN=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DOWS=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function buildText(employees, schedule, year, month) {
  const days = getDaysInMonth(year, month);
  const SUN='☀️', CHECK='✅', RED='🔴';
  let out = '';
  employees.forEach(emp => {
    out += `*HORÁRIO - ${emp}*\n*${MN[month]} ${year}*\n\n`;
    for (let d = 1; d <= days; d++) {
      const s = schedule[emp]?.[d] || '';
      if (!s || s === 'VAZIO') continue;
      const dow = DOWS[new Date(year, month, d).getDay()];
      const isWE = new Date(year, month, d).getDay() === 0 || new Date(year, month, d).getDay() === 6;
      const folga = s === 'FOLGA' || s === 'FOLGA_A' || s === 'FERIAS';
      out += `${folga ? CHECK : SUN} *${dow} ${String(d).padStart(2,'0')}* - ${s.toLowerCase()}${isWE ? ' ' + RED : ''}\n`;
    }
    out += '\n---\n\n';
  });
  return out;
}

function buildCSV(employees, schedule, year, month) {
  const days = getDaysInMonth(year, month);
  const header = ['Dia', ...employees].join(',');
  const rows = [];
  for (let d = 1; d <= days; d++) {
    const dow = DOWS[new Date(year, month, d).getDay()];
    const row = [`${d} ${dow}`, ...employees.map(e => schedule[e]?.[d] || '')];
    rows.push(row.join(','));
  }
  return [header, ...rows].join('\n');
}

export default function ShareModal({ onClose, onWhatsApp, tableRef, year, month, schedule, employees }) {

  async function handleImage() {
    if (!tableRef?.current) return alert('Tabela não encontrada');
    // Encontra o div com overflow/maxHeight dentro do tableRef
    const scrollDiv = tableRef.current.querySelector('[style*="maxHeight"], [style*="max-height"], [style*="overflow"]');
    
    // Guarda os estilos originais
    let oldMaxHeight = '';
    let oldOverflowY = '';
    let oldOverflowX = '';
    if (scrollDiv) {
      oldMaxHeight = scrollDiv.style.maxHeight;
      oldOverflowY = scrollDiv.style.overflowY;
      oldOverflowX = scrollDiv.style.overflowX;
      // Remove as restrições temporariamente
      scrollDiv.style.maxHeight = 'none';
      scrollDiv.style.overflowY = 'visible';
      scrollDiv.style.overflowX = 'visible';
    }

    try {
      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: tableRef.current.scrollWidth,
        windowHeight: tableRef.current.scrollHeight,
      });
      const link = document.createElement('a');
      link.download = `horario-${MN[month]}-${year}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      alert('Erro ao gerar imagem: ' + e.message);
    } finally {
      // Restaura os estilos originais sempre, mesmo se der erro
      if (scrollDiv) {
        scrollDiv.style.maxHeight = oldMaxHeight;
        scrollDiv.style.overflowY = oldOverflowY;
        scrollDiv.style.overflowX = oldOverflowX;
      }
    }
  }

  async function handleCopy() {
    const text = buildText(employees, schedule, year, month);
    await navigator.clipboard.writeText(text);
    alert('Texto copiado!');
  }

  function handleCSV() {
    const csv = buildCSV(employees, schedule, year, month);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `horario-${MN[month]}-${year}.csv`;
    link.click();
  }

  const Btn = ({ onClick, color, emoji, label }) => (
    <button onClick={onClick} style={{
      width:'100%', padding:'12px', borderRadius:'10px', border:'none',
      backgroundColor: color, color:'white', fontWeight:'bold', cursor:'pointer',
      display:'flex', alignItems:'center', gap:'10px', fontSize:'14px', marginBottom:'8px'
    }}>
      <span>{emoji}</span> {label}
    </button>
  );

  const modal = (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'16px'}}>
      <div style={{backgroundColor:'white',borderRadius:'16px',padding:'20px',width:'100%',maxWidth:'360px',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
          <h2 style={{fontSize:'18px',fontWeight:'bold',margin:0}}>Partilhar Horário</h2>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'#6b7280',padding:'4px'}}>
            <X size={20}/>
          </button>
        </div>
        <p style={{fontSize:'12px',color:'#9ca3af',marginBottom:'16px'}}>{MN[month]} {year}</p>
        <Btn onClick={()=>{onWhatsApp();onClose();}} color="#22c55e" emoji="💬" label="Enviar via WhatsApp" />
        <Btn onClick={handleCopy} color="#3b82f6" emoji="📋" label="Copiar Texto" />
        <Btn onClick={handleImage} color="#8b5cf6" emoji="🖼️" label="Salvar como Imagem" />
        <Btn onClick={handleCSV} color="#10b981" emoji="📊" label="Exportar CSV (Sheets/Excel)" />
        <button onClick={onClose} style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid #e5e7eb',backgroundColor:'white',color:'#6b7280',cursor:'pointer',fontWeight:'500'}}>
          Cancelar
        </button>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
