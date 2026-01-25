import { useState, useRef } from "react";
import styles from "./ItemCRUD.module.css";
import { useEffect } from "react";
const ItemCRUD = () => {
  // Access the state passed from AdminPanel
  const [items, setItems] = useState([]);
  const [itemGroups, setItemGroups] = useState([]);
  const [needUpdate, setNeedUpdate] = useState(false);
  const fileInputRef = useRef(null);
  const [item, setItem] = useState({
    name: "",
    price: "",
    group: "",
    image: null,
    imageFileName: "",
  });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/item")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, [needUpdate]);

  useEffect(() => {
    fetch("http://localhost:5000/itemGroup")
      .then((response) => response.json())
      .then((data) => setItemGroups(data))
      .catch((error) => console.error("Error fetching item groups:", error));
  }, []);

  const validateItem = () => {
    const newErrors = {};
    let isValid = true;

    if (!item.name.trim()) {
      newErrors.name = "Item name is required.";
      isValid = false;
    }

    const priceValue = parseFloat(item.price);
    if (!item.price) {
      newErrors.price = "Price is required.";
      isValid = false;
    } else if (isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = "Price must be a positive number.";
      isValid = false;
    }

    if (!item.group) {
      newErrors.group = "Please select a group.";
      isValid = false;
    }

    if (!item.image) {
      newErrors.image = "Please upload an image.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setErrors({ ...errors, [name]: "" });

    // ⭐ Handle File Upload
    if (name === "image") {
      const file = files[0];
      if (file) {
        const fileURL = URL.createObjectURL(file);
        setItem({
          ...item,
          image: fileURL,
          imageFileName: file.name,
        });
      }
      return;
    }

    if (name === "price") {
      const price = value === "" || parseFloat(value) >= 0 ? value : 0;
      setItem({ ...item, price });
      return;
    }

    setItem({ ...item, [name]: value });
  };

  const handleAdd = () => {
    if (!validateItem()) return;

    const finalPrice = Math.abs(parseFloat(item.price)).toFixed(2);

    if (editId) {
      //Update existing item in database
      fetch(`http://localhost:5000/item/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      }).then((response) => {
        if (!response.ok) {
          // Handle error response
          console.error("Failed to update item");
        } else {
          setNeedUpdate(!needUpdate);
        }
      });
      setEditId(null);
    } else {
      //Save to database
      fetch("http://localhost:5000/item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      }).then((response) => {
        if (!response.ok) {
          // Handle error response
          console.error("Failed to save item");
        } else {
          setNeedUpdate(!needUpdate);
        }
      });
    }

    // ⭐ Reset form
    setItem({
      name: "",
      price: "",
      group: "",
      image: null,
      imageFileName: "",
    });

    // ⭐ RESET FILE INPUT (clears hero.webp)
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }

    setErrors({});
  };

  const handleDelete = (id) => {
    if (editId === id) {
      setEditId(null);
      setItem({
        name: "",
        price: "",
        group: "",
        image: null,
        imageFileName: "",
      });

      // ⭐ Reset file input when deleting edited item
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }

    setItems(items.filter((i) => i.id !== id));
    // Delete from database
    fetch(`http://localhost:5000/item/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        setNeedUpdate(!needUpdate);
      }
    });
  };

  const handleEdit = (i) => {
    setEditId(i._id);
    setItem({
      name: i.name,
      price: i.price,
      group: i.group,
      image: i.image,
      imageFileName: i.imageFileName || "",
    });
    setErrors({});
  };

  return (
    <div className={styles.crudBox}>
      <h2>Items</h2>
      <div className={styles.inputRow}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={item.name}
          onChange={handleChange}
          className={styles.input}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={item.price}
          onChange={handleChange}
          className={styles.input}
          min="0"
        />

        {/* ⭐ File Input with Ref */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          ref={fileInputRef} // ✔ file input ref applied
          className={styles.inputFile}
        />
      </div>

      {/* ⭐ Show File Name */}
      {item.imageFileName && (
        <p className={styles.fileName}>Selected: {item.imageFileName}</p>
      )}

      {(errors.name || errors.price || errors.image) && (
        <div className={styles.errorRow}>
          <p className={styles.errorText}>{errors.name}</p>
          <p className={styles.errorText}>{errors.price}</p>
          <p className={styles.errorText}>{errors.image}</p>
        </div>
      )}

      <div className={styles.inputRow}>
        <select
          name="group"
          value={item.group}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Select Group</option>
          {itemGroups.map((g) => (
            <option key={g.id} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>

        <button onClick={handleAdd} className={styles.btn}>
          {editId ? "Update Item" : "Add Item"}
        </button>
      </div>

      {errors.group && <p className={styles.errorText}>{errors.group}</p>}

      <ul>
        {items.map((i) => (
          <li key={i._id} className={styles.listItem}>
            {i.image && (
              <img src={i.image} alt="item" className={styles.smallImage} />
            )}
            <b>{i.name}</b> ₹{Math.abs(i.price)} ({i.group})
            <div>
              <button className={styles.editBtn} onClick={() => handleEdit(i)}>
                {editId === i._id ? "Editing..." : "Edit"}
              </button>

              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(i._id)}
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

export default ItemCRUD;
