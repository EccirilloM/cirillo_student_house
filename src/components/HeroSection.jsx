// Adapted from BuildEstate's HeroSection.tsx (MIT, Aayush Vaghela).
// See licenses/BuildEstate-MIT.txt. Only the presentation layer is retained.
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import referencePhoto from '../assets/Right side feature card.jpg';
import { Arrow, Cube, Bed, Home } from './Icons';

export default function HeroSection({ onExplore }) {
  const reduced = useReducedMotion();
  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: .12 } } };
  const item = { hidden: { opacity: 0, y: reduced ? 0 : 20 }, visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : .55 } } };
  return <section id="casa" className="relative bg-[#F8F6F6] overflow-hidden hero-section">
    <div className="absolute right-0 top-14 w-64 h-64 bg-[rgba(236,70,19,0.08)] rounded-full blur-[32px]" aria-hidden="true"/>
    <div className="absolute left-1/2 bottom-10 w-64 h-64 bg-[rgba(254,215,170,0.2)] rounded-full blur-[32px]" aria-hidden="true"/>
    <div className="site-container relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.div variants={item} className="hero-badge"><span/> UNA CASA PER STUDENTI, A ROMA</motion.div>
          <motion.h1 variants={item} className="hero-title">Il tuo prossimo<br/><em>capitolo</em> inizia<br/>da casa.</motion.h1>
          <motion.p variants={item} className="hero-description">Una casa di famiglia che si prepara a una nuova vita.<br className="hidden xl:block"/> Quattro camere, sei posti letto in progetto e una nuova quotidianità da immaginare, in zona Ardeatina.</motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-4 mb-9">
            <a href="#camere" className="btn btn-primary">Scopri le camere <Arrow/></a>
            <a href="#esplora" className="btn btn-outline" onClick={onExplore}><Cube/> Esplora in 3D</a>
          </motion.div>
          <motion.div variants={item} className="project-note"><span className="project-note-icon"><Home/></span><div><strong>Stiamo preparando qualcosa di nuovo.</strong><p>Casa in ristrutturazione · apertura da definire</p></div></motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .65 }} className="relative">
          <div className="hero-photo-wrap">
            <img src={referencePhoto} alt="Villa del template originale, utilizzata solo come riferimento grafico: non è la casa in affitto" className="hero-photo" fetchPriority="high"/>
            <span className="reference-label">FOTO DEL TEMPLATE · NON È LA CASA</span>
            <div className="hero-property-card">
              <div className="flex justify-between items-start gap-3 mb-4"><div><h2>Cirillo Student House</h2><p>ROMA · ZONA ARDEATINA</p></div><span className="project-badge">IN PROGETTO</span></div>
              <div className="hero-property-meta"><span>Un nuovo inizio, insieme.</span><span><Home/> 4 camere</span><span><Bed/> 6 posti</span></div>
            </div>
          </div>
          <p className="photo-caption">Riferimento visivo provvisorio. Le foto della casa arriveranno dopo i lavori.</p>
        </motion.div>
      </div>
    </div>
  </section>;
}
