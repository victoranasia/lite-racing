import { Game } from "./Game.js";

async function startGame() {

    try {

        console.log("Empire Racing starting...");

        const game = new Game();

        window.empireRacing = game;

        game.init();

        console.log("Empire Racing initialized.");

    } catch (error) {

        console.error(
            "Empire Racing failed to initialize:",
            error
        );

        const loading =
            document.getElementById(
                "loading-screen"
            );

        if (loading) {

            loading.innerHTML = `

                <div
                    style="
                        color:#fff;
                        text-align:center;
                        padding:40px;
                        font-family:Arial;
                    "
                >

                    <h1>
                        EMPIRE RACING
                    </h1>

                    <p
                        style="
                            color:#ff1744;
                            margin-top:20px;
                        "
                    >
                        GAME INITIALIZATION FAILED
                    </p>

                    <pre
                        style="
                            margin-top:20px;
                            white-space:pre-wrap;
                            color:#aaa;
                        "
                    >${error.stack || error}</pre>

                </div>

            `;

        }

    }

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startGame
    );

} else {

    startGame();

}