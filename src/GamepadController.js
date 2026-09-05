export class GamepadController {

    constructor(input) {

        this.input =
            input;

        this.gamepad =
            null;

    }


    update() {

        const gamepads =
            navigator.getGamepads();


        if (!gamepads) {

            return;

        }


        this.gamepad =
            Array.from(gamepads)
                .find(
                    gamepad =>
                        gamepad !== null
                );


        if (
            !this.gamepad
        ) {

            return;

        }


        const leftStick =
            this.gamepad
                .axes[0] || 0;


        const accelerate =
            this.gamepad
                .buttons[7]?.value || 0;


        const brake =
            this.gamepad
                .buttons[6]?.value || 0;


        this.input.steering =
            leftStick;


        this.input.accelerate =
            accelerate > 0.1;


        this.input.brake =
            brake > 0.1;


        this.input.nitro =
            this.gamepad
                .buttons[0]
                ?.pressed || false;

    }

}
