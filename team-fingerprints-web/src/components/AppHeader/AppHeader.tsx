import { Header } from "@mantine/core";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ChevronDownIcon } from "../../assets/ChevronDown.svg";
import { ReactComponent as LogoutIcon } from "../../assets/Logout.svg";
import { ReactComponent as GearIcon } from "../../assets/Gear.svg";
import { ReactComponent as PencilIcon } from "../../assets/Pencil2.svg";
import { ReactComponent as LogoIcon } from "../../assets/Logo.svg";

import "./styles.sass";

const AppHeader = () => {
  const navigate = useNavigate();

  const { logout, user } = useAuth0();

  return (
    <Header height={122} className="header">
      <div className="header__branding">
        <LogoIcon height={37} fill="#ccc" />
      </div>
      {user?.email && (
        <div className="header__menu">
          <img alt="avatar" src={user.picture} />
          <span>{user?.email}</span>
          <ChevronDownIcon />
          <div className="header__menu__submenu">
            <button
              onClick={() => {
                navigate("responses");
              }}
            >
              <div className="svg-wrap">
                <PencilIcon />
              </div>
              <span>Put answers</span>
            </button>
            <button
              onClick={() => {
                navigate(`manage`);
              }}
            >
              <div className="svg-wrap">
                <GearIcon />
              </div>
              <span>Manage Roles and Companies</span>
            </button>
            <button
              onClick={() => {
                logout({
                  returnTo: window.location.origin,
                });
                localStorage.removeItem("token");
              }}
            >
              <div className="svg-wrap">
                <LogoutIcon />
              </div>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </Header>
  );
};

export default AppHeader;
