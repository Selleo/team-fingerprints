import {
  GridIcon,
  SliderIcon,
  CheckboxIcon,
  ResetIcon,
} from "@modulz/radix-icons";
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
    <ThemeIcon color="green" size={30} radius="xl">
      <ResetIcon />
    </ThemeIcon>
  );
};

export const PrimaryIcon = () => {
  return (
    <ThemeIcon color="blue" size={30} radius="xl">
      <CheckboxIcon />
    </ThemeIcon>
  );
};
