export class ShadowManager {

    constructor(scene) {

        this.scene =
            scene;

    }


    optimize() {

        let count = 0;


        this.scene.traverse(
            object => {

                if (
                    !object.isMesh
                ) {

                    return;

                }


                if (
                    count < 150
                ) {

                    object.castShadow =
                        true;

                    object.receiveShadow =
                        true;

                    count++;

                }
                else {

                    object.castShadow =
                        false;

                    object.receiveShadow =
                        false;

                }

            }
        );

    }

}
