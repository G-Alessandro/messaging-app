import { useState } from "react";
import Login from "./log-in/Login";
import CreateAccount from "./create-account/CreateAccount";

export default function LoginPage() {
  const [createAccount, setCreateAccount] = useState(false);

  function showCreateAccount(e) {
    e.preventDefault();
    setCreateAccount((prev) => !prev);
  }

  return (
    <>
      <div>
        <div>
          <div>
            <img src="" alt="" />
            <h2>Messaging App</h2>
          </div>
          {!createAccount && <Login showCreateAccount={showCreateAccount} />}
          {createAccount && (
            <CreateAccount showCreateAccount={showCreateAccount} />
          )}
        </div>

        <div>
          <img src="" alt="" />
        </div>
      </div>
    </>
  );
}
