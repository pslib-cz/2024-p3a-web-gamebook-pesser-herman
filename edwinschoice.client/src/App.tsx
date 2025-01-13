import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Location from './components/Location';
import Menu from './components/Menu';
import PlayerComponent from './components/PlayerComponent';

function App() {
    return (
        <Router>
            <PlayerComponent>
                <div>
                    <Routes>
                        <Route path="/" element={<Menu />} />
                        <Route path="/location/:id" element={<Location />} />
                    </Routes>
                </div>
            </PlayerComponent>
        </Router>
    );
}

export default App;