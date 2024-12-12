import React, { useState, useEffect } from "react";
import "../style/student_profile_style.css";
import {jwtDecode} from "jwt-decode";
import Header from "./Header";

const StudentProfile = () => {

    const baseUrl = "http://localhost:8080";

    const token = localStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);

    const [university, setUniversity] = useState([])
    const [profile, setProfile] = useState({
        ownerId: "",
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
        fetch(`${baseUrl}/student/${decodedToken['user-id']}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setProfile(data);
                return fetch(`${baseUrl}/university/${data.universityId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            })
            .then((response) => response.json())
            .then((data) => setUniversity(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSave = () => {
        fetch(`${baseUrl}/student/${decodedToken['user-id']}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
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
            <Header/>

            <h2>Student Profile</h2>

            <div className="profile-tab">

                <div className="row1">
                    <div className="input-container">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={profile.firstName}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="input-container">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={profile.lastName}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className='row2'>
                    <div className="input-container">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={profile.email}
                            onChange={handleChange}
                            disabled
                        />
                    </div>
                    <div className="input-container">
                        <label>University</label>
                        <input
                            type="text"
                            name="universityName"
                            placeholder="University Name"
                            value={university.name}
                            onChange={handleChange}
                            disabled
                        />
                    </div>
                </div>

                <div className="row3">
                    <div className="input-container">
                        <label>Contact Phone</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Contact Phone"
                            value={profile.phoneNumber}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="input-container">
                        <label>Degree</label>
                        <select
                            name="degree"
                            value={profile.degree}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option value="" disabled>
                                Select the degree
                            </option>
                            <option value="BACHELOR">Bachelor</option>
                            <option value="MASTER">Master</option>
                            <option value="DOCTORATE">Doctorate</option>
                        </select>
                    </div>
                </div>

                <div className="row4">
                    <div className="input-container">
                        <label>GPA</label>
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
                    <div className="input-container">
                        <label>Year of Enrollment</label>
                        <input
                            type="number"
                            name="yearOfEnrollment"
                            placeholder="Year of Enrollment"
                            value={profile.yearOfEnrollment}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="input-container row5">
                    <label>Information about me</label>
                    <textarea name="aboutUs"
                              placeholder=""
                              value={profile.aboutUs}
                              onChange={handleChange}
                              disabled={!isEditing}>
                        </textarea>
                </div>
                <div className="button-container">
                    {isEditing ? (
                        <button className="save-button" onClick={handleSave}>Save Changes</button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="edit-button">
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default StudentProfile;
