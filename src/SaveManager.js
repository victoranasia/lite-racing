export class SaveManager {

    constructor() {

        this.key =
            "empire-racing-save";

    }


    save(data) {

        try {

            localStorage.setItem(

                this.key,

                JSON.stringify(data)

            );

        }
        catch (error) {

            console.error(
                "Save failed:",
                error
            );

        }

    }


    load() {

        try {

            const data =
                localStorage.getItem(
                    this.key
                );


            if (!data) {

                return null;

            }


            return JSON.parse(
                data
            );

        }
        catch (error) {

            console.error(
                "Load failed:",
                error
            );


            return null;

        }

    }


    clear() {

        localStorage.removeItem(
            this.key
        );

    }


    hasSave() {

        return (
            localStorage.getItem(
                this.key
            ) !== null
        );
this.saveManager.save({

    credits: 25000,

    xp: 4500,

    level: 7,

    selectedCar: "sports",

    selectedTrack: "city",

    difficulty: "hard",

    upgrades: {

        engine: 3,

        brakes: 2,

        handling: 4,

        nitro: 2

    }

});
    }

    

}
