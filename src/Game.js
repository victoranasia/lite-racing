import * as THREE from "three";

import { Input } from "./Input2.js";
import { Car } from "./Car.js";
import { Track } from "./Track.js";
import { CameraController } from "./Camera.js";
import { AIController } from "./AI2.js";

import { GameState } from "./GameState.js";
import { MainMenu } from "./MainMenu.js";
import { Garage } from "./Garage.js";
import { HUD } from "./HUD.js";

import { getCar } from "./CarData.js";

import { Environment } from "./Environment.js";
import { AudioManager } from "./AudioManager.js";
import { ParticleSystem } from "./ParticleSystem.js";
import { NitroEffect } from "./NitroEffect.js";
import { CameraEffects } from "./CameraEffects.js";
import { MobileControls } from "./MobileControls.js";

import { WeatherSystem } from "./WeatherSystem.js";
import { DayNightCycle } from "./DayNightCycle.js";

import { GraphicsManager } from "./GraphicsManager.js";
import { LODManager } from "./LODManager.js";
import { PerformanceManager } from "./PerformanceManager.js";

import { LoadingScreen } from "./LoadingScreen.js";
import { SaveManager } from "./SaveManager.js";
import { GamepadController } from "./GamepadController.js";
import { ResponsiveUI } from "./ResponsiveUI.js";


export class Game {

    constructor() {

        // ============================================
        // CORE
        // ============================================

        this.clock = new THREE.Clock();

        this.gameState = new GameState();

        this.scene = new THREE.Scene();

        this.scene.background =
            new THREE.Color(0x101522);


        // ============================================
        // CAMERA
        // ============================================

        this.camera =
            new THREE.PerspectiveCamera(
                60,
                window.innerWidth /
                    window.innerHeight,
                0.1,
                2000
            );

        this.camera.position.set(
            0,
            7,
            12
        );


        // ============================================
        // RENDERER
        // ============================================

        this.renderer =
            new THREE.WebGLRenderer({

                antialias: true,

                powerPreference:
                    "high-performance"

            });


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                2
            )
        );


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        this.renderer.shadowMap.enabled =
            true;

        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;


        // ============================================
        // GAME CONTAINER
        // ============================================

        this.container =
            document.getElementById(
                "game-container"
            );


        if (this.container) {

            this.container.appendChild(
                this.renderer.domElement
            );

        } else {

            document.body.appendChild(
                this.renderer.domElement
            );

        }


        // ============================================
        // RACE STATE
        // ============================================

        this.raceState =
            "menu";

        this.totalLaps = 3;

        this.currentLap = 1;

        this.raceTime = 0;

        this.countdown = 3;

        this.countdownTimer = 0;

        this.playerPosition = 1;

        this.finishedCars = [];

        this.aiCars = [];

        this.raceFinished = false;


        // ============================================
        // INPUT
        // ============================================

        this.input =
            new Input();


        // ============================================
        // LIGHTING
        // ============================================

        this.createLights();


        // ============================================
        // TRACK
        // ============================================

        this.track =
            new Track(
                this.scene
            );


        // ============================================
        // PLAYER
        // ============================================

        this.createPlayer();


        // ============================================
        // AI
        // ============================================

        this.createAICars();


        // ============================================
        // CAMERA CONTROLLER
        // ============================================

        this.cameraController =
            new CameraController(
                this.camera
            );


        // ============================================
        // ENVIRONMENT
        // ============================================

        this.environment =
            new Environment(
                this.scene
            );


        // ============================================
        // WEATHER
        // ============================================

        this.weather =
            new WeatherSystem(
                this.scene
            );


        // ============================================
        // DAY / NIGHT
        // ============================================

        this.dayNight =
            new DayNightCycle(
                this.scene,
                this.sun
            );


        // ============================================
        // PARTICLES
        // ============================================

        this.particles =
            new ParticleSystem(
                this.scene
            );


        // ============================================
        // NITRO
        // ============================================

        this.nitroEffect =
            new NitroEffect(
                this.scene
            );


        // ============================================
        // CAMERA EFFECTS
        // ============================================

        this.cameraEffects =
            new CameraEffects(
                this.camera
            );


        // ============================================
        // AUDIO
        // ============================================

        this.audio =
            new AudioManager(
                this.camera
            );


        // ============================================
        // GRAPHICS
        // ============================================

        this.graphics =
            new GraphicsManager(
                this.renderer,
                this.scene,
                this.camera
            );


        if (
            typeof this.graphics.setup ===
            "function"
        ) {

            this.graphics.setup();

        }


        // ============================================
        // LOD
        // ============================================

        this.lod =
            new LODManager(
                this.scene
            );


        // ============================================
        // PERFORMANCE
        // ============================================

        this.performance =
            new PerformanceManager(
                this.renderer
            );


        // ============================================
        // MOBILE CONTROLS
        // ============================================

        this.mobileControls =
            new MobileControls(
                this.input
            );


        // ============================================
        // GAMEPAD
        // ============================================

        this.gamepad =
            new GamepadController(
                this.input
            );


        // ============================================
        // SAVE
        // ============================================

        this.saveManager =
            new SaveManager();


        // ============================================
        // PAUSE
        // ============================================

        // Game owns the pause screen declared in index.html. Creating a
        // second PauseManager here duplicates its IDs and controls.
        this.pause =
            null;


        // ============================================
        // RESPONSIVE UI
        // ============================================

        this.responsive =
            new ResponsiveUI();


        // ============================================
        // LOADING
        // ============================================

        this.loading =
            new LoadingScreen();


        // ============================================
        // UI
        // ============================================

        this.mainMenu =
            new MainMenu(
                this.gameState
            );


        this.garage =
            new Garage(
                this.gameState
            );

        this.garage.onBack =
            () => this.showMainMenu();


        this.hud =
            new HUD(
                this.gameState
            );


        // ============================================
        // EVENTS
        // ============================================

        this.setupEvents();


        // ============================================
        // INITIAL STATE
        // ============================================

        this.showMainMenu();

    }


    // ============================================
    // INITIALIZE
    // ============================================

    init() {

        console.log(
            "Empire Racing initialized."
        );


        this.animate();

        this.finishLoading();

    }


    // ============================================
    // LOADING
    // ============================================

    finishLoading() {

        const loading =
            document.getElementById(
                "loading-screen"
            );


        if (!loading) {

            return;

        }


        loading.classList.add(
            "hidden"
        );


        setTimeout(() => {

            loading.style.display =
                "none";

        }, 700);

    }


    // ============================================
    // LIGHTS
    // ============================================

    createLights() {

        const hemisphere =
            new THREE.HemisphereLight(
                0xffffff,
                0x20252f,
                1.5
            );


        this.scene.add(
            hemisphere
        );


        this.sun =
            new THREE.DirectionalLight(
                0xffffff,
                2
            );


        this.sun.position.set(
            50,
            100,
            50
        );


        this.sun.castShadow =
            true;


        this.sun.shadow.mapSize.width =
            2048;

        this.sun.shadow.mapSize.height =
            2048;


        this.sun.shadow.camera.near =
            0.5;

        this.sun.shadow.camera.far =
            500;


        this.scene.add(
            this.sun
        );

    }


    // ============================================
    // PLAYER
    // ============================================

    createPlayer() {

        const selectedCar =
            this.gameState.getSelectedCar();


        let carData;

        try {

            carData =
                getCar(
                    selectedCar
                );

        } catch {

            carData = {

                name: "Empire GT",

                color: 0xd90429

            };

        }


        if (!carData) {

            carData = {

                name: "Empire GT",

                color: 0xd90429

            };

        }


        this.player =
            new Car({

                name:
                    carData.name,

                color:
                    carData.color,

                isAI:
                    false

            });


        this.player.physics.position.set(
            -2,
            0,
            195
        );


        this.player.physics.rotation =
            Math.PI;


        this.scene.add(
            this.player.object
        );

    }


    // ============================================
    // AI
    // ============================================

    createAICars() {

        const aiSettings = [

            {
                name: "AI 1",
                color: 0x1565c0,
                skill: 0.90,
                x: 0
            },

            {
                name: "AI 2",
                color: 0xff9800,
                skill: 1.00,
                x: 2
            },

            {
                name: "AI 3",
                color: 0x7b1fa2,
                skill: 1.05,
                x: -4
            },

            {
                name: "AI 4",
                color: 0x2e7d32,
                skill: 0.95,
                x: 4
            }

        ];


        for (
            const settings of aiSettings
        ) {

            const car =
                new Car({

                    name:
                        settings.name,

                    color:
                        settings.color,

                    isAI:
                        true

                });


            car.physics.position.set(
                settings.x,
                0,
                185
            );


            car.physics.rotation =
                Math.PI;


            this.scene.add(
                car.object
            );


            const controller =
                new AIController(

                    car,

                    this.track,

                    {
                        skill:
                            settings.skill
                    }

                );


            this.aiCars.push({

                car,

                controller

            });

        }

    }


    // ============================================
    // UI EVENTS
    // ============================================

    setupEvents() {

        const startButton =
            document.getElementById(
                "start-race"
            );


        const garageButton =
            document.getElementById(
                "open-garage"
            );


        const resetButton =
            document.getElementById(
                "reset-save"
            );


        const raceAgain =
            document.getElementById(
                "race-again"
            );


        const resultsMenu =
            document.getElementById(
                "results-menu"
            );


        const resume =
            document.getElementById(
                "resume-game"
            );


        const pauseMenu =
            document.getElementById(
                "pause-menu"
            );


        startButton?.addEventListener(
            "click",
            () => {

                this.startRace();

            }
        );


        garageButton?.addEventListener(
            "click",
            () => {

                this.showGarage();

            }
        );


        resetButton?.addEventListener(
            "click",
            () => {

                if (
                    confirm(
                        "Reset Empire Racing save?"
                    )
                ) {

                    this.gameState.reset();

                    window.location.reload();

                }

            }
        );


        raceAgain?.addEventListener(
            "click",
            () => {

                this.startRace();

            }
        );


        resultsMenu?.addEventListener(
            "click",
            () => {

                this.showMainMenu();

            }
        );


        resume?.addEventListener(
            "click",
            () => {

                this.resumeRace();

            }
        );


        pauseMenu?.addEventListener(
            "click",
            () => {

                this.showMainMenu();

            }
        );


        window.addEventListener(
            "resize",
            () => {

                this.handleResize();

            }
        );


        window.addEventListener(
            "keydown",
            event => {

                if (
                    event.code ===
                    "Escape"
                ) {

                    this.togglePause();

                }

            }
        );

    }


    // ============================================
    // MAIN MENU
    // ============================================

    showMainMenu() {

        this.raceState =
            "menu";


        this.hideElement(
            "hud"
        );

        this.hideElement(
            "garage"
        );

        this.hideElement(
            "pause-screen"
        );

        this.hideElement(
            "results-screen"
        );


        this.showElement(
            "main-menu"
        );

    }


    // ============================================
    // GARAGE
    // ============================================

    showGarage() {

        this.hideElement(
            "main-menu"
        );

        this.showElement(
            "garage"
        );


        if (
            this.garage &&
            typeof this.garage.show ===
            "function"
        ) {

            this.garage.show();

        }

    }


    // ============================================
    // START RACE
    // ============================================

    startRace() {

        this.hideElement(
            "main-menu"
        );

        this.hideElement(
            "garage"
        );

        this.hideElement(
            "results-screen"
        );


        this.showElement(
            "hud"
        );


        this.raceTime = 0;

        this.currentLap = 1;

        this.countdown = 3;

        this.countdownTimer = 0;

        this.raceFinished = false;

        this.finishedCars = [];


        this.raceState =
            "countdown";


        this.resetCars();


        console.log(
            "Race started."
        );

    }


    // ============================================
    // RESET CARS
    // ============================================

    resetCars() {

        if (
            this.player &&
            this.player.physics
        ) {

            this.player.physics.position.set(
                -2,
                0,
                195
            );


            this.player.physics.rotation =
                Math.PI;


            if (
                "finished"
                in this.player
            ) {

                this.player.finished =
                    false;

            }

        }


        this.aiCars.forEach(
            (entry, index) => {

                const xPositions =
                    [
                        0,
                        2,
                        -4,
                        4
                    ];


                entry.car.physics.position.set(

                    xPositions[index] ?? 0,

                    0,

                    185 - index * 4

                );


                entry.car.physics.rotation =
                    Math.PI;


                if (
                    "finished"
                    in entry.car
                ) {

                    entry.car.finished =
                        false;

                }

            }
        );

    }


    // ============================================
    // PAUSE
    // ============================================

    togglePause() {

        if (
            this.raceState !==
                "racing" &&
            this.raceState !==
                "paused"
        ) {

            return;

        }


        if (
            this.raceState ===
            "paused"
        ) {

            this.resumeRace();

        } else {

            this.pauseRace();

        }

    }


    pauseRace() {

        this.raceState =
            "paused";


        this.showElement(
            "pause-screen"
        );

    }


    resumeRace() {

        this.raceState =
            "racing";


        this.hideElement(
            "pause-screen"
        );

    }


    // ============================================
    // COUNTDOWN
    // ============================================

    updateCountdown(
        delta
    ) {

        this.countdownTimer +=
            delta;


        if (
            this.countdownTimer >= 1
        ) {

            this.countdownTimer = 0;

            this.countdown--;

        }


        if (
            this.countdown <= 0
        ) {

            this.raceState =
                "racing";

        }


        const countdown =
            document.getElementById(
                "countdown"
            );


        if (countdown) {

            if (
                this.raceState ===
                "countdown"
            ) {

                countdown.style.display =
                    "block";

                countdown.textContent =
                    this.countdown;

            } else {

                countdown.style.display =
                    "none";

            }

        }

    }


    // ============================================
    // UPDATE
    // ============================================

    update(
        delta
    ) {

        if (
            this.raceState ===
            "menu"
        ) {

            return;

        }


        if (
            this.raceState ===
            "paused"
        ) {

            return;

        }


        if (
            this.raceState ===
            "countdown"
        ) {

            this.updateCountdown(
                delta
            );

            return;

        }


        if (
            this.raceState !==
            "racing"
        ) {

            return;

        }


        // ========================================
        // TIMER
        // ========================================

        this.raceTime +=
            delta;


        // ========================================
        // PLAYER
        // ========================================

        if (
            this.player &&
            !this.player.finished
        ) {

            this.player.update(
                this.input,
                delta
            );

        }


        // ========================================
        // AI
        // ========================================

        for (
            const entry of this.aiCars
        ) {

            if (
                !entry.car.finished
            ) {

                entry.controller.update(
                    delta
                );

            }

        }


        // ========================================
        // TRACK LIMITS
        // ========================================

        if (
            this.track &&
            typeof this.track.constrainCar ===
            "function"
        ) {

            this.track.constrainCar(
                this.player
            );


            for (
                const entry of this.aiCars
            ) {

                this.track.constrainCar(
                    entry.car
                );

            }

        }


        // ========================================
        // CAMERA
        // ========================================

        if (
            this.cameraController &&
            typeof this.cameraController.update ===
            "function"
        ) {

            this.cameraController.update(
                this.player,
                delta
            );

        }


        // ========================================
        // PARTICLES
        // ========================================

        if (
            this.particles &&
            typeof this.particles.update ===
            "function"
        ) {

            this.particles.update(
                delta
            );

        }


        // ========================================
        // WEATHER
        // ========================================

        if (
            this.weather &&
            typeof this.weather.update ===
            "function"
        ) {

            this.weather.update(
                delta
            );

        }


        // ========================================
        // DAY NIGHT
        // ========================================

        if (
            this.dayNight &&
            typeof this.dayNight.update ===
            "function"
        ) {

            this.dayNight.update(
                delta
            );

        }


        // ========================================
        // RENDER
        // ========================================

        this.updateHUD();

    }


    // ============================================
    // HUD
    // ============================================

    updateHUD() {

        if (!this.player) {

            return;

        }


        const speed =
            document.getElementById(
                "speed"
            );


        if (speed) {

            const currentSpeed =
                this.player.physics.speed ||
                0;


            speed.textContent =
                Math.round(
                    Math.abs(
                        currentSpeed
                    ) * 3.6
                );

        }


        const lap =
            document.getElementById(
                "lap"
            );


        if (lap) {

            lap.textContent =
                `${this.currentLap}/${this.totalLaps}`;

        }


        const timer =
            document.getElementById(
                "race-time"
            );


        if (timer) {

            timer.textContent =
                this.formatTime(
                    this.raceTime
                );

        }


        const position =
            document.getElementById(
                "position"
            );


        if (position) {

            position.textContent =
                `${this.playerPosition}/${this.aiCars.length + 1}`;

        }

    }


    // ============================================
    // TIME FORMAT
    // ============================================

    formatTime(
        seconds
    ) {

        const minutes =
            Math.floor(
                seconds / 60
            );


        const secs =
            Math.floor(
                seconds % 60
            );


        const milliseconds =
            Math.floor(
                (seconds % 1) * 100
            );


        return (

            String(minutes)
                .padStart(2, "0")

            + ":"

            + String(secs)
                .padStart(2, "0")

            + ":"

            + String(milliseconds)
                .padStart(2, "0")

        );

    }


    // ============================================
    // RESIZE
    // ============================================

    handleResize() {

        this.camera.aspect =
            window.innerWidth /
            window.innerHeight;


        this.camera.updateProjectionMatrix();


        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                2
            )
        );


        if (
            this.graphics &&
            typeof this.graphics.resize ===
            "function"
        ) {

            this.graphics.resize(
                window.innerWidth,
                window.innerHeight
            );

        }

    }


    // ============================================
    // RENDER LOOP
    // ============================================

    animate() {

        requestAnimationFrame(
            () => this.animate()
        );


        const delta =
            Math.min(
                this.clock.getDelta(),
                0.05
            );


        this.update(
            delta
        );


        this.renderer.render(
            this.scene,
            this.camera
        );

    }


    // ============================================
    // DOM HELPERS
    // ============================================

    showElement(
        id
    ) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.classList.remove(
                "hidden"
            );

        }

    }


    hideElement(
        id
    ) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.classList.add(
                "hidden"
            );

        }

    }

}


export default Game;
