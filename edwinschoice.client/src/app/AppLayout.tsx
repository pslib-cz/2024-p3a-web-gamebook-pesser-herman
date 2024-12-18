import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <header>
                <h2>Gamebook</h2>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;