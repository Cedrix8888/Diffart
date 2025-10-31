import { useEffect, useRef } from 'react';
import './Background.css';

export default function Background() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawCircuitPattern();
        };

        const drawCircuitPattern = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // 2560/40 = 64, 1600/40 = 40,

            const gridSize = canvas.width / 128;
            const lineWidth = 1;
            
            // Set colors matching the CSS pattern
            const lineColor = 'rgba(34, 197, 94, 0.15)';

            // Draw grid lines
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth;

            const points = [[0.0, 0.87], [0.05, 0.89], [0.1, 0.91], [0.16, 0.93], [0.21, 0.95], [0.26, 0.97], [0.31, 0.98], [0.37, 0.99], [0.42, 0.99], [0.47, 1.0], [0.52, 1.0], [0.58, 1.0], [0.63, 0.99], [0.68, 0.99], [0.73, 0.98], [0.79, 0.97], [0.84, 0.95], [0.89, 0.93], [0.94, 0.91], [0.99, 0.89], [1.05, 0.87], [1.1, 0.84], [1.15, 0.81], [1.2, 0.78], [1.26, 0.74], [1.31, 0.71], [1.36, 0.67], [1.41, 0.63], [1.47, 0.59], [1.52, 0.54], [1.57, 0.5], [1.62, 0.45], [1.68, 0.41], [1.73, 0.36], [1.78, 0.31], [1.83, 0.26], [1.88, 0.21], [1.94, 0.16], [1.99, 0.1], [2.04, 0.05], [2.09, 0.0]];
            
            // Modify points
            points.forEach(item => {
                const tmp = item[0];
                item[0] = canvas.width * (1 - item[1]) + gridSize * (Math.random() * 2 - 1); // x
                item[1] = canvas.height * ((2 * Math.PI / 3) - tmp); // y
            });

            // Horizontal lines
            for (let i = 0; i < points.length; i++) {
                const item = points[i];
                ctx.beginPath();
                ctx.moveTo(item[0], canvas.height - (gridSize - lineWidth / 2) * (i + 1));
                ctx.lineTo(canvas.width, item[1]);
                ctx.stroke();
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef}
            className="dark-circuit-background"
        />
    );
}