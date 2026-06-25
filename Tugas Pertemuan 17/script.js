// ============= BASE CLASS =============
class GameEntity {
    constructor(x, y, color = '#4CAF50') {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw(ctx, size) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * size, this.y * size, size - 1, size - 1);
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}

// ============= FOOD CLASS (Inheritance) =============
class Food extends GameEntity {
    constructor(x, y) {
        super(x, y, '#FF6B6B');
        this.isEaten = false;
    }

    // Override draw method untuk makanan spesial
    draw(ctx, size) {
        ctx.fillStyle = this.color;
        // Membuat makanan berbentuk lingkaran
        ctx.beginPath();
        ctx.arc(
            this.x * size + size / 2,
            this.y * size + size / 2,
            size / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        // Efek glow
        ctx.shadowColor = '#FF6B6B';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    respawn(maxX, maxY) {
        this.x = Math.floor(Math.random() * maxX);
        this.y = Math.floor(Math.random() * maxY);
        this.isEaten = false;
    }
}

// ============= SNAKE CLASS (Inheritance) =============
class Snake extends GameEntity {
    constructor(x, y) {
        super(x, y, '#4CAF50');
        this.body = [{ x: x, y: y }];
        this.direction = { dx: 1, dy: 0 };
        this.nextDirection = { dx: 1, dy: 0 };
        this.growCount = 0;
        this.headColor = '#66BB6A';
        this.bodyColor = '#4CAF50';
    }

    // Override draw method untuk ular
    draw(ctx, size) {
        this.body.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? this.headColor : this.bodyColor;
            
            // Membuat sudut membulat untuk segment
            const padding = index === 0 ? 1 : 2;
            const radius = index === 0 ? 4 : 3;
            
            ctx.beginPath();
            ctx.roundRect(
                segment.x * size + padding,
                segment.y * size + padding,
                size - padding * 2,
                size - padding * 2,
                radius
            );
            ctx.fill();
        });
    }

    move() {
        // Update direction
        this.direction = { ...this.nextDirection };
        
        // Hitung posisi kepala baru
        const head = this.body[0];
        const newHead = {
            x: head.x + this.direction.dx,
            y: head.y + this.direction.dy
        };

        // Tambahkan kepala baru
        this.body.unshift(newHead);

        // Jika tidak tumbuh, hapus ekor
        if (this.growCount > 0) {
            this.growCount--;
        } else {
            this.body.pop();
        }
    }

    grow() {
        this.growCount += 2; // Tumbuh 2 segment untuk setiap makanan
    }

    setDirection(dx, dy) {
        // Cegah ular berbalik arah secara langsung
        if (this.direction.dx !== -dx || this.direction.dy !== -dy) {
            this.nextDirection = { dx, dy };
        }
    }

    checkSelfCollision() {
        const head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) {
                return true;
            }
        }
        return false;
    }

    getHead() {
        return this.body[0];
    }

    reset(x, y) {
        this.body = [{ x: x, y: y }];
        this.direction = { dx: 1, dy: 0 };
        this.nextDirection = { dx: 1, dy: 0 };
        this.growCount = 0;
    }

    // Method untuk mendapatkan posisi semua segment
    getSegments() {
        return this.body;
    }
}

// ============= GAME CLASS =============
class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Konfigurasi game
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Inisialisasi objek
        this.snake = null;
        this.food = null;
        
        // State game
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.gameLoop = null;
        this.speed = 100; // ms per frame
        
        // Event listeners
        this.setupEventListeners();
        
        // Update high score display
        this.updateHighScoreDisplay();
        
        // Inisialisasi game pertama kali
        this.init();
    }

    init() {
        const startX = Math.floor(this.tileCount / 2);
        const startY = Math.floor(this.tileCount / 2);
        
        this.snake = new Snake(startX, startY);
        this.food = new Food(0, 0);
        this.food.respawn(this.tileCount, this.tileCount);
        
        this.score = 0;
        this.gameOver = false;
        this.gamePaused = false;
        this.gameRunning = false;
        
        this.updateScoreDisplay();
        this.draw();
        this.updateStatus('Tekan "Mulai Game" untuk bermain');
    }

    start() {
        if (this.gameRunning && !this.gamePaused) return;
        
        if (this.gameOver) {
            this.reset();
            return;
        }
        
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameOver = false;
        
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        this.gameLoop = setInterval(() => {
            if (!this.gamePaused && this.gameRunning) {
                this.update();
            }
        }, this.speed);
        
        this.updateStatus('Game berjalan...');
    }

    pause() {
        if (!this.gameRunning) return;
        this.gamePaused = !this.gamePaused;
        this.updateStatus(this.gamePaused ? 'Game dijeda' : 'Game dilanjutkan');
    }

    reset() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        this.init();
        this.draw();
        this.updateStatus('Game direset');
    }

    update() {
        if (this.gameOver || !this.gameRunning) return;

        // Pindahkan ular
        this.snake.move();

        // Cek tabrakan dengan dinding
        const head = this.snake.getHead();
        if (head.x < 0 || head.x >= this.tileCount || 
            head.y < 0 || head.y >= this.tileCount) {
            this.endGame();
            return;
        }

        // Cek tabrakan dengan diri sendiri
        if (this.snake.checkSelfCollision()) {
            this.endGame();
            return;
        }

        // Cek apakah ular memakan makanan
        if (head.x === this.food.x && head.y === this.food.y) {
            this.snake.grow();
            this.score += 10;
            this.updateScoreDisplay();
            this.food.respawn(this.tileCount, this.tileCount);
            
            // Cegah makanan muncul di tubuh ular
            this.avoidFoodOnSnake();
            
            // Update high score
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('snakeHighScore', this.highScore);
                this.updateHighScoreDisplay();
            }
        }

        // Gambar ulang
        this.draw();
    }

    avoidFoodOnSnake() {
        const segments = this.snake.getSegments();
        let attempts = 0;
        while (attempts < 100) {
            let collision = false;
            for (let segment of segments) {
                if (this.food.x === segment.x && this.food.y === segment.y) {
                    collision = true;
                    break;
                }
            }
            if (!collision) break;
            this.food.respawn(this.tileCount, this.tileCount);
            attempts++;
        }
    }

    draw() {
        const ctx = this.ctx;
        const size = this.gridSize;
        
        // Bersihkan canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Gambar grid (opsional)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * size, 0);
            ctx.lineTo(i * size, this.canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * size);
            ctx.lineTo(this.canvas.width, i * size);
            ctx.stroke();
        }
        
        // Gambar makanan
        if (this.food) {
            this.food.draw(ctx, size);
        }
        
        // Gambar ular
        if (this.snake) {
            this.snake.draw(ctx, size);
        }
    }

    endGame() {
        this.gameRunning = false;
        this.gameOver = true;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        this.updateStatus('Game Over! Skor: ' + this.score);
        this.draw();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.snake || !this.gameRunning || this.gamePaused) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.snake.setDirection(0, -1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.snake.setDirection(0, 1);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.snake.setDirection(-1, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.snake.setDirection(1, 0);
                    break;
                case ' ':
                    e.preventDefault();
                    this.pause();
                    break;
            }
        });

        // Button controls
        document.getElementById('startBtn').addEventListener('click', () => {
            this.start();
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.pause();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });
    }

    updateScoreDisplay() {
        document.getElementById('score').textContent = this.score;
    }

    updateHighScoreDisplay() {
        document.getElementById('highScore').textContent = this.highScore;
    }

    updateStatus(message) {
        document.getElementById('gameStatus').textContent = message;
    }
}

// ============= POLYFILL roundRect untuk browser lama =============
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (r > w/2) r = w/2;
        if (r > h/2) r = h/2;
        this.moveTo(x + r, y);
        this.lineTo(x + w - r, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r);
        this.lineTo(x + w, y + h - r);
        this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.lineTo(x + r, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r);
        this.lineTo(x, y + r);
        this.quadraticCurveTo(x, y, x + r, y);
        return this;
    };
}

// ============= INISIALISASI GAME =============
// Membuat instance game
const game = new Game('gameCanvas');

console.log('🐍 Snake Game siap dimainkan!');
console.log('Gunakan tombol panah untuk mengontrol ular');
console.log('Tekan Space untuk pause/resume');