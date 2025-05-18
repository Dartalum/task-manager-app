
async function safeJson(res: Response, label: string) {
    const text = await res.text();
    console.log(`[${label}] raw response:`, text);

    try {
        return JSON.parse(text);
    } catch (err) {
        console.error(`[${label}] Ошибка JSON.parse:`, err);
        throw new Error("Ответ не является валидным JSON");
    }
}

export async function fetchTasks() {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/tasks/all', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    return safeJson(res, 'fetchTasks');
}

export async function fetchTaskById(taskId: number) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/tasks/${taskId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    return safeJson(res, 'fetchTaskById');
}

export async function updateTask(taskId: number, updates: any) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    return safeJson(res, 'updateTask');
}

export async function addComment(taskId: number, content: string) {
    const token = localStorage.getItem('token');
    return fetch(`/api/comments/${taskId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    }).then(res => res.json());
}

export async function fetchComments(taskId: number) {
    const token = localStorage.getItem('token');
    return fetch(`/api/comments?taskId=${taskId}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    }).then(res => res.json());
}

export async function fetchSubtasks(taskId: number) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/tasks/${taskId}/subtasks`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    return safeJson(res, 'fetchSubtasks');
}

export async function fetchTaskStatuses() {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/admin/statuses', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    return safeJson(res, 'fetchTaskStatuses');
}

export async function fetchTaskTypes() {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/admin/types', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    return safeJson(res, 'fetchTaskTypes');
}

export async function fetchAllUsers() {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/users', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    return safeJson(res, 'fetchAllUsers');
}
