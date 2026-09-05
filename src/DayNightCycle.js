import * as THREE from "three";

export class DayNightCycle {

    constructor(
        scene,
        sun
    ) {

        this.scene =
            scene;

        this.sun =
            sun;

        this.time =
            12;

        this.speed =
            0.02;

    }


    update(delta) {

        this.time +=
            delta *
            this.speed;


        if (
            this.time >= 24
        ) {

            this.time = 0;

        }


        const angle =
            (this.time / 24) *
            Math.PI *
            2;


        this.sun.position.set(

            Math.cos(angle) *
            100,

            Math.sin(angle) *
            100,

            50

        );


        const daylight =
            Math.max(
                Math.sin(angle),
                0
            );


        this.sun.intensity =
            0.2 +
            daylight * 2;


        const skyColor =
            new THREE.Color();


        skyColor.setHSL(

            0.6,

            0.5,

            0.05 +
            daylight * 0.25

        );


        this.scene.background =
            skyColor;

    }


    setTime(hour) {

        this.time =
            hour;

    }

}
