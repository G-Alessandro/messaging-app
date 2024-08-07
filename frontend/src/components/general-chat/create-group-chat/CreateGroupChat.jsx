export default function CreateGroupChat({
  setError,
  setActionResult,
  setShowGroupChatButton,
  showGroupChatButton,
  groupChatUser,
}) {
  const createGroupChat = async (event) => {
    event.preventDefault();
    if (groupChatUser.length < 1) {
      setActionResult(
        "You must select at least one person to create a group chat!"
      );
      setTimeout(() => setActionResult(null), 2000);
      return;
    }
    const formData = {
      groupChatName: event.target["group-chat-name"].value,
      groupChatUsers: groupChatUser,
    };
    try {
      const response = await fetch("http://localhost:3000/create-group-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setActionResult(data.error);
      } else {
        setActionResult(data.message);
        setShowGroupChatButton(false)
        setTimeout(() => setActionResult(null), 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <button
        style={{
          visibility: showGroupChatButton ? "hidden" : "visible",
        }}
        onClick={() => setShowGroupChatButton(true)}
      >
        Create group chat
      </button>

      {showGroupChatButton && (
        <form onSubmit={createGroupChat}>
          <label htmlFor="group-chat-name">Group Chat Name</label>
          <input
            type="text"
            id="group-chat-name"
            name="group-chat-name"
            minLength={1}
            maxLength={30}
            required
          />

          <button type="submit">Done</button>
          <button onClick={() => setShowGroupChatButton(false)}>Cancel</button>
        </form>
      )}
    </>
  );
}
