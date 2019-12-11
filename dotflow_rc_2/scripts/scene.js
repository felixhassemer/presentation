import * as THREE from './libraries/three.module.js';

// GLOBAL
let scene, canvas, camera;

// Circles Array
let circles = [];
const maxNum = 80;
const circleRadius = .05;
const circleSegments = 16;
const circleDist = .4;
const circleDepthLevel = 0;
const circleDepthDist = .5;

let boundary = {
    left: 0,
    right: 0
}

// set up noise
noise.seed(Math.random());
let n = {
    scl: .05,
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
    // camera = new THREE.OrthographicCamera(5, 0, 2, 5, near, far);
    camera.position.z = 18;
    camera.position.y = 3;
    camera.rotation.x = -Math.PI / 10;

    // Set up scene
    scene = new THREE.Scene();

    // Set up geometry
    const geometry = new THREE.CircleBufferGeometry(circleRadius, circleSegments);
    const color = 0x000000;

    // Set up boundaries
    boundary.left = circleDist * (-maxNum / 2);
    boundary.right = Math.abs(boundary.left);

    // make circles
    for (let depth = 0; depth <= circleDepthLevel; depth++) {
        for (let i = 0; i < maxNum; i++) {
            let x = (circleRadius * 2) + circleDist * (i - (maxNum / 2));
            let y = 0;
            circles.push(makeInstance(geometry, color, x, y));
        }
    }
}


// RENDER ---------------------------------------------------
const animate = (time) => {
    // convert time to seconds
    time *= 0.001;
    // reset depth each iteration
    let depth = 0;

    // resize renderer to windowsize
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    circles.forEach((shape, index) => {
        if (index % maxNum === 0) depth++;

        // set noise as current position on y
        const tempIndex = index % maxNum;
        const currentNoise = noise.perlin2(n.xOff, tempIndex * n.scl);
        shape.position.y = currentNoise * n.ampScl;
        shape.position.y *= (depth + 1) / 4;
        shape.position.z = depth * circleDepthDist;
        // change color of material by y height
        // shape.material.color.setRGB(shape.position.y, 
        //                             shape.position.y, 
        //                             shape.position.y);
        shape.position.x += 0.01;

        if (!checkWidthBounds(shape.position.x, boundary.left, boundary.right)) shape.position.x = boundary.left;
    });

    // increment noise offset
    n.xOff += n.speed;

    // render scene
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// FUNCTIONS -----------------------------------------------

const makeInstance = (geometry, color, x, y) => {
    const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);
    shape.position.x = x;
    shape.position.y = y;
    return shape;
}

const checkWidthBounds = function (x, leftBound, rightBound) {
    if (x >= leftBound && x <= rightBound) return true;
    else return false;
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