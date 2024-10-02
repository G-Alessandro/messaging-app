import { useState } from "react";
import Login from "./log-in/Login";
import CreateAccount from "./create-account/CreateAccount";
import AppImages from "/assets/images/app-image.png";
import AppSvg from "/assets/svg/app-icon.svg";
import style from "./AuthenticationPage.module.css";

export default function LoginPage() {
  const [createAccount, setCreateAccount] = useState(false);

  return (
    <div className={style.authenticationPageContainer}>
      <div className={style.authenticationContainer}>
        <div className={style.imageNameContainer}>
          <img src={AppSvg} className={style.appIconSvg} />
          <h1>
            <span className={style.appNameQuick}>Quick</span>
            <span className={style.appNameChat}>Chat</span>
          </h1>
        </div>
        {!createAccount && <Login setCreateAccount={setCreateAccount} />}
        {createAccount && <CreateAccount setCreateAccount={setCreateAccount} />}
      </div>

      <div className={style.authenticationImageContainer}>
        <img src={AppImages} />
      </div>
    </div>
  );
}
