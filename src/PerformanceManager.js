export class PerformanceManager {

    constructor(renderer) {

        this.renderer =
            renderer;

        this.fps =
            60;

        this.frames =
            0;

        this.lastTime =
            performance.now();

    }


    update() {

        this.frames++;

        const now =
            performance.now();


        if (
            now -
            this.lastTime >=
            1000
        ) {

            this.fps =
                this.frames;


            this.frames =
                0;


            this.lastTime =
                now;


            this.optimize();

        }

    }


    optimize() {

        if (
            this.fps < 30
        ) {

            this.renderer
                .setPixelRatio(
                    Math.min(
                        window.devicePixelRatio,
                        1
                    )
                );

        }

        else if (
            this.fps > 50
        ) {

            this.renderer
                .setPixelRatio(
                    Math.min(
                        window.devicePixelRatio,
                        1.5
                    )
                );

        }

    }


    getFPS() {

        return this.fps;

    }

}
