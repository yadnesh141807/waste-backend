import "./WasteForm.css";
import { useState } from "react";
import API from "../api";

function WasteForm({ type, setSelectedType, wasteList, setWasteList, refreshWaste, setShowBhangarMenu }) {

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [weight, setWeight] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {

    try {

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("type", type);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("weight", weight);
      formData.append("quantity", quantity);

      if (image) {
        formData.append("image", image);
      }

      await API.post("/waste/submit", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Waste submitted successfully ✅");

      refreshWaste();
      setSelectedType("");

    } catch (error) {

      console.log("Waste submit error:", error);
      alert("Error submitting waste ❌");

    }

  };

  return (
    <div className="form-page">
      <div className="form-card">

        <h2 className="form-title">{type} Waste Submission</h2>
        <p className="form-subtitle">Operational Intake Form</p>

        <div className="form-grid">

          <div className="form-group full">
            <label>Description</label>
            <textarea
              placeholder="Briefly describe the waste material"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Pickup Location</label>
            <input
              type="text"
              placeholder="Facility / Area"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              placeholder="Total units"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Estimated Weight (kg)</label>
            <input
              type="number"
              placeholder="e.g. 2.5"
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="form-group full">
            <label>Attach Image</label>
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

        </div>

        <div className="form-actions">

          <button
            className="secondary-btn"
            onClick={() => setShowBhangarMenu(true)}
          >
            Cancel
          </button>

          <button
            className="primary-btn"
            onClick={handleSubmit}
          >
            Submit for Collection
          </button>

        </div>

      </div>
    </div>
  );
}
