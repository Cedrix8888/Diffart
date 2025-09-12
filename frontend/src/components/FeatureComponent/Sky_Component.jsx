import { useRef, useEffect } from 'react';
import { rgb, hsl, vec2, mod, RandomGenerator, EngineObject, randInt } from "littlejsengine"

// sky with background gradient, stars, and planets
class Sky extends EngineObject {
	constructor() {
		super();

		this.renderOrder = -1e4;
		this.seed = randInt(1e9);

		this.skyColor = rgb(0, 0, 0.3);
		this.horizonColor = rgb(0.2, 0.0, 0.0);
	}

	render(context, canvas, time) {
		// fill background with a gradient
		const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
		gradient.addColorStop(0, this.skyColor);
		gradient.addColorStop(1, this.horizonColor);
		context.save();
		context.fillStyle = gradient;
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.globalCompositeOperation = "lighter";

		// draw stars
		const random = new RandomGenerator(this.seed);
		for (let i = 100 + Math.floor((canvas.width * canvas.height) / 1500); i--; ) {
			const size = random.float(0.5, 2) ** 2;
			const speed = random.float() < 0.95 ? random.float(-3, 3) : random.float(-99, 99);
			const color = hsl(random.float(-0.3, 0.2), random.float(), random.float());
			const extraSpace = 50;
			const w = canvas.width + 2 * extraSpace;
		  const h = canvas.height + 2 * extraSpace;

			let camMult = size * 3;

			// Use a default camera position of (0,0) if not defined
			const cameraPos = { x: 0, y: 0 };
			const screenPos = vec2(
				mod(random.float(w) + time * speed - cameraPos.x * camMult, w) - extraSpace,
				mod(random.float(h) + time * speed * random.float() + cameraPos.y * camMult, h) - extraSpace
			);
      context.fillStyle = color;
			context.fillRect(screenPos.x, screenPos.y, size, size);
		}
		context.restore();
	}
}

export default function Sky_Component() {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timeRef = useRef(0);

  const sky = new Sky();

  // 动画循环
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // 更新时间
    timeRef.current += 0.016; // 大约16ms一帧，模拟60fps

    // 清除画布并重绘
    context.clearRect(0, 0, canvas.width, canvas.height);
    sky.render(context, canvas, timeRef.current);

    // 继续动画循环
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // 处理窗口大小变化
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // 设置canvas尺寸为窗口大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  // 组件挂载时初始化
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // 组件卸载时清理
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-1"
    />
  );
};