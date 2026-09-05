export class UpgradeSystem {

    constructor(gameState) {

        this.gameState =
            gameState;

        this.maxLevel = 5;

    }


    getUpgradeCost(level) {

        return 500 +
            (level * 750);

    }


    getLevel(carId, type) {

        const upgrades =
            this.gameState
                .getUpgrades(carId);

        return upgrades[type] || 0;

    }


    canUpgrade(carId, type) {

        return (
            this.getLevel(
                carId,
                type
            ) < this.maxLevel
        );

    }


    upgrade(carId, type) {

        const level =
            this.getLevel(
                carId,
                type
            );


        if (
            level >= this.maxLevel
        ) {

            return {

                success: false,

                message:
                    "Maximum level reached."

            };

        }


        const cost =
            this.getUpgradeCost(
                level
            );


        const success =
            this.gameState.upgrade(
                carId,
                type,
                cost
            );


        if (!success) {

            return {

                success: false,

                message:
                    "Not enough credits."

            };

        }


        return {

            success: true,

            message:
                `${type.toUpperCase()} upgraded!`

        };

    }


    getCarStats(carId, baseStats) {

        const upgrades =
            this.gameState
                .getUpgrades(carId);


        return {

            speed:
                baseStats.speed +
                upgrades.engine * 4,

            acceleration:
                baseStats.acceleration +
                upgrades.acceleration * 5,

            handling:
                baseStats.handling +
                upgrades.handling * 5,

            braking:
                baseStats.braking +
                upgrades.brakes * 5

        };

    }

}
