import { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import CameraSvg from "/assets/svg/camera.svg";
import EditSvg from "/assets/svg/edit.svg";
import style from "./UserProfile.module.css";

export default function UserProfile() {
  const [error, setError] = useState(null);
  const [actionResult, setActionResult] = useState(null);
  const [userProfileData, setUserProfileData] = useState(null);
  const [previewUserImage, setPreviewUserImage] = useState(null);
  const [showFileForm, setShowFileForm] = useState(false);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [isDemoAccount, setIsDemoAccount] = useState(false);

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
          if (data.userProfile.email === "demoaccountemail83749@gmail.com") {
            setIsDemoAccount(true);
          }
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
    event.target.value = "";
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
    <div className={style.userProfileContainer}>
      <Sidebar selectedPage={"profile"} />
      <div className={style.userProfileDataContainer}>
        {error && <h2 className={style.error}>{error}</h2>}
        {actionResult && <h2 className={style.actionResult}>{actionResult}</h2>}
        {!userProfileData && !error && (
          <h2 className={style.loadingScreen}>Loading...</h2>
        )}
        {userProfileData && (
          <div className={style.userProfileFormDataContainer}>
            <form
              onSubmit={(event) => handleSubmit(event, "image")}
              className={style.userProfileImageForm}
            >
              <div className={style.userProfileImage}>
                <img
                  className={style.profileImg}
                  src={
                    previewUserImage !== null
                      ? previewUserImage
                      : userProfileData.profileImage.url
                  }
                  alt={"your profile picture"}
                />
                <label
                  htmlFor="user-image"
                  className={style.groupInputFileLabel}
                  aria-label="change your profile picture"
                  onClick={() => setShowFileForm(true)}
                >
                  <img src={CameraSvg} />
                </label>
              </div>

              <input
                type="file"
                name="user-image"
                id="user-image"
                onChange={handleFileChange}
                required
              />

              {showFileForm &&
                previewUserImage !== userProfileData.profileImage.url && (
                  <div className={style.userProfileImageBtnContainer}>
                    <button
                      onClick={() => setShowFileForm(false)}
                      className={style.infoCancelBtn}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={style.infoSaveBtn}>
                      Save
                    </button>
                  </div>
                )}
            </form>

            <h2>{`${
              userProfileData.firstName.charAt(0).toUpperCase() +
              userProfileData.firstName.slice(1)
            } ${
              userProfileData.lastName.charAt(0).toUpperCase() +
              userProfileData.lastName.slice(1)
            }`}</h2>
            {!isDemoAccount && <h3>{userProfileData.email}</h3>}

            <div className={style.infoContainer}>
              <h3>Info</h3>
              {showInfoForm && (
                <form onSubmit={(event) => handleSubmit(event, "info")}>
                  <input
                    type="text"
                    className={style.infoInputBtn}
                    name="user-info"
                    id="user-info"
                    maxLength="200"
                    defaultValue={userProfileData.profileInfo}
                  />

                  <div className={style.infoFormBtnContainer}>
                    <button
                      className={style.infoCancelBtn}
                      onClick={() => setShowInfoForm(false)}
                    >
                      Cancel
                    </button>

                    <button type="submit" className={style.infoSaveBtn}>
                      Save
                    </button>
                  </div>
                </form>
              )}

              {!showInfoForm && (
                <div className={style.infoBtnContainer}>
                  <div>
                    <p>{userProfileData.profileInfo}</p>
                  </div>
                  {!isDemoAccount && (
                    <button
                      className={style.editInfoBtn}
                      onClick={() => setShowInfoForm(true)}
                    >
                      <img src={EditSvg} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
