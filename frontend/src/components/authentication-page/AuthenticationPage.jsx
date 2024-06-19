import { useState } from "react";
import Login from "./log-in/Login";
import CreateAccount from "./create-account/CreateAccount";

export default function LoginPage() {
  const [createAccount, setCreateAccount] = useState(false);

  return (
    <>
      <div>
        <div>
          <div>
            <img src="" alt="" />
            <h2>Messaging App</h2>
          </div>
          {!createAccount && <Login setCreateAccount={setCreateAccount} />}
          {createAccount && (
            <CreateAccount setCreateAccount={setCreateAccount} />
          )}
        </div>

        <div>
          <img src="" alt="" />
        </div>
      </div>
    </>
  );
}
