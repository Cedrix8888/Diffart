import './Textarea.css';

export default function Textarea() {
    return (
        <div id='poda' className='flex justify-between items-center mt-4 relative z-10 w-full h-full'>
            <div className="glow"></div>
            <div className="darkBorderBg"></div>
            <div className="darkBorderBg"></div>
            <div className="darkBorderBg"></div>

            <div className="white"></div>

            <div className="border"></div>
            
            <textarea placeholder="Search..." name="text" />
        </div>
    )
}