import * as THREE from "three";

export class NitroEffect {

    constructor(car) {

        this.car = car;

        this.active = false;

        this.flames = [];

        this.create();

    }


    create() {

        for (
            const x of [-0.45, 0.45]
        ) {

            const geometry =
                new THREE.ConeGeometry(
                    0.12,
                    0.7,
                    8
                );


            const material =
                new THREE.MeshBasicMaterial({

                    color: 0x00aaff,

                    transparent: true,

                    opacity: 0.9

                });


            const flame =
                new THREE.Mesh(
                    geometry,
                    material
                );


            flame.rotation.x =
                -Math.PI / 2;


            flame.position.set(
                x,
                0.48,
                -1.95
            );


            flame.visible =
                false;


            this.car.object.add(
                flame
            );


            this.flames.push(
                flame
            );

        }

    }


    setActive(active) {

        this.active =
            active;


        this.flames.forEach(
            flame => {

                flame.visible =
                    active;

            }
        );

    }


    update() {

        if (!this.active) {

            return;

        }


        this.flames.forEach(
            flame => {

                const scale =
                    0.7 +
                    Math.random() * 0.6;


                flame.scale.set(
                    1,
                    scale,
                    1
                );

            }
        );

    }

}
