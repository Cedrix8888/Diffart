import './Section.css';
import './Home.css';
import Background from '../FeatureComponent/Background';

export default function Home() {
    return (
        // Home Section
        <div>
            <section id="home" className="section">
                <div className='pl-10 pb-10'>
                    <img src="/diffart.svg" alt="diffart" />
                </div>
                <Background />
            </section>
        </div>
    );
}