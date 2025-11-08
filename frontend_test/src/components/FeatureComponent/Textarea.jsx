import './Textarea.css';

export default function Textarea() {
    return (
        <div className='flex flex-col justify-center items-center'>
            <div className="grid"></div>
            <div id="poda">
                <div className="glow"></div>
                <div className="darkBorderBg"></div>
                <div className="darkBorderBg"></div>
                <div className="darkBorderBg"></div>

                <div className="white"></div>

                <div className="border"></div>
                
                <textarea placeholder="Search..." name="text" />
            </div>
        </div>
    )
}