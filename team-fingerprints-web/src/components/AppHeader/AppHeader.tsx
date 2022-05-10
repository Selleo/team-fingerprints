import { Header } from "@mantine/core";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ChevronDownIcon } from "../../assets/ChevronDown.svg";
import { ReactComponent as LogoutIcon } from "../../assets/Logout.svg";
import { ReactComponent as GearIcon } from "../../assets/Gear.svg";
import { ReactComponent as PencilIcon } from "../../assets/Pencil2.svg";
import { ReactComponent as LogoIcon } from "../../assets/Logo.svg";
import { ReactComponent as UserIcon } from "../../assets/User.svg";

import "./styles.sass";
import { queryClient } from "../../App";

const AppHeader = () => {
  const navigate = useNavigate();

  const { logout, user } = useAuth0();

  return (
    <Header height={122} className="header">
      <div className="header__branding" onClick={() => navigate("/")}>
        <LogoIcon height={37} fill="#ccc" />
      </div>
      {user?.email && (
        <div className="header__menu">
          <img className="header__avatar" alt="avatar" src={user.picture} />
          <span className="header__email">{user?.email}</span>
          <ChevronDownIcon className="header__arrow" />
          <div className="header__submenu">
            <button
              className="header__button"
              onClick={() => {
                navigate("/");
              }}
            >
              <div className="header__icon">
                <PencilIcon />
              </div>
              <span className="header__name">Put answers</span>
            </button>
            <button
              className="header__button"
              onClick={() => {
                navigate(`manage`);
              }}
            >
              <div className="header__icon">
                <GearIcon />
              </div>
              <span className="header__name">Manage Roles and Companies</span>
            </button>
            <button
              className="header__button"
              onClick={() => {
                navigate("profile");
              }}
            >
              <div className="header__icon">
                <UserIcon />
              </div>
              <span className="header__name">Profile</span>
            </button>
            <button
              className="header__button"
              onClick={() => {
                logout({
                  returnTo: window.location.origin,
                });
                localStorage.removeItem("token");
                queryClient.clear();
              }}
            >
              <div className="header__icon">
                <LogoutIcon />
              </div>
              <span className="header__name">Log Out</span>
            </button>
          </div>
        </div>
      )}
    </Header>
  );
};

export default AppHeader;
