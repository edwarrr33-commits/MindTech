import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowRight, Bell, BookOpen, Brain, CalendarDays, Check, ChevronRight,
  CircleHelp, ClipboardCheck, Clock3, Compass, Heart, HeartPulse, Home, Leaf,
  LogOut, Menu, MessageCircle, Moon, MoreHorizontal, Plus, ShieldCheck, Sparkles,
  Target, TrendingUp, UserRound, X, BatteryLow, Wind, Sun, Coffee, Footprints
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { assessments, options, interpretation } from './data';

const icons = { activity: Activity, 'heart-pulse': HeartPulse, 'battery-low': BatteryLow };
const navItems = [
  ['Inicio', 'home', Home], ['Evaluaciones', 'assessments', ClipboardCheck],
  ['Mi progreso', 'progress', TrendingUp], ['Bienestar', 'wellbeing', Leaf]
];

function readResults() {
  try { return JSON.parse(localStorage.getItem('mindtech-results') || '[]'); } catch { return []; }
}
function saveResults(items) { localStorage.setItem('mindtech-results', JSON.stringify(items)); }

function App() {
  const [page, setPage] = useState('home');
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(readResults);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState(() => localStorage.getItem('mindtech-name') || 'Alex');
  const [toast, setToast] = useState('');
  const [breathing, setBreathing] = useState(false);

  useEffect(() => { saveResults(results); }, [results]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const latest = results[0];
  const chartData = useMemo(() => {
    const grouped = {};
    [...results].reverse().forEach((r) => {
      const d = new Date(r.date);
      const key = d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
      grouped[key] = grouped[key] || { date: key, stress: null, anxiety: null, burnout: null };
      grouped[key][r.type] = Math.round((r.score / r.max) * 100);
    });
    const data = Object.values(grouped);
    return data.length ? data : [
      { date: 'Lun', stress: 28, anxiety: 35, burnout: 22 },
      { date: 'Mar', stress: 42, anxiety: 31, burnout: 30 },
      { date: 'Mié', stress: 34, anxiety: 45, burnout: 28 },
      { date: 'Jue', stress: 38, anxiety: 36, burnout: 34 },
      { date: 'Vie', stress: 25, anxiety: 30, burnout: 24 }
    ];
  }, [results]);

  const navigate = (target) => { setPage(target); setActiveAssessment(null); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const startAssessment = (assessment) => { setAnswers({}); setActiveAssessment(assessment); setPage('assessment'); };
  const submitAssessment = () => {
    const score = Object.values(answers).reduce((a, b) => a + b, 0);
    const item = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), type: activeAssessment.id, title: activeAssessment.title, score, max: activeAssessment.questions.length * 4, date: new Date().toISOString() };
    setResults((prev) => [item, ...prev]);
    setActiveAssessment(null); setPage('result'); setToast('Evaluación guardada en este dispositivo');
  };

  const renderPage = () => {
    if (page === 'assessment' && activeAssessment) return <Assessment assessment={activeAssessment} answers={answers} setAnswers={setAnswers} onBack={() => navigate('assessments')} onSubmit={submitAssessment} />;
    if (page === 'result') return <Result result={results[0]} onAgain={() => navigate('assessments')} onProgress={() => navigate('progress')} />;
    if (page === 'assessments') return <Assessments onStart={startAssessment} results={results} />;
    if (page === 'progress') return <Progress results={results} chartData={chartData} />;
    if (page === 'wellbeing') return <Wellbeing breathing={breathing} setBreathing={setBreathing} />;
    return <Dashboard name={userName} results={results} chartData={chartData} onNavigate={navigate} onStart={startAssessment} />;
  };

  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Brain size={22}/></div><span>mind<span className="brand-accent">tech</span></span></div>
      <div className="workspace-label">TU ESPACIO</div>
      <nav>{navItems.map(([label, id, Icon]) => <button key={id} className={`nav-link ${page === id ? 'active' : ''}`} onClick={() => navigate(id)}><Icon size={18}/><span>{label}</span>{id === 'assessments' && <ChevronRight className="nav-chevron" size={15}/>}</button>)}</nav>
      <div className="sidebar-card"><div className="sidebar-card-icon"><Sparkles size={18}/></div><strong>Un momento para ti</strong><p>Pequeños pasos también construyen bienestar.</p><button onClick={() => navigate('wellbeing')}>Explorar <ArrowRight size={14}/></button></div>
      <div className="sidebar-bottom"><div className="privacy-note"><ShieldCheck size={16}/><span>Tus datos de este prototipo permanecen en este navegador.</span></div><button className="profile-mini" onClick={() => setProfileOpen(true)}><div className="avatar"> {userName.slice(0,1).toUpperCase()} </div><span><b>{userName}</b><small>Mi perfil</small></span><MoreHorizontal size={18}/></button></div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Menu size={20}/></button>
        <div className="breadcrumb">Espacio personal <span>/</span> <b>{navItems.find(n => n[1] === page)?.[0] || (page === 'assessment' ? 'Evaluación' : page === 'result' ? 'Resultado' : 'Bienestar')}</b></div>
        <div className="top-actions"><span className="today"><CalendarDays size={15}/>{new Date().toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })}</span><button className="icon-button notification" aria-label="Notificaciones" onClick={() => setToast('No tienes notificaciones nuevas')}><Bell size={18}/><i/></button><button className="top-avatar" onClick={() => setProfileOpen(true)}>{userName.slice(0,1).toUpperCase()}</button></div>
      </header>
      <div className="page-content">{renderPage()}</div>
      <footer className="footer"><span>© 2026 MindTech</span><span>Un espacio para cuidar de ti, a tu ritmo.</span><button onClick={() => setToast('Las evaluaciones son orientativas y no reemplazan una valoración profesional.')}>Aviso importante</button></footer>
    </main>

    {profileOpen && <div className="modal-backdrop" onClick={() => setProfileOpen(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-head"><h3>Tu perfil</h3><button className="icon-button" onClick={() => setProfileOpen(false)}><X size={18}/></button></div><label className="field-label">¿Cómo te llamamos?</label><input className="text-input" value={userName} onChange={e => setUserName(e.target.value)} maxLength={30}/><p className="muted small">Este nombre se guarda solamente en este navegador.</p><button className="primary-button full" onClick={() => { localStorage.setItem('mindtech-name', userName.trim() || 'Alex'); setUserName(userName.trim() || 'Alex'); setProfileOpen(false); setToast('Perfil actualizado'); }}>Guardar cambios</button></div></div>}
    {toast && <div className="toast"><Check size={17}/>{toast}</div>}
  </div>;
}

function PageHeading({eyebrow, title, subtitle, action}) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}
function Dashboard({name, results, chartData, onNavigate, onStart}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  const last = results[0];
  return <>
    <section className="welcome-banner"><div className="welcome-copy"><div className="welcome-tag"><Sparkles size={14}/> TU BIENESTAR IMPORTA</div><h1>{greeting}, {name} <span>✦</span></h1><p>Este es tu espacio para hacer una pausa, escucharte y avanzar a tu propio ritmo.</p><button className="white-button" onClick={() => onNavigate('wellbeing')}>Dedicarme un momento <ArrowRight size={16}/></button></div><div className="welcome-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-sun"><Sun size={42}/></div><div className="art-leaf leaf-one"><Leaf size={38}/></div><div className="art-leaf leaf-two"><Leaf size={30}/></div><div className="art-star">✦</div></div></section>
    <div className="section-title-row"><div><div className="eyebrow">TU RESUMEN</div><h2>¿Cómo vas hoy?</h2></div><button className="text-button" onClick={() => onNavigate('progress')}>Ver mi progreso <ArrowRight size={15}/></button></div>
    <div className="stat-grid">
      <StatCard icon={ClipboardCheck} tint="purple" label="Evaluaciones realizadas" value={results.length} detail={results.length ? 'Registros guardados' : 'Tu primer paso empieza aquí'}/>
      <StatCard icon={HeartPulse} tint="mint" label="Última evaluación" value={last ? new Date(last.date).toLocaleDateString('es-CO', { day:'numeric', month:'short' }) : '—'} detail={last ? last.title : 'Aún no tienes registros'}/>
      <StatCard icon={Target} tint="peach" label="Tu siguiente paso" value="5 min" detail="Un momento de autocuidado"/>
    </div>
    <div className="content-grid">
      <section className="panel chart-panel"><div className="panel-heading"><div><h3>Tu recorrido</h3><p>Una mirada a tus registros recientes</p></div><span className="soft-chip"><TrendingUp size={14}/> Seguimiento</span></div><div className="chart-legend"><span><i className="dot violet-dot"/> Estrés</span><span><i className="dot blue-dot"/> Ansiedad</span><span><i className="dot mint-dot"/> Agotamiento</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:8,right:8,left:-22,bottom:0}}><defs><linearGradient id="stressFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8877e8" stopOpacity={.22}/><stop offset="100%" stopColor="#8877e8" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#edf0f5" vertical={false}/><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill:'#9aa2b2',fontSize:11}}/><YAxis domain={[0,100]} axisLine={false} tickLine={false} tick={{fill:'#9aa2b2',fontSize:11}}/><Tooltip contentStyle={{border:'1px solid #edf0f5',borderRadius:12,fontSize:12}}/><Area connectNulls type="monotone" dataKey="stress" name="Estrés" stroke="#8877e8" fill="url(#stressFill)" strokeWidth={2.5}/><Area connectNulls type="monotone" dataKey="anxiety" name="Ansiedad" stroke="#64a6dc" fill="transparent" strokeWidth={2.5}/><Area connectNulls type="monotone" dataKey="burnout" name="Agotamiento" stroke="#65b99a" fill="transparent" strokeWidth={2.5}/></AreaChart></ResponsiveContainer></div><p className="chart-footnote">{results.length ? 'Los valores muestran el porcentaje de la puntuación máxima de cada cuestionario.' : 'Vista ilustrativa de ejemplo. Realiza una evaluación para comenzar tu propio seguimiento.'}</p></section>
      <section className="panel quick-panel"><div className="panel-heading"><div><h3>Empieza por aquí</h3><p>Elige lo que necesitas hoy</p></div></div><button className="quick-link" onClick={() => onNavigate('assessments')}><div className="quick-icon q-purple"><ClipboardCheck size={19}/></div><span><b>Conocer cómo me siento</b><small>Evaluaciones de bienestar</small></span><ChevronRight size={17}/></button><button className="quick-link" onClick={() => onNavigate('wellbeing')}><div className="quick-icon q-mint"><Wind size={19}/></div><span><b>Hacer una pausa</b><small>Ejercicios y actividades</small></span><ChevronRight size={17}/></button><button className="quick-link" onClick={() => onNavigate('progress')}><div className="quick-icon q-blue"><TrendingUp size={19}/></div><span><b>Revisar mi recorrido</b><small>Historial y tendencias</small></span><ChevronRight size={17}/></button><div className="quote-card"><span>“</span><p>No tienes que resolverlo todo hoy. Un paso a la vez también es avanzar.</p></div></section>
    </div>
    <div className="disclaimer"><ShieldCheck size={17}/><p><b>Recuerda:</b> MindTech es una herramienta de orientación y autoconocimiento. No realiza diagnósticos ni reemplaza el acompañamiento profesional.</p></div>
  </>;
}
function StatCard({icon: Icon, tint, label, value, detail}) {
  return <div className="stat-card"><div className={`stat-icon ${tint}`}><Icon size={19}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></div>;
}
function Assessments({onStart, results}) {
  return <><PageHeading eyebrow="AUTOCONOCIMIENTO" title="Conócete un poco más" subtitle="Responde con honestidad y sin juzgarte. No hay respuestas buenas ni malas."/><div className="assessment-intro"><div className="intro-icon"><Brain size={24}/></div><div><b>Un espacio seguro para escucharte</b><p>Estas preguntas te ayudan a reflexionar sobre cómo te has sentido recientemente. Responde pensando en las últimas dos semanas.</p></div></div><div className="assessment-grid">{assessments.map(a => { const Icon = icons[a.icon]; const count = results.filter(r => r.type === a.id).length; return <article className="assessment-card" key={a.id}><div className={`assessment-icon ${a.color}`}><Icon size={23}/></div><div className="assessment-meta"><span><Clock3 size={13}/>{a.duration}</span><span>{a.questions.length} preguntas</span></div><h3>{a.title}</h3><p>{a.subtitle}</p><div className="assessment-card-bottom"><span>{count ? `${count} ${count === 1 ? 'registro' : 'registros'}` : 'Aún sin realizar'}</span><button onClick={() => onStart(a)}>Comenzar <ArrowRight size={15}/></button></div></article>; })}</div><div className="disclaimer"><CircleHelp size={17}/><p>Los cuestionarios son orientativos y no equivalen a instrumentos clínicos validados. Si algo te preocupa, considera conversarlo con un profesional.</p></div></>;
}
function Assessment({assessment, answers, setAnswers, onBack, onSubmit}) {
  const completed = Object.keys(answers).length;
  const Icon = icons[assessment.icon];
  return <><button className="back-button" onClick={onBack}>← Volver a evaluaciones</button><div className="assessment-work"><div className="assessment-work-head"><div className={`assessment-icon ${assessment.color}`}><Icon size={24}/></div><div><div className="eyebrow">EVALUACIÓN DE BIENESTAR</div><h1>{assessment.title}</h1><p>Piensa en cómo te has sentido durante las últimas dos semanas.</p></div></div><div className="progress-line"><div style={{width:`${completed/assessment.questions.length*100}%`}}/></div><div className="progress-caption"><span>{completed} de {assessment.questions.length} respondidas</span><span>{Math.round(completed/assessment.questions.length*100)}%</span></div>{assessment.questions.map((q,i) => <div className="question-card" key={i}><div className="question-number">PREGUNTA {String(i+1).padStart(2,'0')}</div><h3>{q}</h3><div className="answer-options">{options.map(o => <button key={o.value} className={`answer-option ${answers[i] === o.value ? 'selected' : ''}`} onClick={() => setAnswers(prev => ({...prev,[i]:o.value}))}><span className="radio-dot"/>{o.label}</button>)}</div></div>)}<div className="assessment-submit"><span>{completed === assessment.questions.length ? '¡Ya respondiste todo!' : `Te ${assessment.questions.length-completed === 1 ? 'falta' : 'faltan'} ${assessment.questions.length-completed} ${assessment.questions.length-completed === 1 ? 'respuesta' : 'respuestas'}`}</span><button className="primary-button" disabled={completed !== assessment.questions.length} onClick={onSubmit}>Ver mi resultado <ArrowRight size={16}/></button></div></div></>;
}
function Result({result, onAgain, onProgress}) {
  if (!result) return <div className="empty-state"><Brain size={34}/><h2>Aún no hay resultados</h2><button className="primary-button" onClick={onAgain}>Hacer una evaluación</button></div>;
  const info = interpretation(result.score, result.max);
  const percent = Math.round(result.score/result.max*100);
  return <><PageHeading eyebrow="TU RESULTADO" title="Gracias por escucharte" subtitle="Este resultado es una oportunidad para reflexionar, no una etiqueta."/><div className="result-layout"><section className="panel result-main"><div className="result-check"><Check size={22}/></div><div className="eyebrow">EVALUACIÓN COMPLETADA</div><h2>{result.title}</h2><p className="muted">{new Date(result.date).toLocaleString('es-CO', {dateStyle:'long',timeStyle:'short'})}</p><div className="score-ring" style={{'--score':`${percent*3.6}deg`}}><div><strong>{percent}<small>%</small></strong><span>de puntuación</span></div></div><span className={`result-pill ${info.tone}`}>{info.label}</span><p className="result-description">{info.text}</p><div className="result-scale"><span>0 — Menor frecuencia</span><span>Mayor frecuencia — 100</span></div><div className="scale-track"><i style={{width:`${percent}%`}}/></div><div className="result-actions"><button className="primary-button" onClick={onAgain}>Otra evaluación <ArrowRight size={16}/></button><button className="secondary-button" onClick={onProgress}>Ver mi progreso</button></div></section><aside className="panel result-side"><div className="quick-icon q-mint"><Leaf size={20}/></div><h3>Un pequeño paso para hoy</h3><p>Elige una acción sencilla y realista que te ayude a cuidarte.</p><ul><li>Haz una pausa breve y respira con calma.</li><li>Habla con alguien de confianza sobre cómo te sientes.</li><li>Revisa si puedes ajustar alguna exigencia de tu día.</li></ul><div className="mini-note"><ShieldCheck size={16}/> Si el malestar persiste o afecta tu vida diaria, busca orientación profesional.</div></aside></div></>;
}
function Progress({results, chartData}) {
  return <><PageHeading eyebrow="TU RECORRIDO" title="Tu progreso, a tu ritmo" subtitle="Observa tus registros y reconoce los pasos que has dado."/><div className="progress-stats"><StatCard icon={ClipboardCheck} tint="purple" label="Evaluaciones" value={results.length} detail="En este dispositivo"/><StatCard icon={CalendarDays} tint="mint" label="Último registro" value={results[0] ? new Date(results[0].date).toLocaleDateString('es-CO',{day:'numeric',month:'short'}) : '—'} detail="Fecha de actividad"/><StatCard icon={Sparkles} tint="peach" label="Constancia" value={results.length ? '¡Buen trabajo!' : 'Por comenzar'} detail="Cada paso cuenta"/></div><section className="panel progress-chart"><div className="panel-heading"><div><h3>Historial visual</h3><p>Porcentaje de puntuación máxima por evaluación</p></div><span className="soft-chip"><Activity size={14}/> Tendencia</span></div><div className="large-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:10,right:12,left:-20,bottom:0}}><CartesianGrid stroke="#edf0f5" vertical={false}/><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill:'#9aa2b2',fontSize:12}}/><YAxis domain={[0,100]} axisLine={false} tickLine={false} tick={{fill:'#9aa2b2',fontSize:12}}/><Tooltip/><Area connectNulls type="monotone" dataKey="stress" name="Estrés" stroke="#8877e8" fill="#8877e8" fillOpacity={.08} strokeWidth={2.5}/><Area connectNulls type="monotone" dataKey="anxiety" name="Ansiedad" stroke="#64a6dc" fill="transparent" strokeWidth={2.5}/><Area connectNulls type="monotone" dataKey="burnout" name="Agotamiento" stroke="#65b99a" fill="transparent" strokeWidth={2.5}/></AreaChart></ResponsiveContainer></div></section><section className="panel history-panel"><div className="panel-heading"><div><h3>Evaluaciones anteriores</h3><p>Registros guardados localmente</p></div><span className="soft-chip">{results.length} registros</span></div>{results.length ? <div className="history-list">{results.map(r => { const info = interpretation(r.score,r.max); return <div className="history-row" key={r.id}><div className={`history-symbol ${r.type}`}><ClipboardCheck size={18}/></div><div className="history-name"><b>{r.title}</b><small>{new Date(r.date).toLocaleString('es-CO',{dateStyle:'medium',timeStyle:'short'})}</small></div><span className={`result-pill ${info.tone}`}>{info.label}</span><b className="history-score">{Math.round(r.score/r.max*100)}%</b></div>; })}</div> : <div className="empty-inline"><ClipboardCheck size={25}/><b>Tu historial comenzará aquí</b><span>Completa una evaluación para guardar tu primer registro.</span></div>}</section><p className="chart-footnote">Las puntuaciones no son diagnósticos ni deben utilizarse para tomar decisiones clínicas por cuenta propia.</p></>;
}
function Wellbeing({breathing, setBreathing}) {
  const [activity, setActivity] = useState('breath');
  const [phase, setPhase] = useState('Inhala');
  useEffect(() => {
    if (!breathing || activity !== 'breath') return;
    const sequence = ['Inhala','Sostén','Exhala','Descansa'];
    let i = 0;
    const id = setInterval(() => { i = (i+1)%sequence.length; setPhase(sequence[i]); }, 4000);
    return () => clearInterval(id);
  }, [breathing, activity]);
  const cards = [
    {id:'breath',icon:Wind,title:'Respiración consciente',time:'2 minutos',desc:'Acompaña tu respiración y regálate una pausa.'},
    {id:'pause',icon:Coffee,title:'Pausa activa',time:'5 minutos',desc:'Estira suavemente el cuerpo y cambia de postura.'},
    {id:'ground',icon:Footprints,title:'Vuelve al presente',time:'3 minutos',desc:'Observa tu entorno y conecta con el momento.'}
  ];
  return <><PageHeading eyebrow="HÁBITOS DE AUTOCUIDADO" title="Un momento para ti" subtitle="No necesitas mucho tiempo para hacer una pausa. Elige una práctica amable contigo."/><div className="wellbeing-grid">{cards.map(c => <button key={c.id} className={`wellbeing-card ${activity===c.id?'chosen':''}`} onClick={() => {setActivity(c.id);setBreathing(false);setPhase('Inhala');}}><div className="wellbeing-icon"><c.icon size={22}/></div><span className="wellbeing-time"><Clock3 size={13}/>{c.time}</span><h3>{c.title}</h3><p>{c.desc}</p><span className="wellbeing-select">{activity===c.id?'Seleccionada':'Elegir práctica'} <ChevronRight size={15}/></span></button>)}</div><section className="panel practice-panel">{activity==='breath' ? <><div className="eyebrow">EJERCICIO GUIADO</div><h2>Respira a tu propio ritmo</h2><p className="muted">Si te resulta cómodo, sigue el círculo. Si sientes incomodidad, vuelve a respirar normalmente.</p><div className={`breathing-orb ${breathing?'moving':''}`}><div><Wind size={25}/><b>{breathing?phase:'Pausa'}</b><small>{breathing?'Acompaña el ritmo':'Cuando estés listo'}</small></div></div><button className="primary-button" onClick={() => {setBreathing(!breathing);setPhase('Inhala');}}>{breathing?'Pausar ejercicio':'Comenzar ejercicio'} {breathing?<Moon size={16}/>:<ArrowRight size={16}/>}</button></> : activity==='pause' ? <><div className="eyebrow">PAUSA ACTIVA</div><h2>Despierta suavemente tu cuerpo</h2><p className="muted">Haz cada movimiento sin forzar y detente si sientes dolor.</p><div className="practice-steps"><div><span>01</span><b>Cuello y hombros</b><p>Gira suavemente los hombros hacia atrás cinco veces.</p></div><div><span>02</span><b>Espalda</b><p>Estira los brazos hacia arriba y respira con tranquilidad.</p></div><div><span>03</span><b>Movimiento</b><p>Levántate y camina un poco si tienes la posibilidad.</p></div></div></> : <><div className="eyebrow">ATENCIÓN PLENA</div><h2>Conecta con lo que te rodea</h2><p className="muted">Tómate un momento para observar sin juzgar.</p><div className="grounding-list"><div><b>5</b><span>cosas que puedes ver</span></div><div><b>4</b><span>cosas que puedes sentir</span></div><div><b>3</b><span>sonidos que puedes escuchar</span></div><div><b>2</b><span>olores que puedes reconocer</span></div><div><b>1</b><span>sabor que puedes notar</span></div></div></>}</section><div className="disclaimer"><Heart size={17}/><p>Adapta cada actividad a tus necesidades. Estas prácticas pueden acompañar tu autocuidado, pero no sustituyen la atención profesional.</p></div></>;
}

export default App;