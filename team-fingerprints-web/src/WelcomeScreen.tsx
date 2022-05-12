import { Button, Center, Text, Title } from "@mantine/core";
import { ReactComponent as Manager } from "./assets/Manager-background.svg";
import { ReactComponent as Employer } from "./assets/Employer-background.svg";
import { ReactComponent as Thunder } from "./assets/Thunder.svg";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingData from "./components/LoadingData";

const WelcomeScreen = () => {
  const { isLoading } = useAuth0();
  const navigate = useNavigate();

  if (isLoading) {
    <div className="welcome-screen">
      <LoadingData title="Loading profile data" />
    </div>;
  }

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
            onClick={() => navigate("/intro/leader")}
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
            onClick={() => navigate("/intro/member")}
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
