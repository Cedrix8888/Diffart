import './Background.css';
import { useEffect, useState } from 'react';

export default function Background() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Generate random particles
        const generateParticles = () => {
            const newParticles = [];
            for (let i = 0; i < 20; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 3 + 1,
                    speed: Math.random() * 0.5 + 0.1,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
            setParticles(newParticles);
        };

        generateParticles();

        // Mouse move handler
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };

        // Animate particles
        const animateParticles = () => {
            setParticles(prev => prev.map(particle => ({
                ...particle,
                y: particle.y <= 0 ? 100 : particle.y - particle.speed,
                x: particle.x + Math.sin(particle.y * 0.01) * 0.1
            })));
        };

        window.addEventListener('mousemove', handleMouseMove);
        const particleInterval = setInterval(animateParticles, 50);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(particleInterval);
        };
    }, []);

    return (
        <div className="dark-circuit-background">
            {/* Mouse follower effect */}
            <div 
                className="mouse-glow"
                style={{
                    left: `${mousePosition.x}%`,
                    top: `${mousePosition.y}%`
                }}
            />
            
            {/* Animated particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="floating-particle"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        opacity: particle.opacity
                    }}
                />
            ))}
            
            {/* Pulse rings */}
            <div className="pulse-ring pulse-ring-1" />
            <div className="pulse-ring pulse-ring-2" />
            <div className="pulse-ring pulse-ring-3" />
        </div>
    );
}