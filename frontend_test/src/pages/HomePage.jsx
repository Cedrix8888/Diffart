import NavBar from '../components/FeatureComponent/NavBar';
import Home from '../components/section/Home';
import About from '../components/section/About';
import Services from '../components/section/Services';
import Portfolio from '../components/section/Portfolio';
import Contact from '../components/section/Contact';
import Footer from '../components/FeatureComponent/Footer';

export default function HomePage() {

    
    return (
        <div>
            <NavBar />
            <Home />
            <About />
            <Services />
            <Portfolio />
            <Contact />
            <Footer />
        </div>
    )
}