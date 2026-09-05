```javascript
import * as THREE from "three";


// ============================================================
// TRACK
// 3D Racing Circuit
// ============================================================

class Track {

    constructor(scene) {

        this.scene =
            scene;


        // ====================================================
        // TRACK CONFIGURATION
        // ====================================================

        this.roadWidth =
            14;

        this.trackWidth =
            this.roadWidth;

        this.shoulderWidth =
            3;

        this.wallWidth =
            1;


        this.trackLength =
            400;


        this.trackCenter =
            new THREE.Vector3(
                0,
                0,
                0
            );


        // ====================================================
        // AI WAYPOINTS
        // ====================================================

        this.waypoints =
            [];


        this.centerline =
            this.waypoints;


        // ====================================================
        // CHECKPOINTS
        // ====================================================

        this.checkpoints =
            [];


        // ====================================================
        // START GRID
        // ====================================================

        this.startPositions =
            [];


        // ====================================================
        // TRACK OBJECTS
        // ====================================================

        this.road =
            null;

        this.shoulders =
            null;

        this.grass =
            null;

        this.walls =
            [];

        this.scenery =
            [];


        // ====================================================
        // TEMP VECTORS
        // ====================================================

        this.closestPoint =
            new THREE.Vector3();

        this.closestTangent =
            new THREE.Vector3();


        // ====================================================
        // BUILD
        // ====================================================

        this.createTrack();

    }


    // =========================================================
    // CREATE TRACK
    // =========================================================

    createTrack() {

        this.generateWaypoints();

        this.createGround();

        this.createRoad();

        this.createRoadMarkings();

        this.createCurbs();

        this.createBarriers();

        this.createCheckpoints();

        this.createStartGrid();

        this.createScenery();

    }


    // =========================================================
    // GENERATE RACING LINE
    // =========================================================

    generateWaypoints() {

        this.waypoints =
            [];


        // Large flowing circuit.
        //
        // Starting point is close to z = 200
        // to match the current Game.js.

        const points = [

            [ 0, 0, 200 ],

            [ 18, 0, 195 ],

            [ 34, 0, 180 ],

            [ 45, 0, 155 ],

            [ 50, 0, 125 ],

            [ 48, 0, 95 ],

            [ 40, 0, 65 ],

            [ 25, 0, 40 ],

            [ 5, 0, 25 ],

            [ -20, 0, 20 ],

            [ -42, 0, 5 ],

            [ -55, 0, -20 ],

            [ -58, 0, -50 ],

            [ -52, 0, -80 ],

            [ -40, 0, -105 ],

            [ -20, 0, -120 ],

            [ 5, 0, -125 ],

            [ 30, 0, -118 ],

            [ 48, 0, -100 ],

            [ 58, 0, -75 ],

            [ 60, 0, -45 ],

            [ 55, 0, -15 ],

            [ 45, 0, 15 ],

            [ 38, 0, 45 ],

            [ 42, 0, 75 ],

            [ 55, 0, 100 ],

            [ 70, 0, 125 ],

            [ 78, 0, 150 ],

            [ 72, 0, 175 ],

            [ 55, 0, 195 ],

            [ 30, 0, 210 ],

            [ 0, 0, 215 ],

            [ -28, 0, 210 ],

            [ -50, 0, 195 ],

            [ -62, 0, 175 ],

            [ -60, 0, 150 ],

            [ -50, 0, 130 ],

            [ -35, 0, 120 ],

            [ -20, 0, 115 ],

            [ -5, 0, 120 ]

        ];


        for (
            const point
            of points
        ) {

            this.waypoints.push(

                new THREE.Vector3(
                    point[0],
                    point[1],
                    point[2]
                )

            );

        }


        // Keep AI and centerline
        // references synchronized.

        this.centerline =
            this.waypoints;

    }


    // =========================================================
    // GROUND
    // =========================================================

    createGround() {

        const geometry =
            new THREE.PlaneGeometry(
                500,
                500
            );


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x2d6a32,

                roughness: 1,

                metalness: 0

            });


        this.grass =
            new THREE.Mesh(
                geometry,
                material
            );


        this.grass.rotation.x =
            -Math.PI / 2;


        this.grass.position.y =
            -0.08;


        this.grass.receiveShadow =
            true;


        this.scene.add(
            this.grass
        );

    }


    // =========================================================
    // ROAD
    // =========================================================

    createRoad() {

        const curve =
            this.createCurve();


        const geometry =
            this.createRoadGeometry(
                curve,
                this.roadWidth,
                2
            );


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x242424,

                roughness: 0.92,

                metalness: 0.05

            });


        this.road =
            new THREE.Mesh(
                geometry,
                material
            );


        this.road.receiveShadow =
            true;


        this.road.castShadow =
            false;


        this.scene.add(
            this.road
        );


        // =====================================================
        // SHOULDER
        // =====================================================

        const shoulderGeometry =
            this.createRoadGeometry(

                curve,

                this.roadWidth +
                this.shoulderWidth * 2,

                1.95

            );


        const shoulderMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x777777,

                roughness: 1

            });


        this.shoulders =
            new THREE.Mesh(
                shoulderGeometry,
                shoulderMaterial
            );


        this.shoulders.position.y =
            -0.01;


        this.shoulders.receiveShadow =
            true;


        this.scene.add(
            this.shoulders
        );

    }


    // =========================================================
    // CURVE
    // =========================================================

    createCurve() {

        const points =
            this.waypoints.map(
                point =>
                    point.clone()
            );


        // Closed Catmull-Rom curve

        this.curve =
            new THREE.CatmullRomCurve3(
                points,
                true,
                "catmullrom",
                0.5
            );


        return this.curve;
    }


    // =========================================================
    // ROAD GEOMETRY
    // =========================================================

    createRoadGeometry(
        curve,
        width,
        y
    ) {

        const segments =
            400;


        const vertices =
            [];

        const normals =
            [];

        const uvs =
            [];

        const indices =
            [];


        const point =
            new THREE.Vector3();


        const tangent =
            new THREE.Vector3();


        const side =
            new THREE.Vector3();


        for (
            let i = 0;
            i <= segments;
            i++
        ) {

            const t =
                i /
                segments;


            curve.getPointAt(
                t,
                point
            );


            curve.getTangentAt(
                t,
                tangent
            );


            tangent.y =
                0;


            tangent.normalize();


            side.set(
                -tangent.z,
                0,
                tangent.x
            );


            const left =
                point.clone()
                    .add(
                        side.clone()
                            .multiplyScalar(
                                width / 2
                            )
                    );


            const right =
                point.clone()
                    .sub(
                        side.clone()
                            .multiplyScalar(
                                width / 2
                            )
                    );


            left.y =
                y;


            right.y =
                y;


            vertices.push(
                left.x,
                left.y,
                left.z,

                right.x,
                right.y,
                right.z
            );


            normals.push(
                0,
                1,
                0,

                0,
                1,
                0
            );


            uvs.push(
                0,
                t * 30,

                1,
                t * 30
            );

        }


        for (
            let i = 0;
            i < segments;
            i++
        ) {

            const a =
                i * 2;

            const b =
                i * 2 + 1;

            const c =
                i * 2 + 2;

            const d =
                i * 2 + 3;


            indices.push(
                a,
                b,
                c,

                b,
                d,
                c
            );

        }


        const geometry =
            new THREE.BufferGeometry();


        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                vertices,
                3
            )
        );


        geometry.setAttribute(
            "normal",
            new THREE.Float32BufferAttribute(
                normals,
                3
            )
        );


        geometry.setAttribute(
            "uv",
            new THREE.Float32BufferAttribute(
                uvs,
                2
            )
        );


        geometry.setIndex(
            indices
        );


        geometry.computeBoundingSphere();


        return geometry;

    }


    // =========================================================
    // ROAD MARKINGS
    // =========================================================

    createRoadMarkings() {

        const material =
            new THREE.MeshBasicMaterial({

                color: 0xffffff

            });


        const dashCount =
            120;


        for (
            let i = 0;
            i < dashCount;
            i++
        ) {

            // Skip some segments to
            // create dashed center line.

            if (
                i % 2 === 1
            ) {

                continue;
            }


            const t =
                i /
                dashCount;


            const point =
                this.curve.getPointAt(
                    t
                );


            const tangent =
                this.curve.getTangentAt(
                    t
                );


            tangent.y =
                0;

            tangent.normalize();


            const dash =
                new THREE.Mesh(

                    new THREE.BoxGeometry(
                        0.18,
                        0.025,
                        3
                    ),

                    material

                );


            dash.position.copy(
                point
            );


            dash.position.y =
                0.035;


            dash.rotation.y =
                Math.atan2(
                    tangent.x,
                    tangent.z
                );


            this.scene.add(
                dash
            );

        }

    }


    // =========================================================
    // CURBS
    // =========================================================

    createCurbs() {

        const segments =
            200;


        const redMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xc62828,

                roughness: 0.8

            });


        const whiteMaterial =
            new THREE.MeshStandardMaterial({

                color: 0xffffff,

                roughness: 0.8

            });


        for (
            let i = 0;
            i < segments;
            i++
        ) {

            const t =
                i /
                segments;


            const point =
                this.curve.getPointAt(
                    t
                );


            const tangent =
                this.curve.getTangentAt(
                    t
                );


            tangent.y =
                0;


            tangent.normalize();


            const side =
                new THREE.Vector3(
                    -tangent.z,
                    0,
                    tangent.x
                );


            const sideOffset =
                this.roadWidth /
                2 +
                0.25;


            const material =
                i % 2 === 0
                    ? redMaterial
                    : whiteMaterial;


            for (
                const direction
                of [-1, 1]
            ) {

                const curb =
                    new THREE.Mesh(

                        new THREE.BoxGeometry(
                            1.8,
                            0.12,
                            0.55
                        ),

                        material

                    );


                curb.position.copy(
                    point
                );


                curb.position.add(

                    side.clone()
                        .multiplyScalar(
                            sideOffset *
                            direction
                        )

                );


                curb.position.y =
                    0.06;


                curb.rotation.y =
                    Math.atan2(
                        tangent.x,
                        tangent.z
                    );


                this.scene.add(
                    curb
                );

            }

        }

    }


    // =========================================================
    // BARRIERS
    // =========================================================

    createBarriers() {

        const segments =
            160;


        const material =
            new THREE.MeshStandardMaterial({

                color: 0x555555,

                metalness: 0.65,

                roughness: 0.35

            });


        for (
            let i = 0;
            i < segments;
            i++
        ) {

            const t =
                i /
                segments;


            const point =
                this.curve.getPointAt(
                    t
                );


            const tangent =
                this.curve.getTangentAt(
                    t
                );


            tangent.y =
                0;

            tangent.normalize();


            const side =
                new THREE.Vector3(
                    -tangent.z,
                    0,
                    tangent.x
                );


            const offset =
                this.roadWidth /
                2 +
                this.shoulderWidth +
                0.8;


            for (
                const direction
                of [-1, 1]
            ) {

                const barrier =
                    new THREE.Mesh(

                        new THREE.BoxGeometry(
                            2.5,
                            1.0,
                            0.3
                        ),

                        material

                    );


                barrier.position.copy(
                    point
                );


                barrier.position.add(

                    side.clone()
                        .multiplyScalar(
                            offset *
                            direction
                        )

                );


                barrier.position.y =
                    0.5;


                barrier.rotation.y =
                    Math.atan2(
                        tangent.x,
                        tangent.z
                    );


                barrier.castShadow =
                    true;


                barrier.receiveShadow =
                    true;


                this.scene.add(
                    barrier
                );


                this.walls.push(
                    barrier
                );

            }

        }

    }


    // =========================================================
    // CHECKPOINTS
    // =========================================================

    createCheckpoints() {

        this.checkpoints = [];


        const checkpointIndices = [

            0,

            10,

            20,

            30

        ];


        for (
            let i = 0;
            i <
            checkpointIndices.length;
            i++
        ) {

            const index =
                checkpointIndices[i];


            const point =
                this.waypoints[
                    index
                ];


            if (!point) {

                continue;
            }


            const next =
                this.waypoints[
                    (
                        index +
                        1
                    ) %
                    this.waypoints.length
                ];


            const direction =
                new THREE.Vector3()
                    .subVectors(
                        next,
                        point
                    );


            direction.y =
                0;


            direction.normalize();


            this.checkpoints.push({

                index: i,

                waypointIndex:
                    index,

                position:
                    point.clone(),

                direction:
                    direction.clone(),

                passed: false

            });


            // =================================================
            // VISUAL CHECKPOINT
            // =================================================

            const gate =
                new THREE.Group();


            const postMaterial =
                new THREE.MeshStandardMaterial({

                    color: 0xffcc00,

                    metalness: 0.2,

                    roughness: 0.5

                });


            const postGeometry =
                new THREE.BoxGeometry(
                    0.3,
                    4,
                    0.3
                );


            const leftPost =
                new THREE.Mesh(
                    postGeometry,
                    postMaterial
                );


            const rightPost =
                leftPost.clone();


            leftPost.position.x =
                -this.roadWidth / 2;


            rightPost.position.x =
                this.roadWidth / 2;


            leftPost.position.y =
                2;


            rightPost.position.y =
                2;


            const top =
                new THREE.Mesh(

                    new THREE.BoxGeometry(
                        this.roadWidth,
                        0.3,
                        0.3
                    ),

                    postMaterial

                );


            top.position.y =
                4;


            gate.add(
                leftPost,
                rightPost,
                top
            );


            gate.position.copy(
                point
            );


            gate.position.y =
                0;


            gate.rotation.y =
                Math.atan2(
                    direction.x,
                    direction.z
                );


            this.scene.add(
                gate
            );

        }

    }


    // =========================================================
    // START GRID
    // =========================================================

    createStartGrid() {

        this.startPositions =
            [];


        const start =
            this.waypoints[0];


        const next =
            this.waypoints[1];


        const direction =
            new THREE.Vector3()
                .subVectors(
                    next,
                    start
                );


        direction.y =
            0;


        direction.normalize();


        const side =
            new THREE.Vector3(
                -direction.z,
                0,
                direction.x
            );


        const startRotation =
            Math.atan2(
                direction.x,
                direction.z
            ) +
            Math.PI;


        // 5 grid positions

        const grid = [

            {
                lane: 0,
                distance: 0
            },

            {
                lane: 1,
                distance: 5
            },

            {
                lane: -1,
                distance: 5
            },

            {
                lane: 1,
                distance: 10
            },

            {
                lane: -1,
                distance: 10
            }

        ];


        for (
            const slot
            of grid
        ) {

            const position =
                start.clone();


            position.add(

                direction.clone()
                    .multiplyScalar(
                        -slot.distance
                    )

            );


            position.add(

                side.clone()
                    .multiplyScalar(
                        slot.lane *
                        2
                    )

            );


            this.startPositions.push({

                position,

                rotation:
                    startRotation

            });


            // Start box

            const line =
                new THREE.Mesh(

                    new THREE.BoxGeometry(
                        2.5,
                        0.04,
                        0.25
                    ),

                    new THREE.MeshBasicMaterial({
                        color: 0xffffff
                    })

                );


            line.position.copy(
                position
            );


            line.position.y =
                0.04;


            line.rotation.y =
                Math.atan2(
                    direction.x,
                    direction.z
                );


            this.scene.add(
                line
            );

        }

    }


    // =========================================================
    // SCENERY
    // =========================================================

    createScenery() {

        const treeMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x237a3b,

                roughness: 1

            });


        const trunkMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x654321,

                roughness: 1

            });


        for (
            let i = 0;
            i < 80;
            i++
        ) {

            const t =
                (
                    i /
                    80 +
                    0.17
                ) %
                1;


            const point =
                this.curve.getPointAt(
                    t
                );


            const tangent =
                this.curve.getTangentAt(
                    t
                );


            tangent.y =
                0;


            tangent.normalize();


            const side =
                new THREE.Vector3(
                    -tangent.z,
                    0,
                    tangent.x
                );


            const direction =
                i % 2 === 0
                    ? 1
                    : -1;


            const distance =
                this.roadWidth /
                2 +
                8 +
                (
                    i % 6
                ) * 2;


            const treePosition =
                point.clone();


            treePosition.add(

                side.multiplyScalar(
                    distance *
                    direction
                )

            );


            const tree =
                this.createTree(
                    treePosition,
                    trunkMaterial,
                    treeMaterial
                );


            this.scene.add(
                tree
            );


            this.scenery.push(
                tree
            );

        }

    }


    // =========================================================
    // TREE
    // =========================================================

    createTree(
        position,
        trunkMaterial,
        leafMaterial
    ) {

        const tree =
            new THREE.Group();


        const trunk =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.18,
                    0.25,
                    2,
                    8
                ),

                trunkMaterial

            );


        trunk.position.y =
            1;


        trunk.castShadow =
            true;


        const leaves =
            new THREE.Mesh(

                new THREE.ConeGeometry(
                    1.25,
                    3.2,
                    8
                ),

                leafMaterial

            );


        leaves.position.y =
            3;


        leaves.castShadow =
            true;


        tree.add(
            trunk,
            leaves
        );


        tree.position.copy(
            position
        );


        return tree;

    }


    // =========================================================
    // GET CLOSEST POINT ON TRACK
    // =========================================================

    getClosestPoint(
        position
    ) {

        let closest =
            null;


        let closestDistance =
            Infinity;


        for (
            let i = 0;
            i < this.waypoints.length;
            i++
        ) {

            const point =
                this.waypoints[i];


            const distance =
                point.distanceToSquared(
                    position
                );


            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;


                closest =
                    point;

            }

        }


        if (
            closest
        ) {

            this.closestPoint.copy(
                closest
            );

        }


        return closest;
    }


    // =========================================================
    // GET TRACK PROGRESS
    // =========================================================

    getProgress(
        position
    ) {

        if (
            this.waypoints.length === 0
        ) {

            return 0;
        }


        let nearest =
            0;


        let distance =
            Infinity;


        for (
            let i = 0;
            i < this.waypoints.length;
            i++
        ) {

            const d =
                this.waypoints[i]
                    .distanceToSquared(
                        position
                    );


            if (
                d <
                distance
            ) {

                distance =
                    d;

                nearest =
                    i;
            }

        }


        return (
            nearest /
            this.waypoints.length
        );

    }


    // =========================================================
    // CONSTRAIN CAR
    // =========================================================

    constrainCar(
        car
    ) {

        if (
            !car ||
            !car.physics
        ) {

            return;
        }


        const position =
            car.physics.position;


        const closest =
            this.getClosestPoint(
                position
            );


        if (
            !closest
        ) {

            return;
        }


        const distance =
            position.distanceTo(
                closest
            );


        const maximumDistance =
            this.roadWidth /
            2 +
            this.shoulderWidth;


        // =====================================================
        // CAR IS OUTSIDE TRACK
        // =====================================================

        if (
            distance >
            maximumDistance
        ) {

            const correction =
                closest.clone()
                    .sub(
                        position
                    );


            correction.y =
                0;


            correction.normalize();


            const overflow =
                distance -
                maximumDistance;


            const strength =
                Math.min(
                    overflow *
                    0.5,
                    2
                );


            position.add(

                correction.multiplyScalar(
                    strength
                )

            );


            // Slow car when leaving track

            car.physics.velocity *=
                0.96;

        }


        // =====================================================
        // HARD LIMIT
        // =====================================================

        if (
            distance >
            maximumDistance +
            5
        ) {

            position.copy(
                closest
            );


            car.physics.velocity *=
                0.5;

        }


        // Keep car on ground

        if (
            position.y <
            0
        ) {

            position.y =
                0;
        }

    }


    // =========================================================
    // GET START POSITION
    // =========================================================

    getStartPosition(
        index = 0
    ) {

        if (
            this.startPositions.length === 0
        ) {

            return {

                position:
                    new THREE.Vector3(
                        0,
                        0,
                        195
                    ),

                rotation:
                    Math.PI

            };

        }


        const slot =
            this.startPositions[
                index %
                this.startPositions.length
            ];


        return {

            position:
                slot.position.clone(),

            rotation:
                slot.rotation

        };

    }


    // =========================================================
    // GET WAYPOINT
    // =========================================================

    getWaypoint(
        index
    ) {

        if (
            this.waypoints.length === 0
        ) {

            return null;
        }


        return this.waypoints[
            (
                index %
                this.waypoints.length +
                this.waypoints.length
            ) %
            this.waypoints.length
        ].clone();

    }


    // =========================================================
    // GET CHECKPOINT
    // =========================================================

    getCheckpoint(
        index
    ) {

        if (
            this.checkpoints.length === 0
        ) {

            return null;
        }


        return this.checkpoints[
            (
                index %
                this.checkpoints.length +
                this.checkpoints.length
            ) %
            this.checkpoints.length
        ];

    }


    // =========================================================
    // GET TRACK WIDTH
    // =========================================================

    getWidth() {

        return this.roadWidth;

    }


    // =========================================================
    // GET TRACK LENGTH
    // =========================================================

    getLength() {

        if (
            !this.curve
        ) {

            return this.trackLength;
        }


        return this.curve.getLength();

    }


    // =========================================================
    // UPDATE
    // =========================================================

    update(
        delta
    ) {

        // Reserved for future track animation:
        //
        // traffic
        // moving obstacles
        // weather
        // lights
        // animated scenery

    }


    // =========================================================
    // DISPOSE
    // =========================================================

    dispose() {

        this.scene.traverse(
            object => {

                if (
                    object.geometry &&
                    object.userData?.trackObject
                ) {

                    object.geometry.dispose();

                }

            }
        );

    }

}


export {
    Track
};
```
