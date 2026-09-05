export class ResponsiveUI {

    constructor() {

        this.update();

        window.addEventListener(
            "resize",
            () => this.update()
        );

    }


    update() {

        const width =
            window.innerWidth;


        document.body
            .classList.toggle(
                "mobile",
                width <= 768
            );


        document.body
            .classList.toggle(
                "tablet",
                width > 768 &&
                width <= 1100
            );


        document.body
            .classList.toggle(
                "desktop",
                width > 1100
            );

    }

}
