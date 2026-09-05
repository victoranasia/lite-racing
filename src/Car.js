import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


// ============================================================
// CAR
// ============================================================

class Car {

    constructor(options = {}) {

        this.name =
            options.name || "CAR";

        this.color =
            options.color ?? 0xd90429;

        this.isAI =
            options.isAI ?? false;

        this.modelPath =
            options.modelPath || null;


        // ====================================================
        // RACE STATE
        // ====================================================

        this.finished = false;

        this.finishTime = 0;

        this.lap = 1;

        this.checkpointIndex = 0;

        this.totalProgress = 0;


        // ====================================================
        // CAR PHYSICS
        // ====================================================

        this.physics = {

            position:
                new THREE.Vector3(
                    0,
                    0,
                    0
                ),

            rotation: Math.PI,

            velocity: 0,

            speed: 0,

            lateralVelocity: 0
        };


        // ====================================================
        // ENGINE / DRIVING
        // ====================================================

        this.maxSpeed = 42;

        this.reverseSpeed = 12;

        this.acceleration = 25;

        this.brakingPower = 45;

        this.friction = 7;

        this.drag = 0.985;

        this.steering = 2.4;

        this.grip = 8;

        this.driftGrip = 2.5;


        // ====================================================
        // NITRO
        // ====================================================

        this.nitro = null;

        this.nitroActive = false;

        this.nitroBoost = 22;


        // ====================================================
        // BRAKING
        // ====================================================

        this.isBraking = false;


        // ====================================================
        // VISUAL
        // ====================================================

        this.object =
            new THREE.Group();

        this.object.name =
            this.name;


        // ====================================================
        // MODEL
        // ====================================================

        this.model = null;

        this.createFallbackCar();


        // ====================================================
        // WHEELS
        // ====================================================

        this.wheels = [];

        this.steeringWheels = [];


        // ====================================================
        // INITIALIZATION
        // ====================================================

        if (this.modelPath) {
            this.initialize();
        }

        this.syncObject();
    }


    // =========================================================
    // FALLBACK CAR
    // =========================================================

    createFallbackCar() {

        const bodyMaterial =
            new THREE.MeshStandardMaterial({

                color: this.color,

                metalness: 0.65,

                roughness: 0.25
            });


        const darkMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x111111,

                metalness: 0.3,

                roughness: 0.5
            });


        const glassMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x182433,

                metalness: 0.15,

                roughness: 0.15,

                transparent: true,

                opacity: 0.85
            });


        // =====================================================
        // MAIN BODY
        // =====================================================

        const bodyGeometry =
            new THREE.BoxGeometry(
                1.8,
                0.55,
                3.8
            );

        const body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );

        body.position.y = 0.55;

        body.castShadow = true;

        body.receiveShadow = true;

        this.object.add(body);


        // =====================================================
        // CABIN
        // =====================================================

        const cabinGeometry =
            new THREE.BoxGeometry(
                1.45,
                0.55,
                1.7
            );

        const cabin =
            new THREE.Mesh(
                cabinGeometry,
                glassMaterial
            );

        cabin.position.set(
            0,
            0.95,
            0.15
        );

        cabin.castShadow = true;

        this.object.add(cabin);


        // =====================================================
        // FRONT HOOD
        // =====================================================

        const hoodGeometry =
            new THREE.BoxGeometry(
                1.65,
                0.18,
                1.0
            );

        const hood =
            new THREE.Mesh(
                hoodGeometry,
                bodyMaterial
            );

        hood.position.set(
            0,
            0.75,
            -1.15
        );

        this.object.add(hood);


        // =====================================================
        // REAR
        // =====================================================

        const rearGeometry =
            new THREE.BoxGeometry(
                1.65,
                0.2,
                0.8
            );

        const rear =
            new THREE.Mesh(
                rearGeometry,
                bodyMaterial
            );

        rear.position.set(
            0,
            0.72,
            1.35
        );

        this.object.add(rear);


        // =====================================================
        // WHEELS
        // =====================================================

        const wheelGeometry =
            new THREE.CylinderGeometry(
                0.38,
                0.38,
                0.28,
                20
            );


        const wheelPositions = [

            [-0.95, 0.38, -1.2],

            [ 0.95, 0.38, -1.2],

            [-0.95, 0.38,  1.2],

            [ 0.95, 0.38,  1.2]

        ];


        for (
            let i = 0;
            i < wheelPositions.length;
            i++
        ) {

            const wheel =
                new THREE.Mesh(
                    wheelGeometry,
                    darkMaterial
                );

            wheel.rotation.z =
                Math.PI / 2;

            wheel.position.set(
                ...wheelPositions[i]
            );

            wheel.castShadow = true;

            this.object.add(wheel);

            this.wheels.push(wheel);


            if (i < 2) {

                this.steeringWheels.push(
                    wheel
                );

            }
        }


        // =====================================================
        // HEADLIGHTS
        // =====================================================

        const lightMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xffffff,

                emissive: 0xffffff,

                emissiveIntensity: 2
            });


        const headlightGeometry =
            new THREE.BoxGeometry(
                0.35,
                0.12,
                0.08
            );


        const leftHeadlight =
            new THREE.Mesh(
                headlightGeometry,
                lightMaterial
            );

        leftHeadlight.position.set(
            -0.58,
            0.65,
            -1.92
        );


        const rightHeadlight =
            leftHeadlight.clone();

        rightHeadlight.position.x =
            0.58;


        this.object.add(
            leftHeadlight,
            rightHeadlight
        );


        // =====================================================
        // TAIL LIGHTS
        // =====================================================

        const tailMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xff0000,

                emissive: 0xff0000,

                emissiveIntensity: 1.5
            });


        const tailGeometry =
            new THREE.BoxGeometry(
                0.4,
                0.12,
                0.08
            );


        const leftTail =
            new THREE.Mesh(
                tailGeometry,
                tailMaterial
            );

        leftTail.position.set(
            -0.58,
            0.65,
            1.92
        );


        const rightTail =
            leftTail.clone();

        rightTail.position.x =
            0.58;


        this.object.add(
            leftTail,
            rightTail
        );


        // =====================================================
        // SHADOWS
        // =====================================================

        this.object.traverse(
            child => {

                if (
                    child.isMesh
                ) {

                    child.castShadow = true;

                    child.receiveShadow = true;
                }

            }
        );
    }


    // =========================================================
    // GLTF MODEL INITIALIZATION
    // =========================================================

    async initialize() {

        if (!this.modelPath) {

            return this;
        }


        const loader =
            new GLTFLoader();


        try {

            const gltf =
                await loader.loadAsync(
                    this.modelPath
                );


            if (!gltf || !gltf.scene) {

                return this;
            }


            this.model =
                gltf.scene;


            this.model.scale.set(
                1,
                1,
                1
            );


            this.model.position.set(
                0,
                0,
                0
            );


            this.model.traverse(
                child => {

                    if (
                        child.isMesh
                    ) {

                        child.castShadow = true;

                        child.receiveShadow = true;
                    }

                }
            );


            // Remove fallback car
            while (
                this.object.children.length
            ) {

                this.object.remove(
                    this.object.children[0]
                );

            }


            this.object.add(
                this.model
            );


            this.syncObject();

        }

        catch (error) {

            console.warn(
                `Could not load car model: ${this.modelPath}`,
                error
            );

            // Keep fallback car
        }


        return this;
    }


    // =========================================================
    // UPDATE
    // =========================================================

    update(input, delta) {

        if (
            !Number.isFinite(delta) ||
            delta <= 0
        ) {

            return;
        }


        delta =
            Math.min(
                delta,
                0.05
            );


        // =====================================================
        // INPUT
        // =====================================================

        const throttle =
            this.readInput(
                input,
                [
                    "accelerate",
                    "throttle",
                    "up",
                    "forward"
                ]
            );


        const brake =
            this.readInput(
                input,
                [
                    "brake",
                    "reverse",
                    "down",
                    "backward"
                ]
            );


        const left =
            this.readInput(
                input,
                [
                    "left",
                    "steerLeft"
                ]
            );


        const right =
            this.readInput(
                input,
                [
                    "right",
                    "steerRight"
                ]
            );


        let steering = 0;


        if (left) {

            steering -= 1;
        }


        if (right) {

            steering += 1;
        }


        // =====================================================
        // AI COMPATIBILITY
        // =====================================================

        if (input?.steering !== undefined) {

            const aiSteering =
                Number(input.steering);


            if (
                Number.isFinite(aiSteering)
            ) {

                steering =
                    THREE.MathUtils.clamp(
                        aiSteering,
                        -1,
                        1
                    );

            }
        }


        // =====================================================
        // THROTTLE
        // =====================================================

        const forwardSpeed =
            this.physics.velocity;


        if (throttle) {

            if (
                forwardSpeed <
                this.maxSpeed
            ) {

                this.physics.velocity +=
                    this.acceleration *
                    delta;

            }

        }


        // =====================================================
        // BRAKING
        // =====================================================

        this.isBraking =
            !!brake &&
            forwardSpeed > 0;


        if (brake) {

            if (
                forwardSpeed > 0
            ) {

                this.physics.velocity =
                    Math.max(
                        0,
                        forwardSpeed -
                        this.brakingPower *
                        delta
                    );

            }

            else {

                // Reverse

                this.physics.velocity =
                    Math.max(
                        -this.reverseSpeed,

                        this.physics.velocity -
                        this.acceleration *
                        0.55 *
                        delta
                    );

            }

        }


        // =====================================================
        // NATURAL FRICTION
        // =====================================================

        if (
            !throttle &&
            !brake
        ) {

            const friction =
                this.friction *
                delta;


            if (
                this.physics.velocity > 0
            ) {

                this.physics.velocity =
                    Math.max(
                        0,
                        this.physics.velocity -
                        friction
                    );

            }

            else if (
                this.physics.velocity < 0
            ) {

                this.physics.velocity =
                    Math.min(
                        0,
                        this.physics.velocity +
                        friction
                    );

            }

        }


        // =====================================================
        // NITRO
        // =====================================================

        if (
            this.nitroActive
        ) {

            this.physics.velocity +=
                this.nitroBoost *
                delta;


            this.physics.velocity =
                Math.min(
                    this.physics.velocity,
                    this.maxSpeed +
                    this.nitroBoost
                );

        }


        // =====================================================
        // SPEED LIMIT
        // =====================================================

        this.physics.velocity =
            THREE.MathUtils.clamp(

                this.physics.velocity,

                -this.reverseSpeed,

                this.maxSpeed +
                this.nitroBoost
            );


        // =====================================================
        // STEERING
        // =====================================================

        const speedRatio =
            THREE.MathUtils.clamp(

                Math.abs(
                    this.physics.velocity
                ) / this.maxSpeed,

                0,
                1
            );


        if (
            Math.abs(
                this.physics.velocity
            ) > 0.1
        ) {

            const steeringStrength =
                this.steering *
                (0.35 + speedRatio * 0.65);


            this.physics.rotation +=

                steering *
                steeringStrength *
                delta *
                Math.sign(
                    this.physics.velocity
                );

        }


        // =====================================================
        // LATERAL GRIP
        // =====================================================

        const grip =
            Math.abs(
                steering
            ) > 0.6
                ? this.driftGrip
                : this.grip;


        this.physics.lateralVelocity *=

            Math.max(
                0,
                1 -
                grip *
                delta
            );


        // =====================================================
        // FORWARD MOVEMENT
        // =====================================================

        const forward =
            new THREE.Vector3(
                0,
                0,
                -1
            );


        forward.applyAxisAngle(
            new THREE.Vector3(
                0,
                1,
                0
            ),
            this.physics.rotation
        );


        this.physics.position.add(

            forward.multiplyScalar(

                this.physics.velocity *
                delta

            )

        );


        // =====================================================
        // VISUAL STEERING
        // =====================================================

        this.updateWheelSteering(
            steering
        );


        // =====================================================
        // WHEEL ROTATION
        // =====================================================

        this.updateWheels(
            delta
        );


        // =====================================================
        // SYNC
        // =====================================================

        this.syncObject();


        // =====================================================
        // SPEED
        // =====================================================

        this.physics.speed =
            Math.abs(
                this.physics.velocity
            );


        // =====================================================
        // DRAG
        // =====================================================

        if (
            !throttle &&
            !brake
        ) {

            this.physics.velocity *=
                Math.pow(
                    this.drag,
                    delta * 60
                );

        }

    }


    // =========================================================
    // INPUT READER
    // =========================================================

    readInput(input, names) {

        if (!input) {

            return false;
        }


        for (
            const name of names
        ) {

            if (
                input[name] === true
            ) {

                return true;
            }


            if (
                typeof input[name] ===
                "number" &&
                Math.abs(input[name]) >
                0.15
            ) {

                return true;
            }

        }


        return false;
    }


    // =========================================================
    // WHEEL STEERING
    // =========================================================

    updateWheelSteering(
        steering
    ) {

        for (
            const wheel
            of this.steeringWheels
        ) {

            wheel.rotation.y =
                steering * 0.45;

        }

    }


    // =========================================================
    // WHEEL ROTATION
    // =========================================================

    updateWheels(
        delta
    ) {

        const rotationAmount =
            this.physics.velocity *
            delta /
            0.38;


        for (
            const wheel
            of this.wheels
        ) {

            wheel.rotation.x +=
                rotationAmount;

        }

    }


    // =========================================================
    // SYNC THREE.JS OBJECT
    // =========================================================

    syncObject() {

        this.object.position.copy(
            this.physics.position
        );


        this.object.rotation.y =
            this.physics.rotation;


        // Keep car slightly above road

        this.object.position.y =
            this.physics.position.y;
    }


    // =========================================================
    // SPEED
    // =========================================================

    getSpeed() {

        // Convert game units to a
        // believable KM/H display.

        return Math.round(
            Math.abs(
                this.physics.velocity
            ) * 5
        );

    }


    // =========================================================
    // NITRO
    // =========================================================

    activateNitro() {

        this.nitroActive = true;

        this.nitro = true;
    }


    deactivateNitro() {

        this.nitroActive = false;

        this.nitro = false;
    }


    // =========================================================
    // RESET
    // =========================================================

    reset(
        x = 0,
        y = 0,
        z = 0,
        rotation = Math.PI
    ) {

        this.physics.position.set(
            x,
            y,
            z
        );


        this.physics.rotation =
            rotation;


        this.physics.velocity =
            0;


        this.physics.speed =
            0;


        this.physics.lateralVelocity =
            0;


        this.finished =
            false;


        this.finishTime =
            0;


        this.lap =
            1;


        this.checkpointIndex =
            0;


        this.totalProgress =
            0;


        this.deactivateNitro();


        this.syncObject();
    }


    // =========================================================
    // DAMAGE / CRASH RESPONSE
    // =========================================================

    hit(force = 0.5) {

        this.physics.velocity *=

            THREE.MathUtils.clamp(
                1 - force,
                0,
                1
            );

    }


    // =========================================================
    // CLEANUP
    // =========================================================

    dispose() {

        this.object.traverse(
            child => {

                if (
                    child.geometry
                ) {

                    child.geometry.dispose();

                }


                if (
                    child.material
                ) {

                    if (
                        Array.isArray(
                            child.material
                        )
                    ) {

                        child.material.forEach(
                            material => {

                                material.dispose();

                            }
                        );

                    }

                    else {

                        child.material.dispose();

                    }

                }

            }
        );

    }

}


export { Car };