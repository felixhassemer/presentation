// import { Particle } from './Particle.js';
import { Vector3 } from '../node_modules/three/build/three.module.js';
// import { Scene } from 'three/build/three.module';

export class ParticleSystem {
    constructor(center, count, separation, color, velocity, noiseSpeed) {
        this.particles = [];
        this.materials = [];
        this.center = center;
        this.count = count;
        this.separation = separation;
        this.boundary = null;
        this.colorStops = color;
        this.velocity = velocity;
        this.noise = {
            globalScale: 1,
            increment: [.1, .1, noiseSpeed],
            offset: [.0, .0, .0],
            amplitude: 3
        };
        this.offset = [0, 0];
    }

    generateParticles(geometry) {
        this.particles = [];
        this.materials = [];
        this.setOffset();

        // fill materials and particles arrays
        for (let i = 0; i < this.count[0]; i++) {
            for (let j = 0; j < this.count[1]; j++) {
                this.materials.push(new THREE.MeshBasicMaterial(THREE.FrontSide));
                this.particles.push(new THREE.Mesh(geometry, this.materials[this.materials.length - 1]));
            }
        }
        this.setInitialPositions();
    }

    setInitialPositions() {
        for (let i = 0; i < this.count[0]; i++) {
            for (let j = 0; j < this.count[1]; j++) {
                const position = this.setGridPosition(i, j);
                const index = i + j * this.count[0];

                this.particles[index].position.copy(position);
            }
        }
    }

    updateParticles(lookTarget) {
        // initialize boundary variable
        this.boundary = (this.separation[0] * this.count[0] / 2);

        for (let i = 0; i < this.count[0]; i++) {
            for (let j = 0; j < this.count[1]; j++) {
                const index = i + j * this.count[0];
                const p = this.particles[index];

                if (!this.withinBounds(p.position.x, -this.boundary, this.boundary)) p.position.x *= -1;

                // calculate grid positions and offset by half of gridsize
                const position = p.position.clone();

                // make all shapes look at the target object
                p.lookAt(lookTarget);

                // noise generation dependent on position scaled by value
                const currentNoise = noise.perlin3(p.position.x * this.noise.increment[0],
                    p.position.z * this.noise.increment[1],
                    this.noise.offset[2]);

                // set y to noise * amp and copy to child position
                position.y = currentNoise * this.noise.amplitude;
                position.x += this.velocity;
                p.position.copy(position);

                // set particle color
                let color = this.lerpColor(this.colorStops[0], this.colorStops[1], Math.abs(currentNoise));
                p.material.color.set(color);                
            }
        }
        this.noise.offset[2] += this.noise.increment[2];
    }

    setGridPosition(i, j) {
        // const x = this.separation[0] * i - this.offset[0];
        const x = this.separation[0] * i - this.offset[0];
        const y = this.separation[1] * j - this.offset[1];
        return new THREE.Vector3(x, 0, y);
    }

    setOffset() {
        this.offset[0] = ((this.separation[0] * this.count[0]) / 2) - this.separation[0] / 2;
        this.offset[1] = ((this.separation[1] * this.count[1]) / 2) - this.separation[1] / 2;
    }

    addToScene(scene) {
        this.particles.forEach((p) => {
            scene.add(p);
        })
    }

    setSize(radius) {
        const diameter = radius * 2;
        this.particles.forEach((p) => {
            p.scale.copy(new Vector3(diameter, diameter, diameter));
        })
    }

    withinBounds(value, leftBound, rightBound) {
        if (value >= leftBound && value <= rightBound) return true;
        else return false;
    }

    lerpColor(a, b, amount) {
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
}