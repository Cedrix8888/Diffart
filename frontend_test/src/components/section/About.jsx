import './Section.css';
import './About.css';
import Squares from '../FeatureComponent/Squares';

export default function About() {
    return (
        // About Section
        <section id="about" className="section">
            <div className="absolute inset-0 z-0 w-[100vw] h-[100vh] overflow-hidden">
                <Squares 
                    speed={0.5} 
                    squareSize={40}
                    direction='diagonal' // up, down, left, right, diagonal
                    borderColor='#04270FE3'
                    hoverFillColor='#000000'
                    />
                </div>
        </section>
    )
}