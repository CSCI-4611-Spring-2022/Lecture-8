import * as THREE from 'three'

export class Projectile extends THREE.Object3D
{
    readonly radius : number;

    public velocity : THREE.Vector3;
    public initialPosition : THREE.Vector3;

    constructor(position: THREE.Vector3, radius : number)
    {
        super();
        this.radius = radius;
        this.velocity = new THREE.Vector3();
        this.initialPosition = position;

        // Create a sphere
        var geometry = new THREE.SphereGeometry(this.radius);
        var material = new THREE.MeshPhongMaterial();
        material.color = new THREE.Color(0.335, 0.775, 0.891);
        this.add(new THREE.Mesh(geometry, material));
          
        this.reset();
    }

    public reset() : void
    {
        // Reset the projectiles's position
        this.position.copy(this.initialPosition);

        // Reset the velocity
        this.velocity.set(0, 0, 0);
    }

    public update(deltaTime : number) : void
    {
       
    }
}