export class PauseManager {

    constructor() {

        this.paused =
            false;

        this.createUI();

        this.setupInput();

    }


    createUI() {

        this.element =
            document.createElement(
                "div"
            );


        this.element.id =
            "pause-menu";


        this.element.innerHTML = `

            <div class="pause-panel">

                <h1>PAUSED</h1>

                <button id="resume-game">
                    RESUME
                </button>

                <button id="pause-main-menu">
                    MAIN MENU
                </button>

            </div>

        `;


        document.body.appendChild(
            this.element
        );


        document
            .getElementById(
                "resume-game"
            )
            .addEventListener(
                "click",
                () => this.resume()
            );

    }


    setupInput() {

        window.addEventListener(
            "keydown",
            event => {

                if (
                    event.code ===
                    "Escape"
                ) {

                    this.toggle();

                }

            }
        );

    }


    toggle() {

        if (
            this.paused
        ) {

            this.resume();

        }
        else {

            this.pause();

        }

    }


    pause() {

        this.paused =
            true;

        this.element.style.display =
            "flex";

    }


    resume() {

        this.paused =
            false;

        this.element.style.display =
            "none";

    }

pauseGame() {

    this.pause.pause();

    this.audio.pauseAll();

}

resumeGame() {

    this.pause.resume();

    this.audio.resumeAll();

}



}
