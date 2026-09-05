import * as THREE from "three";

export class LODManager {

    constructor() {

        this.lods = [];

    }


    createLOD(
        high,
        medium,
        low
    ) {

        const lod =
            new THREE.LOD();


        lod.addLevel(
            high,
            0
        );


        lod.addLevel(
            medium,
            30
        );


        lod.addLevel(
            low,
            80
        );


        this.lods.push(
            lod
        );


        return lod;

    }


    update(camera) {

        this.lods.forEach(
            lod => {

                lod.update(
                    camera
                );

            }
        );

    }

}
