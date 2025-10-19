import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Company</h3>
                        <a href="#about">About Us</a>
                        <a href="#services">Services</a>
                        <a href="#contact">Contact</a>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <a href="#portfolio">Portfolio</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                    <div className="footer-section">
                        <h3>Connect</h3>
                        <a href="#">hello@company.com</a>
                        <a href="#">+1 (555) 123-4567</a>
                        <a href="#">Follow Us</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 Company Name. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}