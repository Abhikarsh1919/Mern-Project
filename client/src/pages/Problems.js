import { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import ProblemCard from "../components/ProblemCard";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CSpinner,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CProgress,
} from "@coreui/react";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/problems");
        setProblems(res.data || []);

        const progRes = await api.get("/api/problems/progress", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProgress(progRes.data.progress || []);
        setStats({
          total: progRes.data.total || 0,
          completed: progRes.data.completed || 0,
          percentage: progRes.data.percentage || 0,
        });
      } catch (err) {
        console.error("Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const toggleProgress = async (id, done) => {
    const prevProgress = [...progress];
    const updated = done
      ? prevProgress.filter((p) => p !== id)
      : [...prevProgress, id];

    setProgress(updated);

    try {
      const res = await api.post(
        "/api/problems/progress",
        { progress: updated },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProgress(res.data.progress || updated);
      setStats({
        total: res.data.total || 0,
        completed: res.data.completed || (res.data.progress || []).length,
        percentage: res.data.percentage || 0,
      });
    } catch (err) {
      console.error("Error updating progress:", err);
      setProgress(prevProgress);
    }
  };

  const grouped = problems.reduce((acc, p) => {
    const topic = p.topic || "Misc";
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(p);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <CContainer className="mt-4">
      <h3 className="text-center mb-4">DSA Topics</h3>
      <center>
        <p style={{ marginTop: "-10px" }}>Explore these exciting topics!</p>
      </center>
      <CCard className="mb-4">
        <CCardBody>
          <h5>Overall Progress</h5>
          <CProgress className="mb-2" value={stats.percentage} />
          <small>
            {stats.completed} of {stats.total} problems completed (
            {stats.percentage}%)
          </small>
        </CCardBody>
      </CCard>

      <CAccordion alwaysOpen>
        {Object.keys(grouped).map((topic, idx) => {
          const topicProblems = grouped[topic];
          const completedCount = topicProblems.filter((p) =>
            progress.includes(p._id || p.id)
          ).length;

          return (
            <CAccordionItem key={topic} itemKey={idx}>
              <CAccordionHeader>
                <span style={{ flex: 1 }}>
                  <strong>{topic}</strong>
                </span>
                <span>
                  {completedCount}/{topicProblems.length}{" "}
                  <span style={{ paddingRight: "8px" }}>✅</span>
                </span>
              </CAccordionHeader>
              <CAccordionBody>
                <CRow>
                  {topicProblems.map((p) => {
                    const problemId = p._id || p.id;
                    const done = progress.includes(problemId);
                    return (
                      <CCol md={6} lg={4} key={problemId} className="mb-3">
                        <ProblemCard
                          problem={p}
                          done={done}
                          onToggle={() => toggleProgress(problemId, done)}
                        />
                      </CCol>
                    );
                  })}
                </CRow>
              </CAccordionBody>
            </CAccordionItem>
          );
        })}
      </CAccordion>
    </CContainer>
  );
}
