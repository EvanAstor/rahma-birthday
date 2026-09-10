/* =====================================================
   CANVAS SETUP
===================================================== */

const canvas =
    document.getElementById("starCanvas");

const ctx =
    canvas.getContext("2d");

let stars = [];

let shootingStars = [];

let width = 0;
let height = 0;


/* =====================================================
   DEVICE PIXEL RATIO
===================================================== */

function resizeCanvas() {

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    width =
        window.innerWidth;

    height =
        window.innerHeight;

    canvas.width =
        width * dpr;

    canvas.height =
        height * dpr;

    canvas.style.width =
        width + "px";

    canvas.style.height =
        height + "px";

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


/* =====================================================
   CREATE STARFIELD
===================================================== */

function createStars() {

    stars = [];

    /*
        Amount is based on screen size.

        We intentionally keep it limited
        so weaker phones don't suffer.
    */

    const amount =
        Math.min(
            170,
            Math.max(
                70,
                Math.floor(
                    width * height / 8500
                )
            )
        );


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        stars.push({

            x:
                Math.random() * width,

            y:
                Math.random() * height,

            radius:
                Math.random() * 1.25
                + 0.2,

            opacity:
                Math.random() * 0.55
                + 0.2,

            twinkle:
                Math.random() * 2
                + 0.5,

            phase:
                Math.random()
                * Math.PI
                * 2,

            drift:
                Math.random() * 0.08
                + 0.01,

            depth:
                Math.random()

        });

    }
}


/* =====================================================
   DRAW STARFIELD
===================================================== */

function drawStars(time) {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    for (const star of stars) {

        /*
            Soft twinkle.
        */

        const pulse =
            Math.sin(
                time * 0.001
                * star.twinkle
                + star.phase
            );


        const opacity =
            Math.max(
                0.05,
                star.opacity
                + pulse * 0.15
            );


        /*
            Very slow vertical movement.
        */

        star.y -=
            star.drift
            * star.depth;


        if (star.y < -5) {

            star.y =
                height + 5;

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
            `rgba(
                255,
                255,
                255,
                ${opacity}
            )`;


        ctx.fill();


        /*
            Rare brighter stars.
        */

        if (
            star.radius > 1.05
            &&
            pulse > 0.85
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
                `rgba(
                    255,
                    255,
                    255,
                    ${opacity * 0.08}
                )`;

            ctx.fill();

        }

    }


    drawShootingStars(time);

    requestAnimationFrame(
        drawStars
    );
}


/* =====================================================
   SHOOTING STARS
===================================================== */

function createShootingStar() {

    /*
        Don't create too many.
    */

    if (
        shootingStars.length >= 2
    ) {

        return;

    }


    shootingStars.push({

        x:
            Math.random()
            * width
            * 0.8,

        y:
            Math.random()
            * height
            * 0.35,

        length:
            Math.random() * 80
            + 60,

        speed:
            Math.random() * 7
            + 8,

        opacity:
            0.8,

        life:
            0,

        maxLife:
            Math.random()
            * 25
            + 25

    });

}


function drawShootingStars() {

    for (
        let i =
            shootingStars.length - 1;
        i >= 0;
        i--
    ) {

        const star =
            shootingStars[i];


        star.x +=
            star.speed;

        star.y +=
            star.speed * 0.45;

        star.life++;


        const progress =
            star.life
            / star.maxLife;


        const opacity =
            Math.sin(
                progress * Math.PI
            ) * star.opacity;


        const gradient =
            ctx.createLinearGradient(
                star.x,
                star.y,
                star.x - star.length,
                star.y - star.length * 0.45
            );


        gradient.addColorStop(
            0,
            `rgba(
                255,
                255,
                255,
                ${opacity}
            )`
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
            star.y - star.length * 0.45
        );

        ctx.strokeStyle =
            gradient;

        ctx.lineWidth =
            1.2;

        ctx.stroke();


        if (
            star.life >=
            star.maxLife
        ) {

            shootingStars.splice(
                i,
                1
            );

        }

    }

}


/*
    Random shooting stars.
*/

setInterval(
    createShootingStar,
    5500
);


/* =====================================================
   TOUCH INTERACTION
===================================================== */

const touchLayer =
    document.getElementById(
        "touchLayer"
    );


function createTouchEffect(
    x,
    y
) {

    /*
        Ripple
    */

    const ripple =
        document.createElement(
            "div"
        );

    ripple.className =
        "touch-ripple";

    ripple.style.left =
        `${x}px`;

    ripple.style.top =
        `${y}px`;

    touchLayer.appendChild(
        ripple
    );


    setTimeout(
        () => ripple.remove(),
        1200
    );


    /*
        Small particles
    */

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );

        particle.className =
            "touch-particle";


        const angle =
            Math.random()
            * Math.PI
            * 2;


        const distance =
            Math.random()
            * 45
            + 20;


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


        touchLayer.appendChild(
            particle
        );


        setTimeout(
            () => particle.remove(),
            900
        );

    }

}


/* =====================================================
   TOUCH / POINTER
===================================================== */

window.addEventListener(
    "pointerdown",
    (event) => {

        createTouchEffect(
            event.clientX,
            event.clientY
        );

    }
);


/* =====================================================
   SECRET STAR
===================================================== */

const secretStar =
    document.getElementById(
        "secretStar"
    );


let secretTouches = 0;


secretStar.addEventListener(
    "pointerdown",
    (event) => {

        event.stopPropagation();

        secretTouches++;


        secretStar.style.transform =
            "scale(2) rotate(180deg)";


        secretStar.style.opacity =
            "1";


        setTimeout(() => {

            secretStar.style.transform =
                "";

            secretStar.style.opacity =
                "";

        }, 600);


        /*
            This doesn't reveal anything yet.

            We'll use this later as
            part of an Easter egg.
        */

        if (
            secretTouches >= 3
        ) {

            secretStar.textContent =
                "♡";

            secretStar.style.fontSize =
                "12px";

        }

    }
);


/* =====================================================
   INTRO TEXT
===================================================== */

const introText =
    document.getElementById(
        "introText"
    );


const introMessages = [

    "Take your time...",

    "There's no rush.",

    "Just follow the little stars.",

    "Something is waiting for you.",

    "And yes... you have to discover it."

];


let introIndex = 0;


function changeIntroText() {

    introText.classList.add(
        "changing"
    );


    setTimeout(() => {

        introIndex++;

        if (
            introIndex >=
            introMessages.length
        ) {

            introIndex = 0;

        }


        introText.textContent =
            introMessages[
                introIndex
            ];


        introText.classList.remove(
            "changing"
        );

    }, 800);

}


setInterval(
    changeIntroText,
    3800
);


/* =====================================================
   BEGIN TRANSITION
===================================================== */

const beginBtn =
    document.getElementById(
        "beginBtn"
    );

const opening =
    document.getElementById(
        "opening"
    );

const garden =
    document.getElementById(
        "garden"
    );

const transition =
    document.getElementById(
        "transition"
    );


let gameStarted = false;


beginBtn.addEventListener(
    "pointerdown",
    (event) => {

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


        /*
            The star becomes
            the transition.
        */

        transition.classList.add(
            "active"
        );


        /*
            Hide opening.
        */

        opening.style.opacity =
            "0";

        opening.style.transform =
            "scale(1.08)";


        /*
            Reveal Garden after
            the star transition.
        */

        setTimeout(() => {

            opening.classList.add(
                "hidden"
            );

            garden.classList.remove(
                "hidden"
            );

        }, 1100);


        /*
            Remove transition
            after Garden appears.
        */

        setTimeout(() => {

            transition.classList.remove(
                "active"
            );

        }, 2200);

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();

requestAnimationFrame(
    drawStars
);