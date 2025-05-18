import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold" to="/dashboard">TaskManager</Link>

                <div className="collapse navbar-collapse show">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Задачи</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/kanban">Канбан</Link>
                        </li>
                    </ul>

                    <div className="d-flex gap-2">
                        <button className="btn btn-danger">Создать задачу</button>
                        <button className="btn btn-light text-danger" onClick={handleLogout}>
                            Выйти
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}



/*import React from 'react';

export default function Navbar() {
    console.log('Navbar отображается!');
    return (
        <nav className="bg-danger text-white p-3">
            <h1>Navbar</h1>
        </nav>
    );
}*/
