this.cameraEffects =
    new CameraEffects(
        this.camera
    );
    this.cameraEffects.update(
    delta
);


this.cameraEffects.speedEffect(
    this.player.physics.speed
);
this.cameraEffects.shakeCamera(
    0.25
);



export class CameraEffects {

    constructor(camera) {

        this.camera =
            camera;

        this.shake =
            0;

        this.originalFOV =
            camera.fov;

    }
    


    shakeCamera(
        amount
    ) {

        this.shake =
            Math.max(
                this.shake,
                amount
            );

    }


    update(delta) {

        if (
            this.shake > 0
        ) {

            this.camera.position.x +=
                (Math.random() - 0.5) *
                this.shake;


            this.camera.position.y +=
                (Math.random() - 0.5) *
                this.shake;


            this.camera.position.z +=
                (Math.random() - 0.5) *
                this.shake;


            this.shake *=
                Math.pow(
                    0.05,
                    delta
                );

        }

    }


    speedEffect(
        speed
    ) {

        const targetFOV =
            this.originalFOV +
            Math.min(
                speed * 0.15,
                12
            );


        this.camera.fov +=
            (
                targetFOV -
                this.camera.fov
            ) * 0.05;


        this.camera.updateProjectionMatrix();

    }

    

}