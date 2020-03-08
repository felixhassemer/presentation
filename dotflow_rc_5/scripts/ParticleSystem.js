import { Particle } from './Particle.js';
import { Vector3 } from '../node_modules/three/build/three.module.js';
// import { Scene } from 'three/build/three.module';

export class ParticleSystem {
    constructor(center, count, separation, geometry, color) {
        this.particles = [];
        this.center = center;
        this.count = count;
        this.separation = separation;
        this.colorStops = color;
        this.geometry = geometry;
        this.noise = {
            globalScale: 1,
            increment: [.15, .2, .01],
            offset: [.0, .0, .0],
            amplitude: 3
        }
    }

    generateParticles() {

        this.particles = [];
        // console.log(this.particles);
        for (let i = 0; i < this.count[0]; i++) {
            for (let j = 0; j < this.count[1]; j++) {
                for (let k = 0; k < this.count[2]; k++) {
                    this.particles.push(new Particle(this.center, this.colorStops[0], this.geometry));
                }
            }
        }
    }

    updateParticles(lookTarget) {
        // calculate offsets so the Particlesystem is centered
        const xOff = ((this.separation[0] * this.count[0]) / 2) - this.separation[0] / 2;
        const yOff = ((this.separation[1] * this.count[1]) / 2) - this.separation[1] / 2;
        const zOff = ((this.separation[2] * this.count[2]) / 2) - this.separation[2] / 2;

        this.noise.offset[0] = 0;
        for (let i = 0; i < this.count[0]; i++) {
            this.noise.offset[1] = 0;
            for (let j = 0; j < this.count[1]; j++) {
                for (let k = 0; k < this.count[2]; k++) {
                    const x = this.separation[0] * i - xOff;
                    const y = this.separation[1] * j - yOff;
                    const z = this.separation[2] * k - zOff;

                    // calculate index of current particle
                    const index = i + this.count[0] * (j + this.count[1] * k);
                    this.particles[index].shape.lookAt(lookTarget);

                    // noise generation dependent on position scaled by value
                    const currentNoise = noise.perlin3(this.noise.offset[0], this.noise.offset[1], this.noise.offset[2]);
                    const scaledNoise = this.noise.amplitude * currentNoise;
                    const position = new THREE.Vector3(x, scaledNoise + z, y)
                    this.particles[index].shape.position.copy(position);

                    // set particle color
                    const amount = Math.abs(currentNoise);
                    // const amount = Math.abs(Math.sin(.3 * y - this.noise.offset[2] * 1.4));
                    // this.particles[index].shape.scale.copy(new Vector3(amount, amount, amount));
                    this.particles[index].material.color.set(this.lerpColor(this.colorStops[0], this.colorStops[1], amount));
                }

                this.noise.offset[1] += this.noise.increment[1] * this.noise.globalScale;
            }
            this.noise.offset[0] += this.noise.increment[0] * this.noise.globalScale;
        }
        this.noise.offset[2] += this.noise.increment[2];
    }

    addToScene(scene) {
        this.particles.forEach((p) => {
            scene.add(p.shape);
        })
    }

    setSize(radius) {
        this.particles.forEach((p) => {
            const scale = radius;
            p.shape.scale.copy(new Vector3(scale, scale, scale));
        })
    }

    updateNoise(position, xScl, yScl, gScl, offset) {
        const xN = (position.x * xScl) * gScl;
        const yN = (position.y * yScl) * gScl;
        const result = noise.perlin3(xN, yN, offset);
        return result;
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