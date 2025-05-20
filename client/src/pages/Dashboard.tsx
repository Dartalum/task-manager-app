import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  fetchTasks,
  fetchTaskTypes,
  fetchTaskStatuses,
  updateTask,
  fetchComments,
  addComment,
  fetchAllUsers
} from '../services/taskService';

const CLOSED_STATUS_ID = 3;

export default function Dashboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedIdFromUrl = params.get('id');
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [previousTask, setPreviousTask] = useState<any | null>(null);
  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [filterExecutor, setFilterExecutor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);
  

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const init = async () => {
      const tasksData = await fetchTasks();
      setTasks(tasksData.tasks || tasksData);
      setTypeOptions(await fetchTaskTypes());
      setStatusOptions(await fetchTaskStatuses());
      setUsers(await fetchAllUsers());
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedIdFromUrl && tasks.length && !selectedTask) {
      const task = tasks.find(t => t.id === Number(selectedIdFromUrl));
      if (task) {
        handleTaskClick(task).then(r => console.log(r));
      }
    }
  }, [selectedIdFromUrl, tasks, selectedTask]);


  const handleTaskClick = async (task: any, fromSubtask = false) => {
    if (fromSubtask) {
      setPreviousTask(selectedTask);
    } else {
      setPreviousTask(null);
    }
    setSelectedTask(task);
    setComments(await fetchComments(task.id));
  };

  const handleUpdateTask = async (field: string, value: any) => {
    if (!selectedTask) return;
    const updated = { ...selectedTask, [field]: value };
    setSelectedTask(updated);
    setTasks(prev =>
        prev.map(t => t.id === selectedTask.id ? { ...t, [field]: value } : t)
    );
    await updateTask(selectedTask.id, { [field]: value });
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !selectedTask) return;
    await addComment(selectedTask.id, commentText);
    const updated = await fetchComments(selectedTask.id);
    setComments(Array.isArray(updated) ? updated : []);
    setCommentText('');
  };

  const getUserName = (id: number) => {
    const u = users.find(u => u.id === id);
    return u ? `${u.lastName} ${u.firstName}` : 'Неизвестно';
  };

  const filteredTasks = tasks.filter(t => {
    const executor = getUserName(t.executorId).toLowerCase();
    const status = statusOptions.find(s => s.id === t.statusId)?.name || '';
    const type = typeOptions.find(tp => tp.id === t.typeId)?.name || '';
    return (
        (!t.parentId) &&
        (!filterExecutor || executor.includes(filterExecutor.toLowerCase())) &&
        (!filterStatus || status === filterStatus) &&
        (!filterType || type === filterType) &&
        (!onlyMyTasks || t.authorId === user.id || t.executorId === user.id)
    );
  });

  return (
      <div className="container-fluid p-4" style={{ backgroundColor: '#f4f5f7', minHeight: '100vh' }}>
        <h3 className="mb-4">Задачи</h3>

        {/* Фильтры */}
        <div className="row mb-4 g-2">
          <div className="col-md-3">
            <input
                type="text"
                className="form-control"
                placeholder="Фильтр по исполнителю"
                value={filterExecutor}
                onChange={e => setFilterExecutor(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Все статусы</option>
              {statusOptions.map((s: any) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="">Все типы</option>
              {typeOptions.map((t: any) => (
                  <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-center">
            <input type="checkbox" className="form-check-input me-2" id="myTasks" checked={onlyMyTasks} onChange={() => setOnlyMyTasks(!onlyMyTasks)} />
            <label className="form-check-label" htmlFor="myTasks">Мои задачи</label>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="d-flex flex-column gap-3">
              {filteredTasks.map(task => (
                  <div
                      key={task.id}
                      className={`card shadow-sm ${selectedTask?.id === task.id ? 'border-primary' : ''}`}
                      onClick={() => handleTaskClick(task)}
                      style={{ cursor: 'pointer' }}
                  >
                    <div className="card-body">
                      <h5 className="card-title mb-2">#{task.id} {task.title}</h5>
                      <div className="text-muted small"><strong>Заказчик:</strong> {getUserName(task.authorId)}</div>
                      <div className="text-muted small"><strong>Исполнитель:</strong> {getUserName(task.executorId)}</div>
                      <div className="text-muted small"><strong>Статус:</strong> {statusOptions.find(s => s.id === task.statusId)?.name || '—'}</div>
                      <div className="text-muted small"><strong>Тип:</strong> {typeOptions.find(tp => tp.id === task.typeId)?.name || '—'}</div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          <div className="col-md-8">
            {selectedTask && (
                <div className="card shadow-sm p-4">
                  {previousTask && (
                      <button className="btn btn-sm btn-outline-secondary mb-3" onClick={() => handleTaskClick(previousTask)}>
                        ← Назад к задаче #{previousTask.id}
                      </button>
                  )}
                  <h4 className="mb-3">#{selectedTask.id} {selectedTask.title}</h4>

                  <div className="mb-2 text-muted small">Создана: {new Date(selectedTask.createdAt).toLocaleString()}</div>
                  {selectedTask.statusId === CLOSED_STATUS_ID && (
                      <div className="mb-2 text-muted small">Закрыта: {new Date(selectedTask.updatedAt).toLocaleString()}</div>
                  )}

                  <div className="mb-3">
                    <label className="form-label"><strong>Описание</strong></label>
                    <textarea
                        className="form-control"
                        value={selectedTask.description}
                        rows={3}
                        onChange={e => handleUpdateTask('description', e.target.value)}
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label"><strong>Тип</strong></label>
                      <select className="form-select" value={selectedTask.typeId} onChange={e => handleUpdateTask('typeId', Number(e.target.value))}>
                        {typeOptions.map((t: any) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label"><strong>Статус</strong></label>
                      <select className="form-select" value={selectedTask.statusId} onChange={e => handleUpdateTask('statusId', Number(e.target.value))}>
                        {statusOptions.map((s: any) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label"><strong>Исполнитель</strong></label>
                      <select className="form-select" value={selectedTask.executorId} onChange={e => handleUpdateTask('executorId', Number(e.target.value))}>
                        <option value="">—</option>
                        {users.map((u: any) => (
                            <option key={u.id} value={u.id}>{getUserName(u.id)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {tasks.some(t => t.parentId === selectedTask.id) && (
                      <div className="mt-4">
                        <h5>Подзадачи</h5>
                        <div className="list-group">
                          {tasks.filter(t => t.parentId === selectedTask.id).map(sub => (
                              <div
                                  key={sub.id}
                                  className="list-group-item list-group-item-action d-flex justify-content-between"
                                  onClick={() => handleTaskClick(sub, true)}
                                  style={{ cursor: 'pointer' }}
                              >
                                <span>#{sub.id} {sub.title}</span>
                                <span className="text-muted small">
                          {statusOptions.find(s => s.id === sub.statusId)?.name || '—'}
                        </span>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}

                  <hr className="my-4" />
                  <h5>Комментарии</h5>
                  <div className="mb-3" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                    {comments.map((c: any) => (
                        <div key={c.id} className="d-flex mb-4">
                          <div className="me-3">
                            <div className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
                              {c.User?.firstName?.[0] ?? 'U'}
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center">
                              <strong>{c.User ? `${c.User.lastName} ${c.User.firstName}` : 'Неизвестный пользователь'}</strong>
                              <small className="text-muted">{new Date(c.createdAt).toLocaleString()}</small>
                            </div>
                            <div className="bg-light border rounded p-2 mt-1">
                              {c.content}
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                  <div className="input-group">
                    <input
                        className="form-control"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Введите комментарий"
                    />
                    <button className="btn btn-primary" onClick={handleCommentSubmit}>
                      Отправить
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}