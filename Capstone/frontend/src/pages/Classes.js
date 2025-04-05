import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

function Classes() {
    const [classes, setClasses] = useState([]);
    const [userRole, setUserRole] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        setUserRole(localStorage.getItem("role"));
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await axios.get(`${API_URL}/classes`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClasses(res.data);
            console.log("Updated classes:", res.data); 
        } catch (error) {
            console.error("Error refreshing classes:", error);
        }
    };

    async function enrollInClass(classId) {
        try {
            const res = await axios.post(`${API_URL}/classes/${classId}/enroll`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            alert("Successfully enrolled!");
            await fetchClasses();
        } catch (error) {
            console.error("Enrollment failed:", error);
            
            // Enhanced error handling
            if (error.response) {
                // Check for a 400 error, like "Class is full"
                if (error.response.status === 400) {
                    alert(error.response.data.message || "Enrollment failed.");
                }
                // Handle other 4xx or 5xx errors
                else {
                    alert("An error occurred: " + (error.response.data.message || "Something went wrong."));
                }
            } else {
                // If no response (network error, etc.)
                alert("Network error: Please check your connection.");
            }
        }
    }

    async function unenrollFromClass(classId) {
        try {
            await axios.post(`${API_URL}/classes/${classId}/unenroll`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Successfully unenrolled!");

            // Refresh class data after unenrollment
            await fetchClasses();
        } catch (error) {
            console.error("Unenrollment failed:", error);
            alert(error.response?.data?.message || "Unenrollment failed.");
        }
    }

    return (
        <div>
            <h2>Gym Classes</h2>
            <ul>
                {classes.map((cls) => (
                    <li key={cls.id}>
                        {cls.name} - {cls.schedule} (Capacity: {cls.capacity}, Enrolled: {cls.enrolled_count})

                        {userRole === "member" && (
                            cls.enrolled ? (
                                <button onClick={() => unenrollFromClass(cls.id)}>Unenroll</button>
                            ) : cls.enrolled_count < cls.capacity ? (
                                <button onClick={() => enrollInClass(cls.id)}>Enroll</button>
                            ) : (
                                <span>❌ Full</span>
                            )
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Classes;
