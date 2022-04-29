import { Button, Center, Text, Title } from "@mantine/core";
import { ReactComponent as Manager } from "./assets/Manager-background.svg";
import { ReactComponent as Employer } from "./assets/Employer-background.svg";
import { ReactComponent as Thunder } from "./assets/Thunder.svg";

type LoginScreenProps = {
  loginWithRedirect: any;
  isLoading: any;
  pathname: any;
};

const WelcomeScreen = (props: LoginScreenProps) => {
  const { loginWithRedirect, isLoading, pathname } = props;

  return (
    <div className="welcome-screen">
      <div className="login-box login-box-manager">
        <Center className="login">
          <Title order={1} className="login__header">
            <Text className="login__header-span">I am manager!</Text>
          </Title>
          <Text className="login__text">
            A good leader fosters a positive working environment and ensures the
            right level of empowerment.
          </Text>
          <Button
            className="login__button --manager"
            onClick={() =>
              loginWithRedirect({
                connection: "google-oauth2",
                appState: { returnTo: pathname },
              })
            }
          >
            {isLoading ? "Loading" : "Get Started"}
          </Button>
        </Center>
        <div className="login-background">
          <Manager />
        </div>
      </div>
      <div className="login-box login-box-employer">
        <Center className="login">
          <Title order={1} className="login__header">
            <Text className="login__header-span">I am employer!</Text>
          </Title>
          <Text className="login__text">
            A good leader fosters a positive working environment and ensures the
            right level of empowerment.
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
            {isLoading ? "Loading" : "Get Started"}
          </Button>
        </Center>
        <div className="login-background">
          <Employer />
        </div>
      </div>
      <div className="thunder">
        <Thunder />
      </div>
    </div>
  );
};

export default WelcomeScreen;
