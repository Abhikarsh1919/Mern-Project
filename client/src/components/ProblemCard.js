import { CCard, CCardBody, CCardHeader, CFormCheck } from "@coreui/react";

export default function ProblemCard({ problem, done, onToggle }) {
  return (
    <CCard
      className={`shadow-sm ${done ? "border-success" : ""}`}
      style={{
        borderLeft: done ? "5px solid #28a745" : "5px solid transparent",
      }}
    >
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">{problem.title}</h6>
        <span
          className={`badge ${
            problem.level === "Easy"
              ? "bg-success"
              : problem.level === "Medium"
              ? "bg-warning text-dark"
              : "bg-danger"
          }`}
        >
          {problem.level}
        </span>
      </CCardHeader>

      <CCardBody>
        <div className="d-flex gap-3 mb-3">
          <a
            href={problem.lc}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-primary"
          >
            🔗 LeetCode
          </a>
          {problem.yt && (
            <a
              href={problem.yt}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-danger"
            >
              🎥 YouTube
            </a>
          )}
        </div>

        <CFormCheck
          type="checkbox"
          label={done ? "Completed ✅" : "Mark as Done"}
          checked={done}
          onChange={onToggle}
        />
      </CCardBody>
    </CCard>
  );
}
