import * as THREE from "three";
import { GLTFCarLoader } from "./GLTFCarLoader.js";

export class CarModel {

    constructor(options = {}) {

        this.color =
            options.color || 0xd90429;

        this.modelPath =
            options.modelPath || null;

        this.group =
            new THREE.Group();

        this.loader =
            new GLTFCarLoader();

        this.wheels = [];

    }


    async load() {

        if (
            this.modelPath
        ) {

            try {

                const model =
                    await this.loader.load(
                        this.modelPath
                    );

                this.group.add(
                    model
                );

                this.model =
                    model;

                this.findWheels();

                return;

            }
            catch (error) {

                console.warn(
                    "GLB loading failed. Using procedural car.",
                    error
                );

            }

        }


        this.createFallbackCar();

    }


    createFallbackCar() {

        const material =
            new THREE.MeshStandardMaterial({

                color: this.color,

                metalness: 0.75,

                roughness: 0.25

            });


        const body =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.7,
                    0.5,
                    3.6
                ),

                material

            );


        body.position.y =
            0.55;


        body.castShadow =
            true;


        body.receiveShadow =
            true;


        this.group.add(
            body
        );


        const cabin =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.25,
                    0.5,
                    1.6
                ),

                new THREE.MeshStandardMaterial({

                    color: 0x111820,

                    metalness: 0.3,

                    roughness: 0.1

                })

            );


        cabin.position.set(
            0,
            0.9,
            -0.15
        );


        cabin.castShadow =
            true;


        this.group.add(
            cabin
        );


        const wheelPositions = [

            [-0.9, 0.35, 1.15],

            [0.9, 0.35, 1.15],

            [-0.9, 0.35, -1.15],

            [0.9, 0.35, -1.15]

        ];


        for (
            const position
            of wheelPositions
        ) {

            const wheel =
                new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        0.32,
                        0.32,
                        0.25,
                        24
                    ),

                    new THREE.MeshStandardMaterial({

                        color: 0x111111,

                        roughness: 0.8

                    })

                );


            wheel.rotation.z =
                Math.PI / 2;


            wheel.position.set(
                ...position
            );


            wheel.castShadow =
                true;


            this.group.add(
                wheel
            );


            this.wheels.push(
                wheel
            );

        }

    }


    findWheels() {

        this.wheels = [];

        this.group.traverse(
            object => {

                if (
                    object.isMesh &&
                    object.name
                        .toLowerCase()
                        .includes("wheel")
                ) {

                    this.wheels.push(
                        object
                    );

                }

            }
        );

    }


    update(delta, speed) {

        const rotation =
            speed *
            delta *
            2;


        this.wheels.forEach(
            wheel => {

                wheel.rotation.x +=
                    rotation;

            }
        );

    }


    getObject() {

        return this.group;

    }

}