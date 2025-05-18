// Универсальная обёртка для безопасного JSON-парсинга
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

export async function fetchTasks(role: string) {
    const token = localStorage.getItem('token');
    const url = role === 'admin' || role === 'executor' ? '/api/tasks/all' : '/api/tasks/my';

    const res = await fetch(url, {
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
    const res = await fetch(`/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
    });

    return safeJson(res, 'addComment');
}

export async function fetchComments(taskId: number) {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/tasks/${taskId}/comments`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    return safeJson(res, 'fetchComments');
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
