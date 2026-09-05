import * as THREE from "three";

export class WeatherSystem {

    constructor(scene) {

        this.scene =
            scene;

        this.rain =
            null;

        this.rainCount =
            2500;

        this.createRain();

    }


    createRain() {

        const geometry =
            new THREE.BufferGeometry();


        const positions =
            new Float32Array(
                this.rainCount * 3
            );


        for (
            let i = 0;
            i < this.rainCount;
            i++
        ) {

            positions[i * 3] =
                (Math.random() - 0.5) *
                100;


            positions[i * 3 + 1] =
                Math.random() *
                40;


            positions[i * 3 + 2] =
                (Math.random() - 0.5) *
                200;

        }


        geometry.setAttribute(

            "position",

            new THREE.BufferAttribute(
                positions,
                3
            )

        );


        const material =
            new THREE.PointsMaterial({

                color: 0x9ecfff,

                size: 0.08,

                transparent: true,

                opacity: 0.6

            });


        this.rain =
            new THREE.Points(
                geometry,
                material
            );


        this.rain.visible =
            false;


        this.scene.add(
            this.rain
        );

    }


    setRain(enabled) {

        this.rain.visible =
            enabled;

    }


    update(delta) {

        if (
            !this.rain.visible
        ) {

            return;

        }


        const positions =
            this.rain.geometry
                .attributes
                .position.array;


        for (
            let i = 0;
            i < this.rainCount;
            i++
        ) {

            positions[i * 3 + 1] -=
                30 * delta;


            if (
                positions[i * 3 + 1]
                < 0
            ) {

                positions[i * 3 + 1] =
                    40;

            }

        }


        this.rain.geometry
            .attributes
            .position
            .needsUpdate =
            true;
this.weather.setRain(true);
this.weather.setRain(false);
    }

    
}

