import * as THREE from "three";

export class AudioManager {

    constructor(camera) {

        this.camera = camera;

        this.listener =
            new THREE.AudioListener();

        this.camera.add(
            this.listener
        );

        this.loader =
            new THREE.AudioLoader();

        this.sounds = {};

        this.music = null;

        this.engine = null;

        this.masterVolume = 1;

        this.musicVolume = 0.5;

        this.sfxVolume = 1;

        this.initialized = false;

    }


    loadSound(name, path) {

        return new Promise(
            (resolve, reject) => {

                this.loader.load(

                    path,

                    buffer => {

                        this.sounds[name] =
                            buffer;

                        resolve(buffer);

                    },

                    undefined,

                    error => {

                        console.error(
                            `Failed to load ${name}:`,
                            error
                        );

                        reject(error);

                    }

                );

            }
        );

    }


    async loadAll() {

        const sounds = {

            engine:
                "/assets/audio/engine.mp3",

            brake:
                "/assets/audio/brake.mp3",

            crash:
                "/assets/audio/crash.mp3",

            nitro:
                "/assets/audio/nitro.mp3",

            countdown:
                "/assets/audio/countdown.mp3",

            finish:
                "/assets/audio/finish.mp3",

            music:
                "/assets/audio/music.mp3"

        };


        for (
            const [name, path]
            of Object.entries(sounds)
        ) {

            try {

                await this.loadSound(
                    name,
                    path
                );

            }
            catch (error) {

                console.warn(
                    `Could not load ${name}`
                );

            }

        }


        this.initialized = true;

        console.log(
            "All available audio loaded."
        );

    }


    createEngineSound() {

        if (
            !this.sounds.engine
        ) {

            console.warn(
                "Engine sound not loaded."
            );

            return;

        }


        if (
            this.engine
        ) {

            return;

        }


        this.engine =
            new THREE.Audio(
                this.listener
            );


        this.engine
            .setBuffer(
                this.sounds.engine
            );


        this.engine
            .setLoop(true);


        this.engine
            .setVolume(0);


        this.engine.play();

    }


    updateEngine(
        speed,
        maxSpeed
    ) {

        if (
            !this.engine
        ) {

            return;

        }


        const normalizedSpeed =
            Math.max(
                0,
                Math.min(
                    speed / maxSpeed,
                    1
                )
            );


        const volume =
            0.1 +
            normalizedSpeed *
            0.7;


        const playbackRate =
            0.8 +
            normalizedSpeed *
            0.8;


        this.engine.setVolume(
            volume *
            this.sfxVolume *
            this.masterVolume
        );


        this.engine
            .setPlaybackRate(
                playbackRate
            );

    }


    play(
        name,
        volume = 1
    ) {

        const buffer =
            this.sounds[name];


        if (
            !buffer
        ) {

            console.warn(
                `Sound "${name}" not loaded.`
            );

            return null;

        }


        const sound =
            new THREE.Audio(
                this.listener
            );


        sound.setBuffer(
            buffer
        );


        sound.setVolume(

            volume *
            this.sfxVolume *
            this.masterVolume

        );


        sound.play();


        return sound;

    }


    playBrake() {

        return this.play(
            "brake",
            0.7
        );

    }


    playCrash() {

        return this.play(
            "crash",
            1
        );

    }


    playNitro() {

        return this.play(
            "nitro",
            1
        );

    }


    playCountdown() {

        return this.play(
            "countdown",
            1
        );

    }


    playFinish() {

        return this.play(
            "finish",
            1
        );

    }


    playMusic() {

        if (
            !this.sounds.music
        ) {

            return;

        }


        if (
            this.music
        ) {

            if (
                !this.music.isPlaying
            ) {

                this.music.play();

            }

            return;

        }


        this.music =
            new THREE.Audio(
                this.listener
            );


        this.music
            .setBuffer(
                this.sounds.music
            );


        this.music
            .setLoop(true);


        this.music
            .setVolume(

                this.musicVolume *
                this.masterVolume

            );


        this.music.play();

    }


    stopMusic() {

        if (
            this.music &&
            this.music.isPlaying
        ) {

            this.music.stop();

        }

    }


    setMasterVolume(
        volume
    ) {

        this.masterVolume =
            Math.max(
                0,
                Math.min(
                    volume,
                    1
                )
            );


        this.updateVolumes();

    }


    setMusicVolume(
        volume
    ) {

        this.musicVolume =
            Math.max(
                0,
                Math.min(
                    volume,
                    1
                )
            );


        if (
            this.music
        ) {

            this.music.setVolume(

                this.musicVolume *
                this.masterVolume

            );

        }

    }


    setSFXVolume(
        volume
    ) {

        this.sfxVolume =
            Math.max(
                0,
                Math.min(
                    volume,
                    1
                )
            );

    }


    updateVolumes() {

        if (
            this.music
        ) {

            this.music.setVolume(

                this.musicVolume *
                this.masterVolume

            );

        }


        if (
            this.engine
        ) {

            this.engine.setVolume(

                this.engine
                    .getVolume() *
                this.masterVolume

            );

        }

    }


    stopEngine() {

        if (
            this.engine &&
            this.engine.isPlaying
        ) {

            this.engine.stop();

        }

    }


    pauseAll() {

        if (
            this.music &&
            this.music.isPlaying
        ) {

            this.music.pause();

        }


        if (
            this.engine &&
            this.engine.isPlaying
        ) {

            this.engine.pause();

        }

    }


    resumeAll() {

        if (
            this.music &&
            !this.music.isPlaying
        ) {

            this.music.play();

        }


        if (
            this.engine &&
            !this.engine.isPlaying
        ) {

            this.engine.play();

        }

    }


    dispose() {

        this.stopEngine();

        this.stopMusic();

        this.sounds = {};

    }

}