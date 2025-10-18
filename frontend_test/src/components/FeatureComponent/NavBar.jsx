import './NavBar.css';
import { useState, useEffect, useRef } from 'react';

export default function NavBar() {
    
    const sections = document.querySelectorAll('.section');
    const [activeSection, setActiveSection] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navLinksRef = useRef(null);
    const menuToggleRef = useRef(null);

    // Function to update active nav link based on scroll position
    const updateActiveNav = () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        if (current && current !== activeSection) {
            setActiveSection(current);
        }
    };

    // Handle mobile menu toggle
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Handle nav link click
    const handleNavLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    // Handle click outside to close mobile menu
    const handleClickOutside = (e) => {
        if (menuToggleRef.current && navLinksRef.current &&
            !menuToggleRef.current.contains(e.target) && 
            !navLinksRef.current.contains(e.target)) {
            setIsMobileMenuOpen(false);
        }
    };

    // Set up event listeners
    useEffect(() => {
        window.addEventListener('scroll', updateActiveNav);
        document.addEventListener('click', handleClickOutside);

        // Initial call to set active nav
        updateActiveNav();

        return () => {
            window.removeEventListener('scroll', updateActiveNav);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [activeSection]);

    return (
        // Floating Navbar
        <nav className="navbar">
            <div className="nav-container">
                <a href="#home" className="logo">LOGO</a>
                <div className="nav-center">
                    <ul 
                        className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} 
                        ref={navLinksRef}
                    >
                        <li>
                            <a 
                                href="#home" 
                                className={activeSection === 'home' ? 'active' : ''}
                                onClick={handleNavLinkClick}
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#about" 
                                className={activeSection === 'about' ? 'active' : ''}
                                onClick={handleNavLinkClick}
                            >
                                About
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#services" 
                                className={activeSection === 'services' ? 'active' : ''}
                                onClick={handleNavLinkClick}
                            >
                                Services
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#portfolio" 
                                className={activeSection === 'portfolio' ? 'active' : ''}
                                onClick={handleNavLinkClick}
                            >
                                Portfolio
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#contact" 
                                className={activeSection === 'contact' ? 'active' : ''}
                                onClick={handleNavLinkClick}
                            >
                                Contact
                            </a>
                        </li>
                        <li className="mobile-auth-buttons">
                            <a href="#" className="auth-btn login-btn">Login</a>
                            <a href="#" className="auth-btn signup-btn">Sign Up</a>
                        </li>
                    </ul>
                    
                </div>
                <div className="auth-buttons">
                    <a href="#" className="auth-btn login-btn">Login</a>
                    <a href="#" className="auth-btn signup-btn">Sign Up</a>
                </div>
                <button 
                    className="menu-toggle" 
                    ref={menuToggleRef}
                    onClick={toggleMobileMenu}
                >
                    ☰
                </button>
            </div>
        </nav>
    )
}