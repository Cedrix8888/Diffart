import { useEffect, useRef } from 'react';
import './Sincurve.css';

export default function Sincurve() {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const timeRef = useRef(0);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const caculateX = (y, time) => {
            // Add time-based translation for dynamic effect
            return 0.5 * Math.sin(2 * Math.PI * y + Math.PI + time * 0.0002) + 0.5;
        }

        const createLineGradient = (x, y) => {
            const gradient = ctx.createLinearGradient(x, y, canvas.width, y);
            // 可以根据y位置调整渐变颜色比例，创造更丰富的效果
            gradient.addColorStop(0, `rgba(18, 120, 50, 0.2)`); // 绿色
            gradient.addColorStop(0.3, `rgba(18, 160, 50, 0.6)`);
            gradient.addColorStop(1, `rgba(25, 65, 120, 1)`); // 蓝色
            return gradient;
        };

        const drawSine = (time) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gridSize = canvas.height / 32;
            const lineWidth = 6;

            ctx.lineWidth = lineWidth;

            // Horizontal lines
            for (let i = 0; i < 31; i++) {
                let y = gridSize - lineWidth / 2 + i * gridSize;
                let normalizedY = y / canvas.height;
                let x = caculateX(normalizedY, time) * canvas.width;
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(canvas.width, y);

                ctx.strokeStyle = createLineGradient(x, y);
                ctx.stroke();
            }
        };

        const animate = () => {
            timeRef.current = Date.now();
            drawSine(timeRef.current);
            animationRef.current = requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate(); // Start the animation loop
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef}
            className="dark-circuit-background"
        />
    );
}