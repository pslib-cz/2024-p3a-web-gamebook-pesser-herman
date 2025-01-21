import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Location from './components/Location';
import Battle from './components/Battle';
import Menu from './components/Menu';
import PlayerComponent from './components/PlayerComponent';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/location/:id" element={<PlayerComponent><Location /></PlayerComponent>} />
                <Route path="/battle/:id" element={<PlayerComponent><Battle /></PlayerComponent>} />
            </Routes>
        </Router>
    );
}

export default App;
