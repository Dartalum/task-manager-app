import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import KanbanBoard from '../pages/KanbanBoard';
import CreateTask from '../pages/CreateTask';
import AdminPanel from "../pages/AdminPanel.tsx";


export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
    );
}
