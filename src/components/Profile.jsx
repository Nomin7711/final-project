import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/api';
import defaultImg from '../assets/default-profile.png';
import Loader from './Loader';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to load profile data');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  console.log(userData);
  

  if (loading) {
    return <Loader/>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Profile</h2>
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <img
              src={userData?.profileImage ? userData?.profileImage : defaultImg}
              alt="Profile"
              className="w-40 h-40 object-cover rounded-full "
            />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
            <div className="text-right font-medium text-gray-700">Full Name:</div>
            <div className="text-left text-gray-900">{userData?.name}</div>

            <div className="text-right font-medium text-gray-700">Email:</div>
            <div className="text-left text-gray-900">{userData?.email}</div>

            <div className="text-right font-medium text-gray-700">Profile Image:</div>
            <div className="text-left text-gray-900">{userData?.profileImage ? 'Image Available' : 'No Image'}</div>
          </div>

          <button
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition-colors"
            onClick={() => navigate('/edit-profile')}
          >
            Change Profile Picture
          </button>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
