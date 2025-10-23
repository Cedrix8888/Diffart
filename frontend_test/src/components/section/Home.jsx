import './Section.css';
import './Home.css';

export default function Home() {
    return (
        // Home Section
        <section id="home" className="section">
            <div className='pl-10 pb-10'>
                <h1>HOME</h1>
                <p className="section-info">Welcome section with hero content, main headline, and call-to-action buttons</p>
            </div>
        </section>
    );
}