import React from "react";

const TaskDetails = ({ task }: any) => {
    if (!task) return <div className="task-details">Выберите задачу</div>;

    return (
        <div className="task-details">
            <h2>{task.title}</h2>
            <p><strong>Описание:</strong> {task.description}</p>
            <p><strong>Тип:</strong> {task.TaskType?.name}</p>
            <p><strong>Статус:</strong> {task.TaskStatus?.name}</p>
            <p><strong>Исполнитель:</strong> {task.executor?.username || '—'}</p>
        </div>
    );
};
export default TaskDetails;