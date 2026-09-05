import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class GLTFCarLoader {

    constructor() {

        this.loader = new GLTFLoader();

    }


    load(path) {

        return new Promise(
            (resolve, reject) => {

                this.loader.load(

                    path,

                    gltf => {

                        const car =
                            gltf.scene;

                        car.traverse(
                            object => {

                                if (
                                    object.isMesh
                                ) {

                                    object.castShadow =
                                        true;

                                    object.receiveShadow =
                                        true;

                                    if (
                                        object.material
                                    ) {

                                        object.material
                                            .metalness =
                                            Math.max(
                                                object.material.metalness || 0,
                                                0.2
                                            );

                                        object.material
                                            .roughness =
                                            Math.min(
                                                object.material.roughness || 0.5,
                                                0.7
                                            );

                                    }

                                }

                            }
                        );


                        resolve(car);

                    },

                    undefined,

                    error => {

                        reject(error);

                    }

                );

            }
        );

    }

}
