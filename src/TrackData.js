export const TRACKS = {

    city: {

        id: "city",

        name: "Empire City",

        description:
            "A fast urban circuit.",

        laps: 3,

        difficulty: 1,

        unlocked: true

    },


    desert: {

        id: "desert",

        name: "Desert Run",

        description:
            "A high-speed desert circuit.",

        laps: 3,

        difficulty: 2,

        unlocked: false

    },


    mountain: {

        id: "mountain",

        name: "Mountain Pass",

        description:
            "Technical mountain racing.",

        laps: 4,

        difficulty: 3,

        unlocked: false

    },


    grandprix: {

        id: "grandprix",

        name: "Empire Grand Prix",

        description:
            "The ultimate championship circuit.",

        laps: 5,

        difficulty: 4,

        unlocked: false

    }

};


export function getTrack(trackId) {

    return TRACKS[trackId];

}


export function getAllTracks() {

    return Object.values(TRACKS);

}
