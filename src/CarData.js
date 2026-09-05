export const CAR_DATA = {

    mercedes_dtm: {

        id: "mercedes_dtm",

        name: "Mercedes-AMG C-Coupe DTM",

        modelPath:
            "/assets/models/2018_mercedes_c-coupe_dtm.glb",

        price: 0,

        unlockLevel: 1,

        stats: {

            topSpeed: 310,

            acceleration: 8.5,

            braking: 8.0,

            handling: 8.5,

            nitro: 7.0

        }

    },


    bugatti_chiron: {

        id: "bugatti_chiron",

        name: "Bugatti Chiron Mansory",

        modelPath:
            "/assets/models/bugatti_chiron_mansory.glb",

        price: 250000,

        unlockLevel: 5,

        stats: {

            topSpeed: 420,

            acceleration: 9.5,

            braking: 8.5,

            handling: 7.5,

            nitro: 9.0

        }

    },


    lamborghini_svj: {

        id: "lamborghini_svj",

        name: "Lamborghini SVJ Carbonado",

        modelPath:
            "/assets/models/lamborghini_svj_carbonado_twin_turbo_mansory.glb",

        price: 350000,

        unlockLevel: 8,

        stats: {

            topSpeed: 390,

            acceleration: 9.8,

            braking: 9.0,

            handling: 9.5,

            nitro: 8.5

        }

    },


    mercedes_sl63: {

        id: "mercedes_sl63",

        name: "Mercedes-Benz SL63 Mansory",

        modelPath:
            "/assets/models/mercedes-benz_sl63_mansory.glb",

        price: 300000,

        unlockLevel: 7,

        stats: {

            topSpeed: 350,

            acceleration: 9.0,

            braking: 8.8,

            handling: 8.8,

            nitro: 8.0

        }

    },


    fenyr_supersport: {

        id: "fenyr_supersport",

        name: "W Motors Fenyr SuperSport",

        modelPath:
            "/assets/models/w_motors_fenyr_supersport.glb",

        price: 500000,

        unlockLevel: 12,

        stats: {

            topSpeed: 400,

            acceleration: 9.7,

            braking: 9.2,

            handling: 9.0,

            nitro: 9.5

        }

    },


    lykan_halloween: {

        id: "lykan_halloween",

        name: "W Motors Lykan Halloween Edition",

        modelPath:
            "/assets/models/w_motors_lykan_hypersport_halloween_edition.glb",

        price: 750000,

        unlockLevel: 15,

        stats: {

            topSpeed: 410,

            acceleration: 9.6,

            braking: 9.4,

            handling: 9.3,

            nitro: 10.0

        }

    }

};


const CAR_COLORS = [

    0xd90429,
    0x1565c0,
    0xff9800,
    0x7b1fa2,
    0x2e7d32,
    0xeeeeee

];


export function getCar(carId) {

    return (
        CAR_DATA[carId] ||
        CAR_DATA.mercedes_dtm
    );

}


export function getAllCars() {

    return Object.values(CAR_DATA).map(
        (car, index) => ({

            ...car,

            color:
                car.color ||
                CAR_COLORS[index % CAR_COLORS.length],

            description:
                car.description ||
                "Race-ready performance car.",

            stats: {

                ...car.stats,

                speed:
                    car.stats.speed ||
                    car.stats.topSpeed

            }

        })
    );

}
