
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    fetchTasks,
    fetchTaskStatuses,
    fetchAllUsers,
    fetchTaskTypes,
    updateTask
} from '../services/taskService';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

type Task = {
    id: number;
    title: string;
    executorId: number;
    authorId: number;
    statusId: number;
    typeId: number;
    parentId?: number;
};

type User = {
    id: number;
    firstName: string;
    lastName: string;
};

type Status = {
    id: number;
    name: string;
};

type TaskType = {
    id: number;
    name: string;
};

export default function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [statusOptions, setStatusOptions] = useState<Status[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [typeOptions, setTypeOptions] = useState<TaskType[]>([]);
    const navigate = useNavigate();
    const [filterExecutor, setFilterExecutor] = useState('');
    //const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [onlyMyTasks, setOnlyMyTasks] = useState(false);
    const [filterAuthor, setFilterAuthor] = useState('');
    const [executorSuggestions, setExecutorSuggestions] = useState<string[]>([]);
    const [authorSuggestions, setAuthorSuggestions] = useState<string[]>([]);


    const user = JSON.parse(localStorage.getItem('user') || '{}');


    useEffect(() => {
        const load = async () => {
            const t = await fetchTasks();
            setTasks(Array.isArray(t) ? t : t.tasks);
            setStatusOptions(await fetchTaskStatuses());
            setUsers(await fetchAllUsers());
            setTypeOptions(await fetchTaskTypes());
        };
        load();
    }, []);

    useEffect(() => {
        const input = filterExecutor.toLowerCase();
        const matches = users
            .map(u => getUserName(u.id))
            .filter(name => name.toLowerCase().includes(input));
        setExecutorSuggestions(filterExecutor ? matches.slice(0, 5) : []);
    }, [filterExecutor, users]);

    useEffect(() => {
        const input = filterAuthor.toLowerCase();
        const matches = users
            .map(u => getUserName(u.id))
            .filter(name => name.toLowerCase().includes(input));
        setAuthorSuggestions(filterAuthor ? matches.slice(0, 5) : []);
    }, [filterAuthor, users]);


    const getUserName = (id: number) => {
        const u = users.find(u => u.id === id);
        return u ? `${u.lastName} ${u.firstName}` : '—';
    };

    const getTypeName = (id: number) => {
        return typeOptions.find(t => t.id === id)?.name || '—';
    };


    // const getStatusName = (id: number) => {
    //     return statusOptions.find(s => s.id === id)?.name || '';
    // };

    const filteredTasks = tasks.filter(t => {
        if (t.parentId) return false;

        const executor = getUserName(t.executorId).toLowerCase();
        const author = getUserName(t.authorId).toLowerCase();
        const type = getTypeName(t.typeId);

        return (
            (!filterExecutor || executor.includes(filterExecutor.toLowerCase())) &&
            (!filterAuthor || author.includes(filterAuthor.toLowerCase())) &&
            (!filterType || type === filterType) &&
            (!onlyMyTasks || t.authorId === user.id || t.executorId === user.id)
        );
    });

    const grouped = statusOptions.reduce((acc, status) => {
        acc[status.id] = filteredTasks.filter(t => t.statusId === status.id);
        return acc;
    }, {} as Record<number, any[]>);


    const handleDragEnd = async (result: any) => {
        const { destination, source, draggableId } = result;
        if (!destination || destination.droppableId === source.droppableId) return;

        const taskId = Number(draggableId);
        const newStatusId = Number(destination.droppableId);

        await updateTask(taskId, { statusId: newStatusId });
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, statusId: newStatusId } : t
        ));
    };

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f4f5f7', minHeight: '100vh' }}>
            <div className="row mb-3 g-2">
                {/* Исполнитель */}
                <div className="col-md-3 position-relative">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Фильтр по исполнителю"
                        value={filterExecutor}
                        onChange={e => setFilterExecutor(e.target.value)}
                    />
                    {executorSuggestions.length > 0 && (
                        <div className="list-group position-absolute w-100" style={{ zIndex: 1000, top: '100%' }}>
                            {executorSuggestions.map((name, i) => (
                                <div
                                    key={i}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => {
                                        setFilterExecutor(name);
                                        setTimeout(() => setExecutorSuggestions([]), 0);
                                    }}
                                >
                                    {name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Заказчик */}
                <div className="col-md-3 position-relative">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Фильтр по заказчику"
                        value={filterAuthor}
                        onChange={e => setFilterAuthor(e.target.value)}
                    />
                    {authorSuggestions.length > 0 && (
                        <div className="list-group position-absolute w-100" style={{ zIndex: 1000, top: '100%' }}>
                            {authorSuggestions.map((name, i) => (
                                <div
                                    key={i}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => {
                                        setFilterAuthor(name);
                                        setTimeout(() => setAuthorSuggestions([]), 0);
                                    }}
                                >
                                    {name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Тип задачи */}
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                    >
                        <option value="">Все типы</option>
                        {typeOptions.map((t: any) => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                    </select>
                </div>

                {/* Мои задачи */}
                <div className="col-md-3 d-flex align-items-center">
                    <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={onlyMyTasks}
                        onChange={() => setOnlyMyTasks(!onlyMyTasks)}
                        id="myTasksFilter"
                    />
                    <label className="form-check-label" htmlFor="myTasksFilter">Мои задачи</label>
                </div>
            </div>


            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="d-flex gap-4 overflow-auto">
                    {statusOptions.map((status) => {
                        //const key = status.name.toLowerCase().trim();
                        //const bg = statusColors[key] || '#f1f1f1';

                        return (
                            <Droppable droppableId={String(status.id)} key={status.id}>
                                {(provided) => (
                                    <div
                                        className="rounded shadow-sm flex-grow-1 p-2"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        style={{
                                            minWidth: '280px',
                                            minHeight: '90vh',
                                            backgroundColor:
                                                status.id === 1 ? '#e3f2fd' :
                                                    status.id === 2 ? '#fff3cd' :
                                                        status.id === 3 ? '#d4edda' :
                                                            status.id === 4 ? '#f8d7da' :
                                                                '#f1f1f1'
                                        }}
                                    >
                                        <h5 className="text-center fw-bold">{status.name}</h5>
                                        {grouped[status.id]?.map((task, index) => (
                                            <Draggable draggableId={String(task.id)} index={index} key={task.id}>
                                                {(provided) => (
                                                    <div
                                                        className="card mb-2"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => navigate(`/dashboard?id=${task.id}`)}
                                                    >
                                                        <div className="card-body p-2">
                                                            <div className="fw-bold">#{task.id} {task.title}</div>
                                                            <div className="small text-muted"><strong>Тип:</strong> {getTypeName(task.typeId)}</div>
                                                            <div className="small text-muted"><strong>Исполнитель:</strong> {getUserName(task.executorId)}</div>
                                                            <div className="small text-muted"><strong>Заказчик:</strong> {getUserName(task.authorId)}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
}
