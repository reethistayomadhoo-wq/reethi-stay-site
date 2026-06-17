// ==========================================================
// 1. GLOBAL GAME ENGINE CONFIGURATIONS (Skins & Memory Slots)
// ==========================================================
let canvas, ctx, gameLoopIdx, modal;
const grid = 16;
let count = 0;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;

let snake = {
    x: 160, y: 160,
    dx: grid, dy: 0,
    cells: [],
    maxCells: 4
};

let apple = { x: 96, y: 96 };

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function resetGameEngine() {
    score = 0;
    const scoreEl = document.getElementById("currentScore");
    if (scoreEl) scoreEl.textContent = score;
    
    snake.x = 160; 
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid; 
    snake.dy = 0;
    apple.x = getRandomInt(0, 20) * grid;
    apple.y = getRandomInt(0, 20) * grid;
}

function runArcadeLoop() {
    gameLoopIdx = requestAnimationFrame(runArcadeLoop);

    // Limit game engine tick speed (~12 frames per second for smooth retro pace)
    if (++count < 8) { return; }
    count = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    // Handle map edge boundary wrap configurations
    if (snake.x < 0) { snake.x = canvas.width - grid; }
    else if (snake.x >= canvas.width) { snake.x = 0; }
    
    if (snake.y < 0) { snake.y = canvas.height - grid; }
    else if (snake.y >= canvas.height) { snake.y = 0; }

    snake.cells.unshift({ x: snake.x, y: snake.y });

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Draw Sand Gold Apple Vector Asset
    ctx.fillStyle = '#cfb28c';
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // Draw custom modular snake body segments
    snake.cells.forEach(function(cell, idx) {
        if (idx === 0) ctx.fillStyle = '#be9f77'; // Distinct colored head
        else ctx.fillStyle = '#ffffff';

        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // Apple consumption collision checker rules
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score += 10;
            const scoreEl = document.getElementById("currentScore");
            if (scoreEl) scoreEl.textContent = score;
            
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("snakeHighScore", highScore);
                const hiScoreEl = document.getElementById("highScore");
                if (hiScoreEl) hiScoreEl.textContent = highScore;
            }
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;
        }

        // Self body collision impact checks
        for (let i = idx + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                resetGameEngine();
            }
        }
    });
}

// Global direction vector modifier
function changeDirection(dir) {
    if (dir === 'LEFT' && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
    else if (dir === 'UP' && snake.dy === 0) { snake.dy = -grid; snake.dx = 0; }
    else if (dir === 'RIGHT' && snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
    else if (dir === 'DOWN' && snake.dy === 0) { snake.dy = grid; snake.dx = 0; }
}

// Physical Desktop Keyboard Listeners
document.addEventListener('keydown', function(e) {
    if (e.which === 37) changeDirection('LEFT');
    else if (e.which === 38) changeDirection('UP');
    else if (e.which === 39) changeDirection('RIGHT');
    else if (e.which === 40) changeDirection('DOWN');
});

// Structural Interface Open/Close Flags (Exposed globally)
window.openGame = function() {
    modal = document.getElementById("gameModal");
    canvas = document.getElementById("snakeCanvas");
    
    if (modal && canvas) {
        ctx = canvas.getContext("2d");
        modal.classList.add("open");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
        
        // Push initial saved highscore values down into DOM
        const hiScoreEl = document.getElementById("highScore");
        if (hiScoreEl) hiScoreEl.textContent = highScore;
        
        resetGameEngine();
        cancelAnimationFrame(gameLoopIdx);
        runArcadeLoop();
    }
};

window.closeGame = function() {
    modal = document.getElementById("gameModal");
    if (modal) {
        modal.classList.remove("open");
        document.body.style.overflow = ""; // Restore scrolling
        cancelAnimationFrame(gameLoopIdx);
    }
};


// ==========================================================
// 2. WEBSITE UI AND CORE INTERACTIONS (DOM Loaded Safe Zone)
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Set initial highscore display string on footer button render block if available
    const initialHiScore = document.getElementById("highScore");
    if (initialHiScore) initialHiScore.textContent = highScore;

    // 1. Structural Navbar Background Interpolator
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 60) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        }, { passive: true });
    }

    // 2. High-Performance Intersection Observer Framework (Framer Motion Mimic)
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.08, 
        rootMargin: "0px 0px -10px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 3. RequestAnimationFrame JANK-FREE Parallax Execution Loop
    const heroBgImage = document.querySelector(".hero-bg img");
    if (heroBgImage) {
        let ticked = false;

        window.addEventListener("scroll", () => {
            if (!ticked) {
                window.requestAnimationFrame(() => {
                    let scrollPosition = window.scrollY;
                    if (scrollPosition <= window.innerHeight) {
                        heroBgImage.style.transform = `translate3d(0, ${scrollPosition * 0.32}px, 0)`;
                    }
                    ticked = false;
                });
                ticked = true;
            }
        }, { passive: true });
    }
});


// ==========================================================
// 3. LIGHTWEIGHT RESPONSIVE NAVIGATION DRAWER SYSTEM
// ==========================================================
function toggleMobileMenu() {
    const navWrapper = document.getElementById("navMenuWrapper");
    const toggleBtn = document.getElementById("menuToggleBtn");
    const navbarHeader = document.querySelector(".navbar");
    
    if (navWrapper && toggleBtn && navbarHeader) {
        const isOpen = navWrapper.classList.toggle("open");
        toggleBtn.setAttribute("aria-expanded", isOpen);
        
        if (isOpen) {
            navbarHeader.classList.add("navbar-menu-open");
            document.body.style.overflow = "hidden"; 
        } else {
            navbarHeader.classList.remove("navbar-menu-open");
            document.body.style.overflow = ""; 
        }
    }
}

function closeMobileMenu() {
    const navWrapper = document.getElementById("navMenuWrapper");
    const toggleBtn = document.getElementById("menuToggleBtn");
    const navbarHeader = document.querySelector(".navbar");
    
    if (navWrapper && toggleBtn && navbarHeader) {
        navWrapper.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
        navbarHeader.classList.remove("navbar-menu-open");
        document.body.style.overflow = "";
    }
}