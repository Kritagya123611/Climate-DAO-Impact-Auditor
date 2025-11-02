"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

const Wallet = () => {
  // commented auth logic for development
  // const { status } = useSession();
  // const router = useRouter();
  // if (status === "loading") return <p>Loading...</p>;
  // if (status === "unauthenticated") router.push("/auth/login");

  const [userType, setUserType] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSelect = (type) => {
    setUserType(type);
    setShowForm(false);
  };

  const handleAddProject = () => {
    setShowForm(true);
  };

  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-bold text-green-300 mb-2">
        Your Wallet Dashboard is here
      </h1>
      <p className="text-gray-300 mb-6">Safe and Secure for your transactions</p>
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
        <form className={styles.formContainer}>
  <h2 className="text-xl font-semibold text-green-300 mb-2">Project Information</h2>

  <input
    type="text"
    placeholder="Project Name"
    className={styles.projectFormInput}
    required
  />
  <input
    type="text"
    placeholder="Project Category (e.g. Renewable Energy)"
    className={styles.projectFormInput}
    required
  />
  <textarea
    placeholder="Project Description"
    className={styles.projectFormInput}
    rows={3}
    required
  ></textarea>
  <input
    type="url"
    placeholder="Project Website / Link (optional)"
    className={styles.projectFormInput}
  />

  <button type="submit" className={styles.submitButton}>
    Submit Project
  </button>
</form>
      )}
    </div>
  );
};

export default Wallet;
