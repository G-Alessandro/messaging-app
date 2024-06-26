import { useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import UserProfile from "./user-profile/UserProfile";
import GeneralChat from "./general-chat/GeneralChat";
import GroupChat from "./group-chat/GroupChat";

export default function HomePage() {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showGeneralChat, setShowGeneralChat] = useState(false);
  const [showGroupChat, setShowGroupChat] = useState(false);

  return (
    <>
      <Sidebar
        setShowUserProfile={setShowUserProfile}
        setShowGeneralChat={setShowGeneralChat}
        setShowGroupChat={setShowGroupChat}
      />
      <div>{showUserProfile && <UserProfile />}</div>
      <div>{showGeneralChat && <GeneralChat />}</div>
      <div>{showGroupChat && <GroupChat />}</div>
    </>
  );
}
