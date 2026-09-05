```js
import * as THREE from "three";


// ============================================================
// PHYSICS
// Advanced arcade racing physics
// ============================================================

class Physics {

    constructor(options = {}) {

        // ====================================================
        // VEHICLE PARAMETERS
        // ====================================================

        this.mass =
            options.mass ?? 1200;

        this.maxSpeed =
            options.maxSpeed ?? 42;

        this.reverseSpeed =
            options.reverseSpeed ?? 12;

        this.acceleration =
            options.acceleration ?? 25;

        this.braking =
            options.braking ?? 45;

        this.friction =
            options.friction ?? 7;

        this.drag =
            options.drag ?? 0.985;

        this.steering =
            options.steering ?? 2.4;

        this.grip =
            options.grip ?? 8;

        this.driftGrip =
            options.driftGrip ?? 2.5;


        // ====================================================
        // NITRO
        // ====================================================

        this.nitroBoost =
            options.nitroBoost ?? 22;

        this.nitroActive =
            false;


        // ====================================================
        // STATE
        // ====================================================

        this.position =
            new THREE.Vector3();

        this.velocity =
            0;

        this.speed =
            0;

        this.rotation =
            Math.PI;

        this.lateralVelocity =
            0;

        this.isBraking =
            false;


        // ====================================================
        // TEMPORARY VECTORS
        // ====================================================

        this.forward =
            new THREE.Vector3();

        this.right =
            new THREE.Vector3();

        this.velocityVector =
            new THREE.Vector3();
    }


    // =========================================================
    // UPDATE
    // =========================================================

    update(
        input = {},
        delta = 0.016
    ) {

        if (
            !Number.isFinite(delta) ||
            delta <= 0
        ) {

            return;
        }


        // Prevent unstable physics after lag spikes

        delta =
            Math.min(
                delta,
                0.05
            );


        // ====================================================
        // INPUT
        // ====================================================

        const throttle =
            this.getInput(
                input,
                [
                    "accelerate",
                    "throttle",
                    "up",
                    "forward"
                ]
            );


        const brake =
            this.getInput(
                input,
                [
                    "brake",
                    "reverse",
                    "down",
                    "backward"
                ]
            );


        let steeringInput = 0;


        if (
            this.getInput(
                input,
                [
                    "left",
                    "steerLeft"
                ]
            )
        ) {

            steeringInput -= 1;
        }


        if (
            this.getInput(
                input,
                [
                    "right",
                    "steerRight"
                ]
            )
        ) {

            steeringInput += 1;
        }


        // AI / controller compatibility

        if (
            typeof input.steering ===
            "number"
        ) {

            steeringInput =
                THREE.MathUtils.clamp(
                    input.steering,
                    -1,
                    1
                );
        }


        // ====================================================
        // ACCELERATION
        // ====================================================

        if (throttle) {

            const accelerationForce =
                this.acceleration *
                delta;


            this.velocity +=
                accelerationForce;
        }


        // ====================================================
        // BRAKING
        // ====================================================

        this.isBraking =
            !!brake &&
            this.velocity > 0;


        if (brake) {

            if (
                this.velocity > 0
            ) {

                this.velocity -=
                    this.braking *
                    delta;


                if (
                    this.velocity < 0
                ) {

                    this.velocity = 0;
                }

            }

            else {

                // Reverse

                this.velocity -=
                    this.acceleration *
                    0.55 *
                    delta;


                this.velocity =
                    Math.max(
                        this.velocity,
                        -this.reverseSpeed
                    );
            }
        }


        // ====================================================
        // NATURAL FRICTION
        // ====================================================

        if (
            !throttle &&
            !brake
        ) {

            if (
                this.velocity > 0
            ) {

                this.velocity -=
                    this.friction *
                    delta;


                if (
                    this.velocity < 0
                ) {

                    this.velocity = 0;
                }
            }


            if (
                this.velocity < 0
            ) {

                this.velocity +=
                    this.friction *
                    delta;


                if (
                    this.velocity > 0
                ) {

                    this.velocity = 0;
                }
            }
        }


        // ====================================================
        // NITRO
        // ====================================================

        if (
            this.nitroActive
        ) {

            this.velocity +=
                this.nitroBoost *
                delta;

        }


        // ====================================================
        // SPEED LIMIT
        // ====================================================

        const maximumForwardSpeed =
            this.maxSpeed +
            (
                this.nitroActive
                    ? this.nitroBoost
                    : 0
            );


        this.velocity =
            THREE.MathUtils.clamp(

                this.velocity,

                -this.reverseSpeed,

                maximumForwardSpeed

            );


        // ====================================================
        // SPEED
        // ====================================================

        this.speed =
            Math.abs(
                this.velocity
            );


        // ====================================================
        // STEERING
        // ====================================================

        if (
            this.speed > 0.1
        ) {

            const speedRatio =
                THREE.MathUtils.clamp(

                    this.speed /
                    this.maxSpeed,

                    0,
                    1
                );


            // Less steering at very low speed,
            // stronger steering at racing speed.

            const steeringStrength =
                this.steering *
                (
                    0.30 +
                    speedRatio * 0.70
                );


            this.rotation +=

                steeringInput *
                steeringStrength *
                delta *
                Math.sign(
                    this.velocity
                );
        }


        // ====================================================
        // DRIFT / LATERAL GRIP
        // ====================================================

        const drifting =
            Math.abs(
                steeringInput
            ) > 0.65 &&
            this.speed > 12;


        const currentGrip =
            drifting
                ? this.driftGrip
                : this.grip;


        this.lateralVelocity *=

            Math.max(
                0,
                1 -
                currentGrip *
                delta
            );


        // ====================================================
        // FORWARD VECTOR
        // ====================================================

        this.forward.set(
            0,
            0,
            -1
        );


        this.forward.applyAxisAngle(

            new THREE.Vector3(
                0,
                1,
                0
            ),

            this.rotation

        );


        // ====================================================
        // LATERAL MOVEMENT
        // ====================================================

        this.right.set(
            1,
            0,
            0
        );


        this.right.applyAxisAngle(

            new THREE.Vector3(
                0,
                1,
                0
            ),

            this.rotation

        );


        // ====================================================
        // MOVEMENT
        // ====================================================

        this.velocityVector.copy(
            this.forward
        );


        this.velocityVector.multiplyScalar(
            this.velocity
        );


        // Add controlled lateral drift

        this.velocityVector.add(

            this.right.clone()
                .multiplyScalar(
                    this.lateralVelocity
                )

        );


        this.position.add(

            this.velocityVector
                .multiplyScalar(
                    delta
                )

        );


        // ====================================================
        // DRAG
        // ====================================================

        if (
            !throttle &&
            !brake
        ) {

            this.velocity *=

                Math.pow(
                    this.drag,
                    delta * 60
                );

        }


        // ====================================================
        // FINAL SAFETY
        // ====================================================

        if (
            !Number.isFinite(
                this.velocity
            )
        ) {

            this.velocity = 0;
        }


        if (
            !Number.isFinite(
                this.rotation
            )
        ) {

            this.rotation = Math.PI;
        }


        if (
            !Number.isFinite(
                this.position.x
            ) ||
            !Number.isFinite(
                this.position.y
            ) ||
            !Number.isFinite(
                this.position.z
            )
        ) {

            this.position.set(
                0,
                0,
                0
            );
        }


        this.speed =
            Math.abs(
                this.velocity
            );
    }


    // =========================================================
    // INPUT HELPER
    // =========================================================

    getInput(
        input,
        names
    ) {

        if (!input) {

            return false;
        }


        for (
            const name of names
        ) {

            if (
                input[name] === true
            ) {

                return true;
            }


            if (
                typeof input[name] ===
                "number" &&
                Math.abs(
                    input[name]
                ) > 0.15
            ) {

                return true;
            }
        }


        return false;
    }


    // =========================================================
    // NITRO
    // =========================================================

    activateNitro() {

        this.nitroActive =
            true;
    }


    deactivateNitro() {

        this.nitroActive =
            false;
    }


    // =========================================================
    // APPLY IMPACT
    // =========================================================

    applyImpact(
        strength = 0.5
    ) {

        strength =
            THREE.MathUtils.clamp(
                strength,
                0,
                1
            );


        this.velocity *=
            1 - strength;
    }


    // =========================================================
    // RESET
    // =========================================================

    reset(
        x = 0,
        y = 0,
        z = 0,
        rotation = Math.PI
    ) {

        this.position.set(
            x,
            y,
            z
        );


        this.velocity =
            0;


        this.speed =
            0;


        this.rotation =
            rotation;


        this.lateralVelocity =
            0;


        this.isBraking =
            false;


        this.deactivateNitro();
    }


    // =========================================================
    // SET SPEED
    // =========================================================

    setSpeed(
        speed
    ) {

        if (
            !Number.isFinite(speed)
        ) {

            return;
        }


        this.velocity =
            THREE.MathUtils.clamp(

                speed,

                -this.reverseSpeed,

                this.maxSpeed +
                this.nitroBoost

            );


        this.speed =
            Math.abs(
                this.velocity
            );
    }


    // =========================================================
    // GET FORWARD VECTOR
    // =========================================================

    getForwardVector() {

        return this.forward.clone();
    }


    // =========================================================
    // GET SPEED KM/H
    // =========================================================

    getSpeedKmh() {

        return Math.round(
            this.speed * 5
        );
    }


    // =========================================================
    // GET MPH
    // =========================================================

    getSpeedMph() {

        return Math.round(
            this.speed * 3.10686
        );
    }

}


export {
    Physics
};
```
