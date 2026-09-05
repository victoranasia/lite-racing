import * as THREE from "three";

import {
    GraphicsSettings
} from "./GraphicsSettings.js";


export class GraphicsManager {

    constructor(renderer = null) {

        this.renderer =
            renderer instanceof THREE.WebGLRenderer
                ? renderer
                : new THREE.WebGLRenderer({

                    antialias:
                        GraphicsSettings.antialias

                });


        this.renderer.setPixelRatio(
            GraphicsSettings.pixelRatio
        );


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;


        this.renderer.shadowMap.enabled =
            GraphicsSettings.shadows;


        if (!renderer) {

            const container =
                document.getElementById(
                    "game-container"
                ) ||
                document.body;

            container.appendChild(
                this.renderer.domElement
            );

        }

    }


    resize() {

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        this.renderer.setPixelRatio(
            GraphicsSettings.pixelRatio
        );

    }


    render(scene, camera) {

        this.renderer.render(
            scene,
            camera
        );

    }

}


export default GraphicsManager;
