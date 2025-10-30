import './NavBar.css';
import { useState, useEffect, useRef } from 'react';

export default function NavBar() {
    
    const [activeSection, setActiveSection] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navLinksRef = useRef(null);
    const menuToggleRef = useRef(null);

    // Function to update active nav link based on scroll position
    const updateActiveNav = () => {
        console.log('=== updateActiveNav called ===');
        
        const sections = document.querySelectorAll('.section');
        console.log(`Found ${sections.length} sections`);
        
        if (sections.length === 0) {
            console.warn('No sections found with class "section"');
            return;
        }
        
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const navbarHeight = 80; // Approximate navbar height
        
        console.log(`ScrollY: ${scrollY}, Window Height: ${windowHeight}, Current Active: ${activeSection}`);
        
        let current = '';
        let minDistance = Infinity;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            const sectionId = section.getAttribute('id');
            
            // Calculate distance from current scroll position to section start
            const distanceToTop = Math.abs(scrollY + navbarHeight - sectionTop);
            
            console.log(`Section ${index + 1} (${sectionId}):`, {
                top: sectionTop,
                height: sectionHeight,
                bottom: sectionBottom,
                distanceToTop: distanceToTop,
                isInView: scrollY + navbarHeight >= sectionTop && scrollY + navbarHeight < sectionBottom
            });
            
            // Method 1: Check if scroll position + navbar offset is within section
            if (scrollY + navbarHeight >= sectionTop && scrollY + navbarHeight < sectionBottom) {
                current = sectionId;
                console.log(`✓ Active by position: ${sectionId}`);
            }
            
            // Method 2: Find closest section (fallback)
            if (distanceToTop < minDistance) {
                minDistance = distanceToTop;
                if (!current) {
                    current = sectionId;
                    console.log(`✓ Active by proximity: ${sectionId} (distance: ${distanceToTop})`);
                }
            }
        });
        
        // Fallback to home if no section detected and we're near the top
        if (!current && scrollY < 100) {
            current = 'home';
            console.log('✓ Fallback to home (near top)');
        }
        
        // Final fallback
        if (!current) {
            current = 'home';
            console.log('✓ Final fallback to home');
        }
        
        console.log(`Final decision: ${current} (was: ${activeSection})`);
        
        if (current !== activeSection) {
            console.log(`🔄 CHANGING: ${activeSection} → ${current}`);
            setActiveSection(current);
        } else {
            console.log(`✓ No change needed: ${current}`);
        }
        
        console.log('=== updateActiveNav end ===\n');
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
        console.log('🔧 Setting up scroll listener, activeSection:', activeSection);
        
        window.addEventListener('scroll', updateActiveNav);
        document.addEventListener('click', handleClickOutside);

        // Initial call to set active nav
        updateActiveNav();

        return () => {
            console.log('🧹 Cleaning up scroll listener');
            window.removeEventListener('scroll', updateActiveNav);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [activeSection]); // Add activeSection as dependency

    return (
        // Floating Navbar
        <nav className="navbar">
            <div className="nav-container">
                <a href="#home" className="logo">
                    <img src="/logo.svg" alt="logo" />
                </a>
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