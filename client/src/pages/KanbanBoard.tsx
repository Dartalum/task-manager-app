import React, { useState } from "react";
import { mockTasks } from "./mockTasks";

export default function KanbanBoard() {
  const [executorFilter, setExecutorFilter] = useState("");

  const statuses = ["новая", "в работе", "завершена", "отменена"];

  const filteredTasks = mockTasks.filter(task => {
    return !executorFilter ||
      task.executor.username.includes(executorFilter) ||
      task.executor.email.includes(executorFilter) ||
      task.executor.fullName.toLowerCase().includes(executorFilter.toLowerCase());
  });

  const grouped = statuses.reduce((acc, status) => {
    acc[status] = filteredTasks.filter(task => task.status === status);
    return acc;
  }, {} as Record<string, typeof mockTasks>);

  return (
    <div className="container-fluid mt-4">
      <h4 className="mb-3">Kanban</h4>
      <div className="mb-3 col-md-4">
        <input
          type="text"
          className="form-control"
          placeholder="Фильтр по исполнителю"
          value={executorFilter}
          onChange={(e) => setExecutorFilter(e.target.value)}
        />
      </div>

      <div className="row" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        {statuses.map(status => (
          <div key={status} className="col-md-3" style={{ minWidth: "260px" }}>
            <div className="bg-light p-2 rounded mb-2 fw-semibold text-center text-capitalize">
              {status}
            </div>
            {grouped[status].map(task => (
              <div key={task.id} className="card mb-2">
                <div className="card-body">
                  <h6 className="card-title mb-1">{task.title}</h6>
                  <p className="card-text small text-muted mb-1">
                    Автор: {task.author.fullName}<br />
                    Исполнитель: {task.executor.fullName}
                  </p>
                  <span className={`badge-status ${task.status.replace(" ", "-")}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}