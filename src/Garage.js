import {
    getAllCars
} from "./CarData.js";

import {
    UpgradeSystem
} from "./UpgradeSystem.js";




export class Garage {

    constructor(gameState) {

        this.gameState =
            gameState;

        this.upgrades =
            new UpgradeSystem(
                gameState
            );

        this.container =
            document.getElementById(
                "garage"
            );

        this.render();

    }


    render() {

        this.container.innerHTML = `

            <div class="garage-header">

                <h1>GARAGE</h1>

                <div id="garage-credits">
                    CREDITS: 0
                </div>

            </div>


            <div
                id="car-grid"
                class="car-grid"
            ></div>


            <div
                id="upgrade-panel"
                class="upgrade-panel"
            ></div>


            <button
                id="garage-back"
                class="menu-button"
            >
                BACK
            </button>

        `;


        this.renderCars();

        this.updateCredits();


        document
            .getElementById(
                "garage-back"
            )
            .addEventListener(
                "click",
                () => {

                    if (this.onBack) {

                        this.onBack();

                    } else {

                        this.hide();

                    }

                }
            );

    }


    renderCars() {

        const grid =
            document.getElementById(
                "car-grid"
            );


        grid.innerHTML = "";


        for (
            const car
            of getAllCars()
        ) {

            const owned =
                this.gameState
                    .isCarOwned(
                        car.id
                    );


            const selected =
                this.gameState
                    .getSelectedCar()
                    === car.id;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "car-card";


            card.innerHTML = `

                <div
                    class="car-preview"
                    style="
                        background:
                        rgb(
                            ${car.color >> 16 & 255},
                            ${car.color >> 8 & 255},
                            ${car.color & 255}
                        );
                    "
                >
                    🚗
                </div>

                <h2>
                    ${car.name}
                </h2>

                <p>
                    ${car.description}
                </p>

                <div class="stat">
                    SPEED
                    <span>
                        ${car.stats.speed}
                    </span>
                </div>

                <div class="stat">
                    ACCELERATION
                    <span>
                        ${car.stats.acceleration}
                    </span>
                </div>

                <div class="stat">
                    HANDLING
                    <span>
                        ${car.stats.handling}
                    </span>
                </div>

                <div class="stat">
                    BRAKING
                    <span>
                        ${car.stats.braking}
                    </span>
                </div>

                <button
                    class="car-action"
                >
                    ${
                        selected
                            ? "SELECTED"
                            : owned
                                ? "SELECT"
                                : `BUY ${car.price}`
                    }
                </button>

            `;


            const button =
                card.querySelector(
                    ".car-action"
                );


            button.addEventListener(
                "click",
                () => {

                    this.selectCar(
                        car
                    );

                }
            );


            grid.appendChild(
                card
            );

        }

    }


    selectCar(car) {

        const owned =
            this.gameState
                .isCarOwned(
                    car.id
                );


        if (!owned) {

            const purchased =
                this.gameState
                    .spendCredits(
                        car.price
                    );


            if (!purchased) {

                alert(
                    "Not enough credits."
                );

                return;

            }


            this.gameState
                .unlockCar(
                    car.id
                );

        }


        this.gameState
            .setCar(
                car.id
            );


        this.renderCars();

        this.renderUpgrades();

        this.updateCredits();

    }


    renderUpgrades() {

        const panel =
            document.getElementById(
                "upgrade-panel"
            );


        const carId =
            this.gameState
                .getSelectedCar();


        const upgrades =
            this.gameState
                .getUpgrades(
                    carId
                );


        const types = [

            "engine",

            "acceleration",

            "brakes",

            "handling"

        ];


        panel.innerHTML = `

            <h2>
                UPGRADES
            </h2>

            <div class="upgrade-grid">

                ${types.map(
                    type => {

                        const level =
                            upgrades[type];

                        const cost =
                            this.upgrades
                                .getUpgradeCost(
                                    level
                                );

                        return `

                            <div
                                class="upgrade-card"
                            >

                                <h3>
                                    ${type.toUpperCase()}
                                </h3>

                                <div>
                                    LEVEL
                                    ${level}/5
                                </div>

                                <button
                                    data-type="${type}"
                                    ${
                                        level >= 5
                                        ? "disabled"
                                        : ""
                                    }
                                >
                                    ${
                                        level >= 5
                                        ? "MAX"
                                        : `UPGRADE — ${cost}`
                                    }
                                </button>

                            </div>

                        `;

                    }
                ).join("")}

            </div>

        `;


        panel
            .querySelectorAll(
                "button[data-type]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const result =
                                this.upgrades
                                    .upgrade(
                                        carId,
                                        button.dataset.type
                                    );


                            alert(
                                result.message
                            );


                            this.renderUpgrades();

                            this.updateCredits();

                        }
                    );

                }
            );

    }


    updateCredits() {

        document
            .getElementById(
                "garage-credits"
            )
            .textContent =

            `CREDITS: ${
                this.gameState
                    .getCredits()
            }`;

    }


    show() {

        this.container.style.display =
            "block";

        this.renderCars();

        this.renderUpgrades();

        this.updateCredits();

    }


    hide() {

        this.container.style.display =
            "none";

    }

}
