// Assuming you're using React, make a GET request to fetch profile data
import { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/profile', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setProfileData(response.data);
        })
        .catch(error => {
            console.error("There was an error fetching the profile data!", error);
        });
    }, []);

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{profileData.name}'s Profile</h1>
            <p>Email: {profileData.email}</p>
            <p>Role: {profileData.role}</p>

            <h2>Enrolled Classes</h2>
            {profileData.enrolled_classes.length > 0 ? (
                <ul>
                    {profileData.enrolled_classes.map((classInfo) => (
                        <li key={classInfo.class_id}>
                            <strong>{classInfo.class_name}</strong> - {classInfo.schedule}
                            <p>Status: {classInfo.status}</p>
                            <p>Timestamp: {new Date(classInfo.timestamp).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No classes enrolled yet.</p>
            )}
        </div>
    );
}

export default Profile;
