import * as THREE from "three";


export class CameraController {

    constructor(camera) {

        this.camera = camera;


        this.offset =
            new THREE.Vector3(
                0,
                7,
                11
            );


        this.lookAtOffset =
            new THREE.Vector3(
                0,
                1,
                0
            );

    }


    update(car) {

        const rotatedOffset =
            this.offset.clone();


        rotatedOffset.applyQuaternion(
            car.object.quaternion
        );


        const targetPosition =
            car.object.position
                .clone()
                .add(
                    rotatedOffset
                );


        this.camera.position.lerp(
            targetPosition,
            0.08
        );


        const lookTarget =
            car.object.position
                .clone()
                .add(
                    this.lookAtOffset
                );


        this.camera.lookAt(
            lookTarget
        );

    }

}