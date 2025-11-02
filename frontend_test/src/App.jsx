import { Routes, Route} from 'react-router-dom';
import Layout from "./components/Layout.jsx";
import Homepage from './pages/Homepage.jsx';
import Workspace from "./pages/Workspace.jsx"


export default function App() {
  return (
    <div>
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