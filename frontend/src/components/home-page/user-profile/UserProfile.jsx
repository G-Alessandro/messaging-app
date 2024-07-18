import { useState, useEffect } from "react";
import style from "./UserProfile.module.css";

export default function UserProfile() {
  const [error, setError] = useState(null);
  const [actionResult, setActionResult] = useState(null);
  const [userProfileData, setUserProfileData] = useState(null);
  const [previewUserImage, setPreviewUserImage] = useState(null);
  const [showFileForm, setShowFileForm] = useState(false);
  const [showInfoForm, setShowInfoForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/user-profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          mode: "cors",
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        } else {
          setUserProfileData(data.userProfile);
          setPreviewUserImage(data.userProfile.profileImage.url);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [showInfoForm, showFileForm]);

  const handleFileChange = (event) => {
    const image = event.target.files[0];
    if (image) {
      const imageUrl = URL.createObjectURL(image);
      setPreviewUserImage(imageUrl);
    }
  };

  const handleSubmit = async (event, type) => {
    event.preventDefault();
    const input = type;
    let formData;
    let headers = {};

    if (type === "image") {
      formData = new FormData();
      formData.append("user-image", event.target["user-image"].files[0]);
    } else {
      formData = JSON.stringify({
        "user-info": event.target["user-info"].value,
      });
      headers = { "Content-Type": "application/json" };
    }
    try {
      const response = await fetch(
        `http://localhost:3000/user-profile-${input}`,
        {
          method: "POST",
          headers,
          credentials: "include",
          mode: "cors",
          body: formData,
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      } else {
        setActionResult(data.message);
        setTimeout(() => setActionResult(null), 2000);
        input === "image" ? setShowFileForm(false) : setShowInfoForm(false);
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {actionResult && <p>{actionResult}</p>}
      {!userProfileData && !error && <p>Loading...</p>}
      {userProfileData && (
        <>
          {showFileForm && (
            <form onSubmit={(event) => handleSubmit(event, "image")}>
              <div>
                <img
                  className={style.profileImg}
                  src={previewUserImage}
                  alt="Preview of your new profile picture"
                />
              </div>
              <input
                type="file"
                name="user-image"
                id="user-image"
                onChange={handleFileChange}
                required
              />
              <button type="submit">Save</button>
              <button onClick={() => setShowFileForm(false)}>Cancel</button>
            </form>
          )}
          <div>
            <div>
              <img
                className={style.profileImg}
                src={userProfileData.profileImage.url}
                alt={`Profile image of ${userProfileData.firstName} ${userProfileData.lastName}`}
              />
            </div>
            <button onClick={() => setShowFileForm(true)}>Change img</button>
          </div>

          <div>
            <p>{`${userProfileData.firstName} ${userProfileData.lastName}`}</p>
            <p>{userProfileData.email}</p>
          </div>

          <div>
            <p>Info:</p>
            {showInfoForm && (
              <form onSubmit={(event) => handleSubmit(event, "info")}>
                <input
                  type="text"
                  name="user-info"
                  id="user-info"
                  maxLength="200"
                  defaultValue={userProfileData.profileInfo}
                />
                <button type="submit">Save</button>
                <button onClick={() => setShowInfoForm(false)}>Cancel</button>
              </form>
            )}
            {!showInfoForm && (
              <div>
                <p>{userProfileData.profileInfo}</p>
                <button onClick={() => setShowInfoForm(true)}>
                  Change Info
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
