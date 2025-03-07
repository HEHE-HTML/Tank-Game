const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tank1HealthBar = document.getElementById('tank1-health');
const tank2HealthBar = document.getElementById('tank2-health');
const tank1HealthContainer = document.getElementById('tank1-health-container');
const tank2HealthContainer = document.getElementById('tank2-health-container');
const gameMessage = document.getElementById('game-message');
const restartButton = document.getElementById('restart-button');

// Set canvas dimensions
canvas.width = Math.min(window.innerWidth * 0.8, 1000);
canvas.height = Math.min(window.innerHeight * 0.8, 700);

const gridSize = 50;
let obstacles = [];
let bullets = [];
let explosions = [];
let healthPickups = [];
let gameOver = false;

// Game state
let tank1, tank2;

// Initialize game
function initGame() {
    // Reset game state
    obstacles = [];
    bullets = [];
    explosions = [];
    healthPickups = [];
    gameOver = false;

    // Hide UI elements
    gameMessage.style.display = "none";
    restartButton.style.display = "none";

    // Show health bars
    tank1HealthContainer.style.display = "flex";
    tank2HealthContainer.style.display = "flex";

    // Calculate a common vertical coordinate (e.g., center of the canvas)
    const commonY = canvas.height / 2;

    // Initialize tanks
    tank1 = {
        x: 50, // Start near the left edge
        y: commonY,
        width: 40,
        height: 50,
        speed: 4,
        rotation: 0,
        color: '#2ecc71',
        borderColor: '#145a32',
        flashCount: 0,
        health: 100,
        maxHealth: 100,
        shootCooldown: 0,
        maxCooldown: 15,
        barrelLength: 30,
        barrelWidth: 8,
        id: 1
    };

    tank2 = {
        x: canvas.width - 90, // Start near the right edge
        y: commonY,
        width: 40,
        height: 50,
        speed: 4,
        rotation: 180,
        color: '#e74c3c',
        borderColor: '#7b241c',
        flashCount: 0,
        health: 100,
        maxHealth: 100,
        shootCooldown: 0,
        maxCooldown: 15,
        barrelLength: 30,
        barrelWidth: 8,
        id: 2
    };

    createObstacles();
    spawnHealthPickup();
    updateHealthBars();
}

// Create obstacles for the game map
function createObstacles() {
    const rows = Math.floor(canvas.height / gridSize);
    const cols = Math.floor(canvas.width / gridSize);
    
    // Keep edges of map clear
    const clearEdgeSize = 3;
    
    // Main cover blocks
    for (let i = 0; i < 8; i++) {
        let validPosition = false;
        let x, y;
        
        while (!validPosition) {
            x = clearEdgeSize + Math.floor(Math.random() * (cols - 2 * clearEdgeSize));
            y = clearEdgeSize + Math.floor(Math.random() * (rows - 2 * clearEdgeSize));
            
            // Check if position is clear from tanks
            const tank1Clear = Math.hypot((x * gridSize) - tank1.x, (y * gridSize) - tank1.y) > 150;
            const tank2Clear = Math.hypot((x * gridSize) - tank2.x, (y * gridSize) - tank2.y) > 150;
            
            validPosition = tank1Clear && tank2Clear && 
                !obstacles.some(o => Math.abs(o.x - x * gridSize) < gridSize && Math.abs(o.y - y * gridSize) < gridSize);
        }
        
        // Create a cluster of obstacles
        createObstacleCluster(x, y);
    }
}

// Create cluster of obstacles
function createObstacleCluster(startX, startY) {
    // Center obstacle
    obstacles.push({ 
        x: startX * gridSize, 
        y: startY * gridSize,
        width: gridSize,
        height: gridSize
    });
    
    // Random neighboring obstacles
    const directions = [
        {dx: 1, dy: 0}, {dx: -1, dy: 0},
        {dx: 0, dy: 1}, {dx: 0, dy: -1}
    ];
    
    directions.forEach(dir => {
        if (Math.random() < 0.6) {
            const nx = startX + dir.dx;
            const ny = startY + dir.dy;
            
            // Ensure obstacle is within canvas
            if (nx >= 0 && nx * gridSize < canvas.width - gridSize && 
                ny >= 0 && ny * gridSize < canvas.height - gridSize) {
                obstacles.push({ 
                    x: nx * gridSize, 
                    y: ny * gridSize,
                    width: gridSize,
                    height: gridSize
                });
            }
        }
    });
}

// Spawn health pickup at random empty grid position
function spawnHealthPickup() {
    if (healthPickups.length >= 3 || gameOver) return; // Limit number of health pickups
    
    const rows = Math.floor(canvas.height / gridSize);
    const cols = Math.floor(canvas.width / gridSize);
    
    let validPosition = false;
    let x, y;
    const healthPickupSize = 30; // Increased from 25 to 30
    
    // Try to find an empty position
    let attempts = 0;
    while (!validPosition && attempts < 200) {
        attempts++;
        x = Math.floor(Math.random() * cols);
        y = Math.floor(Math.random() * rows);
        
        const pickupX = x * gridSize + (gridSize - healthPickupSize) / 2;
        const pickupY = y * gridSize + (gridSize - healthPickupSize) / 2;
        
        // Check if this grid cell is empty (no obstacles)
        const cellIsEmpty = !obstacles.some(o => 
            o.x === x * gridSize && o.y === y * gridSize
        );
        
        // Check if it's not too close to tanks
        const tank1Clear = Math.hypot(pickupX - tank1.x, pickupY - tank1.y) > 100;
        const tank2Clear = Math.hypot(pickupX - tank2.x, pickupY - tank2.y) > 100;
        
        // Check if it's not too close to other pickups
        const otherPickupsClear = !healthPickups.some(p => 
            Math.hypot(pickupX - p.x, pickupY - p.y) < gridSize
        );
        
        validPosition = cellIsEmpty && tank1Clear && tank2Clear && otherPickupsClear;
    }
    
    if (validPosition) {
        healthPickups.push({
            x: x * gridSize + (gridSize - healthPickupSize) / 2,
            y: y * gridSize + (gridSize - healthPickupSize) / 2,
            width: healthPickupSize,
            height: healthPickupSize,
            healAmount: 25,
            pulse: 0
        });
    }
    
    // Schedule next health pickup
    setTimeout(spawnHealthPickup, 10000 + Math.random() * 5000);
}

// Draw grid and obstacles
function drawGrid() {
    // Draw grid lines
    ctx.strokeStyle = '#5d6d7e';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Draw obstacles
    obstacles.forEach(obstacle => {
        // Fill
        ctx.fillStyle = '#717d7e';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Thick outline
        ctx.strokeStyle = '#4d5656';
        ctx.lineWidth = 4;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Inner details
        ctx.fillStyle = '#616a6b';
        ctx.fillRect(obstacle.x + 10, obstacle.y + 10, obstacle.width - 20, obstacle.height - 20);
    });
}

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false,
    " ": false,
    Enter: false,
};

window.addEventListener('keydown', (e) => {
    if (keys[e.key] !== undefined) {
        keys[e.key] = true;
        e.preventDefault(); // Prevent default behavior (scrolling)
    }
});

window.addEventListener('keyup', (e) => {
    if (keys[e.key] !== undefined) {
        keys[e.key] = false;
    }
});

restartButton.addEventListener('click', () => {
    initGame();
});

function updateTankMovement(tank, controls) {
    // Store previous position
    const prevX = tank.x;
    const prevY = tank.y;
    
    // Handle rotation
    if (controls.a) {
        tank.rotation -= 3;
    }
    if (controls.d) {
        tank.rotation += 3;
    }
    
    // Normalize rotation
    tank.rotation = (tank.rotation + 360) % 360;
    
    // Calculate movement based on rotation
    let moveX = 0;
    let moveY = 0;
    
    if (controls.w) {
        moveX = tank.speed * Math.cos(tank.rotation * Math.PI / 180);
        moveY = tank.speed * Math.sin(tank.rotation * Math.PI / 180);
    }
    if (controls.s) {
        moveX = -tank.speed * Math.cos(tank.rotation * Math.PI / 180);
        moveY = -tank.speed * Math.sin(tank.rotation * Math.PI / 180);
    }
    
    // Try horizontal movement first
    tank.x += moveX;
    
    // Check collisions horizontal
    if (checkCollisionWithObstacles(tank) || checkCollisionWithTank(tank)) {
        tank.x = prevX; // Revert x movement
    }
    
    // Try vertical movement
    tank.y += moveY;
    
    // Check collisions vertical
    if (checkCollisionWithObstacles(tank) || checkCollisionWithTank(tank)) {
        tank.y = prevY; // Revert y movement
    }
    
    // Ensure tank stays within boundaries
    tank.x = Math.max(0, Math.min(canvas.width - tank.width, tank.x));
    tank.y = Math.max(0, Math.min(canvas.height - tank.height, tank.y));
    
    // Check for health pickup collisions
    checkHealthPickupCollisions(tank);
}

function checkCollision(rect1, rect2) {
    // AABB collision detection with slightly reduced hitbox for tanks
    const padding = (rect1.id === 1 || rect1.id === 2) ? 2 : 0; // Add padding only for tanks
    
    return (
        rect1.x + padding < rect2.x + rect2.width &&
        rect1.x + rect1.width - padding > rect2.x &&
        rect1.y + padding < rect2.y + rect2.height &&
        rect1.y + rect1.height - padding > rect2.y
    );
}

function checkCollisionWithObstacles(tank) {
    for (const obstacle of obstacles) {
        if (checkCollision(tank, obstacle)) {
            return true;
        }
    }
    return false;
}

function checkCollisionWithTank(tank) {
    let targetTank = (tank.id === 1) ? tank2 : tank1;
    return checkCollision(tank, targetTank);
}

function checkHealthPickupCollisions(tank) {
    for (let i = healthPickups.length - 1; i >= 0; i--) {
        const pickup = healthPickups[i];
        if (checkCollision(tank, pickup)) {
            // Apply health gain
            tank.health = Math.min(tank.maxHealth, tank.health + pickup.healAmount);
            
            // Remove the pickup
            healthPickups.splice(i, 1);
            
            // Update health bars
            updateHealthBars();
            
            // Create a healing effect (green explosion)
            createHealingEffect(tank.x + tank.width/2, tank.y + tank.height/2);
            
            // Schedule a new pickup
            setTimeout(spawnHealthPickup, 5000 + Math.random() * 5000);
        }
    }
}

function createHealingEffect(x, y) {
    explosions.push({
        x: x,
        y: y,
        radius: 5,
        maxRadius: 30,
        opacity: 1,
        growth: 2,
        isHealing: true
    });
}

function drawTank(tank) {
    ctx.save();
    ctx.translate(tank.x + tank.width / 2, tank.y + tank.height / 2);
    ctx.rotate(tank.rotation * Math.PI / 180);

    // Determine tank color (flash if hit)
    let tankColor = tank.color;
    if (tank.flashCount > 0 && tank.flashCount % 2 === 0) {
        tankColor = 'white';
    }
    
    // Draw tank body (rectangle with thick outline)
    ctx.fillStyle = tankColor;
    ctx.fillRect(-tank.width / 2, -tank.height / 2, tank.width, tank.height);
    
    // Draw thick outline
    ctx.strokeStyle = tank.borderColor;
    ctx.lineWidth = 5;
    ctx.strokeRect(-tank.width / 2, -tank.height / 2, tank.width, tank.height);
    
    // Draw tank gun/barrel
    ctx.fillStyle = tankColor;
    ctx.fillRect(0, -tank.barrelWidth / 2, tank.barrelLength, tank.barrelWidth);
    ctx.strokeRect(0, -tank.barrelWidth / 2, tank.barrelLength, tank.barrelWidth);
    
    // Draw tank details
    ctx.fillStyle = tank.borderColor;
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawHealthPickups() {
    healthPickups.forEach(pickup => {
        // Pulsing effect
        pickup.pulse = (pickup.pulse + 0.05) % (2 * Math.PI);
        const pulseFactor = 1 + 0.1 * Math.sin(pickup.pulse);
        
        // Draw health pickup
        ctx.save();
        ctx.translate(pickup.x + pickup.width / 2, pickup.y + pickup.height / 2);
        ctx.scale(pulseFactor, pulseFactor);
        
        // Use tank border colors
        ctx.lineWidth = 4;
        ctx.strokeStyle = tank1.borderColor; // Using tank1's border color
        ctx.fillStyle = '#2ecc71';
        
        // White background
        ctx.beginPath();
        ctx.arc(0, 0, pickup.width / 2 - 2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();
        
        // Green cross
        ctx.fillStyle = '#2ecc71';
        // Horizontal bar
        ctx.fillRect(-pickup.width * 0.3, -pickup.width * 0.1, pickup.width * 0.6, pickup.width * 0.2);
        // Vertical bar
        ctx.fillRect(-pickup.width * 0.1, -pickup.width * 0.3, pickup.width * 0.2, pickup.width * 0.6);
        
        ctx.restore();
        
        // Remove gradient effect - no code needed here as we're just not drawing it
    });
}

function shoot(tank) {
    if (tank.shootCooldown > 0 || gameOver) return;
    
    tank.shootCooldown = tank.maxCooldown;

    // Calculate bullet starting position at the end of barrel
    const bulletX = tank.x + tank.width / 2 + 
        (tank.barrelLength + 5) * Math.cos(tank.rotation * Math.PI / 180);
    const bulletY = tank.y + tank.height / 2 + 
        (tank.barrelLength + 5) * Math.sin(tank.rotation * Math.PI / 180);

    const bullet = {
        x: bulletX,
        y: bulletY,
        width: 8, // Slightly bigger bullet
        height: 8, // Slightly bigger bullet
        rotation: tank.rotation,
        speed: 10,
        tankId: tank.id,
        damage: 10,
        color: tank.color,
        borderColor: tank.borderColor // Same border color as tank
    };
    
    bullets.push(bullet);
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        // Update bullet position
        bullet.x += bullet.speed * Math.cos(bullet.rotation * Math.PI / 180);
        bullet.y += bullet.speed * Math.sin(bullet.rotation * Math.PI / 180);

        // Check if bullet is out of bounds
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(i, 1);
            continue;
        }

        // Check collision with tanks and obstacles
        let hit = false;
        
        // Get the shooter and target tanks
        const shooterTank = bullet.tankId === 1 ? tank1 : tank2;
        const targetTank = bullet.tankId === 1 ? tank2 : tank1;
        
        // Check collision with target tank
        if (checkCollision(bullet, targetTank)) {
            targetTank.health -= bullet.damage;
            targetTank.flashCount = 10;
            
            // Create explosion effect
            createExplosion(bullet.x, bullet.y);
            
            if (targetTank.health <= 0) {
                targetTank.health = 0;
                endGame(shooterTank.id);
            }
            
            updateHealthBars();
            hit = true;
        }
        
        // Check collision with obstacles
        for (const obstacle of obstacles) {
            if (checkCollision(bullet, obstacle)) {
                createExplosion(bullet.x, bullet.y);
                hit = true;
                break;
            }
        }
        
        // Remove bullet if it hit something
        if (hit) {
            bullets.splice(i, 1);
        }
    }
}

function createExplosion(x, y) {
    explosions.push({
        x: x,
        y: y,
        radius: 5,
        maxRadius: 20,
        opacity: 1,
        growth: 2,
        isHealing: false
    });
}

function updateExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
        const explosion = explosions[i];
        
        // Grow the explosion
        explosion.radius += explosion.growth;
        explosion.opacity -= 0.05;
        
        // Remove faded explosions
        if (explosion.opacity <= 0) {
            explosions.splice(i, 1);
        }
    }
}

function drawExplosions() {
    explosions.forEach(explosion => {
        if (explosion.isHealing) {
            // Draw healing effect (green explosion)
            const gradient = ctx.createRadialGradient(
                explosion.x, explosion.y, 0,
                explosion.x, explosion.y, explosion.radius
            );
            
            gradient.addColorStop(0, `rgba(46, 204, 113, ${explosion.opacity})`);
            gradient.addColorStop(0.4, `rgba(39, 174, 96, ${explosion.opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(20, 82, 20, ${explosion.opacity * 0.1})`);
            
            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Draw damage explosion (orange/red)
            const gradient = ctx.createRadialGradient(
                explosion.x, explosion.y, 0,
                explosion.x, explosion.y, explosion.radius
            );
            
            gradient.addColorStop(0, `rgba(255, 255, 100, ${explosion.opacity})`);
            gradient.addColorStop(0.4, `rgba(255, 120, 40, ${explosion.opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(255, 20, 20, ${explosion.opacity * 0.1})`);
            
            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function drawBullet(bullet) {
    ctx.save();
    ctx.translate(bullet.x, bullet.y);
    ctx.rotate(bullet.rotation * Math.PI / 180);
    
    // Draw the larger bullet with outline
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2); // Increased from 4 to 6
    ctx.fillStyle = bullet.color;
    ctx.fill();
    
    // Draw outline with tank's border color
    ctx.strokeStyle = bullet.borderColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw trail
    const gradient = ctx.createLinearGradient(-12, 0, 0, 0);
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0)');
   gradient.addColorStop(0, 'rgba(255, 255, 0, 0)');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 0;
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    
    ctx.restore();
}

function updateHealthBars() {
    tank1HealthBar.style.width = (tank1.health / tank1.maxHealth * 100) + '%';
    tank2HealthBar.style.width = (tank2.health / tank2.maxHealth * 100) + '%';
    
    // Update health bar colors based on health level
    if (tank1.health < 30) {
        tank1HealthBar.style.backgroundColor = '#e74c3c';
    } else if (tank1.health < 60) {
        tank1HealthBar.style.backgroundColor = '#f39c12';
    } else {
        tank1HealthBar.style.backgroundColor = '#2ecc71';
    }
    
    if (tank2.health < 30) {
        tank2HealthBar.style.backgroundColor = '#e74c3c';
    } else if (tank2.health < 60) {
        tank2HealthBar.style.backgroundColor = '#f39c12';
    } else {
        tank2HealthBar.style.backgroundColor = '#e74c3c';
    }
}

function endGame(winnerId) {
    gameOver = true;
    
    // Hide health bars
    tank1HealthContainer.style.display = "none";
    tank2HealthContainer.style.display = "none";
    
    // Show game over message
    gameMessage.textContent = `TANK ${winnerId} WINS!`;
    gameMessage.style.display = "block";
    
    // Show restart button
    restartButton.style.display = "block";
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid and obstacles
    drawGrid();
    
    // Draw health pickups
    drawHealthPickups();

    // Update tank movement
    if (!gameOver) {
        updateTankMovement(tank1, { w: keys.w, a: keys.a, s: keys.s, d: keys.d });
        updateTankMovement(tank2, { w: keys.ArrowUp, a: keys.ArrowLeft, s: keys.ArrowDown, d: keys.ArrowRight });

        // Handle shooting
        if (keys[" "]) {
            shoot(tank1);
            keys[" "] = false;
        }

        if (keys.Enter) {
            shoot(tank2);
            keys.Enter = false;
        }
    }

    // Update game entities
    updateBullets();
    updateExplosions();

    // Update tank state
    if (tank1.flashCount > 0) tank1.flashCount--;
    if (tank2.flashCount > 0) tank2.flashCount--;

    if (tank1.shootCooldown > 0) tank1.shootCooldown--;
    if (tank2.shootCooldown > 0) tank2.shootCooldown--;

    // Draw game entities
    drawTank(tank1);
    drawTank(tank2);
    bullets.forEach(drawBullet);
    drawExplosions();

    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Initialize and start game
initGame();
gameLoop();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = Math.min(window.innerWidth * 0.8, 1000);
    canvas.height = Math.min(window.innerHeight * 0.8, 700);
});