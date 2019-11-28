import * as THREE from './libraries/three.module.js';

// GLOBAL
let scene, canvas, camera;

// Circles Array
let circles = [];
const maxNum = 100;
const circleRadius = .05;
const circleSegments = 16;
const circleDist = .3;
const circleSinSclDist = 40;
const circleDepthLevel = 8;

// set up noise
noise.seed(Math.random());
let n = {
    scl: .035,
    speed: .002,
    xOff: 0,
    ampScl: 4
}



// attach to DOM element
canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

// Setup ---------------------------------------------------
function init() {

    // Set up camera
    const fov = 75;
    const aspect = 1;
    const near = 0.1;
    const far = 40;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 18;

    // Set up scene
    scene = new THREE.Scene();

    // Set up geometry
    const geometry = new THREE.CircleBufferGeometry(circleRadius, circleSegments);

    // make circles
    for (let depth = 0; depth <= circleDepthLevel; depth++) {
        for (let i = 0; i < maxNum; i++) {
            let x = (circleRadius * 2) + circleDist * (i - (maxNum / 2));
            let y = 0;
            circles.push(makeInstance(geometry, 0x000000, x, y));
        }
    }
    // console.log(circles.length, maxNum);
}


// RENDER ---------------------------------------------------
const animate = (time) => {
    // convert time to seconds
    time *= 0.001;

    // resize renderer to windowsize
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    let depth = 0;
    // console.log(circles, maxNum);
    circles.forEach((shape, index) => {
        if (index % maxNum === 0) depth++;

        // scale circles by sine function
        const sclIndex = index / circleSinSclDist;
        const scl = Math.sin(sclIndex - time);
        shape.scale.set(scl, scl, scl);

        // set noise as current position on y
        const tempIndex = index % maxNum;
        const currentNoise = noise.perlin2(n.xOff, tempIndex * n.scl);
        shape.position.y = currentNoise * n.ampScl;
        shape.position.y *= (depth + 1) / 4;
        shape.position.z = depth;
    });

    // increment noise offset
    n.xOff += n.speed;

    // render scene
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// FUNCTIONS -----------------------------------------------

// const initLight = (color, intensity, position) => {
//     // add directional light
//     const light = new THREE.DirectionalLight(color, intensity);
//     light.position.set(position[0], position[1], position[2]);
//     scene.add(light);
// }

const makeInstance = (geometry, color, x, y) => {
    const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);
    shape.position.x = x;
    shape.position.y = y;
    return shape;
}

const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // check if resolution needs changing
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

init();
animate();