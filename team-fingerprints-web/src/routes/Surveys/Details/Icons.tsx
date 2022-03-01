import { GridIcon, SliderIcon } from "@modulz/radix-icons";
import { Text } from "@mantine/core";
import { ThemeIcon } from "@mantine/core";

export const CategoryIcon = () => {
  return (
    <ThemeIcon size={30} color="pink" variant="light" radius="xl">
      <GridIcon />
    </ThemeIcon>
  );
};

export const TrendIcon = () => {
  return (
    <ThemeIcon size={30} color="yellow" variant="light" radius="xl">
      <SliderIcon />
    </ThemeIcon>
  );
};

export const SecondaryIcon = () => {
  return (
    <ThemeIcon style={{ backgroundColor: "#48bd66" }} size={30} radius="xl">
      <Text style={{ color: "#2b2b2b" }}>S</Text>
    </ThemeIcon>
  );
};

export const PrimaryIcon = () => {
  return (
    <ThemeIcon style={{ backgroundColor: "#FEC92D" }} size={30} radius="xl">
      <Text style={{ color: "#2b2b2b" }}>P</Text>
    </ThemeIcon>
  );
};
