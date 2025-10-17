export default function NavBar() {
    return (
        // Floating Navbar
        <nav className="fixed top-5 left-[50%] -translate-x-1/2 bg-[rgba(26,26,26,0.9)] backdrop-blur-md rounded-full px-8 py-3 border border-gray-700 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between gap-10">
                <a href="#home" className="text-2xl font-extrabold text-white no-underline">LOGO</a>
                <div className="flex align-center gap-10">
                    <ul className="flex list-none gap-[30px]" id="navLinks">
                        <li><a href="#home" className='text- no-underline font-medium text-[0.95rem] transition-all duration-300 ease-in-out relative'>Home</a></li>
                        <li><a href="#about" className='text-[#e0e0e0] no-underline font-medium text-[0.95rem] transition-all duration-300 ease-in-out relative'>About</a></li>
                        <li><a href="#services" className='text-[#e0e0e0] no-underline font-medium text-[0.95rem] transition-all duration-300 ease-in-out relative'>Services</a></li>
                        <li><a href="#portfolio" className='text-[#e0e0e0] no-underline font-medium text-[0.95rem] transition-all duration-300 ease-in-out relative'>Portfolio</a></li>
                        <li><a href="#contact" classname='text-[#e0e0e0] no-underline font-medium text-[0.95rem] transition-all duration-300 ease-in-out relative'>Contact</a></li>
                        <li class="mobile-auth-buttons">
                            <a href="#" class="auth-btn login-btn" className='text-[#e0e0e0] no-underline font-medium text-[0.95rem] transition-all duration-300 ease-in-out relative'>Login</a>
                            <a href="#" class="auth-btn signup-btn" className='text-[#e0e0e0] no-underline font-medium text-[0.95rem] transition-all duration-300 ease-in-out relative'>Sign Up</a>
                        </li>
                    </ul>
                    
                </div>
                <div class="auth-buttons">
                    <a href="#" class="auth-btn login-btn">Login</a>
                    <a href="#" class="auth-btn signup-btn">Sign Up</a>
                </div>
                <button class="menu-toggle" id="menuToggle">☰</button>
            </div>
        </nav>
    )
}