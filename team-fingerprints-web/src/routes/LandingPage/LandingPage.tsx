import { Button, Center, Title, Text } from "@mantine/core";
import { ReactComponent as BGIcons } from "../../assets/BGIcons.svg";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const LandingPage = () => {
  const { loginWithRedirect, isLoading } = useAuth0();
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
              appState: { returnTo: "/" },
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
          Check global results
        </Button>
      </Center>
      <div className="svg-background">
        <BGIcons />
      </div>
    </>
  );
};

export default LandingPage;
