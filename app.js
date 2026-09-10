const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

const touchLayer = document.getElementById("touchLayer");
const opening = document.getElementById("opening");
const garden = document.getElementById("garden");
const transition = document.getElementById("transition");
const beginBtn = document.getElementById("beginBtn");
const secretStar = document.getElementById("secretStar");
const introText = document.getElementById("introText");

const flowers = document.querySelectorAll(".flower");
const flowersFound = document.getElementById("flowersFound");
const flowerMessage = document.getElementById("flowerMessage");
const messageText = document.getElementById("messageText");
const gardenComplete = document.getElementById("gardenComplete");
const gardenContinue = document.getElementById("gardenContinue");

let width = 0;
let height = 0;

let stars = [];
let shootingStars = [];

let gameStarted = false;
let secretTouches = 0;
let introIndex = 0;
let foundFlowers = 0;
let messageTimer = null;


function resizeCanvas() {
    const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    createStars();
}


function createStars() {
    stars = [];

    const amount = Math.min(
        170,
        Math.max(
            70,
            Math.floor(width * height / 8500)
        )
    );

    for (let i = 0; i < amount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.25 + .2,
            opacity: Math.random() * .55 + .2,
            twinkle: Math.random() * 2 + .5,
            phase: Math.random() * Math.PI * 2,
            drift: Math.random() * .08 + .01,
            depth: Math.random()
        });
    }
}


function drawStars(time) {
    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    for (const star of stars) {
        const pulse = Math.sin(
            time * .001 * star.twinkle +
            star.phase
        );

        const opacity = Math.max(
            .05,
            star.opacity + pulse * .15
        );

        star.y -= star.drift * star.depth;

        if (star.y < -5) {
            star.y = height + 5;
        }

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,255,255,${opacity})`;

        ctx.fill();

        if (
            star.radius > 1.05 &&
            pulse > .85
        ) {
            ctx.beginPath();

            ctx.arc(
                star.x,
                star.y,
                star.radius * 2.5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(255,255,255,${opacity * .08})`;

            ctx.fill();
        }
    }

    drawShootingStars();

    requestAnimationFrame(drawStars);
}


function createShootingStar() {
    if (shootingStars.length >= 2) {
        return;
    }

    shootingStars.push({
        x: Math.random() * width * .8,
        y: Math.random() * height * .35,
        length: Math.random() * 80 + 60,
        speed: Math.random() * 7 + 8,
        opacity: .8,
        life: 0,
        maxLife: Math.random() * 25 + 25
    });
}


function drawShootingStars() {
    for (
        let i = shootingStars.length - 1;
        i >= 0;
        i--
    ) {
        const star = shootingStars[i];

        star.x += star.speed;
        star.y += star.speed * .45;
        star.life++;

        const progress =
            star.life / star.maxLife;

        const opacity =
            Math.sin(progress * Math.PI) *
            star.opacity;

        const gradient =
            ctx.createLinearGradient(
                star.x,
                star.y,
                star.x - star.length,
                star.y - star.length * .45
            );

        gradient.addColorStop(
            0,
            `rgba(255,255,255,${opacity})`
        );

        gradient.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        ctx.beginPath();

        ctx.moveTo(
            star.x,
            star.y
        );

        ctx.lineTo(
            star.x - star.length,
            star.y - star.length * .45
        );

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (
            star.life >=
            star.maxLife
        ) {
            shootingStars.splice(i, 1);
        }
    }
}


function createTouchEffect(x, y) {
    const ripple =
        document.createElement("div");

    ripple.className =
        "touch-ripple";

    ripple.style.left =
        `${x}px`;

    ripple.style.top =
        `${y}px`;

    touchLayer.appendChild(ripple);

    setTimeout(
        () => ripple.remove(),
        1200
    );

    for (let i = 0; i < 7; i++) {
        const particle =
            document.createElement("div");

        particle.className =
            "touch-particle";

        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            Math.random() * 45 + 20;

        particle.style.left =
            `${x}px`;

        particle.style.top =
            `${y}px`;

        particle.style.setProperty(
            "--x",
            `${Math.cos(angle) * distance}px`
        );

        particle.style.setProperty(
            "--y",
            `${Math.sin(angle) * distance}px`
        );

        touchLayer.appendChild(particle);

        setTimeout(
            () => particle.remove(),
            900
        );
    }
}


window.addEventListener(
    "pointerdown",
    event => {
        createTouchEffect(
            event.clientX,
            event.clientY
        );
    }
);


secretStar.addEventListener(
    "pointerdown",
    event => {
        event.stopPropagation();

        secretTouches++;

        secretStar.style.transform =
            "scale(2) rotate(180deg)";

        secretStar.style.opacity = "1";

        setTimeout(() => {
            secretStar.style.transform = "";
            secretStar.style.opacity = "";
        }, 600);

        if (secretTouches >= 3) {
            secretStar.textContent = "♡";
            secretStar.style.fontSize = "12px";
        }
    }
);


const introMessages = [
    "Take your time...",
    "There's no rush.",
    "Just follow the little stars.",
    "Something is waiting for you.",
    "And yes... you have to discover it."
];


function changeIntroText() {
    introText.classList.add("changing");

    setTimeout(() => {
        introIndex++;

        if (
            introIndex >=
            introMessages.length
        ) {
            introIndex = 0;
        }

        introText.textContent =
            introMessages[introIndex];

        introText.classList.remove(
            "changing"
        );
    }, 800);
}


setInterval(
    changeIntroText,
    3800
);


beginBtn.addEventListener(
    "pointerdown",
    event => {
        event.preventDefault();
    }
);


beginBtn.addEventListener(
    "click",
    () => {

        if (gameStarted) {
            return;
        }

        gameStarted = true;

        transition.classList.add(
            "active"
        );

        opening.style.opacity = "0";
        opening.style.transform =
            "scale(1.08)";

        setTimeout(() => {
            opening.classList.add(
                "hidden"
            );

            garden.classList.remove(
                "hidden"
            );
        }, 1100);

        setTimeout(() => {
            transition.classList.remove(
                "active"
            );
        }, 2200);
    }
);


flowers.forEach(flower => {

    flower.addEventListener(
        "click",
        () => {

            if (
                flower.classList.contains(
                    "found"
                )
            ) {
                return;
            }

            flower.classList.add(
                "found"
            );

            foundFlowers++;

            flowersFound.textContent =
                foundFlowers;

            messageText.textContent =
                flower.dataset.message;

            if (messageTimer) {
                clearTimeout(messageTimer);
            }

            flowerMessage.classList.remove(
                "show"
            );

            setTimeout(() => {
                flowerMessage.classList.add(
                    "show"
                );
            }, 80);

            messageTimer = setTimeout(() => {
                flowerMessage.classList.remove(
                    "show"
                );
            }, 5000);

            createGardenParticles(
                flower
            );

            if (
                foundFlowers ===
                flowers.length
            ) {

                setTimeout(() => {
                    gardenComplete.classList.add(
                        "show"
                    );
                }, 1800);

            }
        }
    );

});


function createGardenParticles(element) {

    const rect =
        element.getBoundingClientRect();

    const centerX =
        rect.left + rect.width / 2;

    const centerY =
        rect.top + 35;

    for (let i = 0; i < 14; i++) {

        const particle =
            document.createElement("div");

        particle.className =
            "garden-particle";

        particle.style.left =
            `${centerX}px`;

        particle.style.top =
            `${centerY}px`;

        const angle =
            Math.random() *
            Math.PI *
            2;

        const distance =
            25 +
            Math.random() *
            55;

        particle.style.setProperty(
            "--tx",
            `${Math.cos(angle) * distance}px`
        );

        particle.style.setProperty(
            "--ty",
            `${Math.sin(angle) * distance}px`
        );

        document.body.appendChild(
            particle
        );

        setTimeout(
            () => particle.remove(),
            850
        );
    }
}


gardenContinue.addEventListener(
    "click",
    () => {

        gardenComplete.classList.remove(
            "show"
        );

        transition.classList.add(
            "active"
        );

        setTimeout(() => {

            garden.classList.add(
                "hidden"
            );

            transition.classList.remove(
                "active"
            );

        }, 900);
    }
);


window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();

requestAnimationFrame(
    drawStars
);

setInterval(
    createShootingStar,
    5500
);