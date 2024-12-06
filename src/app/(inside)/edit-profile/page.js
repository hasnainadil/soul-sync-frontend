'use client';

import { useState, useEffect } from "react";
import { SaveIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/utils/axiosInstance";
import { apiUrls } from "@/utils/lib";

export default function EditProfilePage() {
  const [profileData, setProfileData] = useState({
    name: "",
    occupation: "",
    hobbies: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data when the page loads
  useEffect(() => {
    axiosInstance.get("http://localhost:8080/v1/user").then((response) => {
      setProfileData({
        name: response.data.fullName,
        occupation: response.data.occupation,
        hobbies: response.data.hobbies,
      });
      setProfilePicture(response.data.profilePic);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching user data:", error);
      setLoading(false);
    })
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    console.log("Saving profile data:", profileData);
    console.log("Profile picture:", profilePicture);

    try {
      const response = await fetch("http://localhost:8080/v1/user", {
        credentials: 'include',
        method: "PUT", // Assuming a PUT request for updating user data
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: profileData.name,
          occupation: profileData.occupation,
          hobbies: profileData.hobbies,
          profilePic: profilePicture, // If your backend expects this
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save user data");
      }

      console.log("Profile data saved successfully!");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePicture(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-primary">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-full overflow-hidden border border-gray-300">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <Button
                asChild
                className="bg-gray-400 text-white hover:bg-gray-500 px-4 py-2 text-sm"
              >
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                  Change Profile Picture
                </label>
              </Button>
            </div>

            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                placeholder="Edit your name"
                className="rounded-lg"
              />
            </div>
            {/* Occupation Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                name="occupation"
                value={profileData.occupation}
                onChange={handleChange}
                placeholder="Enter your occupation"
                className="rounded-lg"
              />
            </div>
            {/* Hobbies Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="hobbies">Hobbies</Label>
              <textarea
                id="hobbies"
                name="hobbies"
                value={profileData.hobbies}
                onChange={handleChange}
                placeholder="Write your hobbies..."
                className="rounded-lg p-3 border border-gray-300 resize-none"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSave}
            className="w-20 flex items-center justify-center gap-2 bg-[#f2b9a6] text-white hover:bg-[#e98463] px-4 py-2 text-sm"
          >
            <SaveIcon size={16} />
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
