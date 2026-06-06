import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageCircle, Image, FileText, Table } from 'lucide-react';
import { getDaysInMonth } from '../scheduleConfig';

export default function ShareModal({ onClose, onWhatsApp, tableRef, year, month, schedule, employees }) {
  const [loading, setLoading] = useState(null);
  const mn = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  async function handleImage() {
    setLoading('image');
    try {
      const domtoimage = (await import('dom-to-image')).default;
      const node = tableRef.current;
      const dataUrl = await domtoimage.toPng(node, {
        bgcolor: '#ffffff',
        width: node.scrollWidth,
        height: node.scrollHeight,
        style: { overflow: 'visible', width: node.scrollWidth+'px' }
      });
      const link = document.createElement('a');
      link.download = 'horario-'+mn[month]+'-'+year+'.png';
      link.href = dataUrl;
      link.click();
    } catch(e) { alert('Erro: '+e.message); }
    setLoading(null);
  }

  async function handlePDF() {
    setLoading('pdf');
    try {
      const domtoimage = (await import('dom-to-image')).default;
      const { jsPDF } = await import('jspdf');
      const node = tableRef.current;
      const dataUrl = await domtoimage.toPng(node, {
        bgcolor: '#ffffff',
        width: node.scrollWidth,
        height: node.scrollHeight,
        style: { overflow: 'visible', width: node.scrollWidth+'px' }
      });
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const w = pdf.internal.pageSize.getWidth();
      const img = new window.Image();
      img.src = dataUrl;
      await new Promise(r => img.onload = r);
      const h = (img.height * w) / img.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, w, h);
      pdf.save('horario-'+mn[month]+'-'+year+'.pdf');
    } catch(e) { alert('Erro: '+e.message); }
    setLoading(null);
  }

  function handleCSV() {
    const days = getDaysInMonth(year, month);
    const dows = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'];
    let csv = 'Dia,DiaSemana,'+employees.join(',')+'\n';
    for (let d = 1; d <= days; d++) {
      const dow = dows[new Date(year, month, d).getDay()];
      const row = [d, dow, ...employees.map(e => schedule[e]?.[d] || '')];
      csv += row.join(',') + '\n';
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'horario-'+mn[month]+'-'+year+'.csv';
    link.click();
  }

  const modal = (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'16px'}}>
      <div style={{backgroundColor:'white',borderRadius:'16px',padding:'20px',width:'100%',maxWidth:'360px',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
          <h2 style={{fontSize:'18px',fontWeight:'bold',color:'#1f2937'}}>Partilhar Horario</h2>
          <button onClick={onClose} style={{color:'#9ca3af',background:'none',border:'none',cursor:'pointer'}}><X size={20}/></button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <button onClick={()=>{onWhatsApp();onClose();}} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',borderRadius:'12px',backgroundColor:'#f0fdf4',color:'#15803d',fontWeight:'600',border:'none',cursor:'pointer',fontSize:'15px'}}>
            <MessageCircle size={22}/> WhatsApp (por funcionario)
          </button>
          <button onClick={handleImage} disabled={loading==='image'} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',borderRadius:'12px',backgroundColor:'#eff6ff',color:'#1d4ed8',fontWeight:'600',border:'none',cursor:'pointer',fontSize:'15px'}}>
            <Image size={22}/> {loading==='image'?'A gerar...':'Guardar como Imagem'}
          </button>
          <button onClick={handlePDF} disabled={loading==='pdf'} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',borderRadius:'12px',backgroundColor:'#fef2f2',color:'#b91c1c',fontWeight:'600',border:'none',cursor:'pointer',fontSize:'15px'}}>
            <FileText size={22}/> {loading==='pdf'?'A gerar...':'Guardar como PDF'}
          </button>
          <button onClick={handleCSV} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px',borderRadius:'12px',backgroundColor:'#ecfdf5',color:'#065f46',fontWeight:'600',border:'none',cursor:'pointer',fontSize:'15px'}}>
            <Table size={22}/> Exportar para Sheets (CSV)
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
