import React, { useEffect, useState } from 'react';
import '../../styles/client/ClientApplications.css';
import axios from 'axios';

const ProjectApplications = () => {
  const [applications, setApplications] = useState([]);
  const [displayApplications, setDisplayApplications] = useState([]);
  const [projectTitles, setProjectTitles] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:6001/fetch-applications");
      const filteredApps = response.data.filter(
        (application) => application.clientId === localStorage.getItem("userId")
      );
      setApplications(filteredApps);
      setDisplayApplications([...filteredApps].reverse()); // Reverse to show latest first
      console.log("Fetched Applications:", filteredApps); // Debugging log
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  useEffect(() => {
    const uniqueTitles = [...new Set(applications.map((app) => app.title))];
    setProjectTitles(uniqueTitles);
  }, [applications]);

  const handleFilterChange = (value) => {
    setProjectFilter(value); // Update filter state
    if (value === '') {
      setDisplayApplications([...applications].reverse());
    } else {
      const filtered = applications.filter((application) => application.title === value);
      setDisplayApplications([...filtered].reverse());
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.get(`http://localhost:6001/approve-application/${id}`);
      alert("Application approved");
      fetchApplications();
    } catch (err) {
      alert("Operation failed!!");
      console.error("Error approving application:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.get(`http://localhost:6001/reject-application/${id}`);
      alert("Application rejected!!");
      fetchApplications();
    } catch (err) {
      alert("Operation failed!!");
      console.error("Error rejecting application:", err);
    }
  };

  return (
    <div className="client-applications-page">
      <h3>Applications</h3>

      {projectTitles.length > 0 && (
        <select
          className="form-control"
          value={projectFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="">All Projects</option>
          {projectTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      )}

      <div className="client-applications-body">
        {displayApplications.length > 0 ? (
          displayApplications.map((application) => (
            <div className="client-application" key={application._id}>
              <div className="client-application-body">
                <div className="client-application-half">
                  <h4>{application.title}</h4>
                  <p>{application.description}</p>
                  <span>
                    <h5>Skills</h5>
                    <div className="application-skills">
                      {application.requiredSkills.map((skill) => (
                        <p key={skill}>{skill}</p>
                      ))}
                    </div>
                  </span>
                  <h6>Budget - &#8377; {application.budget}</h6>
                </div>

                <div className="vertical-line"></div>

                <div className="client-application-half">
                  <span>
                    <h5>Proposal</h5>
                    <p>{application.proposal}</p>
                  </span>
                  <span>
                    <h5>Freelancer Skills</h5>
                    <div className="application-skills">
                      {application.freelancerSkills.map((skill) => (
                        <p key={skill}>{skill}</p>
                      ))}
                    </div>
                  </span>
                  <h6>Proposed Budget - &#8377; {application.bidAmount}</h6>
                  <div className="approve-btns">
                    {application.status === 'Pending' ? (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => handleApprove(application._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleReject(application._id)}
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <h6>
                        Status: <b>{application.status}</b>
                      </h6>
                    )}
                  </div>
                </div>
              </div>
              <hr />
            </div>
          ))
        ) : (
          <p>No applications available.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectApplications;
