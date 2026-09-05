
// ============================================================
// EMPIRE / LITE RACING
// GAME STATE & PLAYER PROGRESSION
// ============================================================

export const GAME_STATES = Object.freeze({

    LOADING: "loading",

    MENU: "menu",

    GARAGE: "garage",

    RACING: "racing",

    PAUSED: "paused",

    RESULTS: "results"

});


export class GameState {

    constructor() {

        // Current game screen/state
        this.current =
            GAME_STATES.LOADING;

        this.previous =
            null;

        // Load saved player data
        this.load();

        // Race information
        this.raceStarted =
            false;

        this.raceFinished =
            false;

        this.paused =
            false;

        this.lap =
            1;

        this.totalLaps =
            3;

        this.position =
            1;

        this.totalRacers =
            5;

        this.raceTime =
            0;

        this.countdown =
            3;

    }


    // ========================================================
    // DEFAULT PLAYER STATE
    // ========================================================

    getDefaultState() {

        return {

            selectedCar:
                "mercedes_dtm",

            selectedTrack:
                "city",

            difficulty:
                "normal",

            xp:
                0,

            credits:
                500,

            ownedCars: [

                "mercedes_dtm"

            ],

            upgrades: {

                mercedes_dtm: {

                    engine:
                        0,

                    brakes:
                        0,

                    handling:
                        0,

                    acceleration:
                        0

                }

            }

        };

    }


    // ========================================================
    // LOAD
    // ========================================================

    load() {

        const saved =
            localStorage.getItem(
                "empireRacingSave"
            );


        if (!saved) {

            this.state =
                this.getDefaultState();

            return;

        }


        try {

            const parsed =
                JSON.parse(saved);


            // Merge saved data with defaults.
            // This protects against older save files
            // missing newly-added properties.

            const defaults =
                this.getDefaultState();


            this.state = {

                ...defaults,

                ...parsed,

                upgrades: {

                    ...defaults.upgrades,

                    ...(parsed.upgrades || {})

                }

            };


            if (
                !Array.isArray(
                    this.state.ownedCars
                )
            ) {

                this.state.ownedCars =
                    ["mercedes_dtm"];

            }


        } catch (error) {

            console.warn(
                "Could not load Empire Racing save:",
                error
            );


            this.state =
                this.getDefaultState();

        }

    }


    // ========================================================
    // SAVE
    // ========================================================

    save() {

        try {

            localStorage.setItem(

                "empireRacingSave",

                JSON.stringify(
                    this.state
                )

            );

        } catch (error) {

            console.warn(
                "Could not save Empire Racing data:",
                error
            );

        }

    }


    // ========================================================
    // GAME STATE
    // ========================================================

    setState(state) {

        if (
            !Object.values(
                GAME_STATES
            ).includes(state)
        ) {

            console.warn(
                `Invalid game state: ${state}`
            );

            return false;

        }


        this.previous =
            this.current;

        this.current =
            state;


        this.paused =
            state ===
            GAME_STATES.PAUSED;


        this.raceStarted =
            state ===
            GAME_STATES.RACING;


        return true;

    }


    is(state) {

        return (
            this.current === state
        );

    }


    getState() {

        return this.current;

    }


    // ========================================================
    // MENU
    // ========================================================

    goToMenu() {

        this.resetRace();

        this.setState(
            GAME_STATES.MENU
        );

    }


    // ========================================================
    // GARAGE
    // ========================================================

    openGarage() {

        this.setState(
            GAME_STATES.GARAGE
        );

    }


    // ========================================================
    // START RACE
    // ========================================================

    startRace() {

        this.resetRace();

        this.setState(
            GAME_STATES.RACING
        );

    }


    // ========================================================
    // PAUSE
    // ========================================================

    pause() {

        if (
            !this.is(
                GAME_STATES.RACING
            )
        ) {

            return false;

        }


        this.setState(
            GAME_STATES.PAUSED
        );


        return true;

    }


    // ========================================================
    // RESUME
    // ========================================================

    resume() {

        if (
            !this.is(
                GAME_STATES.PAUSED
            )
        ) {

            return false;

        }


        this.setState(
            GAME_STATES.RACING
        );


        return true;

    }


    // ========================================================
    // FINISH RACE
    // ========================================================

    finishRace() {

        this.raceStarted =
            false;

        this.raceFinished =
            true;

        this.paused =
            false;


        this.setState(
            GAME_STATES.RESULTS
        );

    }


    // ========================================================
    // RESET RACE
    // ========================================================

    resetRace() {

        this.lap =
            1;

        this.position =
            1;

        this.raceTime =
            0;

        this.countdown =
            3;

        this.raceStarted =
            false;

        this.raceFinished =
            false;

        this.paused =
            false;

    }


    // ========================================================
    // UPDATE RACE TIME
    // ========================================================

    updateRaceTime(delta) {

        if (
            !this.is(
                GAME_STATES.RACING
            )
        ) {

            return;

        }


        if (this.paused) {

            return;

        }


        this.raceTime +=
            delta;

    }


    // ========================================================
    // LAP
    // ========================================================

    setLap(lap) {

        this.lap =
            Math.max(
                1,
                Math.min(
                    lap,
                    this.totalLaps
                )
            );

    }


    nextLap() {

        if (
            this.lap <
            this.totalLaps
        ) {

            this.lap++;

            return false;

        }


        // Last lap completed

        this.finishRace();

        return true;

    }


    getLap() {

        return this.lap;

    }


    // ========================================================
    // POSITION
    // ========================================================

    setPosition(position) {

        this.position =
            Math.max(
                1,
                Math.min(
                    position,
                    this.totalRacers
                )
            );

    }


    getPosition() {

        return this.position;

    }


    // ========================================================
    // CAR SELECTION
    // ========================================================

    setCar(carId) {

        if (
            !this.isCarOwned(
                carId
            )
        ) {

            console.warn(
                `Car "${carId}" is not owned.`
            );

            return false;

        }


        this.state.selectedCar =
            carId;


        this.save();

        return true;

    }


    getSelectedCar() {

        return this.state.selectedCar;

    }


    // ========================================================
    // UNLOCK CAR
    // ========================================================

    unlockCar(carId) {

        if (
            this.isCarOwned(
                carId
            )
        ) {

            return false;

        }


        this.state.ownedCars.push(
            carId
        );


        this.save();

        return true;

    }


    // ========================================================
    // CAR OWNERSHIP
    // ========================================================

    isCarOwned(carId) {

        return this.state.ownedCars.includes(
            carId
        );

    }


    getOwnedCars() {

        return [
            ...this.state.ownedCars
        ];

    }


    // ========================================================
    // TRACK
    // ========================================================

    setTrack(trackId) {

        this.state.selectedTrack =
            trackId;

        this.save();

    }


    getSelectedTrack() {

        return this.state.selectedTrack;

    }


    // ========================================================
    // DIFFICULTY
    // ========================================================

    setDifficulty(level) {

        const validLevels = [

            "easy",

            "normal",

            "hard",

            "expert"

        ];


        if (
            !validLevels.includes(
                level
            )
        ) {

            console.warn(
                `Invalid difficulty: ${level}`
            );

            return false;

        }


        this.state.difficulty =
            level;


        this.save();

        return true;

    }


    getDifficulty() {

        return this.state.difficulty;

    }


    // ========================================================
    // XP
    // ========================================================

    addXP(amount) {

        amount =
            Math.max(
                0,
                Number(amount) || 0
            );


        this.state.xp +=
            amount;


        this.save();

    }


    getXP() {

        return this.state.xp;

    }


    getLevel() {

        return (
            Math.floor(
                this.state.xp / 1000
            ) + 1
        );

    }


    getXPForNextLevel() {

        return (
            this.getLevel() *
            1000
        );

    }


    getXPProgress() {

        const levelXP =
            (
                this.getLevel() - 1
            ) * 1000;


        return (
            this.state.xp -
            levelXP
        );

    }


    getXPProgressPercent() {

        const progress =
            this.getXPProgress();


        const required =
            1000;


        return Math.min(
            100,
            (
                progress /
                required
            ) * 100
        );

    }


    // ========================================================
    // CREDITS
    // ========================================================

    addCredits(amount) {

        amount =
            Math.max(
                0,
                Number(amount) || 0
            );


        this.state.credits +=
            amount;


        this.save();

    }


    spendCredits(amount) {

        amount =
            Math.max(
                0,
                Number(amount) || 0
            );


        if (
            this.state.credits <
            amount
        ) {

            return false;

        }


        this.state.credits -=
            amount;


        this.save();

        return true;

    }


    getCredits() {

        return this.state.credits;

    }


    // ========================================================
    // UPGRADES
    // ========================================================

    getUpgrades(carId) {

        if (
            !this.state.upgrades[carId]
        ) {

            this.state.upgrades[carId] = {

                engine:
                    0,

                brakes:
                    0,

                handling:
                    0,

                acceleration:
                    0

            };

        }


        return this.state.upgrades[
            carId
        ];

    }


    upgrade(
        carId,
        type,
        cost
    ) {

        const validTypes = [

            "engine",

            "brakes",

            "handling",

            "acceleration"

        ];


        if (
            !validTypes.includes(
                type
            )
        ) {

            console.warn(
                `Invalid upgrade type: ${type}`
            );

            return false;

        }


        if (
            !this.isCarOwned(
                carId
            )
        ) {

            return false;

        }


        if (
            !this.spendCredits(
                cost
            )
        ) {

            return false;

        }


        const upgrades =
            this.getUpgrades(
                carId
            );


        upgrades[type]++;


        this.save();

        return true;

    }


    // ========================================================
    // GET COMPLETE PLAYER DATA
    // ========================================================

    getPlayerData() {

        return {
            ...this.state,

            level:
                this.getLevel(),

            xpProgress:
                this.getXPProgress(),

            xpForNextLevel:
                this.getXPForNextLevel()

        };

    }


    // ========================================================
    // RESET EVERYTHING
    // ========================================================

    reset() {

        this.state =
            this.getDefaultState();


        this.resetRace();


        this.save();


        this.setState(
            GAME_STATES.MENU
        );

    }

}


export default GameState;

