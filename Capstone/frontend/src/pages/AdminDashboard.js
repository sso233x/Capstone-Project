import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000"; // Your Flask API

//Only thing can think to do is tests
//gonna have to email abu and see what he says

function AdminDashboard() {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ name: "", capacity: "", schedule: "" });
  const [editingClass, setEditingClass] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();


  const fetchClasses = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  }); // Dependency array includes token

  useEffect(() => {
    fetchClasses();
  }, []);

  async function addClass(classData) {
    if (isSubmitting) return;  // Prevent duplicate submissions
  
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/classes`, classData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 201 && response.data.id) {
        console.log("Class added:", response.data);
        setClasses((prevClasses) => [...prevClasses, response.data]);
        setNewClass({ name: "", capacity: "", schedule: "" });
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error adding class:", error);
  
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  }
    
  
  async function deleteClass(classId) {
    try {
      if (!classId) {
        console.error("Class ID is undefined!");
        return;
      }
      const response = await axios.delete(`${API_URL}/classes/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setClasses(classes.filter((cls) => cls.id !== classId));
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  }
  

  async function updateClass(e, classId) {
    e.preventDefault();

    if (!editingClass || !editingClass.id) {
        console.error("Invalid class data for update!");
        return;
    }

    try {
        const response = await axios.put(`${API_URL}/classes/${classId}`, editingClass, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
            console.log("Class updated successfully:", response.data);
            // Update state with new class data
            setClasses(classes.map((cls) => (cls.id === classId ? response.data : cls)));
        } else {
            console.error("Unexpected response:", response);
        }

        setEditingClass(null); // Clear editing mode
    } catch (error) {
        console.error("Error updating class:", error);
    }

  }



  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Form to Add Class */}
      <form onSubmit={(e) => { e.preventDefault(); addClass(newClass); }}>
        <input
          type="text"
          placeholder="Class Name"
          value={newClass.name}
          onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newClass.capacity}
          onChange={(e) => setNewClass({ ...newClass, capacity: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Schedule"
          value={newClass.schedule}
          onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
          required
        />
        <button type="submit">Add Class</button>
      </form>

      {/* List of Classes */}
      <h2>All Classes</h2>
      <ul>
        {classes.map((cls) => (
          <li key={cls.id}>
          {console.log("Class ID:", cls.id)} {/* Debugging line */}
            {editingClass && editingClass.id === cls.id ? (
              <form onSubmit={(e) => updateClass(e, cls.id)}>
                <input
                  type="text"
                  value={editingClass.name}
                  onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  value={editingClass.capacity}
                  onChange={(e) => setEditingClass({ ...editingClass, capacity: e.target.value })}
                  required
                />
                <input
                  type="text"
                  value={editingClass.schedule}
                  onChange={(e) => setEditingClass({ ...editingClass, schedule: e.target.value })}
                  required
                />
                <button type="submit">Save</button>
                <button onClick={() => setEditingClass(null)}>Cancel</button>
              </form>
            ) : (
              <>
                {cls.name} - {cls.schedule} (Capacity: {cls.capacity})
                <button onClick={() => deleteClass(cls.id)}>Delete</button>
                <button onClick={() => setEditingClass(cls)}>Edit</button>
              </>
            )}
          </li>
        ))}

      </ul>
    </div>
  );
}

export default AdminDashboard;
