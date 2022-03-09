import {
  Header,
  useMantineTheme,
  MediaQuery,
  Burger,
  Title,
} from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ProfileContext } from "../../routes";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ChevronDownIcon } from "../../assets/ChevronDown.svg";
import { ReactComponent as LogoutIcon } from "../../assets/Logout.svg";
import { ReactComponent as GearIcon } from "../../assets/Gear.svg";
import { ReactComponent as PencilIcon } from "../../assets/Pencil2.svg";

import "./styles.sass";

const AppHeader = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  const { logout, user } = useAuth0();
  const { profile } = useContext(ProfileContext);

  const roleBasedBtn = useMemo(() => {
    if (profile?.role === "COMPANY_ADMIN") {
      const companyId = profile?.company?._id;
      return (
        <button
          onClick={() => {
            navigate(`companies/${companyId}`);
          }}
        >
          <div className="svg-wrap">
            <GearIcon />
          </div>
          <span>Manage Company</span>
        </button>
      );
    }

    if (profile?.role === "TEAM_LEADER") {
      const companyId = profile.company?._id;
      const teamId = profile.team?._id;

      return (
        <button
          onClick={() => {
            navigate(`companies/${companyId}/team/${teamId}`);
          }}
        >
          <div className="svg-wrap">
            <GearIcon />
          </div>
          <span>Manage Team</span>
        </button>
      );
    }
  }, [navigate, profile?.company?._id, profile?.role, profile?.team?._id]);

  return (
    <Header height={122} className="header">
      {/* Handle other responsive styles with MediaQuery component or createStyles function */}
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Burger
          opened={opened}
          onClick={() => setOpened((o) => !o)}
          size="sm"
          color={theme.colors.gray[6]}
          mr="xl"
        />
      </MediaQuery>

      <div className="header__branding">
        <Title order={2} className={"header__branding__title"}>
          fingerprints
        </Title>
      </div>
      {user?.email && (
        <div className="header__menu">
          <img alt="avatar" src={user.picture} />
          <span>{user?.email}</span>
          <ChevronDownIcon />
          <div className="header__menu__submenu">
            {profile?.role !== "SUPER_ADMIN" && (
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
            )}
            {roleBasedBtn}
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
