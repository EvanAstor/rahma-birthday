const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

const touchLayer = document.getElementById("touchLayer");
const opening = document.getElementById("opening");
const garden = document.getElementById("garden");
const sky = document.getElementById("sky");
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

const skyStars = document.querySelectorAll(".sky-star:not(.sky-star-hidden)");
const hiddenSkyStar = document.getElementById("hiddenSkyStar");
const skyStarsFound = document.getElementById("skyStarsFound");
const skyMessage = document.getElementById("skyMessage");
const skyMessageText = document.getElementById("skyMessageText");
const skyHint = document.getElementById("skyHint");
const swipeHint = document.getElementById("swipeHint");
const skyComplete = document.getElementById("skyComplete");
const skyContinue = document.getElementById("skyContinue");
const observatory = document.getElementById("observatory");
const telescope = document.getElementById("telescope");
const observatoryStars = document.querySelectorAll(".observatory-star");
const observatoryFound = document.getElementById("observatoryFound");
const observatoryMessage = document.getElementById("observatoryMessage");
const observatoryMessageText = document.getElementById("observatoryMessageText");
const observatoryHint = document.getElementById("observatoryHint");
const observatoryComplete = document.getElementById("observatoryComplete");
const observatoryContinue = document.getElementById("observatoryContinue");
const birthdayLetter = document.getElementById("birthdayLetter");
const letterClose = document.getElementById("letterClose");
const observatoryBeam = document.getElementById("observatoryBeam");
const telescopeView = document.getElementById("telescopeView");
const scopeClose = document.getElementById("scopeClose");
const scopeDiscovery = document.getElementById("scopeDiscovery");
const heartConstellation = document.getElementById("heartConstellation");
const memoryLabel = document.getElementById("memoryLabel");
const constellationLines = document.querySelectorAll(".constellation-line");
const gardenEcho = document.getElementById("gardenEcho");
const skySecret = document.getElementById("skySecret");
const skyMoon = document.getElementById("skyMoon");

let width = 0;
let height = 0;
let stars = [];
let shootingStars = [];
let gameStarted = false;
let secretTouches = 0;
let introIndex = 0;
let foundFlowers = 0;
let messageTimer = null;
let foundSkyStars = 0;
let skyMessageTimer = null;
let skyStarted = false;
let skySecretFound = false;
let hiddenStarMoving = false;
let swipeStartX = 0;
let swipeStartY = 0;
let swipeTracking = false;
let foundObservatoryStars = 0;
let telescopeUsed = false;
let observatoryFinished = false;

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

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
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
        const pulse = Math.sin(
            time * .001 * star.twinkle + star.phase
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

        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();

        if (star.radius > 1.05 && pulse > .85) {
            ctx.beginPath();

            ctx.arc(
                star.x,
                star.y,
                star.radius * 2.5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = `rgba(255,255,255,${opacity * .08})`;
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
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];

        star.x += star.speed;
        star.y += star.speed * .45;
        star.life++;

        const progress = star.life / star.maxLife;

        const opacity =
            Math.sin(progress * Math.PI) *
            star.opacity;

        const gradient = ctx.createLinearGradient(
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

        ctx.moveTo(star.x, star.y);

        ctx.lineTo(
            star.x - star.length,
            star.y - star.length * .45
        );

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (star.life >= star.maxLife) {
            shootingStars.splice(i, 1);
        }
    }
}

function createTouchEffect(x, y) {
    const ripple = document.createElement("div");

    ripple.className = "touch-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    touchLayer.appendChild(ripple);

    setTimeout(() => ripple.remove(), 1200);

    for (let i = 0; i < 7; i++) {
        const particle = document.createElement("div");

        particle.className = "touch-particle";

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 45 + 20;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        particle.style.setProperty(
            "--x",
            `${Math.cos(angle) * distance}px`
        );

        particle.style.setProperty(
            "--y",
            `${Math.sin(angle) * distance}px`
        );

        touchLayer.appendChild(particle);

        setTimeout(() => particle.remove(), 900);
    }
}

window.addEventListener("pointerdown", event => {
    createTouchEffect(
        event.clientX,
        event.clientY
    );
});

secretStar.addEventListener("pointerdown", event => {
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
});

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

        if (introIndex >= introMessages.length) {
            introIndex = 0;
        }

        introText.textContent =
            introMessages[introIndex];

        introText.classList.remove("changing");
    }, 800);
}

setInterval(changeIntroText, 3800);

beginBtn.addEventListener("pointerdown", event => {
    event.preventDefault();
});

beginBtn.addEventListener("click", () => {
    if (gameStarted) {
        return;
    }

    gameStarted = true;

    transition.classList.add("active");

    opening.style.opacity = "0";
    opening.style.transform = "scale(1.08)";

    setTimeout(() => {
        opening.classList.add("hidden");
        garden.classList.remove("hidden");
    }, 1100);

    setTimeout(() => {
        transition.classList.remove("active");
    }, 2200);
});

flowers.forEach(flower => {
    flower.addEventListener("click", () => {
        if (flower.classList.contains("found")) {
            return;
        }

        flower.classList.add("found");

        foundFlowers++;

        flowersFound.textContent =
            foundFlowers;

        messageText.textContent =
            flower.dataset.message;

        if (messageTimer) {
            clearTimeout(messageTimer);
        }

        flowerMessage.classList.remove("show");

        setTimeout(() => {
            flowerMessage.classList.add("show");
        }, 80);

        messageTimer = setTimeout(() => {
            flowerMessage.classList.remove("show");
        }, 5000);

        createGardenParticles(flower);

        if (foundFlowers === flowers.length) {
            setTimeout(() => {
                gardenComplete.classList.add("show");
            }, 1800);
        }
    });
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

gardenContinue.addEventListener("click", () => {
    gardenComplete.classList.remove("show");

    transition.classList.add("active");

    setTimeout(() => {
        garden.classList.add("hidden");
        sky.classList.remove("hidden");
        transition.classList.remove("active");
        startSky();
    }, 900);
});

function startSky() {
    if (skyStarted) {
        return;
    }

    skyStarted = true;

    requestAnimationFrame(updateConstellation);

    setTimeout(() => {
        skyHint.classList.add("show");
    }, 3500);
}

skyStars.forEach((star, index) => {
    star.addEventListener("click", () => {
        if (star.classList.contains("found")) {
            return;
        }

        star.classList.add("found");

        foundSkyStars++;

        skyStarsFound.textContent =
            foundSkyStars;

        skyMessageText.textContent =
            star.dataset.message;

        skyMessage.classList.remove("show");

        if (skyMessageTimer) {
            clearTimeout(skyMessageTimer);
        }

        setTimeout(() => {
            skyMessage.classList.add("show");
        }, 60);

        skyMessageTimer = setTimeout(() => {
            skyMessage.classList.remove("show");
        }, 4200);

        activateConstellation(index);

        createSkyParticles(star);

        if (foundSkyStars === skyStars.length) {
            setTimeout(() => {
                skyHint.classList.remove("show");

                skyMessageText.textContent =
                    "Something is missing...";

                skyMessage.classList.add("show");

                gardenEcho.classList.add("show");

                setTimeout(() => {
                    hiddenSkyStar.classList.add("revealed");

                    // Star 7 is visible now. Only now can the final constellation segment exist.
                    updateConstellation();
                    constellationLines[constellationLines.length - 1]?.classList.add("active");

                    swipeHint.classList.add("show");

                    skyMessageText.textContent =
                        "Look a little closer.";

                    setTimeout(() => {
                        skyMessageText.textContent =
                            "Follow the light.";
                    }, 2600);
                }, 1600);
            }, 1200);
        }
    });
});

function moveHiddenStar() {
    if (!hiddenSkyStar.classList.contains("revealed")) {
        return;
    }

    if (hiddenSkyStar.classList.contains("found")) {
        return;
    }

    hiddenSkyStar.classList.add("running");

    setTimeout(() => {
        hiddenSkyStar.classList.remove("running");
    }, 220);
}

hiddenSkyStar.addEventListener("click", () => {
    if (!hiddenSkyStar.classList.contains("revealed")) {
        return;
    }

    if (hiddenSkyStar.classList.contains("found")) {
        return;
    }

    collectHiddenStar();
});

function collectHiddenStar() {
    if (
        !hiddenSkyStar.classList.contains("revealed") ||
        hiddenSkyStar.classList.contains("found")
    ) {
        return;
    }

    hiddenSkyStar.classList.add("found");

    swipeHint.classList.remove("show");

    foundSkyStars++;

    skyStarsFound.textContent =
        foundSkyStars;

    skyMessageText.textContent =
        hiddenSkyStar.dataset.message;

    skyMessage.classList.add("show");

    if (skyMessageTimer) {
        clearTimeout(skyMessageTimer);
    }

    skyMessageTimer = setTimeout(() => {
        skyMessage.classList.remove("show");
    }, 5200);

    createSkyParticles(hiddenSkyStar);

    constellationLines.forEach(line => {
        line.classList.add("active");
    });

    // The constellation is complete. The golden star is the final reward.
    setTimeout(() => {
        skyMessageText.textContent =
            "It was there all along.";

        skyMessage.classList.add("show");

        setTimeout(() => {
            skySecret.classList.add("revealed");
            skyMessageText.textContent =
                "One last light...";
        }, 1800);
    }, 1400);
}

function updateConstellation() {
    const points = [
        ...skyStars,
        hiddenSkyStar
    ];

    const world = document.getElementById("skyWorld");
    const worldRect = world.getBoundingClientRect();

    for (let i = 0; i < constellationLines.length; i++) {
        const from = points[i];
        const to = points[i + 1];

        // The last constellation segment points to the hidden 7th star.
        // Never calculate/show that segment while the hidden star is still hidden.
        if (!from || !to) continue;
        if (i === constellationLines.length - 1 &&
            !hiddenSkyStar.classList.contains("revealed")) {
            constellationLines[i].style.width = "0px";
            constellationLines[i].classList.remove("active");
            continue;
        }

        const a = from.getBoundingClientRect();
        const b = to.getBoundingClientRect();

        const x1 = a.left + a.width / 2 - worldRect.left;
        const y1 = a.top + a.height / 2 - worldRect.top;
        const x2 = b.left + b.width / 2 - worldRect.left;
        const y2 = b.top + b.height / 2 - worldRect.top;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        constellationLines[i].style.left = `${x1}px`;
        constellationLines[i].style.top = `${y1}px`;
        constellationLines[i].style.width = `${length}px`;
        constellationLines[i].style.transform = `rotate(${angle}deg)`;
    }
}

function activateConstellation(index) {
    updateConstellation();

    // Line 6 ends at star 7, so it must wait for star 7 to be revealed.
    if (index === constellationLines.length - 1 &&
        !hiddenSkyStar.classList.contains("revealed")) {
        return;
    }

    if (constellationLines[index]) {
        constellationLines[index].classList.add("active");
    }
}

function createSkyParticles(element) {
    const rect =
        element.getBoundingClientRect();

    const centerX =
        rect.left +
        rect.width / 2;

    const centerY =
        rect.top +
        rect.height / 2;

    for (let i = 0; i < 20; i++) {
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
            20 +
            Math.random() *
            65;

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

skySecret.addEventListener("click", () => {
    if (skySecretFound || foundSkyStars < 7 || !skySecret.classList.contains("revealed")) {
        return;
    }

    skySecretFound = true;
    skySecret.classList.add("found");

    if (skyMessageTimer) {
        clearTimeout(skyMessageTimer);
    }

    skyMessageText.textContent =
        "You found the little golden light.";

    skyMessage.classList.add("show");
    createSkyParticles(skySecret);

    // Extra golden burst: the reward should feel different from ordinary stars.
    setTimeout(() => {
        createSkyParticles(skySecret);
        skyMessageText.textContent =
            "This one was just for you.";
    }, 900);

    setTimeout(() => {
        skyMessage.classList.remove("show");
        setTimeout(() => {
            skyComplete.classList.add("show");
        }, 700);
    }, 4200);
});

skyContinue.addEventListener("click", () => {
    skyComplete.classList.remove("show");
    transition.classList.add("active");

    setTimeout(() => {
        sky.classList.add("hidden");
        observatory.classList.remove("hidden");
        observatory.classList.add("scene-enter");
        setTimeout(() => observatory.classList.remove("scene-enter"), 1400);
        setTimeout(() => observatoryHint.classList.add("show"), 500);
        transition.classList.remove("active");
    }, 800);
});

const scopeTargets = document.querySelectorAll(".scope-target");
const scopeFoundNote = document.getElementById("scopeFoundNote");
const scopeStars = document.getElementById("scopeStars");
let scopePanX = 0;
let scopePanY = 0;
let scopeDragging = false;
let scopeDragStartX = 0;
let scopeDragStartY = 0;
let scopePanStartX = 0;
let scopePanStartY = 0;
let scopeFound = new Set();

/* The physical stars from the observatory stay hidden. The real search happens in the eyepiece. */
observatoryStars.forEach(star => {
    star.classList.remove("revealed");
    star.classList.add("scope-only");
});

function activateHeartConstellation() {
    heartConstellation.classList.add("complete");
    observatory.classList.add("constellation-complete");
}

function showObservatoryMessage(title, text) {
    memoryLabel.textContent = title;
    observatoryMessageText.textContent = text;
    observatoryMessage.classList.remove("show");
    void observatoryMessage.offsetWidth;
    observatoryMessage.classList.add("show");
}

function updateScopePan() {
    /* The sky is intentionally larger than the eyepiece, so dragging reveals new areas. */
    const maxX = Math.max(120, Math.min(360, window.innerWidth * .28));
    const maxY = Math.max(100, Math.min(300, window.innerHeight * .24));
    scopePanX = Math.max(-maxX, Math.min(maxX, scopePanX));
    scopePanY = Math.max(-maxY, Math.min(maxY, scopePanY));

    scopeStars.style.setProperty("--pan-x", `${scopePanX}px`);
    scopeStars.style.setProperty("--pan-y", `${scopePanY}px`);
}

function resetScopePan() {
    scopePanX = 0;
    scopePanY = 0;
    updateScopePan();
}

function revealScopeTargets() {
    /* All three are guaranteed to exist; they fade in together instead of one being clipped. */
    scopeTargets.forEach((target, index) => {
        if (!scopeFound.has(index)) {
            target.style.animationDelay = `${index * 180}ms`;
            target.classList.add("visible");
        }
    });
}

function openTelescopeView() {
    if (telescopeView.classList.contains("show")) return;
    resetScopePan();
    telescopeView.classList.add("show");
    telescopeView.setAttribute("aria-hidden", "false");
    scopeDiscovery.textContent = foundObservatoryStars === 0
        ? "Drag the sky in any direction. Find the three hidden lights."
        : `${foundObservatoryStars} of 3 found — keep searching.`;
    revealScopeTargets();
}

function closeTelescopeView() {
    telescopeView.classList.remove("show");
    telescopeView.setAttribute("aria-hidden", "true");
    telescopeView.classList.remove("dragging");
    scopeDragging = false;
}

function useTelescope() {
    if (!telescopeUsed) {
        telescopeUsed = true;
        telescope.classList.add("used");
        observatoryHint.classList.remove("show");
        observatoryBeam.classList.add("active");
        showObservatoryMessage(
            "A little closer",
            "Now you can actually look through it. Drag the view around like you are moving the telescope itself."
        );
        setTimeout(() => {
            showObservatoryMessage(
                "Three little memories",
                "Inside the telescope are three lights. Find them one by one — there is no timer."
            );
        }, 2200);
    }
    openTelescopeView();
}

telescope.addEventListener("click", useTelescope);
telescope.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        useTelescope();
    }
});

scopeClose.addEventListener("click", event => {
    event.stopPropagation();
    closeTelescopeView();
});

telescopeView.addEventListener("pointerdown", event => {
    if (event.target.closest(".scope-target, .scope-close")) return;
    scopeDragging = true;
    telescopeView.classList.add("dragging");
    scopeDragStartX = event.clientX;
    scopeDragStartY = event.clientY;
    scopePanStartX = scopePanX;
    scopePanStartY = scopePanY;
    try { telescopeView.setPointerCapture(event.pointerId); } catch (_) {}
});

telescopeView.addEventListener("pointermove", event => {
    if (!scopeDragging) return;
    scopePanX = scopePanStartX + (event.clientX - scopeDragStartX) * 1.25;
    scopePanY = scopePanStartY + (event.clientY - scopeDragStartY) * 1.25;
    updateScopePan();
});

function stopScopeDrag() {
    scopeDragging = false;
    telescopeView.classList.remove("dragging");
}
telescopeView.addEventListener("pointerup", stopScopeDrag);
telescopeView.addEventListener("pointercancel", stopScopeDrag);
telescopeView.addEventListener("pointerleave", event => {
    if (scopeDragging && event.pointerType === "mouse") stopScopeDrag();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && telescopeView.classList.contains("show")) closeTelescopeView();
});

scopeTargets.forEach((target) => {
    target.addEventListener("click", event => {
        event.stopPropagation();
        if (!telescopeUsed) return;

        const index = Number(target.dataset.star);
        if (scopeFound.has(index)) return;

        scopeFound.add(index);
        target.classList.add("found");
        foundObservatoryStars++;
        observatoryFound.textContent = foundObservatoryStars;

        const original = observatoryStars[index];
        showObservatoryMessage(original.dataset.title, original.dataset.clue);

        scopeFoundNote.textContent = `${foundObservatoryStars} / 3  —  you found one`;
        scopeFoundNote.classList.remove("show");
        void scopeFoundNote.offsetWidth;
        scopeFoundNote.classList.add("show");
        setTimeout(() => scopeFoundNote.classList.remove("show"), 3000);

        scopeDiscovery.textContent = foundObservatoryStars === 3
            ? "All three lights found. Look at what they became."
            : "There is another light somewhere in the sky... keep looking.";

        createSkyParticles(target);
        createMemoryBurst(target);

        if (foundObservatoryStars === 3) {
            setTimeout(() => {
                closeTelescopeView();
                resetScopePan();
                activateHeartConstellation();
                showObservatoryMessage(
                    "And this is the part I mean most",
                    "Out of all the places these stars could have led to... they led back to you."
                );
            }, 1400);

            setTimeout(() => {
                observatoryComplete.classList.add("show");
                observatoryFinished = true;
            }, 5000);
        }
    });
});

function createMemoryBurst(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    for (let i = 0; i < 14; i++) {
        const particle = document.createElement("div");
        particle.className = "memory-particle";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = 35 + Math.random() * 75;
        particle.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
        particle.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1100);
    }
}

observatoryContinue.addEventListener("click", () => {
    observatoryComplete.classList.remove("show");
    setTimeout(() => birthdayLetter.classList.add("show"), 450);
});

letterClose.addEventListener("click", () => {
    birthdayLetter.classList.remove("show");
    setTimeout(() => {
        showObservatoryMessage(
            "Chapter III",
            "Keep this little place. There are still more things I want to give you."
        );
    }, 700);
});

window.addEventListener("resize", () => {
    resizeCanvas();
    if (!sky.classList.contains("hidden")) {
        updateConstellation();
    }
});

resizeCanvas();
setTimeout(updateConstellation, 100);

requestAnimationFrame(drawStars);

setInterval(createShootingStar, 5500);