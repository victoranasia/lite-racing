export class HUD {

    constructor(gameState) {

        this.gameState =
            gameState;

        this.create();

    }


    create() {

        const existing =
            document.getElementById(
                "hud"
            );


        const hud =
            existing ||
            document.createElement(
                "div"
            );


        hud.id =
            "hud";


        hud.innerHTML = `

            <div>
                SPEED:
                <b id="speed">0</b>
            </div>

            <div>
                LAP:
                <b id="lap">1/3</b>
            </div>

            <div>
                TIME:
                <b id="race-time">00:00:00</b>
            </div>

            <div>
                POSITION:
                <b id="position">1/5</b>
            </div>

        `;


        if (!existing) {

            document.body.appendChild(
                hud
            );

        }

        this.update();

    }


    update() {

        // Race values are maintained by Game. Keeping this method makes the
        // component safe for callers that only need the DOM initialized.

    }

}
