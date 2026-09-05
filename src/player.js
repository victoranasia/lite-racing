const carGeometry = new THREE.BoxGeometry(
    2,
    0.7,
    4
);

const carMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000
});

const car = new THREE.Mesh(
    carGeometry,
    carMaterial
);

car.position.y = 0.5;

scene.add(car);

//controls the car
const keys = {};

window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

//movement instructions

function updateCar(car) {

    if (keys['w'] || keys['ArrowUp']) {
        car.position.z -= 0.1;
    }

    if (keys['s'] || keys['ArrowDown']) {
        car.position.z += 0.05;
    }

    if (keys['a'] || keys['ArrowLeft']) {
        car.rotation.y += 0.03;
    }

    if (keys['d'] || keys['ArrowRight']) {
        car.rotation.y -= 0.03;
    }
}
