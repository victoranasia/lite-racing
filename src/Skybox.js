import * as THREE from "three";

export class Skybox {

    constructor(scene) {

        this.scene =
            scene;

        this.loader =
            new THREE.CubeTextureLoader();

    }


    load() {

        const texture =
            this.loader.load([

                "./assets/skybox/px.jpg",

                "./assets/skybox/nx.jpg",

                "./assets/skybox/py.jpg",

                "./assets/skybox/ny.jpg",

                "./assets/skybox/pz.jpg",

                "./assets/skybox/nz.jpg"

            ]);


        texture.colorSpace =
            THREE.SRGBColorSpace;


        this.scene.background =
            texture;

    }

}
