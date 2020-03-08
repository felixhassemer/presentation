export class Particle {
    constructor(position, color, geometry) {
        // new THREE.CircleBufferGeometry(radius, segments);
        this.geometry = geometry;
        this.material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
        this.shape = new THREE.Mesh(this.geometry, this.material);
        this.shape.position.x = position.x;
        this.shape.position.y = position.y;
        this.shape.position.z = position.z;
    }
    run() {
        this.update();
    }
    update(position) {
        this.shape.position.x = position.x;
        this.shape.position.y = position.y;
        this.shape.position.z = position.z;
    }
}