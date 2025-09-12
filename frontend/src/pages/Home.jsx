import { Link } from 'react-router-dom';
import { Sky_Component } from '../components/FeatureComponent/Sky_Component';

export default function Home() {
    return (
        <div>
            <Sky_Component />
            <div className="text-center py-36">
                <p className="font-semibold tracking-tight text-gray-900 text-7xl">Make AI image</p>
                <p className="font-semibold tracking-tight text-gray-900 text-7xl">more</p>
                <p className="font-semibold tracking-tight text-black text-8xl">customized</p>
                <div className="text-center mt-10">
                    <Link to="/workspace/rgb" className="rounded-md bg-gray-100 px-2.5 py-2 text-sm font-semibold text-black shadow-sm hover:bg-black hover:text-white">Get started</Link>
                </div>
            </div>
        </div>
    );
}