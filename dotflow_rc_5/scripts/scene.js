import * as THREE from '../node_modules/three/build/three.module.js';
import * as dat from '../node_modules/dat.gui/build/dat.gui.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
// import { Particle } from './Particle.js';
import { ParticleSystem } from './ParticleSystem.js';


// GLOBAL VARIABLES
// scene variables
let scene, canvas, camera, width, height, controls;
let showHelpers = true;
let particleSystem = null;
let gridHelper, axesHelper;

// dots setup
let d = {
    count: [64, 10, 1],
    radius: .2,
    segments: 32,
    separation: [.5, .5, .5],
    velocity: .06,
    geometry: null
}

let parameters = {
    helpers: true,

    radius: d.radius,
    xCount: d.count[0],
    yCount: d.count[1],
    zCount: d.count[2],
    xSeparation: d.separation[0],
    ySeparation: d.separation[1],
    zSeparation: d.separation[2],

    globalScale: 1,
    amplitude: 4,
    xincrement: .01,
    yincrement: .01,
    zincrement: .01,

    color1: 0x293770,
    color2: 0xE60665
}

let boundary = {
    left: 0,
    right: 0
}

// noise setup
noise.seed(Math.random());

// GUI Setup
window.onload = function () {
    let gui = new dat.GUI();
    var folder1 = gui.addFolder('Grid');
    var folder2 = gui.addFolder('Noise');
    var folder3 = gui.addFolder('Colors');
    gui.remember(parameters);

    gui.add(parameters, 'helpers').onChange(setHelpers);

    folder1.add(parameters, 'radius', 0.01, 3, .01).onChange(setSizeValues);
    folder1.add(parameters, 'xSeparation', 0.1, 10, .1).onChange(setSeparationValues);
    folder1.add(parameters, 'ySeparation', 0.1, 10, .1).onChange(setSeparationValues);
    folder1.add(parameters, 'zSeparation', 0.1, 10, .1).onChange(setSeparationValues);
    folder1.add(parameters, 'xCount', 1, 64, 1).onChange(setCountValues);
    folder1.add(parameters, 'yCount', 1, 64, 1).onChange(setCountValues);
    folder1.add(parameters, 'zCount', 1, 4, 1).onChange(setCountValues);

    folder2.add(parameters, 'globalScale', 0.01, 4, .01).onChange(setNoiseValues);
    folder2.add(parameters, 'amplitude', 1, 10, .2).onChange(setNoiseValues);
    folder2.add(parameters, 'xincrement', .001, .1, .001).onChange(setNoiseValues);
    folder2.add(parameters, 'yincrement', .001, .1, .001).onChange(setNoiseValues);
    folder2.add(parameters, 'zincrement', .001, .1, .001).onChange(setNoiseValues);

    folder3.addColor(parameters, 'color1').onChange(setColorValues);
    folder3.addColor(parameters, 'color2').onChange(setColorValues);
}

// attach canvas to DOM element
canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });


// Setup ---------------------------------------------------
function init() {
    // CAMERA
    const near = .01;
    const far = 100;
    const fov = 30;
    const zoom = .2;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    // const left = -aspect,
    //     right = aspect,
    //     top = 1,
    //     bottom = -1;

    // camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.zoom = zoom;
    camera.position.z = 10;
    camera.position.y = 5; // controls viewing angle
    camera.lookAt(0, 0, 0);

    // ORBIT CONTROLS
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 100;

    // Set up scene
    scene = new THREE.Scene();

    // BOUNDARIES
    boundary.left = d.separation.x * (-d.count[0] / 2);
    boundary.right = Math.abs(boundary.left);

    // PARTICLE SYSTEM
    d.geometry = new THREE.CircleBufferGeometry(d.radius, d.segments);
    const color = [parameters.color1, parameters.color2];
    particleSystem = new ParticleSystem(new THREE.Vector3(0, 0, 0), d.count, d.separation, d.geometry, color);
    particleSystem.generateParticles();
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

    controls.update();

    // render scene
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


// FUNCTIONS -----------------------------------------------

const setSeparationValues = function () {
    particleSystem.separation[0] = parameters.xSeparation;
    particleSystem.separation[1] = parameters.ySeparation;
    particleSystem.separation[2] = parameters.zSeparation;
}

const setCountValues = function () {
    // console.log(particleSystem.count);
    particleSystem.count[0] = parameters.xCount;
    particleSystem.count[1] = parameters.yCount;
    particleSystem.count[2] = parameters.zCount;
    particleSystem.particles.forEach((p) => {
        p.shape.geometry.dispose();
        p.shape.material.dispose();
        scene.remove(p.shape);
        renderer.renderLists.dispose();
    })
    particleSystem.generateParticles();
    particleSystem.addToScene(scene);
}

const setNoiseValues = function () {
    particleSystem.noise.globalScale = parameters.globalScale;
    particleSystem.noise.amplitude = parameters.amplitude;
    particleSystem.noise.increment[0] = parameters.xincrement;
    particleSystem.noise.increment[1] = parameters.yincrement;
    particleSystem.noise.increment[2] = parameters.zincrement;
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

const checkWidthBounds = function (x, leftBound, rightBound) {
    if (x >= leftBound && x <= rightBound) return true;
    else return false;
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

const helpers = function () {


}

init();
animate();