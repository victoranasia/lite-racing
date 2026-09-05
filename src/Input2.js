export class Input {

    constructor() {

        this.left = false;

        this.right = false;

        this.accelerate = false;

        this.brake = false;

        this.nitro = false;


        this.setup();

    }


    setup() {

        window.addEventListener(
            "keydown",
            event => {

                switch (
                    event.code
                ) {

                    case "ArrowLeft":

                    case "KeyA":

                        this.left = true;

                        break;


                    case "ArrowRight":

                    case "KeyD":

                        this.right = true;

                        break;


                    case "ArrowUp":

                    case "KeyW":

                        this.accelerate = true;

                        break;


                    case "ArrowDown":

                    case "KeyS":

                        this.brake = true;

                        break;


                    case "ShiftLeft":

                    case "ShiftRight":

                        this.nitro = true;

                        break;

                    }

            }
        );


        window.addEventListener(
            "keyup",
            event => {

                switch (
                    event.code
                ) {

                    case "ArrowLeft":

                    case "KeyA":

                        this.left = false;

                        break;


                    case "ArrowRight":

                    case "KeyD":

                        this.right = false;

                        break;


                    case "ArrowUp":

                    case "KeyW":

                        this.accelerate = false;

                        break;


                    case "ArrowDown":

                    case "KeyS":

                        this.brake = false;

                        break;


                    case "ShiftLeft":

                    case "ShiftRight":

                        this.nitro = false;

                        break;

                }

            }
        );

    }

}