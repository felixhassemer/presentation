import { ParticleSystem } from './ParticleSystem.js';

// GLOBAL VARIABLES
// scene variables
let scene, canvas, camera, width, height, controls;
let particleSystem = null;
let gridHelper, axesHelper;

// dots setup
let d = {
    count: [260, 7],
    radius: .03,
    segments: 16,
    separation: [.1, .3],
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
    velocity: .016,

    globalScale: .09,
    amplitude: 4,
    xincrement: .06,
    yincrement: .2,
    noiseSpeed: .002,

    color1: 0x293770,
    color2: 0xE60665
}

// noise setup
noise.seed(Math.random());

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

    // render scene
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


// FUNCTIONS -----------------------------------------------

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