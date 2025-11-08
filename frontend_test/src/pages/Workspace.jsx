import './Workspace.css';
import Textarea from '../components/FeatureComponent/Textarea.jsx';

export default function Workspace() {
    return (
        <div className="w-[100vw] h-[100vh] bg-[#2c2c2c] flex justify-between items-center overflow-hidden z-0">
            <div className="card w-[25%] h-[90%] ml-10 flex flex-col justify-center items-center z-5">
                <Textarea />
            </div>
        </div>
    )
}