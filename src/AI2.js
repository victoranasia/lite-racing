import * as THREE from "three";


// ============================================================
// AI CONTROLLER
// Racing-line based opponent AI
// ============================================================

class AIController {

    constructor(car, track, options = {}) {

        this.car =
            car;

        this.track =
            track;


        // ====================================================
        // AI SKILL
        // ====================================================

        this.skill =
            THREE.MathUtils.clamp(
                Number(options.skill ?? 1),
                0.5,
                1.2
            );


        // ====================================================
        // AI PARAMETERS
        // ====================================================

        this.baseSpeed =
            28 +
            (
                this.skill * 10
            );


        this.maxSpeed =
            36 +
            (
                this.skill * 10
            );


        this.acceleration =
            0.8 +
            (
                this.skill * 0.25
            );


        this.steeringStrength =
            0.8 +
            (
                this.skill * 0.35
            );


        // ====================================================
        // TARGETING
        // ====================================================

        this.targetDistance =
            12 +
            (
                this.skill * 5
            );


        this.lookAhead =
            15 +
            (
                this.skill * 10
            );


        this.currentTarget =
            new THREE.Vector3();


        this.previousTarget =
            new THREE.Vector3();


        this.targetDirection =
            new THREE.Vector3();


        this.forward =
            new THREE.Vector3();


        this.toTarget =
            new THREE.Vector3();


        this.up =
            new THREE.Vector3(
                0,
                1,
                0
            );


        // ====================================================
        // WAYPOINT SYSTEM
        // ====================================================

        this.waypoints =
            this.extractWaypoints(
                track
            );


        this.currentWaypoint =
            0;


        this.lastWaypoint =
            -1;


        this.lap =
            1;


        // ====================================================
        // BEHAVIOUR
        // ====================================================

        this.stuckTimer =
            0;


        this.reverseTimer =
            0;


        this.overtakeOffset =
            0;


        this.overtakeTimer =
            0;


        this.randomSeed =
            Math.random() *
            1000;


        // ====================================================
        // OUTPUT
        // ====================================================

        this.input = {

            accelerate: false,

            brake: false,

            left: false,

            right: false,

            nitro: false,

            steering: 0
        };


        // ====================================================
        // DEBUG
        // ====================================================

        this.debug =
            false;

    }


    // =========================================================
    // UPDATE
    // =========================================================

    update(delta = 0.016) {

        if (
            !this.car ||
            !this.car.physics
        ) {

            return this.input;
        }


        delta =
            Math.min(
                Math.max(
                    delta,
                    0
                ),
                0.05
            );


        // =====================================================
        // FINISHED CAR
        // =====================================================

        if (
            this.car.finished
        ) {

            this.input.accelerate =
                false;

            this.input.brake =
                true;

            this.input.left =
                false;

            this.input.right =
                false;

            this.input.steering =
                0;


            return this.input;
        }


        // =====================================================
        // FIND TARGET
        // =====================================================

        const target =
            this.findTarget();


        if (!target) {

            return this.driveFallback(
                delta
            );
        }


        this.currentTarget.copy(
            target
        );


        // =====================================================
        // CALCULATE DIRECTION
        // =====================================================

        const carPosition =
            this.car.physics.position;


        this.toTarget.subVectors(
            this.currentTarget,
            carPosition
        );


        this.toTarget.y =
            0;


        const distance =
            this.toTarget.length();


        if (
            distance < 0.001
        ) {

            return this.input;
        }


        this.toTarget.normalize();


        // =====================================================
        // CAR FORWARD VECTOR
        // =====================================================

        this.forward.set(
            0,
            0,
            -1
        );


        this.forward.applyAxisAngle(
            this.up,
            this.car.physics.rotation
        );


        this.forward.normalize();


        // =====================================================
        // STEERING
        // =====================================================

        const cross =
            this.forward.x *
            this.toTarget.z -
            this.forward.z *
            this.toTarget.x;


        const dot =
            THREE.MathUtils.clamp(
                this.forward.dot(
                    this.toTarget
                ),
                -1,
                1
            );


        const angle =
            Math.atan2(
                cross,
                dot
            );


        let steering =
            THREE.MathUtils.clamp(
                angle * this.steeringStrength,
                -1,
                1
            );


        // =====================================================
        // SMALL STABILITY FILTER
        // =====================================================

        steering =
            this.stabilizeSteering(
                steering
            );


        // =====================================================
        // SPEED MANAGEMENT
        // =====================================================

        const currentSpeed =
            Math.abs(
                this.car.physics.velocity ??
                0
            );


        const targetSpeed =
            this.calculateTargetSpeed(
                angle,
                distance
            );


        const shouldBrake =
            currentSpeed >
            targetSpeed + 3;


        // =====================================================
        // OUTPUT
        // =====================================================

        this.input.steering =
            steering;


        this.input.left =
            steering < -0.08;


        this.input.right =
            steering > 0.08;


        this.input.brake =
            shouldBrake;


        this.input.accelerate =
            !shouldBrake &&
            currentSpeed <
            targetSpeed;


        // =====================================================
        // NITRO
        // =====================================================

        this.input.nitro =
            this.shouldUseNitro(
                currentSpeed,
                targetSpeed,
                angle,
                distance
            );


        // =====================================================
        // WAYPOINT PROGRESS
        // =====================================================

        this.updateWaypointProgress(
            distance
        );


        // =====================================================
        // STUCK DETECTION
        // =====================================================

        if (
            currentSpeed < 1
        ) {

            this.stuckTimer +=
                delta;

        }

        else {

            this.stuckTimer =
                Math.max(
                    0,
                    this.stuckTimer -
                    delta * 2
                );
        }


        // =====================================================
        // RECOVERY
        // =====================================================

        if (
            this.stuckTimer > 2
        ) {

            this.recoverFromStuck(
                delta
            );

        }


        return this.input;
    }


    // =========================================================
    // FIND TARGET
    // =========================================================

    findTarget() {

        if (
            this.waypoints.length === 0
        ) {

            return null;
        }


        const position =
            this.car.physics.position;


        let nearestIndex =
            this.findNearestWaypoint(
                position
            );


        // Keep progress moving forward

        if (
            this.currentWaypoint >= 0
        ) {

            const current =
                this.waypoints[
                    this.currentWaypoint
                ];


            const currentDistance =
                current.distanceTo(
                    position
                );


            const nearest =
                this.waypoints[
                    nearestIndex
                ];


            const nearestDistance =
                nearest.distanceTo(
                    position
                );


            // Avoid jumping backwards
            // around the track.

            if (
                nearestDistance >
                currentDistance &&
                currentDistance <
                this.lookAhead
            ) {

                nearestIndex =
                    this.currentWaypoint;
            }
        }


        this.currentWaypoint =
            nearestIndex;


        const targetIndex =
            this.getLookAheadWaypoint(
                nearestIndex
            );


        const target =
            this.waypoints[
                targetIndex
            ];


        if (!target) {

            return null;
        }


        // =====================================================
        // RACING LINE OFFSET
        // =====================================================

        this.applyRacingLineOffset(
            target,
            targetIndex
        );


        return target;
    }


    // =========================================================
    // FIND NEAREST WAYPOINT
    // =========================================================

    findNearestWaypoint(
        position
    ) {

        let nearest =
            0;


        let nearestDistance =
            Infinity;


        for (
            let i = 0;
            i < this.waypoints.length;
            i++
        ) {

            const distance =
                this.waypoints[i]
                    .distanceToSquared(
                        position
                    );


            if (
                distance <
                nearestDistance
            ) {

                nearestDistance =
                    distance;

                nearest =
                    i;
            }
        }


        return nearest;
    }


    // =========================================================
    // LOOK AHEAD
    // =========================================================

    getLookAheadWaypoint(
        index
    ) {

        const count =
            this.waypoints.length;


        if (
            count === 0
        ) {

            return 0;
        }


        const speed =
            Math.abs(
                this.car.physics.velocity ??
                0
            );


        const extra =
            Math.floor(
                speed * 0.25
            );


        const skillExtra =
            Math.floor(
                this.skill * 2
            );


        return (
            index +
            1 +
            extra +
            skillExtra
        ) % count;
    }


    // =========================================================
    // WAYPOINT PROGRESS
    // =========================================================

    updateWaypointProgress(
        distance
    ) {

        if (
            this.waypoints.length === 0
        ) {

            return;
        }


        if (
            distance <
            this.targetDistance
        ) {

            const previous =
                this.currentWaypoint;


            this.currentWaypoint =

                (
                    this.currentWaypoint +
                    1
                ) %
                this.waypoints.length;


            if (
                previous ===
                this.waypoints.length - 1 &&
                this.currentWaypoint === 0
            ) {

                this.lap++;
            }
        }
    }


    // =========================================================
    // TARGET SPEED
    // =========================================================

    calculateTargetSpeed(
        angle,
        distance
    ) {

        let targetSpeed =
            this.baseSpeed;


        // Faster AI gets closer to maximum speed

        targetSpeed +=
            (
                this.skill -
                0.8
            ) * 6;


        // =====================================================
        // CORNER SLOWDOWN
        // =====================================================

        const cornerFactor =
            Math.min(
                Math.abs(angle) /
                0.75,
                1
            );


        targetSpeed *=

            1 -
            cornerFactor *
            0.55;


        // =====================================================
        // SHARP TURN
        // =====================================================

        if (
            Math.abs(angle) >
            1.0
        ) {

            targetSpeed *=
                0.55;
        }


        // =====================================================
        // CLOSE TARGET
        // =====================================================

        if (
            distance <
            8
        ) {

            targetSpeed *=
                0.85;
        }


        return THREE.MathUtils.clamp(

            targetSpeed,

            8,

            this.maxSpeed
        );
    }


    // =========================================================
    // RACING LINE OFFSET
    // =========================================================

    applyRacingLineOffset(
        target,
        index
    ) {

        if (
            this.waypoints.length <
            3
        ) {

            return;
        }


        const previousIndex =
            (
                index -
                1 +
                this.waypoints.length
            ) %
            this.waypoints.length;


        const nextIndex =
            (
                index +
                1
            ) %
            this.waypoints.length;


        const previous =
            this.waypoints[
                previousIndex
            ];


        const next =
            this.waypoints[
                nextIndex
            ];


        const direction =
            new THREE.Vector3()
                .subVectors(
                    next,
                    previous
                );


        direction.y =
            0;


        if (
            direction.lengthSq() <
            0.001
        ) {

            return;
        }


        direction.normalize();


        const side =
            new THREE.Vector3(
                -direction.z,
                0,
                direction.x
            );


        // Different AI cars use
        // slightly different lines.

        const lane =
            (
                Math.sin(
                    this.randomSeed +
                    index * 0.31
                )
            ) *
            1.2;


        target.add(
            side.multiplyScalar(
                lane
            )
        );
    }


    // =========================================================
    // NITRO
    // =========================================================

    shouldUseNitro(
        currentSpeed,
        targetSpeed,
        angle,
        distance
    ) {

        if (
            this.skill < 0.9
        ) {

            return false;
        }


        // Do not use nitro while turning hard.

        if (
            Math.abs(angle) >
            0.35
        ) {

            return false;
        }


        if (
            distance <
            10
        ) {

            return false;
        }


        return (
            currentSpeed >
            targetSpeed * 0.75
        ) &&
        (
            currentSpeed >
            20
        );
    }


    // =========================================================
    // STEERING STABILIZATION
    // =========================================================

    stabilizeSteering(
        steering
    ) {

        // Prevent violent left/right switching.

        const previous =
            this.input.steering ?? 0;


        const smoothing =
            0.18;


        return THREE.MathUtils.lerp(
            previous,
            steering,
            smoothing
        );
    }


    // =========================================================
    // STUCK RECOVERY
    // =========================================================

    recoverFromStuck(
        delta
    ) {

        this.reverseTimer +=
            delta;


        this.input.accelerate =
            false;


        this.input.brake =
            true;


        // Alternate steering direction

        if (
            this.reverseTimer <
            1
        ) {

            this.input.steering =
                -0.7;

            this.input.left =
                true;

            this.input.right =
                false;

        }

        else if (
            this.reverseTimer <
            2
        ) {

            this.input.steering =
                0.7;

            this.input.left =
                false;

            this.input.right =
                true;

        }

        else {

            this.reverseTimer =
                0;

            this.stuckTimer =
                0;
        }
    }


    // =========================================================
    // FALLBACK DRIVING
    // =========================================================

    driveFallback(
        delta
    ) {

        this.input.accelerate =
            true;


        this.input.brake =
            false;


        this.input.left =
            false;


        this.input.right =
            false;


        this.input.steering =
            0;


        return this.input;
    }


    // =========================================================
    // EXTRACT WAYPOINTS
    // =========================================================

    extractWaypoints(
        track
    ) {

        const points = [];


        if (!track) {

            return points;
        }


        // -----------------------------------------------------
        // Option 1:
        // track.waypoints
        // -----------------------------------------------------

        if (
            Array.isArray(
                track.waypoints
            )
        ) {

            for (
                const point
                of track.waypoints
            ) {

                const vector =
                    this.toVector3(
                        point
                    );


                if (vector) {

                    points.push(
                        vector
                    );
                }
            }


            if (
                points.length > 1
            ) {

                return points;
            }
        }


        // -----------------------------------------------------
        // Option 2:
        // track.points
        // -----------------------------------------------------

        if (
            Array.isArray(
                track.points
            )
        ) {

            for (
                const point
                of track.points
            ) {

                const vector =
                    this.toVector3(
                        point
                    );


                if (vector) {

                    points.push(
                        vector
                    );
                }
            }


            if (
                points.length > 1
            ) {

                return points;
            }
        }


        // -----------------------------------------------------
        // Option 3:
        // track.centerline
        // -----------------------------------------------------

        if (
            Array.isArray(
                track.centerline
            )
        ) {

            for (
                const point
                of track.centerline
            ) {

                const vector =
                    this.toVector3(
                        point
                    );


                if (vector) {

                    points.push(
                        vector
                    );
                }
            }


            if (
                points.length > 1
            ) {

                return points;
            }
        }


        // -----------------------------------------------------
        // Option 4:
        // track.curve
        // -----------------------------------------------------

        if (
            track.curve &&
            typeof track.curve.getPoints ===
            "function"
        ) {

            const curvePoints =
                track.curve.getPoints(
                    100
                );


            for (
                const point
                of curvePoints
            ) {

                const vector =
                    this.toVector3(
                        point
                    );


                if (vector) {

                    points.push(
                        vector
                    );
                }
            }


            if (
                points.length > 1
            ) {

                return points;
            }
        }


        return points;
    }


    // =========================================================
    // VECTOR CONVERSION
    // =========================================================

    toVector3(
        point
    ) {

        if (
            !point
        ) {

            return null;
        }


        if (
            point instanceof THREE.Vector3
        ) {

            return point.clone();
        }


        if (
            typeof point.x === "number" &&
            typeof point.z === "number"
        ) {

            return new THREE.Vector3(
                point.x,
                Number(point.y ?? 0),
                point.z
            );
        }


        if (
            Array.isArray(point) &&
            point.length >= 3
        ) {

            return new THREE.Vector3(
                Number(point[0]),
                Number(point[1]),
                Number(point[2])
            );
        }


        return null;
    }


    // =========================================================
    // GET INPUT
    // =========================================================

    getInput() {

        return {
            ...this.input
        };
    }


    // =========================================================
    // RESET
    // =========================================================

    reset() {

        this.currentWaypoint =
            0;


        this.lastWaypoint =
            -1;


        this.lap =
            1;


        this.stuckTimer =
            0;


        this.reverseTimer =
            0;


        this.overtakeOffset =
            0;


        this.overtakeTimer =
            0;


        this.input = {

            accelerate: false,

            brake: false,

            left: false,

            right: false,

            nitro: false,

            steering: 0
        };
    }


    // =========================================================
    // DEBUG
    // =========================================================

    setDebug(
        enabled
    ) {

        this.debug =
            !!enabled;
    }
}


export {
    AIController
};
