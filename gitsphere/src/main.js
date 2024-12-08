import './style.css';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import countries from "../public/custom.geo.json";
import lines from "../public/lines.json";
import map from "../public/map.json";


var renderer, camera, scene, controls;

let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

var Globe;

init();
initGlobe();
onWindowResize();
animate();

function init() {
  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x040d21);
  // Camera setup
  camera = new THREE.PerspectiveCamera(
  );
  camera.position.set(0, 0, 400);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xbbbbbb, 0.4);
  scene.add(ambientLight);

  const DirLight1 = new THREE.DirectionalLight(0xffffff, .7);
  DirLight1.position.set(-800, 2000, 400);

  const DirLight2 = new THREE.DirectionalLight(0x7982f6, 3);
  DirLight2.position.set(-200, 500, 200);

  camera.add(DirLight1);
  camera.add(DirLight2);

  scene.add(camera);

  // Fog
  scene.fog = new THREE.Fog(0x535ef3, 20, 2000);

  // Orbit controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;

  // Event listeners
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', onMouseMove, false);
}

function initGlobe() {
  // Globe setup
  Globe = new ThreeGlobe({
    waitForGlobeReady: true,
    animateIn: true,
  })

    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .showAtmosphere(true)
    .atmosphereColor("#6e5cc0")
    .atmosphereAltitude(0.3)

  setTimeout(()=>{
    Globe.arcsData(lines.pulls)
    .arcColor((e) =>{
      return e.status ? "#9cff00" : "#ff4000";
    })
    .arcAltitude((e)=>{
      return e.arcAlt;
    })
    .arcStroke((e)=>{
      return e.status ? 0.5 : 0.3
    })
    .arcDashLength(0.9)
    .arcDashGap(4)
    .arcDashAnimateTime(1000)
    .arcDashInitialGap((e)=>{e.order*1})
    .labelsData(map.maps)
    .labelColor(()=>{"#ffcb21"})

    .labelDotRadius(0.3)
    .labelSize((e) => 2.5)
    .labelText( (e)=>e.city || 'Unknown')
    .labelResolution(6)
    .labelColor(()=>"#ffcbff")
    .labelAltitude(0.1)
    .pointsData(map.maps)
    .pointsColor(() =>"#ffffff")
    .pointsMerge(true)
    .pointAltitude(0.07)
    .pointRadius(0.05);
  },1000);

  

  Globe.rotateY(-Math.PI * (5 / 9));
  Globe.rotateZ(Math.PI / 6);

  const GlobeMaterial = Globe.globeMaterial();
  GlobeMaterial.color = new THREE.Color(0x3a228a);
  GlobeMaterial.emissive = new THREE.Color(0x220038);
  GlobeMaterial.emissiveIntensity = 0.8;
  GlobeMaterial.shininess = 0.7;

  scene.add(Globe);
}

function onMouseMove(e) {
  mouseX = e.clientX - windowHalfX;
  mouseY = e.clientY - windowHalfY;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  windowHalfX = window.innerWidth / 1.5;
  windowHalfY = window.innerHeight / 1.5; 
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  Globe.rotateY(0.0005);
  Globe.rotateX(-0.0005);
  camera.lookAt(scene.position);
  controls.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
