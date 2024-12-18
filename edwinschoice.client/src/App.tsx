import './App.css';
import { createBrowserRouter, RouterProvider, } from 'react-router-dom';
import AppLayout from './app/AppLayout';
import Menu from './app/Menu';
import Locname1 from './components/locname1';
import Locname2 from './components/locname2';
import Locname3 from './components/locname3';

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Menu />,
            },
            {
                path: '/locname1',
                element: <Locname1 />,
            },
            {
                path: '/locname2',
                element: <Locname2 />,
            },
            {
                path: '/locname3',
                element: <Locname3 />,
            },
        ],
    },
]);

function App() {
    return (
        <>
            <h1>Gamebook</h1>
            <RouterProvider router={router} />
        </>
    );
}

export default App;