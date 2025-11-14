import { useState } from 'react';
import './AuthModal.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div id="auth-modal-backdrop" className='fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-9999 p-4' onClick={handleBackdropClick}>
            <div id='auth-modal' className="flex flex-col bg-[#2c2c2c] rounded-[20px] shadow-[0_25px_50px_rgba(0,0,0,0.5)] p-4 w-[28vw] h-[85vh] overflow-y-auto relative">
                <button className="auth-modal-close absolute top-3 right-3 w-[32px] h-[32px] border-none bg-[#1a1a1a] rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 text-[#4c4c4c] hover:bg-[#e2e8f0] hover:text-[#2d3748] hover:rotate-90" onClick={onClose}>
                    <svg className='w-[20px] h-[20px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                <div className="text-center h-[25%] mt-2 flex flex-col items-center justify-center mb-2">
                    <div className='flex flex-col items-center text-white'>
                        <img src="/logo.svg" alt="logo" className="w-[54px] h-[54px]" />
                        <p className="text-3xl font-bold leading-10 select-none">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </p>
                        <p className="text-md font-serif font-light leading-6 select-none text-[#d1d1d1]">
                            {mode === 'login' 
                                ? 'Sign in to continue' 
                                : 'Join us to design amazing posters'}
                        </p>
                    </div>
                </div>

                <div id="auth-modal-content" className='mb-1 px-4'>
                    {mode === 'login' ? (
                        <LoginForm onSuccess={onClose} />
                    ) : (
                        <RegisterForm onSuccess={onClose} />
                    )}
                </div>

                <div id="auth-modal-footer" className='text-center pt-4 text-gray-400 text-[0.9rem]'>
                    <div className="flex items-center pt-2">
 		                <div className="h-px bg-gray-700 flex-1"></div>
 		                    <p className="message px-4 text-md leading-5 text-gray-400 select-none">Login with social accounts</p>
 		                <div className="h-px bg-gray-700 flex-1"></div>
	                </div>
                    <div id="social-icons" className='flex justify-center'>
 		                <button aria-label="Log in with Google" className="icon rounded-sm p-3 border-none bg-transparent ml-2">
 			                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 fill-white cursor-pointer transition-all duration-300 hover:-translate-y-0.5">
 				                <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
 			                </svg>
 		                </button>
 		                <button aria-label="Log in with Twitter" className="icon rounded-sm p-3 border-none bg-transparent ml-2">
 			                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 fill-white cursor-pointer transition-all duration-300 hover:-translate-y-0.5">
 				                <path d="M31.937 6.093c-1.177 0.516-2.437 0.871-3.765 1.032 1.355-0.813 2.391-2.099 2.885-3.631-1.271 0.74-2.677 1.276-4.172 1.579-1.192-1.276-2.896-2.079-4.787-2.079-3.625 0-6.563 2.937-6.563 6.557 0 0.521 0.063 1.021 0.172 1.495-5.453-0.255-10.287-2.875-13.52-6.833-0.568 0.964-0.891 2.084-0.891 3.303 0 2.281 1.161 4.281 2.916 5.457-1.073-0.031-2.083-0.328-2.968-0.817v0.079c0 3.181 2.26 5.833 5.26 6.437-0.547 0.145-1.131 0.229-1.724 0.229-0.421 0-0.823-0.041-1.224-0.115 0.844 2.604 3.26 4.5 6.14 4.557-2.239 1.755-5.077 2.801-8.135 2.801-0.521 0-1.041-0.025-1.563-0.088 2.917 1.86 6.36 2.948 10.079 2.948 12.067 0 18.661-9.995 18.661-18.651 0-0.276 0-0.557-0.021-0.839 1.287-0.917 2.401-2.079 3.281-3.396z"></path>
 			                </svg>
 		                </button>
 		                <button aria-label="Log in with GitHub" className="icon rounded-sm p-3 border-none bg-transparent ml-2">
 			                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 fill-white cursor-pointer transition-all duration-300 hover:-translate-y-0.5">
 				                <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
 			                </svg>
                        </button>
 	                </div>
                    <p>
                        <span className='select-none'>
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button 
                            id="auth-switch-btn"
                            className='ml-1 bg-none border-none font-bold text-[#7f7f7f] cursor-pointer decoration-none transition-all duration-300 hover:-translate-y-0.5 hover:scale-103 hover:text-[#676767]'
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        >
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}














// <div class="form-container">
// 	<p class="title">Login</p>
// 	<div class="social-message">
// 		<div class="line"></div>
// 		<p class="message">Login with social accounts</p>
// 		<div class="line"></div>
// 	</div>
// 	<div class="social-icons">
// 		<button aria-label="Log in with Google" class="icon">
// 			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
// 				<path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
// 			</svg>
// 		</button>
// 		<button aria-label="Log in with Twitter" class="icon">
// 			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
// 				<path d="M31.937 6.093c-1.177 0.516-2.437 0.871-3.765 1.032 1.355-0.813 2.391-2.099 2.885-3.631-1.271 0.74-2.677 1.276-4.172 1.579-1.192-1.276-2.896-2.079-4.787-2.079-3.625 0-6.563 2.937-6.563 6.557 0 0.521 0.063 1.021 0.172 1.495-5.453-0.255-10.287-2.875-13.52-6.833-0.568 0.964-0.891 2.084-0.891 3.303 0 2.281 1.161 4.281 2.916 5.457-1.073-0.031-2.083-0.328-2.968-0.817v0.079c0 3.181 2.26 5.833 5.26 6.437-0.547 0.145-1.131 0.229-1.724 0.229-0.421 0-0.823-0.041-1.224-0.115 0.844 2.604 3.26 4.5 6.14 4.557-2.239 1.755-5.077 2.801-8.135 2.801-0.521 0-1.041-0.025-1.563-0.088 2.917 1.86 6.36 2.948 10.079 2.948 12.067 0 18.661-9.995 18.661-18.651 0-0.276 0-0.557-0.021-0.839 1.287-0.917 2.401-2.079 3.281-3.396z"></path>
// 			</svg>
// 		</button>
// 		<button aria-label="Log in with GitHub" class="icon">
// 			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
// 				<path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
// 			</svg>
// 		</button>
// 	</div>
// 	<p class="signup">Don't have an account?
// 		<a rel="noopener noreferrer" href="#" class="">Sign up</a>
// 	</p>
// </div>







// .form-container {
//   width: 320px;
//   border-radius: 0.75rem;
//   background-color: rgba(17, 24, 39, 1);
//   padding: 2rem;
//   color: rgba(243, 244, 246, 1);
// }

// .title {
//   text-align: center;
//   font-size: 1.5rem;
//   line-height: 2rem;
//   font-weight: 700;
// }

// .form {
//   margin-top: 1.5rem;
// }

// .input-group {
//   margin-top: 0.25rem;
//   font-size: 0.875rem;
//   line-height: 1.25rem;
// }

// .input-group label {
//   display: block;
//   color: rgba(156, 163, 175, 1);
//   margin-bottom: 4px;
// }

// .input-group input {
//   width: 100%;
//   border-radius: 0.375rem;
//   border: 1px solid rgba(55, 65, 81, 1);
//   outline: 0;
//   background-color: rgba(17, 24, 39, 1);
//   padding: 0.75rem 1rem;
//   color: rgba(243, 244, 246, 1);
// }

// .input-group input:focus {
//   border-color: rgba(167, 139, 250);
// }

// .forgot {
//   display: flex;
//   justify-content: flex-end;
//   font-size: 0.75rem;
//   line-height: 1rem;
//   color: rgba(156, 163, 175,1);
//   margin: 8px 0 14px 0;
// }

// .forgot a,.signup a {
//   color: rgba(243, 244, 246, 1);
//   text-decoration: none;
//   font-size: 14px;
// }

// .forgot a:hover, .signup a:hover {
//   text-decoration: underline rgba(167, 139, 250, 1);
// }

// .sign {
//   display: block;
//   width: 100%;
//   background-color: rgba(167, 139, 250, 1);
//   padding: 0.75rem;
//   text-align: center;
//   color: rgba(17, 24, 39, 1);
//   border: none;
//   border-radius: 0.375rem;
//   font-weight: 600;
// }

// .social-icons .icon {
//   border-radius: 0.125rem;
//   padding: 0.75rem;
//   border: none;
//   background-color: transparent;
//   margin-left: 8px;
// }

// .social-icons .icon svg {
//   height: 1.25rem;
//   width: 1.25rem;
//   fill: #fff;
// }

// .signup {
//   text-align: center;
//   font-size: 0.75rem;
//   line-height: 1rem;
//   color: rgba(156, 163, 175, 1);
// }
