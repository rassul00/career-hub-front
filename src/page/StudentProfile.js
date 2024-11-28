import React, { useState, useEffect } from "react";
import "../style/student_profile_style.css";
import {jwtDecode} from "jwt-decode";

const StudentProfile = () => {

    const baseUrl = "http://localhost:8080";

    const token = localStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);


    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        universityId: "",
        degree: "",
        gpa: "",
        currentYear: "",
        yearOfEnrollment: "",
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetch(`${baseUrl}/student/${decodedToken['id']}`)
            .then((response) => response.json())
            .then((data) => setProfile(data))
            .catch((error) => console.error("Error fetching profile data:", error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSave = () => {
        fetch(`${baseUrl}/student/${decodedToken['id']}`, { //здесь эндпоинт /student/update
            method: "PUT",
            headers: { "Content-Type": "application/json" },//token
            body: JSON.stringify(profile),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Profile saved successfully!");
                    setIsEditing(false);
                } else {
                    alert("Error saving profile.");
                }
            })
            .catch((error) => console.error("Error saving profile:", error));
    };

    return (
        <div className="student-profile-page">
            <h2>Student Profile</h2>
            <div>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={profile.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={profile.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={profile.email}
                    onChange={handleChange}
                    disabled // Email обычно не редактируется
                />
            </div>
            <div>
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={profile.phoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <input
                    type="text"
                    name="universityId"
                    placeholder="University Id"
                    value={profile.universityId}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <select
                    name="degree"
                    value={profile.degree}
                    onChange={handleChange}
                    disabled={!isEditing}
                >
                    <option value="BACHELOR">Bachelor</option>
                    <option value="MASTER">Master</option>
                    <option value="DOCTORATE">Doctorate</option>
                </select>
            </div>
            <div>
                <input
                    type="number"
                    name="gpa"
                    placeholder="GPA"
                    value={profile.gpa}
                    onChange={handleChange}
                    step="0.01"
                    min="0.0"
                    max="4.0"
                    disabled={!isEditing}
                />
            </div>
            <div>
                <input
                    type="number"
                    name="currentYear"
                    placeholder="Current Year"
                    value={profile.currentYear}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div>
                <input
                    type="number"
                    name="yearOfEnrollment"
                    placeholder="Year of Enrollment"
                    value={profile.yearOfEnrollment}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            {isEditing ? (
                <button onClick={handleSave}>Save Changes</button>
            ) : (
                <button onClick={() => setIsEditing(true)} className="edit">
                    Edit Profile
                </button>
            )}
        </div>
    );
};

export default StudentProfile;
