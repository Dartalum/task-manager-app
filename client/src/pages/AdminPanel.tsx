import React, { useEffect, useState } from 'react';
import {
    fetchTaskTypes,
    fetchTaskStatuses,
    fetchAllUsers,
    addTaskType,
    addTaskStatus,
    addUser,
    fetchRoles
} from '../services/adminService';

export default function AdminPanel() {
    const [taskTypes, setTaskTypes] = useState<{ id: number; name: string }[]>([]);
    const [taskStatuses, setTaskStatuses] = useState<{ id: number; name: string }[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

    const [typeName, setTypeName] = useState('');
    const [statusName, setStatusName] = useState('');

    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        middleName: '',
        roleId: 2
    });

    const [openSection, setOpenSection] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setTaskTypes(await fetchTaskTypes());
        setTaskStatuses(await fetchTaskStatuses());
        setUsers(await fetchAllUsers());
        setRoles(await fetchRoles());
    };

    const handleAddType = async () => {
        if (!typeName.trim()) return;
        await addTaskType(typeName);
        setTypeName('');
        loadData();
    };

    const handleAddStatus = async () => {
        if (!statusName.trim()) return;
        await addTaskStatus(statusName);
        setStatusName('');
        loadData();
    };

    const handleAddUser = async () => {
        await addUser(newUser);
        setNewUser({ username: '', email: '', password: '', firstName: '', lastName: '', middleName: '', roleId: 0 });
        loadData();
    };

    return (
        <div className="container py-4">
            <h3 className="mb-4">Админ-панель</h3>

            {/* Типы задач */}
            <div className="mb-4">
                <button className="btn btn-outline-primary" onClick={() => setOpenSection(openSection === 'types' ? null : 'types')}>
                    Типы задач
                </button>
                {openSection === 'types' && (
                    <div className="mt-3">
                        <div className="d-flex mb-3">
                            <input className="form-control me-2" value={typeName} onChange={e => setTypeName(e.target.value)} placeholder="Название типа" />
                            <button className="btn btn-success" onClick={handleAddType}>Добавить</button>
                        </div>
                        <ul className="list-group">
                            {taskTypes.map(t => (
                                <li key={t.id} className="list-group-item">{t.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Статусы задач */}
            <div className="mb-4">
                <button className="btn btn-outline-primary" onClick={() => setOpenSection(openSection === 'statuses' ? null : 'statuses')}>
                    Статусы задач
                </button>
                {openSection === 'statuses' && (
                    <div className="mt-3">
                        <div className="d-flex mb-3">
                            <input className="form-control me-2" value={statusName} onChange={e => setStatusName(e.target.value)} placeholder="Название статуса" />
                            <button className="btn btn-success" onClick={handleAddStatus}>Добавить</button>
                        </div>
                        <ul className="list-group">
                            {taskStatuses.map(s => (
                                <li key={s.id} className="list-group-item">{s.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Пользователи */}
            <div className="mb-4">
                <button className="btn btn-outline-primary" onClick={() => setOpenSection(openSection === 'users' ? null : 'users')}>
                    Пользователи
                </button>
                {openSection === 'users' && (
                    <div className="mt-3">
                        <div className="row g-2 mb-3">
                            <div className="col"><input className="form-control" placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} /></div>
                            <div className="col"><input className="form-control" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} /></div>
                            <div className="col"><input className="form-control" placeholder="Пароль" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} /></div>
                            <div className="col"><input className="form-control" placeholder="Фамилия" value={newUser.lastName} onChange={e => setNewUser({ ...newUser, lastName: e.target.value })} /></div>
                            <div className="col"><input className="form-control" placeholder="Имя" value={newUser.firstName} onChange={e => setNewUser({ ...newUser, firstName: e.target.value })} /></div>
                            <div className="col"><input className="form-control" placeholder="Отчество" value={newUser.middleName} onChange={e => setNewUser({ ...newUser, middleName: e.target.value })} /></div>
                            <div className="col">
                                <select className="form-select" value={newUser.roleId} onChange={e => setNewUser({ ...newUser, roleId: Number(e.target.value) })}>
                                    <option value="">Выберите роль</option>
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-auto">
                                <button className="btn btn-success" onClick={handleAddUser}>Добавить</button>
                            </div>
                        </div>
                        <ul className="list-group">
                            {users.map(u => (
                                <li key={u.id} className="list-group-item">
                                    {u.lastName} {u.firstName} ({u.email}) — роль: {u.UserRole?.name || u.roleId}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
