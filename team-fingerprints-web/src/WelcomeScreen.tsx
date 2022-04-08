import { Button, Center, MantineProvider, Text, Title } from "@mantine/core";
import { ReactComponent as BGIcons } from "./assets/BGIcons.svg";
import { useCallback } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

type LoginScreenProps = {
  loginWithRedirect: any;
  isLoading: any;
  pathname: any;
};

const WelcomeScreen = (props: LoginScreenProps) => {
  const { loginWithRedirect, isLoading, pathname } = props;
  const navigate = useNavigate();

  return (
    <>
      <Center className="login">
        <Title order={1} className="login__header">
          Welcome to
          <Text className="login__header-span">Selleo Fingerprint</Text>
        </Title>
        <Text className="login__text">
          Find out what the values of employees, companies and teams are.
          Compare charts and data. Create surveys you dream about.
        </Text>
        <Button
          className="login__button"
          onClick={() =>
            loginWithRedirect({
              connection: "google-oauth2",
              appState: { returnTo: pathname },
            })
          }
        >
          {isLoading ? "Loading" : "Log in"}
        </Button>
        <Button
          className="login__public"
          onClick={() => {
            navigate("/public");
          }}
        >
          Public Surveys
        </Button>
      </Center>
      <div className="svg-background">
        <BGIcons />
      </div>
    </>
  );
};

export default WelcomeScreen;
