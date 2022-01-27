import { Navbar, Avatar, Text, Group, UnstyledButton } from "@mantine/core";
import {
  DashboardIcon,
  PersonIcon,
  CheckboxIcon,
  HomeIcon,
} from "@modulz/radix-icons";
import { useStyles } from "./styles";
import { useNavigate } from "react-router-dom";

const AppNavBar = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

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
        <UnstyledButton onClick={() => navigate("/users")}>
          <Group>
            <Avatar size={40} color="pink">
              <PersonIcon />
            </Avatar>

            <Text color="pink">Users</Text>
          </Group>
        </UnstyledButton>
      </Navbar.Section>
      <Navbar.Section className={classes.sectionItem}>
        <UnstyledButton onClick={() => navigate("/responses")}>
          <Group>
            <Avatar size={40} color="green">
              <CheckboxIcon />
            </Avatar>

            <Text color="greek">Responses</Text>
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
};

export default AppNavBar;
