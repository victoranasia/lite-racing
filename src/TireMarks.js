import * as THREE from "three";

export class TireMarks {

    constructor(scene) {

        this.scene = scene;

        this.marks = [];

    }


    create(
        position,
        rotation
    ) {

        const geometry =
            new THREE.PlaneGeometry(
                0.12,
                0.8
            );


        const material =
            new THREE.MeshBasicMaterial({

                color: 0x111111,

                transparent: true,

                opacity: 0.45,

                depthWrite: false

            });


        const mark =
            new THREE.Mesh(
                geometry,
                material
            );


        mark.rotation.x =
            -Math.PI / 2;


        mark.rotation.z =
            rotation;


        mark.position.copy(
            position
        );


        mark.position.y =
            0.012;


        this.scene.add(
            mark
        );


        this.marks.push(
            mark
        );


        if (
            this.marks.length > 300
        ) {

            const old =
                this.marks.shift();


            this.scene.remove(
                old
            );


            old.geometry.dispose();

            old.material.dispose();

        }


        if (
    this.player.isBraking
) {

    this.tireMarks.create(

        this.player.object
            .position.clone(),

        this.player.object.rotation.y

    );

}


    }

}