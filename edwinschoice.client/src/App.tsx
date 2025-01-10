import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Location from './components/Location';
import Menu from './components/Menu';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Menu />} />
                    <Route path="/location/:id" element={<Location />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
