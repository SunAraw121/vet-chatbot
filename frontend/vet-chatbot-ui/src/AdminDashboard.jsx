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
            const response = await axios.get('https://vet-chatbot-backend-uon9.onrender.com/api/appointments');
            setAppointments(response.data);
        } catch (err) {
            console.error("Failed to fetch appointments", err);
            setError("Could not load appointments. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h1>🏥 Veterinary Admin Dashboard</h1>
            <p>View all booked appointments below.</p>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                            <th style={thStyle}>Owner Name</th>
                            <th style={thStyle}>Pet Name</th>
                            <th style={thStyle}>Phone</th>
                            <th style={thStyle}>Date & Time</th>
                            <th style={thStyle}>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length === 0 ? (
                            <tr><td colSpan="5" style={tdStyle}>No appointments found.</td></tr>
                        ) : (
                            appointments.map((apt) => (
                                <tr key={apt._id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={tdStyle}>{apt.ownerName}</td>
                                    <td style={tdStyle}>{apt.petName}</td>
                                    <td style={tdStyle}>{apt.phone}</td>
                                    <td style={tdStyle}>{apt.datetime}</td>
                                    <td style={tdStyle}>{new Date(apt.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const thStyle = { padding: '12px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px' };

export default AdminDashboard;
