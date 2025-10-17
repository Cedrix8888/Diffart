import SideBar from '../components/FeatureComponent/SideBar.jsx';
import Canvas from '../components/FeatureComponent/Canvas.jsx';
import { useState } from 'react';

export default function Workspace() {
    const [images, setImages] = useState(null);

    return (
        <div>
            <SideBar setImages={ setImages } />
            <Canvas images={ images } />
        </div>
    )
}