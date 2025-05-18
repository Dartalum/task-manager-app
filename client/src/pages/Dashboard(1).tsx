
import React, { useEffect, useState } from 'react';
import {
  fetchTasks,
  fetchTaskTypes,
  fetchTaskStatuses,
  updateTask,
  fetchComments,
  addComment,
  fetchAllUsers
} from '../services/taskService';

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const [statusOptions, setStatusOptions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const init = async () => {
      const role = user.role;
      const tasksData = await fetchTasks(role);
      setTasks(tasksData.tasks || tasksData);

      const types = await fetchTaskTypes();
      setTypeOptions(types);

      const statuses = await fetchTaskStatuses();
      setStatusOptions(statuses);

      const allUsers = await fetchAllUsers();
      setUsers(allUsers);
    };
    init();
  }, []);

  const getSubtasks = (taskId: number) =>
    tasks.filter(t => t.parentId === taskId);

  const handleTaskClick = async (task: any) => {
    setSelectedTask(task);
    const c = await fetchComments(task.id);
    setComments(c);
  };

  const handleUpdateField = async (field: string, value: any) => {
    if (!selectedTask) return;
    const update = { [field]: value };
    await updateTask(selectedTask.id, update);
    const updated = tasks.map(t =>
      t.id === selectedTask.id ? { ...t, ...update } : t
    );
    setTasks(updated);
    setSelectedTask({ ...selectedTask, ...update });
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !selectedTask) return;
    await addComment(selectedTask.id, commentText);
    const c = await fetchComments(selectedTask.id);
    setComments(c);
    setCommentText('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Задачи</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded max-h-[75vh] overflow-y-auto">
          {tasks
            .filter(t => !t.parentId)
            .map(task => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className={`p-3 border-b cursor-pointer hover:bg-blue-50 ${
                  selectedTask?.id === task.id ? 'bg-blue-100' : ''
                }`}
              >
                <div className="font-semibold">{task.title}</div>
                <div className="text-sm text-gray-600">
                  Тип: {task.type?.name || '-'}, Статус: {task.status?.name || '-'}
                </div>
              </div>
            ))}
        </div>

        {selectedTask && (
          <div className="md:col-span-2 border-2 border-blue-400 rounded-2xl p-4 shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4">{selectedTask.title}</h2>

            <div className="mb-3">
              <label className="block font-semibold">Тип задачи:</label>
              <select
                className="p-2 border rounded w-full"
                value={selectedTask.typeId || ''}
                onChange={e =>
                  handleUpdateField('typeId', Number(e.target.value))
                }
              >
                {typeOptions.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block font-semibold">Статус:</label>
              <select
                className="p-2 border rounded w-full"
                value={selectedTask.statusId || ''}
                onChange={e =>
                  handleUpdateField('statusId', Number(e.target.value))
                }
              >
                {statusOptions.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block font-semibold">Исполнитель:</label>
              <select
                className="p-2 border rounded w-full"
                value={selectedTask.executorId || ''}
                onChange={e =>
                  handleUpdateField('executorId', Number(e.target.value))
                }
              >
                <option value="">Не назначен</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.lastName} {u.firstName} {u.middleName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Подзадачи</h3>
              <ul className="list-disc pl-5">
                {getSubtasks(selectedTask.id).map(sub => (
                  <li
                    key={sub.id}
                    className="cursor-pointer hover:underline"
                    onClick={() => handleTaskClick(sub)}
                  >
                    {sub.title} — {sub.status?.name || '-'}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Комментарии</h3>
              <div className="max-h-40 overflow-y-auto mt-2 border rounded p-2 bg-gray-50">
                {comments.map(c => (
                  <div key={c.id} className="border-b py-1 text-sm">
                    <strong>{c.authorName}: </strong> {c.text}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  className="flex-1 p-2 border rounded"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Добавить комментарий"
                />
                <button
                  onClick={handleCommentSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
