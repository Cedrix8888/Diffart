import './Workspace.css';
import Input from '../components/FeatureComponent/Input.jsx';

export default function Workspace() {
    return (
        <div className="min-h-screen w-full h-full bg-[#2c2c2c] flex justify-between items-center">
            <div className="card ml-10 flex flex-col justify-center items-center">
                <Input />
            </div>
        </div>
    )
}