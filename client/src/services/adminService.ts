const token = localStorage.getItem('token');
const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

export async function fetchTaskTypes(): Promise<{ id: number; name: string }[]> {
    const res = await fetch('/api/admin/types', { headers });
    return res.json();
}

export async function fetchTaskStatuses(): Promise<{ id: number; name: string }[]> {
    const res = await fetch('/api/admin/statuses', { headers });
    return res.json();
}

export async function fetchAllUsers(): Promise<{
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    middleName: string;
    roleId: number;
    UserRole?: { name: string };
}[]> {
    const res = await fetch('/api/users', { headers });
    return res.json();
}

export async function fetchRoles(): Promise<{ id: number; name: string }[]> {
    const res = await fetch('/api/admin/roles', { headers });
    return res.json();
}

export async function addTaskType(name: string): Promise<any> {
    const res = await fetch('/api/admin/types', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name })
    });
    return res.json();
}

export async function addTaskStatus(name: string): Promise<any> {
    const res = await fetch('/api/admin/statuses', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name })
    });
    return res.json();
}

export async function addUser(user: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    middleName: string;
    roleId: number;
}): Promise<any> {
    const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers,
        body: JSON.stringify(user)
    });
    return res.json();
}
