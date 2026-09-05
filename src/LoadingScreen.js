export class LoadingScreen {

    constructor() {

        this.element =
            document.getElementById(
                "loading-screen"
            );


        if (!this.element) {

            this.element =
                document.createElement(
                    "div"
                );

            this.element.id =
                "loading-screen";

            this.element.innerHTML = `
                <div class="loading-content">
                    <div class="loading-bar">
                        <div class="loading-progress"></div>
                    </div>
                    <p class="loading-text">Loading...</p>
                </div>
            `;

            document.body.appendChild(
                this.element
            );

        }


        this.progress =
            this.element.querySelector(
                "[data-loading-progress], .loading-progress, #loading-progress"
            );

        this.text =
            this.element.querySelector(
                ".loading-text, #loading-text"
            );

    }


    setProgress(
        value,
        text = "Loading..."
    ) {

        if (this.progress) {

            this.progress.style.width =
                `${Math.max(0, Math.min(value, 1)) * 100}%`;

        }


        if (this.text) {

            this.text.textContent =
                text;

        }

    }


    hide() {

        this.element.classList.add(
            "hidden"
        );

    }

}
