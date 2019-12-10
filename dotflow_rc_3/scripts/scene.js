import * as THREE from '../node_modules/three/three.module.js';

// GLOBAL

// scene variables
let scene, canvas, camera;

let colorStops = [0x293770, 0xE60665];

// dots setup
let dots = [];
let d = {
    maxNum: 80,
    radius: .08,
    segments: 12,
    xDist: 1,
    depthLevels: 6,
    depthDist: .6,
    xMove: .015
}

let boundary = {
    left: 0,
    right: 0
}

// noise setup
noise.seed(Math.random());
let n = {
    globalScale: 1,
    xScale: .06,
    yScale: .16,
    speed: .002,
    offset: 0,
    ampScl: 6
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
    camera.position.y = 18;
    camera.rotation.x = -Math.PI / 3;

    // Set up scene
    scene = new THREE.Scene();

    // Set up geometry
    const geometry = new THREE.CircleBufferGeometry(d.radius, d.segments);
    const color = colorStops[0];

    // Set up boundaries
    boundary.left = d.xDist * (-d.maxNum / 2);
    boundary.right = Math.abs(boundary.left);

    // make dots
    for (let depth = 0; depth <= d.depthLevels; depth++) {
        for (let i = 0; i < d.maxNum; i++) {
            let x = (d.radius * 2) + d.xDist * (i - (d.maxNum / 2)); // translate into middle of coordinate system ( -d.maxNum/2 )
            let y = 0;
            dots.push(makeInstance(geometry, color, x, y)); // populate array
        }
    }
}


// RENDER ---------------------------------------------------
const animate = function (time) {
    // convert time to seconds
    time *= 0.001;

    // resize renderer to windowsize
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    moveDots();

    // increment noise offset
    n.offset += n.speed;

    // render scene
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// FUNCTIONS -----------------------------------------------

const moveDots = function () {
    // reset depth each iteration
    let depth = 0;

    // loop over all dots and set y height to noise value
    dots.forEach((shape, index) => {
        if (!checkWidthBounds(shape.position.x, boundary.left, boundary.right)) shape.position.x = boundary.left;

        if (index % d.maxNum === 0) depth++;

        // set noise as current position on y
        const xNoise = (shape.position.x * n.xScale) * n.globalScale;
        const yNoise = (shape.position.z * n.yScale) * n.globalScale;
        const currentNoise = noise.perlin3(xNoise, yNoise, n.offset);

        // set new positions
        shape.position.x += d.xMove * (depth / d.depthLevels + 1);
        shape.position.y = currentNoise * n.ampScl;
        shape.position.z = depth * d.depthDist;

        // adding color
        const amount = (shape.position.y - -n.ampScl) / (n.ampScl - -n.ampScl); // normalize position values to be used as interpolation input
        shape.material.color.set(lerpColor(colorStops[0], colorStops[1], amount));
    });
}

const lerpColor = function (a, b, amount) {
    const ar = a >> 16,
        ag = a >> 8 & 0xff,
        ab = a & 0xff,

        br = b >> 16,
        bg = b >> 8 & 0xff,
        bb = b & 0xff,

        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return (rr << 16) + (rg << 8) + (rb | 0);
}

const makeInstance = function (geometry, color, x, y) {
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

const resizeRendererToDisplaySize = function (renderer) {
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