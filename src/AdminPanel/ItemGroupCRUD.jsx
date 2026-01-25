import { useState } from "react";
import styles from "./ItemGroupCRUD.module.css";
import { useEffect } from "react";
const ItemGroupCRUD = () => {
  const [itemGroups, setItemGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [needUpdate, setNeedUpdate] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/itemgroup")
      .then((response) => response.json())
      .then((data) => setItemGroups(data))
      .catch((error) => console.error("Error fetching item groups:", error));
  }, [needUpdate]);

  // Utility function for validation
  const validateGroup = () => {
    const trimmedName = groupName.trim();

    // --- Empty Name Validation ---
    if (!trimmedName) {
      setError("Group name cannot be empty.");
      return false;
    }

    // --- Duplicate Name Validation ---
    // Check if the name already exists, ignoring the current item if we are in edit mode
    const isDuplicate = itemGroups.some(
      (g) =>
        g.name.trim().toLowerCase() === trimmedName.toLowerCase() &&
        g.id !== editId
    );

    if (isDuplicate) {
      setError(`The group name "${trimmedName}" already exists.`);
      return false;
    }

    // If all checks pass
    setError("");
    return true;
  };

  const handleChange = (e) => {
    // Clear the error message as the user types
    setError("");
    setGroupName(e.target.value);
  };

  const addGroup = () => {
    // 2. Run validation check before proceeding
    if (!validateGroup()) {
      return;
    }

    if (editId) {
      // Update existing item group
      fetch(`http://localhost:5000/itemgroup/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: groupName.trim() }),
      }).then((response) => {
        setNeedUpdate(!needUpdate);
        setEditId(null);
      });
    } else {
      //Save to database
      fetch("http://localhost:5000/itemgroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: groupName.trim() }),
      }).then((response) => {
        if (!response.ok) {
          // Handle error response
          console.error("Failed to save item group");
        } else {
          setNeedUpdate(!needUpdate);
        }
      });
    }
    setGroupName("");
  };

  const deleteGroup = (id) => {
    // Clear edit state if the item being edited is deleted
    if (editId === id) {
      setEditId(null);
      setGroupName("");
    }
    //Delete from database
    fetch(`http://localhost:5000/itemgroup/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        alert(
          "Failed to delete item group as it is associated with existing items."
        );
      }
      setNeedUpdate(!needUpdate);
    });
  };

  // New handler to load item into form for editing
  const handleEdit = (g) => {
    setEditId(g._id);
    setGroupName(g.name);
    setError(""); // Clear error when starting edit
  };

  return (
    <div className={styles.crudBox}>
      <h2>Items Groups</h2>
      {/* 3. Input and Button are now wrapped together for better layout handling */}
      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={handleChange}
          className={styles.input} /* Use input style from previous CSS */
        />
        <button onClick={addGroup} className={styles.btn}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* Display error message */}
      {error && <p className={styles.errorText}>{error}</p>}

      <ul>
        {itemGroups.map((g) => (
          <li key={g._id} className={styles.listItem}>
            {g.name}
            <div>
              <button onClick={() => handleEdit(g)} className={styles.editBtn}>
                {editId === g._id ? "Editing..." : "Edit"}
              </button>
              <button
                onClick={() => deleteGroup(g._id)}
                className={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemGroupCRUD;
