import { useState } from "react";
import api from "../services/api";
import "./FeedbackFooter.css";

function getSavedProfile() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null") || {};
  } catch {
    return {};
  }
}

function FeedbackFooter() {
  const [profile] = useState(getSavedProfile);
  const [formData, setFormData] = useState({
    type: "Feedback",
    name: profile.name || "",
    email: profile.email || "",
    message: "",
  });
  const [status, setStatus] = useState({ message: "", isError: false });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ message: "", isError: false });

    try {
      const response = await api.post("/feedback", formData);
      setStatus({ message: response.data.message, isError: false });
      setFormData((current) => ({ ...current, message: "" }));
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || "Could not send your message. Please try again.",
        isError: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="site-feedback-footer">
      <div className="feedback-footer-content">
        <div className="feedback-footer-heading">
          <h2>Feedback &amp; reports</h2>
          <p>Send a note directly to our team.</p>
        </div>

        <form className="feedback-footer-form" onSubmit={handleSubmit}>
          <label className="feedback-footer-field">
            <span>Type</span>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Feedback">Feedback</option>
              <option value="Report">Report a problem</option>
            </select>
          </label>

          <label className="feedback-footer-field">
            <span>Name</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
              autoComplete="name"
              placeholder="Your name (optional)"
            />
          </label>

          <label className="feedback-footer-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={254}
              autoComplete="email"
              placeholder="For a reply (optional)"
            />
          </label>

          <label className="feedback-footer-field feedback-footer-message">
            <span>Message</span>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              maxLength={3000}
              rows={3}
              required
              placeholder="What would you like us to know?"
            />
          </label>

          <div className="feedback-footer-submit">
            {status.message && (
              <p
                className={status.isError ? "feedback-error" : "feedback-success"}
                role="status"
              >
                {status.message}
              </p>
            )}
            <button type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
}

export default FeedbackFooter;