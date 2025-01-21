import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Location from './components/Location';
import Battle from './components/Battle';
import Menu from './components/Menu';
import PlayerComponent from './components/PlayerComponent';
import Ending from './components/Endings';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/location/:id" element={<PlayerComponent><Location /></PlayerComponent>} />
                <Route path="/battle/:id" element={<PlayerComponent><Battle /></PlayerComponent>} />
                <Route path="/endings" element={<Ending />} />
            </Routes>
        </Router>
    );
}

export default App;
