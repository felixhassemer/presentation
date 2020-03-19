import * as THREE from '../node_modules/three/build/three.module.js';
import * as dat from '../node_modules/dat.gui/build/dat.gui.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
// import { Particle } from './Particle.js';
import { ParticleSystem } from './ParticleSystem.js';


// GLOBAL VARIABLES
// scene variables
let scene, canvas, camera, width, height, controls;
let particleSystem = null;
let gridHelper, axesHelper;

// dots setup
let d = {
    count: [78, 7],
    radius: .06,
    segments: 32,
    separation: [.25, .6],
    geometry: null,
    material: null
}

let parameters = {
    helpers: false,
    orbit: false,
    ui: false,

    radius: d.radius,
    xCount: d.count[0],
    yCount: d.count[1],
    xSeparation: d.separation[0],
    ySeparation: d.separation[1],
    velocity: .02,

    globalScale: 2.09,
    amplitude: 4,
    xincrement: .03,
    yincrement: .04,
    noiseSpeed: .003,

    color1: 0x293770,
    color2: 0xE60665
}

// noise setup
noise.seed(Math.random());

// GUI Setup
window.onload = function () {
    if (parameters.ui) {
        let gui = new dat.GUI();
        var folder1 = gui.addFolder('Grid');
        var folder2 = gui.addFolder('Noise');
        var folder3 = gui.addFolder('Colors');
        gui.remember(parameters);
    
        gui.add(parameters, 'helpers').onChange(setHelpers);
    
        folder1.add(parameters, 'radius', 0.01, 3, .01).onChange(setSizeValues);
        folder1.add(parameters, 'xSeparation', 0.1, 2, .1).onChange(setCountValues);
        folder1.add(parameters, 'ySeparation', 0.1, 2, .1).onChange(setCountValues);
        folder1.add(parameters, 'xCount', 1, 64, 1).onChange(setCountValues);
        folder1.add(parameters, 'yCount', 1, 64, 1).onChange(setCountValues);
        folder1.add(parameters, 'velocity', .01, .1, .001).onChange(setVelocityValues);
    
        folder2.add(parameters, 'globalScale', 0.01, 4, .01).onChange(setNoiseValues);
        folder2.add(parameters, 'amplitude', 1, 10, .2).onChange(setNoiseValues);
        folder2.add(parameters, 'xincrement', .001, .1, .001).onChange(setNoiseValues);
        folder2.add(parameters, 'yincrement', .001, .1, .001).onChange(setNoiseValues);
        folder2.add(parameters, 'noiseSpeed', .001, .1, .001).onChange(setNoiseValues);
    
        folder3.addColor(parameters, 'color1').onChange(setColorValues);
        folder3.addColor(parameters, 'color2').onChange(setColorValues);
    }
}

// attach canvas to DOM element
canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true });


// Setup ---------------------------------------------------
function init() {
    // CAMERA
    const near = .01;
    const far = 100;
    const zoom = .2;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const left = -aspect,
        right = aspect,
        top = 1,
        bottom = -1;

    camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    camera.zoom = zoom;
    camera.position.z = 10;
    camera.position.y = 10; // controls viewing angle
    camera.lookAt(0, 0, 0);

    // ORBIT CONTROLS
    if (parameters.orbit) {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 5;
        controls.maxDistance = 100;
    }

    // Set up scene
    scene = new THREE.Scene();

    // PARTICLE SYSTEM
    const colorStops = [parameters.color1, parameters.color2];
    scene.background = new THREE.Color(0xffffff);
    d.geometry = new THREE.CircleBufferGeometry(d.radius, d.segments);
    particleSystem = new ParticleSystem(new THREE.Vector3(0, 0, 0), d.count, d.separation, colorStops, parameters.velocity, parameters.noiseSpeed);
    particleSystem.generateParticles(d.geometry);
    particleSystem.addToScene(scene);

    // HELPERS
    // grid
    let size = 20;
    let divisions = 10;
    gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
    // axes helper
    axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    // check parameters to see if helpers need to be turned off
    if (!parameters.helpers) {
        axesHelper.visible = !axesHelper.visible;
        gridHelper.visible = !gridHelper.visible;
    }
}


// RENDER ---------------------------------------------------
const animate = function (time) {
    // convert time to seconds
    time *= 0.001;

    // resize renderer to windowsize
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        const aspect = canvas.clientWidth / canvas.clientHeight;
        camera.aspect = aspect;
        camera.left = -aspect;
        camera.right = aspect;
        camera.updateProjectionMatrix();
    }

    // update the particle system
    particleSystem.updateParticles(camera.position);

    if (parameters.orbit) controls.update();

    // render scene
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


// FUNCTIONS -----------------------------------------------

const setCountValues = function () {
    particleSystem.count[0] = parameters.xCount;
    particleSystem.count[1] = parameters.yCount;

    particleSystem.separation[0] = parameters.xSeparation;
    particleSystem.separation[1] = parameters.ySeparation;

    particleSystem.particles.forEach((p) => {
        p.geometry.dispose();
        p.material.dispose();
        scene.remove(p);
        renderer.renderLists.dispose();
    })

    particleSystem.generateParticles(d.geometry, d.material);
    particleSystem.addToScene(scene);
}

const setVelocityValues = function () {
    particleSystem.velocity = parameters.velocity;
}

const setNoiseValues = function () {
    particleSystem.noise.globalScale = parameters.globalScale;
    particleSystem.noise.amplitude = parameters.amplitude;
    particleSystem.noise.increment[0] = parameters.xincrement;
    particleSystem.noise.increment[1] = parameters.yincrement;
    particleSystem.noise.increment[2] = parameters.noiseSpeed;
}

const setSizeValues = function () {
    particleSystem.setSize(parameters.radius);
}

const setColorValues = function () {
    const colors = [parameters.color1, parameters.color2];
    particleSystem.colorStops = colors;
}

const setHelpers = function () {
    axesHelper.visible = !axesHelper.visible;
    gridHelper.visible = !gridHelper.visible;
}

const resizeRendererToDisplaySize = function (renderer) {
    const canvas = renderer.domElement;
    width = canvas.clientWidth;
    height = canvas.clientHeight;

    // check if resolution needs changing
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

init();
animate();