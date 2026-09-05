export class MainMenu {

    constructor(gameState) {

        this.gameState = gameState;

        this.container =
            document.getElementById("main-menu");

        this.onStart = null;
        this.onGarage = null;

        this.setup();
    }


    // ==========================================
    // SETUP
    // ==========================================

    setup() {

        // START RACE BUTTON
        const startButton =
            document.getElementById("start-race");

        if (startButton) {

            startButton.addEventListener(
                "click",
                () => {

                    if (this.onStart) {
                        this.onStart();
                    }

                }
            );

        }


        // GARAGE BUTTON
        const garageButton =
            document.getElementById("garage-button");

        if (garageButton) {

            garageButton.addEventListener(
                "click",
                () => {

                    if (this.onGarage) {
                        this.onGarage();
                    }

                }
            );

        }


        // RESET SAVE BUTTON
        const resetButton =
            document.getElementById("reset-save");

        if (resetButton) {

            resetButton.addEventListener(
                "click",
                () => {

                    this.gameState.reset();

                    window.location.reload();

                }
            );

        }


        // ==========================================
        // DIFFICULTY SELECTOR
        // ==========================================

        const difficulty =
            document.getElementById(
                "difficulty-select"
            );

        if (difficulty) {

            difficulty.value =
                this.gameState.getDifficulty();


            difficulty.addEventListener(
                "change",
                () => {

                    this.gameState.setDifficulty(
                        difficulty.value
                    );

                }
            );

        }


        // ==========================================
        // TRACK SELECTOR
        // ==========================================

        const track =
            document.getElementById(
                "track-select"
            );

        if (track) {

            track.value =
                this.gameState.getSelectedTrack();


            track.addEventListener(
                "change",
                () => {

                    this.gameState.setTrack(
                        track.value
                    );

                }
            );

        }

    }


    // ==========================================
    // SHOW MENU
    // ==========================================

    show() {

        if (this.container) {

            this.container.style.display =
                "flex";

        }

    }


    // ==========================================
    // HIDE MENU
    // ==========================================

    hide() {

        if (this.container) {

            this.container.style.display =
                "none";

        }

    }

}