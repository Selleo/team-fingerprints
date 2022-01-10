import {
  Header,
  Text,
  useMantineTheme,
  MediaQuery,
  Burger,
  Title,
  Button,
} from "@mantine/core";
import { useState } from "react";
import { useStyles } from "./styles";
import DarkMoreToogle from "../DarkModeToogle";
import { useAuth0 } from "@auth0/auth0-react";

const AppHeader = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles();

  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();

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
          </div>
        )}
        <div className={classes.loginButton}>
          {isAuthenticated ? (
            <Button
              onClick={() =>
                logout({
                  returnTo: window.location.origin,
                })
              }
            >
              Logout
            </Button>
          ) : (
            <Button onClick={() => loginWithRedirect()}>Login</Button>
          )}
        </div>
        <div className={classes.flex0}>
          <DarkMoreToogle />
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
