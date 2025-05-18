// Dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  fetchTasks,
  fetchTaskTypes,
  fetchTaskStatuses,
  updateTask,
  fetchComments,
  addComment,
  fetchSubtasks
} from '../services/taskService';

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [subtasks, setSubtasks] = useState<any[]>([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const init = async () => {
      const role = user.role;
      const tasksData = await fetchTasks(role);
      setTasks(tasksData.tasks || tasksData);

      const types = await fetchTaskTypes();
      setTypeOptions(types.map((t: any) => t.name));

      const statuses = await fetchTaskStatuses();
      setStatusOptions(statuses.map((s: any) => s.name));
    };

    init();
  }, []);

  const handleTaskClick = async (task: any) => {
    setSelectedTask(task);
    const c = await fetchComments(task.id);
    const s = await fetchSubtasks(task.id);
    setComments(c);
    setSubtasks(s);
  };

  const handleUpdateField = async (field: string, value: string) => {
    if (!selectedTask) return;

    const updated = { ...selectedTask };
    if (field === 'status') updated.statusId = statusOptions.findIndex(s => s === value) + 1;
    if (field === 'type') updated.typeId = typeOptions.findIndex(t => t === value) + 1;

    await updateTask(selectedTask.id, updated);
    window.location.reload();
  };

  return (
      <div className="container-fluid mt-4">
        <div className="row">
          {/* Список задач */}
          <div className="col-md-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {tasks.map(task => (
                <div
                    key={task.id}
                    className={`card mb-2 ${selectedTask?.id === task.id ? 'border-primary' : ''}`}
                    onClick={() => handleTaskClick(task)}
                    style={{ cursor: 'pointer' }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{task.title}</h5>
                    <p className="card-text">
                      <span className="badge bg-secondary me-2">{task.TaskType?.name}</span>
                      <span className="badge bg-info">{task.TaskStatus?.name}</span>
                    </p>
                    <p className="card-text small">Исполнитель: {task.executor?.username || 'не назначен'}</p>
                  </div>
                </div>
            ))}
          </div>

          {/* Развёрнутая задача */}
          <div className="col-md-8">
            {selectedTask && (
                <div className="card">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">TASK-{selectedTask.id}: {selectedTask.title}</h5>
                  </div>
                  <div className="card-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                    <div className="mb-2">
                      <strong>Тип:</strong>
                      <select
                          className="form-select form-select-sm w-auto d-inline ms-2"
                          value={selectedTask.TaskType?.name || ''}
                          onChange={e => handleUpdateField("type", e.target.value)}
                      >
                        {typeOptions.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <strong>Статус:</strong>
                      <select
                          className="form-select form-select-sm w-auto d-inline ms-2"
                          value={selectedTask.TaskStatus?.name || ''}
                          onChange={e => handleUpdateField("status", e.target.value)}
                      >
                        {statusOptions.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <strong>Автор:</strong> {selectedTask.author?.username || '—'}
                    </div>
                    <div className="mb-2">
                      <strong>Исполнитель:</strong> {selectedTask.executor?.username || 'не назначен'}
                    </div>
                    <div className="mb-3">
                      <strong>Описание:</strong>
                      <p>{selectedTask.description}</p>
                    </div>

                    {/* Подзадачи */}
                    <div className="mb-4">
                      <strong>Подзадачи:</strong>
                      <ul className="list-group">
                        {subtasks.map(sub => (
                            <li
                                key={sub.id}
                                className="list-group-item list-group-item-action"
                                onClick={() => handleTaskClick(sub)}
                                style={{ cursor: 'pointer' }}
                            >
                              {sub.title} — <em>{sub.TaskStatus?.name}</em> — {sub.executor?.username || 'не назначен'}
                            </li>
                        ))}
                      </ul>
                    </div>

                    {/* Комментарии */}
                    <div>
                      <strong>Комментарии:</strong>
                      <div className="border p-2 mb-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {comments.map(c => (
                            <div key={c.id} className="border-bottom py-1">
                              <strong>{c.user?.fullName || c.user?.username}</strong>
                              <p className="mb-1">{c.content}</p>
                            </div>
                        ))}
                      </div>
                      <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Новый комментарий"
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={handleCommentSubmit}>Отправить</button>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
