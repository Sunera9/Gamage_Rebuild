import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiCalendar,
  FiAward,
} from "react-icons/fi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          setError("User email not found in localStorage.");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/users/getByEmail/${email}`
        );
        setUser(response.data.user);
      } catch (err) {
        console.error(err.message);
        setError("Failed to fetch user data.");
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-500">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-200 to-gray-100 p-8">
          <div className="flex items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-4 border-white shadow-md"
            />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-500">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileField icon={<FiMail />} label="Email" value={user.email} />
          <ProfileField icon={<FiPhone />} label="Phone" value={user.phone} />
          <ProfileField
            icon={<FiMapPin />}
            label="Address"
            value={user.address}
          />
          <ProfileField icon={<FiUser />} label="NIC" value={user.nic} />
          <ProfileField
            icon={<FiCalendar />}
            label="Date of Birth"
            value={new Date(user.dob).toLocaleDateString()}
          />
          <ProfileField icon={<FiAward />} label="Role" value={user.role} />
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-center bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="p-3 bg-blue-100 rounded-full text-blue-500 text-lg">
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

export default Profile;
