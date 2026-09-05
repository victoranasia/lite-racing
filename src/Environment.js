import * as THREE from "three";

export class Environment {

    constructor(scene) {

        this.scene = scene;

        this.objects = [];

        this.build();

    }


    build() {

        this.createGround();

        this.createTrees();

        this.createBuildings();

        this.createStreetLights();

        this.createMountains();

    }


    // =====================================
    // GROUND
    // =====================================

    createGround() {

        const geometry =
            new THREE.PlaneGeometry(
                500,
                500
            );


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x31572c,

                roughness: 1

            });


        const ground =
            new THREE.Mesh(
                geometry,
                material
            );


        ground.rotation.x =
            -Math.PI / 2;


        ground.receiveShadow =
            true;


        this.scene.add(
            ground
        );

    }


    // =====================================
    // TREES
    // =====================================

    createTrees() {

        const trunkMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x5d4037

            });


        const leavesMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x1b5e20

            });


        for (
            let i = 0;
            i < 80;
            i++
        ) {

            const tree =
                new THREE.Group();


            const trunk =
                new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        0.15,
                        0.2,
                        2,
                        8
                    ),

                    trunkMaterial

                );


            trunk.position.y =
                1;


            tree.add(trunk);


            const leaves =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        1,
                        10,
                        10
                    ),

                    leavesMaterial

                );


            leaves.position.y =
                2.2;


            tree.add(leaves);


            const side =
                Math.random() > 0.5
                    ? 1
                    : -1;


            tree.position.set(

                side *
                (8 + Math.random() * 15),

                0,

                -100 +
                Math.random() * 250

            );


            const scale =
                0.7 +
                Math.random() * 0.8;


            tree.scale.setScalar(
                scale
            );


            this.scene.add(tree);

        }

    }


    // =====================================
    // BUILDINGS
    // =====================================

    createBuildings() {

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x444444,

                roughness: 0.8

            });


        for (
            let i = 0;
            i < 25;
            i++
        ) {

            const height =
                5 +
                Math.random() * 15;


            const building =
                new THREE.Mesh(

                    new THREE.BoxGeometry(
                        4,
                        height,
                        4
                    ),

                    material

                );


            const side =
                Math.random() > 0.5
                    ? 1
                    : -1;


            building.position.set(

                side *
                (12 + Math.random() * 15),

                height / 2,

                -100 +
                Math.random() * 250

            );


            building.castShadow =
                true;


            building.receiveShadow =
                true;


            this.scene.add(
                building
            );

        }

    }


    // =====================================
    // STREET LIGHTS
    // =====================================

    createStreetLights() {

        for (
            let z = -100;
            z < 150;
            z += 15
        ) {

            this.createStreetLight(
                -5,
                z
            );

            this.createStreetLight(
                5,
                z
            );

        }

    }


    createStreetLight(
        x,
        z
    ) {

        const group =
            new THREE.Group();


        const pole =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.05,
                    0.08,
                    3,
                    8
                ),

                new THREE.MeshStandardMaterial({
                    color: 0x333333
                })

            );


        pole.position.y =
            1.5;


        group.add(pole);


        const lamp =
            new THREE.PointLight(
                0xffeeaa,
                5,
                12
            );


        lamp.position.set(
            0,
            3,
            0
        );


        group.add(lamp);


        group.position.set(
            x,
            0,
            z
        );


        this.scene.add(
            group
        );

    }


    // =====================================
    // MOUNTAINS
    // =====================================

    createMountains() {

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x555555,

                flatShading: true

            });


        for (
            let i = 0;
            i < 15;
            i++
        ) {

            const mountain =
                new THREE.Mesh(

                    new THREE.ConeGeometry(
                        15 +
                        Math.random() * 15,

                        20 +
                        Math.random() * 20,

                        6
                    ),

                    material

                );


            mountain.position.set(

                (i % 2 === 0
                    ? -1
                    : 1) *
                40,

                10,

                -150 +
                i * 25

            );


            this.scene.add(
                mountain
            );

        }

    }

}
