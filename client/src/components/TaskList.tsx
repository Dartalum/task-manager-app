import React from "react";

const TaskList = ({ tasks, onSelect, selectedTaskId }: any) => (
    <div className="task-list">
        {tasks.map((task: any) => (
            <div
                key={task.id}
                className={`task-item ${selectedTaskId === task.id ? 'active' : ''}`}
                onClick={() => onSelect(task.id)}
            >
                {task.title}
            </div>
        ))}
    </div>
);
export default TaskList;