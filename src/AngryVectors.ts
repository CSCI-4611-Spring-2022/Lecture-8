import * as THREE from 'three'
import { GraphicsApp } from './GraphicsApp'
import { Projectile } from './Projectile'

export class AngryVectors extends GraphicsApp
{ 
    private inputVector : THREE.Vector3;
    private projectile : Projectile;
    private arrow : THREE.Group;

    private arrowPitch : number;
    private arrowYaw : number;

    constructor()
    {
        // Pass in the aspect ratio to the constructor
        super(1920/1080);
        
        // Initialize all member variables here
        // This will help prevent runtime errors
        this.inputVector = new THREE.Vector3();
        this.projectile = new Projectile(new THREE.Vector3(0, 0.25, 2), 0.5);
        this.arrow = new THREE.Group();

        // Set the initial arrow direction
        this.arrowPitch = 20 * Math.PI / 180;
        this.arrowYaw = 0;
    }

    createScene() : void
    {
        // Setup camera
        this.camera.position.set(0, 1.6, 0);
        this.camera.lookAt(0, 1.6, 1);
        this.camera.up.set(0, 1, 0);

        // Create an ambient light
        var ambientLight = new THREE.AmbientLight('white', 0.3);
        this.scene.add(ambientLight);

        // Create a directional light
        var directionalLight = new THREE.DirectionalLight('white', .6);
        directionalLight.position.set(0, 2, 1);
        this.scene.add(directionalLight)

        // Create the skybox material
        var skyboxMaterial = new THREE.MeshBasicMaterial();
        skyboxMaterial.side = THREE.BackSide;
        skyboxMaterial.color.set('skyblue');

        // Create a skybox
        var skybox = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), skyboxMaterial);
        this.scene.add(skybox)

        // Create the ground material
        var groundMaterial = new THREE.MeshLambertMaterial();
        groundMaterial.color.set('green');

        // Create a field mesh
        var ground = new THREE.Mesh(new THREE.BoxGeometry(1000, 1, 1000), groundMaterial);
        ground.position.set(0, -.5, 0);
        this.scene.add(ground)

        // Add the projectile to the scene
        this.scene.add(this.projectile);

        var arrowMaterial = new THREE.MeshLambertMaterial();
        arrowMaterial.color.set('blue');

        var arrowCylinder = new THREE.CylinderGeometry(0.05, 0.05, 2);
        var arrowMesh = new THREE.Mesh(arrowCylinder, arrowMaterial);
        arrowMesh.position.set(0, 0, 1);
        arrowMesh.rotateX(90 * Math.PI / 180);
        this.arrow.add(arrowMesh);

        var arrowCone = new THREE.ConeGeometry(0.1, 0.25);
        var arrowConeMesh = new THREE.Mesh(arrowCone, arrowMaterial);
        arrowConeMesh.position.set(0, 1, 0);
        arrowMesh.add(arrowConeMesh);

        this.arrow.position.set(0, 0.25, 2);
        this.scene.add(this.arrow);
    }

    update(deltaTime : number) : void
    {
        // This rotation code doesn't work correctly because of the order of rotations
        //this.arrow.rotateX(90 * Math.PI / 180 * deltaTime * -this.inputVector.y);
        //this.arrow.rotateY(90 * Math.PI / 180 * deltaTime * -this.inputVector.x);

        this.arrowPitch += 90 * Math.PI / 180 * deltaTime * this.inputVector.y;
        this.arrowYaw += 90 * Math.PI / 180 * deltaTime * -this.inputVector.x;

        const maxArrowYaw = 90 * Math.PI / 180;
        const maxArrowPitch = 75 * Math.PI / 180;

        if(this.arrowYaw >= maxArrowYaw)
            this.arrowYaw = maxArrowYaw;
        else if(this.arrowYaw <= -maxArrowYaw)
            this.arrowYaw = -maxArrowYaw;

        if(this.arrowPitch >= maxArrowPitch)
            this.arrowPitch = maxArrowPitch;
        else if(this.arrowPitch <= 0)
            this.arrowPitch = 0;

        var rotationMatrixX = new THREE.Matrix4().makeRotationX(-this.arrowPitch);
        var rotationMatrixY = new THREE.Matrix4().makeRotationY(this.arrowYaw);
        this.arrow.setRotationFromMatrix(rotationMatrixY.multiply(rotationMatrixX));

        const scaleSpeed = 1.5;
        const maxScale = 3;
        const minScale = 0.1;

        this.arrow.scale.z += this.inputVector.z * scaleSpeed * deltaTime;

        if(this.arrow.scale.z > maxScale)
            this.arrow.scale.z = maxScale;
        else if(this.arrow.scale.z < minScale)
            this.arrow.scale.z = minScale;

        this.projectile.update(deltaTime);
    }

    fire(): void
    {
        if(this.projectile.velocity.length() == 0)
        {
            const speedMultiplier = 20;
            var speed = this.arrow.scale.z * speedMultiplier;

            var direction = new THREE.Vector3(0, 0, 1);
            direction.applyEuler(this.arrow.rotation);
            direction.normalize();

            this.projectile.velocity.copy(direction);
            this.projectile.velocity.multiplyScalar(speed);
        }    
    }

    // Event handler for keyboard input
    // You don't need to modify this function
    onKeyDown(event: KeyboardEvent): void 
    {
        if(event.key == 'w')
            this.inputVector.y = 1;
        else if(event.key == 's')
            this.inputVector.y = -1;
        else if(event.key == 'a')
            this.inputVector.x = -1;
        else if(event.key == 'd')
            this.inputVector.x = 1;
        else if(event.key == 'ArrowUp')
            this.inputVector.z = 1;
        else if(event.key == 'ArrowDown')
            this.inputVector.z = -1;
        else if(event.key == ' ')
            this.fire();
        else if(event.key == 'r')
            this.projectile.reset();
    }

    // Event handler for keyboard input
    // You don't need to modify this function
    onKeyUp(event: KeyboardEvent): void 
    {
        if(event.key == 'w' && this.inputVector.y == 1)
            this.inputVector.y = 0;
        else if(event.key == 's' && this.inputVector.y == -1)
            this.inputVector.y = 0;
        else if(event.key == 'a'  && this.inputVector.x == -1)
            this.inputVector.x = 0;
        else if(event.key == 'd'  && this.inputVector.x == 1)
            this.inputVector.x = 0;
        else if(event.key == 'ArrowUp' && this.inputVector.z == 1)
            this.inputVector.z = 0;
        else if(event.key == 'ArrowDown' && this.inputVector.z == -1)
            this.inputVector.z = 0;
    }
}
