import * as THREE from "three";

export class ParticleSystem {

    constructor(scene) {

        this.scene = scene;

        this.particles = [];

    }


    createSmoke(
        position,
        amount = 3
    ) {

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.15 +
                    Math.random() * 0.2,
                    8,
                    8
                );


            const material =
                new THREE.MeshBasicMaterial({

                    color: 0x999999,

                    transparent: true,

                    opacity: 0.45

                });


            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                );


            particle.position.copy(
                position
            );


            particle.position.x +=
                (Math.random() - 0.5) *
                0.5;


            particle.position.z +=
                (Math.random() - 0.5) *
                0.5;


            particle.velocity =
                new THREE.Vector3(

                    (Math.random() - 0.5)
                    * 0.4,

                    0.3 +
                    Math.random() * 0.3,

                    (Math.random() - 0.5)
                    * 0.4

                );


            particle.life =
                0.5 +
                Math.random() * 0.5;


            this.scene.add(
                particle
            );


            this.particles.push(
                particle
            );

        }

    }


    update(delta) {

        for (
            let i =
                this.particles.length - 1;

            i >= 0;

            i--
        ) {

            const particle =
                this.particles[i];


            particle.position.add(
                particle.velocity
                    .clone()
                    .multiplyScalar(delta)
            );


            particle.velocity.y +=
                0.15 * delta;


            particle.scale.multiplyScalar(
                1.02
            );


            particle.material.opacity -=
                delta * 0.7;


            particle.life -=
                delta;


            if (
                particle.life <= 0
            ) {

                this.scene.remove(
                    particle
                );


                particle.geometry.dispose();

                particle.material.dispose();


                this.particles.splice(
                    i,
                    1
                );

            }

        }

    }

}
