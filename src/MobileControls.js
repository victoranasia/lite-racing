export class MobileControls {

    constructor(input) {

        this.input =
            input;

        this.create();

    }


    create() {

        const container =
            document.createElement(
                "div"
            );


        container.id =
            "mobile-controls";


        container.innerHTML = `

            <div
                id="steering-buttons"
            >

                <button
                    id="mobile-left"
                >
                    ◀
                </button>

                <button
                    id="mobile-right"
                >
                    ▶
                </button>

            </div>


            <div
                id="pedal-buttons"
            >

                <button
                    id="mobile-brake"
                >
                    BRAKE
                </button>

                <button
                    id="mobile-gas"
                >
                    GAS
                </button>

                <button
                    id="mobile-nitro"
                >
                    NITRO
                </button>

            </div>

        `;


        document.body.appendChild(
            container
        );


        this.bind(
            "mobile-left",
            "left"
        );


        this.bind(
            "mobile-right",
            "right"
        );


        this.bind(
            "mobile-gas",
            "accelerate"
        );


        this.bind(
            "mobile-brake",
            "brake"
        );


        this.bind(
            "mobile-nitro",
            "nitro"
        );

    }


    bind(
        id,
        property
    ) {

        const button =
            document.getElementById(
                id
            );


        const start = event => {

            event.preventDefault();

            this.input[property] =
                true;

        };


        const end = event => {

            event.preventDefault();

            this.input[property] =
                false;

        };


        button.addEventListener(
            "touchstart",
            start,
            {
                passive: false
            }
        );


        button.addEventListener(
            "touchend",
            end,
            {
                passive: false
            }
        );


        button.addEventListener(
            "touchcancel",
            end,
            {
                passive: false
            }
        );


        button.addEventListener(
            "mousedown",
            start
        );


        button.addEventListener(
            "mouseup",
            end
        );


        button.addEventListener(
            "mouseleave",
            end
        );

    }

}
