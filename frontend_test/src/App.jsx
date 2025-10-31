import { Routes, Route} from 'react-router-dom';
import Layout from "./components/Layout.jsx";
import HomePage from './pages/HomePage.jsx';


export default function App() {
  return (
    <div className="font-sans bg-[#0a0a0a] text-white leading-[1.6] -z-10">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </div>
  )
}