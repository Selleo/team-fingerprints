import {
  Header,
  useMantineTheme,
  MediaQuery,
  Burger,
  Title,
  Button,
} from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import { useStyles } from "./styles";
import DarkMoreToogle from "../DarkModeToogle";
import { useAuth0 } from "@auth0/auth0-react";
import { ProfileContext } from "../../routes";
import { useNavigate } from "react-router-dom";

const AppHeader = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles();
  const navigate = useNavigate();

  const { logout, user } = useAuth0();
  const { profile } = useContext(ProfileContext);

  const roleBasedBtn = useMemo(() => {
    if (profile?.role === "COMPANY_ADMIN") {
      const companyId = profile?.company?._id;

      return (
        <div className={classes.loginButton}>
          <Button
            color="yellow"
            onClick={() => {
              navigate(`companies/${companyId}`);
            }}
          >
            Manage company
          </Button>
        </div>
      );
    }

    if (profile?.role === "TEAM_LEADER") {
      const companyId = profile.company?._id;
      const teamId = profile.team?._id;

      return (
        <div className={classes.loginButton}>
          <Button
            color="yellow"
            onClick={() => {
              navigate(`companies/${companyId}/teams/${teamId}`);
            }}
          >
            Manage team
          </Button>
        </div>
      );
    }
  }, []);

  return (
    <Header height={70} padding="md">
      {/* Handle other responsive styles with MediaQuery component or createStyles function */}
      <div className={classes.flexWrapper}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <div className={classes.flex1}>
          <Title order={2}>Team Fingerprints Admin</Title>
        </div>
        {user?.email && (
          <div className={classes.flex0}>
            <strong>{user?.email}</strong>
            <strong> {profile?.role}</strong>
          </div>
        )}
        {profile?.role !== "SUPER_ADMIN" && (
          <div className={classes.loginButton}>
            <Button
              color="green"
              onClick={() => {
                navigate("responses");
              }}
            >
              Answer survey
            </Button>
          </div>
        )}
        {roleBasedBtn}
        <div className={classes.loginButton}>
          <Button
            onClick={() => {
              logout({
                returnTo: window.location.origin,
              });
              localStorage.removeItem("token");
            }}
          >
            Logout
          </Button>
        </div>
        <div className={classes.flex0}>
          <DarkMoreToogle />
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
