import { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Progress() {
  const { token } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProblems = await api.get("/api/problems");
        setProblems(allProblems.data);

        const progRes = await api.get("/api/problems/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProgress(progRes.data.progress || []);
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };
    fetchData();
  }, [token]);

  const completedCount = progress.length;
  const totalCount = problems.length;
  const overallPercent = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  const topicStats = problems.reduce((acc, prob) => {
    const topicList = prob.topic ? [prob.topic] : prob.topics || [];

    topicList.forEach((topic) => {
      if (!acc[topic]) {
        acc[topic] = { total: 0, done: 0 };
      }
      acc[topic].total++;
      if (progress.includes(prob._id || prob.id)) {
        acc[topic].done++;
      }
    });

    return acc;
  }, {});

  return (
    <div className="progress-page">
      <h2 className="title">📊 Your Progress</h2>

      <div className="overall-progress">
        <h3>Overall Completion</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${overallPercent}%` }}
          ></div>
        </div>
        <p>
          {completedCount} / {totalCount} problems solved ({overallPercent}%)
        </p>
      </div>

      <div className="topic-progress">
        <h3>Topic-wise Progress</h3>
        {Object.entries(topicStats).map(([topic, stats]) => {
          const percent = Math.round((stats.done / stats.total) * 100);
          return (
            <div key={topic} className="topic-row">
              <span className="topic-name">{topic}</span>
              <div className="progress-bar small">
                <div
                  className="progress-fill"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <span className="topic-percent">
                {stats.done}/{stats.total} ({percent}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
