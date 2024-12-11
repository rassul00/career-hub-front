import React, { useState, useEffect } from "react";
import "../style/company_profile_style.css";
import {jwtDecode} from "jwt-decode";
import candidateIcon from "../resources/candidate-icon.svg";
import favourite_active from "../resources/favourite_active.svg";
import favourite_not_active from "../resources/favourite_not_active.svg";

const CompanyProfile = () => {

    const baseUrl = "http://localhost:8080";
    const token = localStorage.getItem("authToken");
    const decodedToken = jwtDecode(token);

    const [profile, setProfile] = useState({
        ownerId: "",
        name: "",
        type: "PRIVATE",
        email: "",
        location: "",
        contactPhone: "",
        industry: "",
        website: "",
        establishedYear: "",
    });
    const [favourites, setFavourites] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [currentTab, setCurrentTab] = useState("profile");
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch(`${baseUrl}/company/${decodedToken['user-id']}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data) => setProfile(data))
            .catch((error) => console.error("Error fetching profile data:", error));
    }, []);


    useEffect(() => {
        fetch(`${baseUrl}/company/favouriteStudent/${decodedToken['user-id']}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setFavourites(data);
            })
            .catch((error) => console.error("Error fetching students:", error))
    }, []);


    useEffect(() => {
        if (favourites.length > 0) {
            const fetchStudentData = async () => {
                try {
                    const studentRequests = favourites.map((id) =>
                        fetch(`${baseUrl}/student/${id}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        }).then((response) => {
                            if (!response.ok) {
                                throw new Error(`Failed to fetch student with id ${id}`);
                            }
                            return response.json();
                        })
                    );

                    const studentData = await Promise.all(studentRequests);

                    setStudents(studentData);
                } catch (error) {
                    console.error("Error fetching students:", error);
                }
            };

            fetchStudentData().then();
        }
    }, [favourites]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };


    const isFavorite = (id) => Array.isArray(favourites) && favourites.includes(id);

    const toggleFavorite = (id) => {
        if (isFavorite(id)) {
            //deleteFavorite(id);
        } else {
            //addFavorite(id);
        }
    };



    const handleSave = () => {
        fetch(`${baseUrl}/company/update/${decodedToken['user-id']}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            }, //token
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
        <div className="company-profile-page">
            <div className="tabs">
                <button
                    onClick={() => setCurrentTab("profile")}
                    className={currentTab === "profile" ? "active" : ""}
                >
                    Profile
                </button>
                <button
                    onClick={() => setCurrentTab("favourites")}
                    className={currentTab === "favourites" ? "active" : ""}
                >
                    Favourites
                </button>
            </div>
            {currentTab === "profile" && (
                <div className="profile-tab">
                    <h2>Company Profile</h2>
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Company Name"
                            value={profile.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div>
                        <select
                            name="type"
                            value={profile.type}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option value="PRIVATE">Private</option>
                            <option value="STATE">State</option>
                        </select>
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={profile.email}
                            onChange={handleChange}
                            disabled
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={profile.location}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="contactPhone"
                            placeholder="Contact Phone"
                            value={profile.contactPhone}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="industry"
                            placeholder="Industry"
                            value={profile.industry}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="website"
                            placeholder="Website"
                            value={profile.website}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            name="establishedYear"
                            placeholder="Year of Establishment"
                            value={profile.establishedYear}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                    {isEditing ? (
                        <button className="save_button" onClick={handleSave}>Save Changes</button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="edit">
                            Edit Profile
                        </button>
                    )}
                </div>
            )}

            {currentTab === "favourites" && (
                <div className="favourites-tab" >
                    <h2>Favourites</h2>
                    {students.map((student) => (
                        <div key={student.id} className>
                            <div>
                                <div>
                                    <h3>{student.firstName} {student.lastName}</h3>
                                    <p>Degree: {student.degree}</p>
                                </div>

                                <div>
                                    {decodedToken['user-role'] === "COMPANY" && (
                                        <button
                                            className="candidate-favorite"
                                            onClick={() => toggleFavorite(student.ownerId)}
                                            aria-label={isFavorite(student.ownerId) ? "Remove from Favorites" : "Add to Favorites"}
                                        >
                                            {isFavorite(student.ownerId) ?
                                                <img src={favourite_active}></img> :
                                                <img src={favourite_not_active}></img>
                                            }
                                        </button>
                                    )}
                                    <button  onClick={() => {
                                        // fetchReviews(student.ownerId);
                                        // setReview(prevState => ({
                                        //     ...prevState,
                                        //     recipientId: student.ownerId,
                                        // }));
                                        // fetchUniversity(student.universityId);
                                        // openModal(student)
                                    }
                                    }>
                                        View Profile →
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}


        </div>
    );
};

export default CompanyProfile;
