import { FC } from "react";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { SunIcon, MoonIcon } from "@modulz/radix-icons";
import { useStyles } from "./styles";

const DarkMoreToogle: FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { classes } = useStyles();

  return (
    <ActionIcon
      variant="outline"
      color={dark ? "yellow" : "blue"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? (
        <SunIcon className={classes.icon} />
      ) : (
        <MoonIcon className={classes.icon} />
      )}
    </ActionIcon>
  );
};

export default DarkMoreToogle;
