import { useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import AppRouter from './router';
import React from 'react';

export default function App() {
    const location = useLocation();
    console.log('App.tsx отрисовался. Путь:', location.pathname);

    const showNavbar = location.pathname !== '/';

    return (
        <>
            {showNavbar && <Navbar />}
            <AppRouter />
        </>
    );
}
