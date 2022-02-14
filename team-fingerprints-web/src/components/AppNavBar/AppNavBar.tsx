import { Navbar, Avatar, Text, Group, UnstyledButton } from "@mantine/core";
import { DashboardIcon, CheckboxIcon, HomeIcon } from "@modulz/radix-icons";
import { useStyles } from "./styles";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ProfileContext } from "../../routes";

const AppNavBar = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const { profile } = useContext(ProfileContext);

  if (profile?.role === "SUPER_ADMIN") {
    return (
      <Navbar height={600} padding="xs" width={{ base: 300 }}>
        <Navbar.Section className={classes.sectionItem}>
          <UnstyledButton onClick={() => navigate("/surveys")}>
            <Group>
              <Avatar size={40} color="blue">
                <DashboardIcon />
              </Avatar>

              <Text color="blue">Surveys</Text>
            </Group>
          </UnstyledButton>
        </Navbar.Section>
        <Navbar.Section className={classes.sectionItem}>
          <UnstyledButton onClick={() => navigate("/companies")}>
            <Group>
              <Avatar size={40} color="cyan">
                <HomeIcon />
              </Avatar>

              <Text color="cyan">Companies</Text>
            </Group>
          </UnstyledButton>
        </Navbar.Section>
      </Navbar>
    );
  }

  return <div />;
};

export default AppNavBar;
