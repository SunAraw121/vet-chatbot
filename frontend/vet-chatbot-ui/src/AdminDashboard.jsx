import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const hostname = window.location.hostname;
            const apiBase = (hostname === "localhost" || hostname === "127.0.0.1")
                ? "http://localhost:4000/api"
                : (hostname.includes("onrender.com") ? "/api" : "https://vet-chatbot-backend-uon9.onrender.com/api");

            const response = await axios.get(`${apiBase}/appointments`);
            setAppointments(response.data);
        } catch (err) {
            console.error("Failed to fetch appointments", err);
            setError("Could not load appointments. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>🏥 Veterinary Admin</h1>
                <p style={subtitleStyle}>Manage your booked appointments and pet care schedules.</p>
            </div>

            <div style={contentStyle}>
                {loading && (
                    <div style={loadingContainer}>
                        <div className="spinner"></div>
                        <p>Fetching appointments...</p>
                    </div>
                )}

                {error && <div style={errorStyle}>{error}</div>}

                {!loading && !error && (
                    <div style={tableWrapper}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Owner Name</th>
                                    <th style={thStyle}>Pet Name</th>
                                    <th style={thStyle}>Phone Number</th>
                                    <th style={thStyle}>Date & Time</th>
                                    <th style={thStyle}>Booked On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={emptyStyle}>No appointments found.</td>
                                    </tr>
                                ) : (
                                    appointments.map((apt) => (
                                        <tr key={apt._id} style={rowStyle}>
                                            <td style={tdStyle}><strong>{apt.ownerName}</strong></td>
                                            <td style={tdStyle}>{apt.petName}</td>
                                            <td style={tdStyle}>{apt.phone}</td>
                                            <td style={tdStyle}>{apt.datetime}</td>
                                            <td style={tdStyle}>{new Date(apt.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                .spinner {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border-left-color: #6366f1;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

// --- Styles ---
const containerStyle = {
    padding: '40px 20px',
    maxWidth: '1100px',
    margin: '0 auto',
    fontFamily: "'Inter', system-ui, sans-serif",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
};

const headerStyle = {
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '20px'
};

const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: 0,
    color: '#111827'
};

const subtitleStyle = {
    color: '#6b7280',
    fontSize: '1.1rem',
    marginTop: '8px'
};

const contentStyle = {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    border: '1px solid #f3f4f6'
};

const tableWrapper = {
    overflowX: 'auto'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
};

const thStyle = {
    backgroundColor: '#f9fafb',
    padding: '16px 24px',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '2px solid #e5e7eb'
};

const tdStyle = {
    padding: '20px 24px',
    fontSize: '1rem',
    color: '#111827',
    borderBottom: '1px solid #f3f4f6'
};

const rowStyle = {
    transition: 'background 0.2s',
    '&:hover': {
        backgroundColor: '#f9fafb'
    }
};

const emptyStyle = {
    padding: '40px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '1.1rem'
};

const loadingContainer = {
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    color: '#6b7280'
};

const errorStyle = {
    padding: '40px',
    textAlign: 'center',
    color: '#ef4444',
    background: '#fef2f2',
    margin: '20px',
    borderRadius: '8px'
};

export default AdminDashboard;
