import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers, fetchTaskTypes } from '../services/taskService';

type User = {
    id: number;
    firstName: string;
    lastName: string;
};

type TaskType = {
    id: number;
    name: string;
};

export default function CreateTask() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [executorId, setExecutorId] = useState<number | ''>('');
    const [typeId, setTypeId] = useState<number | ''>('');
    const [users, setUsers] = useState<User[]>([]);
    const [types, setTypes] = useState<TaskType[]>([]);
    const [errors, setErrors] = useState<{ title?: string; typeId?: string; executorId?: string }>({});
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const load = async () => {
            setUsers(await fetchAllUsers());
            setTypes(await fetchTaskTypes());
        };
        load();
    }, []);

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!title.trim()) newErrors.title = 'Название обязательно';
        if (!typeId) newErrors.typeId = 'Тип задачи обязателен';
        if (!executorId) newErrors.executorId = 'Исполнитель обязателен';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const taskData = {
            title,
            description,
            authorId: currentUser.id,
            statusId: 1,
            typeId: Number(typeId),
            executorId: Number(executorId)
        };

        console.log('➡️ Отправляется taskData:', taskData);

        const token = localStorage.getItem('token');
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (res.ok) {
            navigate('/dashboard');
        } else {
            const err = await res.json();
            alert('Ошибка: ' + err.message);
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: '600px' }}>
            <h3 className="mb-4 fw-bold">Создание задачи</h3>
            <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded p-4 border">
                <div className="mb-3">
                    <label className="form-label fw-semibold">Название задачи <span className="text-danger">*</span></label>
                    <input
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Введите название"
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Описание</label>
                    <textarea
                        className="form-control"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Описание задачи"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Тип задачи <span className="text-danger">*</span></label>
                    <select
                        className={`form-select ${errors.typeId ? 'is-invalid' : ''}`}
                        value={typeId}
                        onChange={(e) => setTypeId(e.target.value ? Number(e.target.value) : '')}
                    >
                        <option value="">Выберите тип</option>
                        {types.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    {errors.typeId && <div className="invalid-feedback">{errors.typeId}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Исполнитель <span className="text-danger">*</span></label>
                    <select
                        className={`form-select ${errors.executorId ? 'is-invalid' : ''}`}
                        value={executorId}
                        onChange={(e) => setExecutorId(e.target.value ? Number(e.target.value) : '')}
                    >
                        <option value="">Выберите исполнителя</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.lastName} {u.firstName}
                            </option>
                        ))}
                    </select>
                    {errors.executorId && <div className="invalid-feedback">{errors.executorId}</div>}
                </div>

                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary px-4" type="submit">
                        Создать
                    </button>
                </div>
            </form>
        </div>
    );
}
