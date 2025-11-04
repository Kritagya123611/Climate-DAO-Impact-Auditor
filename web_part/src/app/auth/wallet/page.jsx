"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wallet = () => {
  const router = useRouter();

  const [userType, setUserType] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [projectData, setProjectData] = useState({
    name: "",
    category: "",
    description: "",
    website: "",
  });

  const handleChange = (e) => {
    setProjectData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelect = (type) => {
    setUserType(type);
    setShowForm(false);
  };

  const handleAddProject = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success("NFT minted successfully 🎉", {
      position: "top-right",
      autoClose: 2000,
    });

setTimeout(() => {
  const queryString = new URLSearchParams(projectData).toString();
- router.push(`/persona?${queryString}`);
+ router.push(`/auth/persona?${queryString}`);
}, 2000);

  };

  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-bold text-green-300 mb-2">
        Your Wallet Dashboard is here
      </h1>
      <p className="text-gray-300 mb-6">
        Safe and Secure for your transactions
      </p>

      <div className="flex gap-6">
        <button
          onClick={() => handleSelect("individual")}
          className={`p-6 rounded-2xl border transition-all w-56 text-center ${
            userType === "individual"
              ? "bg-green-600 text-white border-green-400"
              : "bg-transparent border-green-700 text-green-300 hover:bg-green-800"
          }`}
        >
          Individual User
        </button>

        <button
          onClick={() => handleSelect("company")}
          className={`p-6 rounded-2xl border transition-all w-56 text-center ${
            userType === "company"
              ? "bg-blue-600 text-white border-blue-400"
              : "bg-transparent border-blue-700 text-blue-300 hover:bg-blue-800"
          }`}
        >
          Company / Enterprise
        </button>
      </div>

      {userType && !showForm && (
        <button
          onClick={handleAddProject}
          className="mt-8 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition-all"
        >
          Add Your Project
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <h2 className="text-xl font-semibold text-green-300 mb-2">
            Project Information
          </h2>

          <input
            name="name"
            type="text"
            placeholder="Project Name"
            className={styles.projectFormInput}
            required
            onChange={handleChange}
          />

          <input
            name="category"
            type="text"
            placeholder="Project Category (e.g. Renewable Energy)"
            className={styles.projectFormInput}
            required
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Project Description"
            className={styles.projectFormInput}
            rows={3}
            required
            onChange={handleChange}
          ></textarea>

          <input
            name="website"
            type="url"
            placeholder="Project Website / Link (optional)"
            className={styles.projectFormInput}
            onChange={handleChange}
          />

          <button type="submit" className={styles.submitButton}>
            Submit Project
          </button>
        </form>
      )}

      <ToastContainer />
    </div>
  );
};

export default Wallet;
