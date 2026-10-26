import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { house } from './content';

// Procedural concept only: replace with a surveyed GLB model when available.
export default function House3D({ selected, onSelect }) {
  const mount = useRef(null);
  const selectRef = useRef(onSelect);
  const sceneRef = useRef(null);
  const [failed, setFailed] = useState(false);
  selectRef.current = onSelect;

  useEffect(() => {
    const host = mount.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xf0ece3, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute('aria-label', 'Modello 3D dimostrativo. Selezione alternativa disponibile nei pulsanti camera a fianco.');
    renderer.domElement.setAttribute('role', 'img');
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(10, 12, 12);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.minDistance = 9;
    controls.maxDistance = 23;
    controls.maxPolarAngle = Math.PI / 2.5;
    controls.enablePan = false;
    controls.update();
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc5ac8b, 2.5));
    const sun = new THREE.DirectionalLight(0xffffff, 3);
    sun.position.set(-3, 8, 5);
    scene.add(sun);
    const pickables = [];
    const floors = [];
    function box(w, h, d, x, y, z, color, roomId) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 0.85 }));
      mesh.position.set(x, y, z);
      scene.add(mesh);
      if (roomId) { mesh.userData.roomId = roomId; pickables.push(mesh); }
      return mesh;
    }
    box(8.7, .18, 6.7, 0, -.18, 0, '#b79875');
    box(8.8, .8, .12, 0, .3, -3.3, '#e5d8c4');
    box(.12, .8, 6.6, -4.3, .3, 0, '#e5d8c4');
    box(.12, .55, 6.6, 4.3, .18, 0, '#e5d8c4');
    box(8.6, .18, .12, 0, 0, 3.3, '#e5d8c4');
    box(.16, .5, 6.5, 0, .16, 0, '#e5d8c4');
    box(8.5, .5, .16, 0, .16, 0, '#e5d8c4');
    for (const room of house.rooms) {
      const floor = box(4.1, .08, 3.1, room.x, -.03, room.z, room.color, room.id);
      floors.push({ mesh: floor, room });
      for (let i = 0; i < room.beds; i++) {
        const x = room.x - .95 + i * 1.7;
        box(1.15, .25, 1.9, x, .15, room.z -.1, '#98775b', room.id);
        box(1.12, .16, 1.84, x, .36, room.z -.1, '#f7f1e6', room.id);
        box(1.13, .04, 1.05, x, .46, room.z + .27, room.color, room.id);
        box(.9, .09, .37, x, .49, room.z -.75, '#ffffff', room.id);
        box(1.2, .7, .1, x, .35, room.z -1.12, '#9e7a55', room.id);
      }
      box(1.1, .12, .5, room.x + 1.2, .78, room.z -1.1, '#b58b5d', room.id);
      box(.07, .7, .07, room.x + .75, .35, room.z -1.1, '#725840', room.id);
      box(.07, .7, .07, room.x + 1.65, .35, room.z -1.1, '#725840', room.id);
      box(.4, .06, .27, room.x +1.2, .88, room.z -1.1, '#3b4b47', room.id);
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 128; labelCanvas.height = 128;
      const ctx = labelCanvas.getContext('2d');
      ctx.fillStyle = '#fbf8ef'; ctx.beginPath(); ctx.arc(64, 64, 43, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#373b32'; ctx.font = 'bold 44px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(room.id, 64, 66);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(labelCanvas), depthTest: false }));
      sprite.position.set(room.x, 1.5, room.z); sprite.scale.set(.9, .9, 1); sprite.userData.roomId = room.id;
      scene.add(sprite); pickables.push(sprite);
    }
    const render = () => renderer.render(scene, camera);
    sceneRef.current = { floors, render, reset: () => { camera.position.set(10, 12, 12); controls.target.set(0, 0, 0); controls.update(); render(); } };
    const resize = new ResizeObserver(() => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); render();
    });
    resize.observe(host);
    controls.addEventListener('change', render);
    const raycaster = new THREE.Raycaster();
    let down = null;
    function pointerDown(e) { down = { x: e.clientX, y: e.clientY }; }
    function pointerUp(e) {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera(new THREE.Vector2(((e.clientX-rect.left)/rect.width)*2-1, -((e.clientY-rect.top)/rect.height)*2+1), camera);
      const hit = raycaster.intersectObjects(pickables)[0];
      if (hit) selectRef.current(hit.object.userData.roomId);
      down = null;
    }
    function lost(e) { e.preventDefault(); setFailed(true); }
    renderer.domElement.addEventListener('pointerdown', pointerDown);
    renderer.domElement.addEventListener('pointerup', pointerUp);
    renderer.domElement.addEventListener('webglcontextlost', lost);
    render();
    return () => {
      resize.disconnect(); controls.removeEventListener('change', render); controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', pointerDown);
      renderer.domElement.removeEventListener('pointerup', pointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      scene.traverse(obj => { obj.geometry?.dispose(); if (obj.material) { obj.material.map?.dispose(); obj.material.dispose(); } });
      renderer.dispose(); renderer.domElement.remove(); sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.floors.forEach(({ mesh, room }) => {
      mesh.material.color.set(room.id === selected ? '#e6b657' : room.color);
    });
    sceneRef.current?.render();
  }, [selected]);

  return <div className="three-shell">
    <div ref={mount} className="three-canvas" style={failed ? { visibility: 'hidden' } : undefined}/>
    {failed ? <div className="three-fallback" role="status">Il 3D non è disponibile su questo browser. Usa la Pianta 2D o i pulsanti camera: tutte le informazioni rimangono accessibili.</div> : <button className="reset-view" onClick={() => sceneRef.current?.reset()}>↺ Ripristina vista</button>}
  </div>;
}
