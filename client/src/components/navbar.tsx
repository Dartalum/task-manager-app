import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('[Navbar] user:', user);
    console.log('[Navbar] typeof user:', typeof user);




    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container-fluid">
                <NavLink className="navbar-brand fw-bold fs-4 text-dark" to="/dashboard">
                    TaskManager
                </NavLink>
                <div className="collapse navbar-collapse show">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    'nav-link fw-semibold fs-5' + (isActive ? ' text-black border-bottom border-2 border-black' : ' text-light')
                                }
                            >
                                Задачи
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/kanban"
                                className={({ isActive }) =>
                                    'nav-link fw-semibold fs-5' + (isActive ? ' text-black border-bottom border-2 border-black' : ' text-light')
                                }
                            >
                                Канбан
                            </NavLink>

                        </li>
                    </ul>

                    <div className="d-flex gap-2">
                        {user.role === 'admin' && (
                            <button className="btn btn-danger" onClick={() => navigate('/admin-panel')}>
                                Админ-панель
                            </button>
                        )}
                        <button className="btn btn-danger" onClick={() => navigate('/create-task')}>
                            Создать задачу
                        </button>
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
