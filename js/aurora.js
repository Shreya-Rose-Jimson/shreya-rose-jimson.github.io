// Monochrome Aurora Borealis Animation
// Inspired by fluid/simplex noise waves, simplified using sine waves and gradient fills

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('nanoCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    let time = 0;

    function drawAurora() {
        ctx.clearRect(0, 0, width, height);
        
        // Dark theme vs Light theme aurora logic
        const isDark = document.documentElement.classList.contains('dark');
        ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over';
        
        const layers = 4;
        for (let i = 0; i < layers; i++) {
            ctx.beginPath();
            
            // Generate a sweeping curve
            ctx.moveTo(0, height);
            
            let gradient = ctx.createLinearGradient(0, 0, width, height);
            let baseAlpha = 0.15 + (0.05 * i);
            
            if (isDark) {
                // Glow effect for dark mode
                gradient.addColorStop(0, `rgba(200, 200, 255, 0)`);
                gradient.addColorStop(0.5, `rgba(200, 200, 255, ${baseAlpha * 1.5})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            } else {
                // Ink effect for light mode
                gradient.addColorStop(0, `rgba(50, 50, 50, 0)`);
                gradient.addColorStop(0.5, `rgba(100, 100, 100, ${baseAlpha})`);
                gradient.addColorStop(1, `rgba(200, 200, 200, 0)`);
            }
            
            for (let x = 0; x <= width; x += 20) {
                // Wave Math
                let yOffset = Math.sin(x * 0.003 + time + i) * 200;
                let yOffset2 = Math.cos(x * 0.002 - time * 0.4 + i) * 150;
                let baseY = height * 0.4 + (i * 120);
                
                ctx.lineTo(x, baseY + yOffset + yOffset2);
            }
            
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        time += 0.01;
        requestAnimationFrame(drawAurora);
    }

    // Start
    drawAurora();
});
