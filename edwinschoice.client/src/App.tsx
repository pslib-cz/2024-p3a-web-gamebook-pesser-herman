import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Location from './components/Location';
import Battle from './components/Battle';
import Menu from './components/Menu';
import PlayerComponent from './components/PlayerComponent';
import Ending from './components/Endings';

function App() {
    return (
        <Router>
            <PlayerComponent>
                <Routes>
                    <Route path="/" element={<Menu />} />
                    <Route path="/location/:id" element={<Location />} />
                    <Route path="/battle/:id" element={<Battle />} />
                    <Route path="/endings" element={<Ending />} />
                </Routes>
            </PlayerComponent>
        </Router>
    );
}

export default App;
