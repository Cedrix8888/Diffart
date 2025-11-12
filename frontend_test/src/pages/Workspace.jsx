import './Workspace.css';
import Chatbox from '../components/FeatureComponent/Chatbox.jsx';   

export default function Workspace() {
    return (
        <div className="w-[100vw] h-[100vh] bg-[#2c2c2c] overflow-hidden z-0 flex items-center">
            <Chatbox />
        </div>
    )
}