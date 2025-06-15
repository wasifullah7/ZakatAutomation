import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import './AcceptorApplications.css';

const AcceptorApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [reviewNote, setReviewNote] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.getAcceptors();
      setApplications(response.data);
    } catch (err) {
      setError('Failed to fetch applications. Please try again.');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status) => {
    if (!selectedApplication) return;

    try {
      setLoading(true);
      setError(null);
      await authAPI.approveAcceptor(selectedApplication._id, {
        status,
        reviewNote
      });
      await fetchApplications();
      setSelectedApplication(null);
      setReviewNote('');
    } catch (err) {
      setError('Failed to update application status. Please try again.');
      console.error('Error updating application:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !applications.length) {
    return <div className="loading">Loading applications...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="applications-container">
      <h1>Acceptor Applications</h1>
      
      <div className="applications-grid">
        {/* Applications List */}
        <div className="applications-list">
          <h2>Pending Applications</h2>
          {applications.length === 0 ? (
            <p>No pending applications</p>
          ) : (
            applications.map(app => (
              <div
                key={app._id}
                className={`application-card ${selectedApplication?._id === app._id ? 'selected' : ''}`}
                onClick={() => setSelectedApplication(app)}
              >
                <h3>{app.firstName} {app.lastName}</h3>
                <p>Status: <span className={`status ${app.status}`}>{app.status}</span></p>
                <p>Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>

        {/* Application Details */}
        {selectedApplication && (
          <div className="application-details">
            <h2>Application Details</h2>
            
            <div className="details-section">
              <h3>Personal Information</h3>
              <p><strong>Name:</strong> {selectedApplication.firstName} {selectedApplication.lastName}</p>
              <p><strong>Email:</strong> {selectedApplication.email}</p>
              <p><strong>Phone:</strong> {selectedApplication.phone}</p>
              <p><strong>Address:</strong> {selectedApplication.address}</p>
            </div>

            <div className="details-section">
              <h3>Zakat Eligibility</h3>
              <p><strong>National ID:</strong> {selectedApplication.nationalId}</p>
              <p><strong>Family Size:</strong> {selectedApplication.familySize}</p>
              <p><strong>Monthly Income:</strong> ${selectedApplication.monthlyIncome}</p>
              <p><strong>Monthly Expenses:</strong> ${selectedApplication.monthlyExpenses}</p>
              <p><strong>Assets:</strong> ${selectedApplication.assets}</p>
              <p><strong>Liabilities:</strong> ${selectedApplication.liabilities}</p>
            </div>

            {selectedApplication.organizationName && (
              <div className="details-section">
                <h3>Organization Information</h3>
                <p><strong>Name:</strong> {selectedApplication.organizationName}</p>
                <p><strong>Type:</strong> {selectedApplication.organizationType}</p>
                <p><strong>Registration:</strong> {selectedApplication.registrationNumber}</p>
              </div>
            )}

            <div className="details-section">
              <h3>Areas of Need</h3>
              <p><strong>Reason for Zakat:</strong> {selectedApplication.zakatReason}</p>
              <p><strong>Specific Needs:</strong> {selectedApplication.needs}</p>
            </div>

            {selectedApplication.documents?.length > 0 && (
              <div className="details-section">
                <h3>Supporting Documents</h3>
                <div className="documents-grid">
                  {selectedApplication.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="document-link"
                    >
                      Document {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="review-section">
              <h3>Review Application</h3>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Add review notes..."
                className="review-textarea"
              />
              <div className="review-buttons">
                <button
                  onClick={() => handleReview('approved')}
                  className="approve-button"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReview('rejected')}
                  className="reject-button"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptorApplications; 