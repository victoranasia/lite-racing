export class GraphicsSettings {

    constructor(renderer) {

        this.renderer =
            renderer;

        this.settings = {

            quality: "high",

            shadows: true,

            particles: true,

            weather: true,

            antialias: true

        };

    }


    setQuality(level) {

        this.settings.quality =
            level;


        switch (level) {

            case "low":

                this.renderer
                    .setPixelRatio(1);

                this.settings.shadows =
                    false;

                this.settings.particles =
                    false;

                break;


            case "medium":

                this.renderer
                    .setPixelRatio(1);

                this.settings.shadows =
                    true;

                this.settings.particles =
                    true;

                break;


            case "high":

                this.renderer
                    .setPixelRatio(
                        Math.min(
                            window.devicePixelRatio,
                            1.5
                        )
                    );

                this.settings.shadows =
                    true;

                this.settings.particles =
                    true;

                break;

        }

    }


    getSettings() {

        return this.settings;

    }

}
