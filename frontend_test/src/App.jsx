import { Routes, Route} from 'react-router-dom';
import Layout from "./components/Layout.jsx";
import Homepage from './pages/Homepage.jsx';
import Workspace from "./pages/Workspace.jsx"


export default function App() {
  return (
    <div className="font-sans bg-[#0a0a0a] text-white leading-[1.6] -z-10">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="/workspace" element={<Workspace />}>
          </Route>
        </Route>
      </Routes>
    </div>
  )
}