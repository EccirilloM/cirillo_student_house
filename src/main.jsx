import React, { Component, lazy, Suspense, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { house } from './content';
import HeroSection from './components/HeroSection';
import { Arrow, Cube, Bed, Home, Pin, Book, Bus, Bag, Plus, BrandIcon } from './components/Icons';
import roomOne from './assets/The Glass Pavilion.jpg';
import roomTwo from './assets/Skyline Penthouse.jpg';
import roomThree from './assets/Desert Oasis.jpg';
import roomFour from './assets/Coastal Retreat.jpg';
import './styles.css';

const House3D = lazy(() => import('./House3D'));
const roomPhotos = [roomOne, roomTwo, roomThree, roomFour];
const navLinks = [['La casa', '#casa'], ['Le camere', '#camere'], ['Esplora in 3D', '#esplora'], ['La zona', '#zona']];
const roomLabel = r => `${r.name} · ${r.type}`;

function FloorPlan({ selected, onSelect }) {
  return <div className="floor-plan" aria-label="Schema dimostrativo delle quattro camere">
    {house.rooms.map(room => <button key={room.id} className={`plan-room ${selected === room.id ? 'selected' : ''}`} style={{ '--room-color': room.color }} onClick={() => onSelect(room.id)} aria-pressed={selected === room.id}>
      <span className="plan-number">{room.id}</span><span className="plan-beds" aria-hidden="true">{Array.from({ length: room.beds }, (_, i) => <i key={i}/>)}</span>
      <strong>{room.type}</strong><span>{room.beds} {room.beds === 1 ? 'posto letto' : 'posti letto'}</span>
    </button>)}
    <span className="plan-caption">SCHEMA DIMOSTRATIVO · NON IN SCALA</span>
  </div>;
}

class ViewerBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div className="viewer-loading" role="status">Non è stato possibile caricare il 3D. Puoi usare la pianta 2D e i pulsanti delle camere.</div> : this.props.children;
  }
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('Tutte');
  const [selected, setSelected] = useState('01');
  const [view, setView] = useState('3d');
  const [viewerStarted, setViewerStarted] = useState(false);
  const [message, setMessage] = useState('');
  const room = house.rooms.find(r => r.id === selected);
  function selectRoom(id) {
    setSelected(id);
    setView('3d');
    setViewerStarted(true);
    document.getElementById('esplora').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function prepareEmail(event) {
    event.preventDefault();
    if (!house.email) {
      setMessage('Questa è un’anteprima: nessun dato è stato inviato o salvato. Il modulo sarà attivato quando i contatti saranno pronti.');
      return;
    }
    const data = new FormData(event.currentTarget);
    const selectedRoom = house.rooms.find(r => r.id === data.get('room'));
    const body = `Nome: ${data.get('name')}\nEmail: ${data.get('email')}\nInteresse: ${roomLabel(selectedRoom)}\n\n${data.get('message')}`;
    window.location.href = `mailto:${house.email}?subject=${encodeURIComponent('Informazioni — Cirillo Student House')}&body=${encodeURIComponent(body)}`;
    setMessage('La richiesta è pronta nel tuo programma di posta. Per inviarla, conferma l’invio da lì.');
  }
  return <>
    <a className="skip-link" href="#contenuto">Vai al contenuto</a>
    <header className="site-header">
      <div className="site-container nav-inner">
        <a href="#casa" className="brand" aria-label="Cirillo Student House, inizio"><BrandIcon/><span>Cirillo<span className="brand-subtitle">STUDENT HOUSE</span></span></a>
        <button className="menu-toggle" aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'} aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? '✕' : '☰'}</button>
        <nav id="navigation" className={menuOpen ? 'open' : ''} aria-label="Navigazione principale">
          {navLinks.map(([label, href]) => <a key={href} href={href} onClick={() => { setMenuOpen(false); if (href === '#esplora') { setView('3d'); setViewerStarted(true); } }}>{label}</a>)}
          <a className="btn btn-primary nav-contact" href="#contatti" onClick={() => setMenuOpen(false)}>Contattaci <Arrow/></a>
        </nav>
      </div>
    </header>
    <main id="contenuto">
      <HeroSection onExplore={() => { setView('3d'); setViewerStarted(true); }}/>
      <section className="stats-strip" aria-label="Il progetto in breve"><div className="site-container stats-grid">
        {[['4', 'CAMERE PREVISTE'], ['6', 'POSTI LETTO IN PROGETTO'], ['Roma', 'ZONA ARDEATINA'], ['In divenire', 'RISTRUTTURAZIONE IN CORSO']].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </div></section>
      <section className="section-pad rooms-section" id="camere"><div className="site-container">
        <div className="section-heading"><div><p className="eyebrow">GLI SPAZI DA ABITARE</p><h2>Trova il tuo posto.</h2><p>Una singola tutta per te o una doppia da condividere.<br/>Questa è la prima ipotesi: due singole e due doppie.</p></div><a href="#esplora" className="text-link" onClick={() => setViewerStarted(true)}>Esplora la casa <Arrow/></a></div>
        <div className="room-toolbar"><span>4 camere · 6 posti letto previsti</span><div className="segmented" aria-label="Filtra camere">{['Tutte', 'Singola', 'Doppia'].map(type => <button key={type} aria-pressed={filter === type} className={filter === type ? 'active' : ''} onClick={() => setFilter(type)}>{type === 'Singola' ? 'Singole' : type === 'Doppia' ? 'Doppie' : type}</button>)}</div></div>
        <div className={`listings-grid ${filter !== 'Tutte' ? 'filtered' : ''}`}>
          {house.rooms.filter(r => filter === 'Tutte' || r.type === filter).map(r => <article className={`listing-card room-${r.id}`} key={r.id}>
            <img src={roomPhotos[Number(r.id)-1]} alt={`Immagine del template per ${r.name}: non rappresenta la camera reale`} loading="lazy"/>
            <div className="listing-shade"/>
            <span className="reference-label">FOTO DEL TEMPLATE · NON È LA CAMERA</span>
            <div className="listing-content"><span className="listing-type">{r.type}</span><h3>{r.name}</h3><p>Spazi e arredi in fase di definizione.</p><div className="listing-bottom"><span><Bed/> {r.beds} {r.beds === 1 ? 'posto letto' : 'posti letto'}</span><button onClick={() => selectRoom(r.id)} aria-label={`Esplora ${r.name} in 3D`}>Esplora <Arrow/></button></div></div>
          </article>)}
        </div>
        <p className="footnote">Distribuzione da confermare. Le immagini provengono dal template e servono solo a valutare il design; non sono fotografie della casa.</p>
      </div></section>
      <section className="explore-section section-pad" id="esplora"><div className="site-container">
        <div className="section-heading"><div><p className="eyebrow">ENTRA, CAMBIA PROSPETTIVA</p><h2>La casa, da ogni angolazione.</h2><p>Ruota il modello, scegli una camera e scopri gli spazi.<br/>Puoi esplorare anche dalla pianta 2D.</p></div><span className="section-icon"><Cube/></span></div>
        <div className="explorer">
          <div className="viewer">
            <div className="viewer-toolbar"><span className="demo-badge">MODELLO DIMOSTRATIVO</span><div className="segmented">{[['2d', 'Pianta 2D'], ['3d', 'Vista 3D']].map(([id, label]) => <button key={id} className={view === id ? 'active' : ''} aria-pressed={view === id} onClick={() => {setView(id);setViewerStarted(true);}}>{label}</button>)}</div></div>
            {view === '2d' ? <FloorPlan selected={selected} onSelect={setSelected}/> : !viewerStarted ? <div className="viewer-poster"><div className="poster-icon"><Cube/></div><h3>Fai un primo giro in casa.</h3><p>Un modello interattivo per immaginare gli spazi.</p><button className="btn btn-primary" onClick={() => setViewerStarted(true)}>Avvia l’esplorazione 3D <Arrow/></button><span>Schema illustrativo, non una ricostruzione reale.</span></div> : <ViewerBoundary><Suspense fallback={<div className="viewer-loading" role="status">Caricamento del modello…</div>}><House3D selected={selected} onSelect={setSelected}/></Suspense></ViewerBoundary>}
            <p className="viewer-help">{view === '3d' ? 'Trascina per ruotare · Pizzica per lo zoom · Tocca una camera' : 'Seleziona una camera nella pianta oppure dall’elenco'}</p>
          </div>
          <aside className="room-detail"><p className="eyebrow">SCEGLI UNA CAMERA</p><div className="room-pills">{house.rooms.map(r => <button key={r.id} onClick={() => setSelected(r.id)} aria-label={`Seleziona ${r.name}`} aria-pressed={selected === r.id} className={selected === r.id ? 'active' : ''}>{r.id}</button>)}</div>
            <div aria-live="polite"><span className="detail-type">{room.type}</span><h3>{room.name}</h3><p>{room.beds === 1 ? 'Uno spazio tutto tuo, dentro una casa condivisa.' : 'Due posti letto, per condividere anche il percorso.'}</p><dl><div><dt>Posti letto previsti</dt><dd>{room.beds}</dd></div><div><dt>Superficie</dt><dd>Da confermare</dd></div><div><dt>Arredi</dt><dd>In progettazione</dd></div></dl></div>
            <a className="btn btn-primary" href="#contatti">Chiedi informazioni <Arrow/></a><p className="detail-note">La selezione non è una prenotazione.</p>
          </aside>
        </div><p className="footnote">La geometria e gli arredi del modello sono inventati per mostrare l’esperienza. La ricostruzione della casa sarà realizzata sulla planimetria definitiva.</p>
      </div></section>
      <section className="section-pad zone-section" id="zona"><div className="site-container">
        <div className="section-heading"><div><p className="eyebrow">LA TUA NUOVA QUOTIDIANITÀ</p><h2>Roma, oltre la tua stanza.</h2><p>La casa si trova in zona Ardeatina, vicino alle Fosse Ardeatine.<br/>L’indirizzo esatto verrà condiviso privatamente per le visite.</p></div><a href="https://www.openstreetmap.org/search?query=Fosse%20Ardeatine%2C%20Roma" target="_blank" rel="noreferrer" className="text-link"><Pin/> Esplora la zona <Arrow/></a></div>
        <div className="zone-grid">{[[Book,'Università e studio','Le sedi e i percorsi utili per raggiungerle.'],[Bus,'Muoversi a Roma','Fermate, linee e collegamenti da verificare.'],[Bag,'La vita di tutti i giorni','Supermercati, farmacie e servizi della zona.']].map(([Icon,title,text]) => <article key={title} className="zone-card"><div className="zone-icon"><Icon/></div><h3>{title}</h3><p>{text}</p><span>Guida in preparazione</span></article>)}</div>
        <p className="footnote">La mappa indica un punto di riferimento pubblico, non la posizione dell’abitazione. Tempi e distanze saranno aggiunti solo dopo la verifica.</p>
      </div></section>
      <section className="process-section section-pad"><div className="site-container process-layout"><div><p className="eyebrow">UN PASSO ALLA VOLTA</p><h2>Da casa di famiglia<br/>a un nuovo <em>inizio.</em></h2><p>Stiamo ristrutturando la casa di nostro nonno per accogliere chi viene a Roma a studiare. Il progetto prende forma insieme agli spazi.</p><a href="#contatti" className="btn btn-primary">Restiamo in contatto <Arrow/></a></div><div className="process-steps">{[['01','La ristrutturazione','Stiamo lavorando agli ambienti e alla distribuzione delle camere.','In corso'],['02','Gli spazi reali','Arriveranno planimetria, fotografie e ricostruzione 3D della casa.','Prossimamente'],['03','Conosciamoci','Condivideremo condizioni, dettagli e modalità per organizzare una visita.','Da definire']].map(([n,title,text,status]) => <div className="process-step" key={n}><span className="step-number">{n}</span><div><span className="step-status">{status}</span><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>
      <section className="section-pad" id="informazioni"><div className="site-container faq-layout"><div><p className="eyebrow">LE COSE DA SAPERE</p><h2>Le prime risposte.</h2><p>Alcune informazioni sono già qui.<br/>Le altre arriveranno insieme al progetto.</p></div><div className="faqs">{house.faqs.map(([q,a]) => <details key={q}><summary>{q}<Plus/></summary><p>{a}</p></details>)}</div></div></section>
      <section className="contact-section section-pad" id="contatti"><div className="site-container contact-layout">
        <div><p className="eyebrow">PARLIAMONE</p><h2>Ti immagini<br/><em>già qui?</em></h2><p>Il primo passo è conoscerci. Presto potrai scriverci per saperne di più sulla casa e raccontarci cosa ti porta a Roma.</p><div className="contact-status"><Home/><div><strong>Contatti in preparazione</strong><p>{house.email ? 'Puoi preparare una richiesta via email dal modulo.' : 'Il modulo è in anteprima. Non invia né salva dati.'}</p>{house.phone && <a href={`tel:${house.phone.replace(/[^\d+]/g,'')}`}>Chiamaci: {house.phone}</a>}</div></div></div>
        <form onSubmit={prepareEmail} className="contact-form"><span className="demo-badge">{house.email ? 'RICHIESTA VIA EMAIL' : 'ANTEPRIMA · INVIO NON ATTIVO'}</span><h3>Facciamo conoscenza.</h3><div className="form-row"><label>Il tuo nome<input name="name" autoComplete="name" placeholder="Come ti chiami?" required maxLength={100}/></label><label>La tua email<input name="email" type="email" autoComplete="email" placeholder="nome@esempio.it" required maxLength={200}/></label></div><label>La camera che ti interessa<select name="room" value={selected} onChange={e=>setSelected(e.target.value)}>{house.rooms.map(r=><option key={r.id} value={r.id}>{roomLabel(r)}</option>)}</select></label><label>Il tuo messaggio<textarea name="message" rows={4} maxLength={2000} placeholder="Raccontaci qualcosa di te e del tuo percorso a Roma…"/></label><p className="form-note">{house.email ? 'Il pulsante prepara una richiesta nel tuo programma di posta. Dovrai inviarla da lì.' : 'Questo modulo serve a provare l’esperienza. Nessun dato viene inviato o conservato.'}</p><button className="btn btn-primary" type="submit">{house.email ? 'Prepara email' : 'Prova il modulo'} <Arrow/></button><p className="form-result" role="status">{message}</p></form>
      </div></section>
    </main>
    <footer className="site-footer"><div className="site-container"><div className="footer-grid"><div><a href="#casa" className="brand"><BrandIcon/><span>Cirillo<span className="brand-subtitle">STUDENT HOUSE</span></span></a><p>Una casa di famiglia.<br/>Un nuovo capitolo da condividere, a Roma.</p></div><div><h3>Esplora il progetto</h3>{navLinks.map(([label,href])=><a key={href} href={href}>{label}</a>)}</div><div><h3>Informazioni</h3><a href="#informazioni">Domande frequenti</a><a href="#contatti">Contatti</a><p>Roma · zona Ardeatina<br/>Casa in ristrutturazione</p></div></div><div className="footer-bottom"><span>Cirillo Student House · Progetto in evoluzione</span><span>Anteprima locale · foto e modello dimostrativi</span><a href="#casa">Torna su ↑</a></div></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
