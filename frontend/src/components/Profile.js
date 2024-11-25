import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = ({ userId }) => {
  const [profile, setProfile] = useState({
    aboutMe: "",
    facebookLink: "NONE",
    linkedInLink: "NONE",
    instagramLink: "NONE",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(profile);

  // Fetch profile data
  useEffect(() => {
    axios
      .get(`/api/profile/${userId}`)
      .then((response) => {
        setProfile(response.data.profile);
        setUpdatedProfile(response.data.profile);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, [userId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/api/profile/${userId}`, updatedProfile)
      .then((response) => {
        setProfile(updatedProfile);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 mt-6">
      <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>

      {!isEditing ? (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">About Me</h2>
            <p className="text-gray-700">{profile.aboutMe || "No information provided."}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Social Links</h2>
            <ul className="list-disc pl-5">
              <li>
                <strong>Facebook:</strong> {profile.facebookLink !== "NONE" ? profile.facebookLink : "No link"}
              </li>
              <li>
                <strong>LinkedIn:</strong> {profile.linkedInLink !== "NONE" ? profile.linkedInLink : "No link"}
              </li>
              <li>
                <strong>Instagram:</strong> {profile.instagramLink !== "NONE" ? profile.instagramLink : "No link"}
              </li>
            </ul>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="aboutMe" className="block text-sm font-semibold mb-2">
              About Me
            </label>
            <textarea
              name="aboutMe"
              id="aboutMe"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={updatedProfile.aboutMe}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="facebookLink" className="block text-sm font-semibold mb-2">
              Facebook Link
            </label>
            <input
              type="text"
              name="facebookLink"
              id="facebookLink"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={updatedProfile.facebookLink}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="linkedInLink" className="block text-sm font-semibold mb-2">
              LinkedIn Link
            </label>
            <input
              type="text"
              name="linkedInLink"
              id="linkedInLink"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={updatedProfile.linkedInLink}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="instagramLink" className="block text-sm font-semibold mb-2">
              Instagram Link
            </label>
            <input
              type="text"
              name="instagramLink"
              id="instagramLink"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={updatedProfile.instagramLink}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
