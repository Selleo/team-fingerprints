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
    <ThemeIcon style={{ backgroundColor: "#48bd66" }} size={30} radius="xl">
      <ResetIcon style={{ color: '#2b2b2b' }} />
    </ThemeIcon>
  );
};

export const PrimaryIcon = () => {
  return (
    <ThemeIcon style={{ backgroundColor: "#FEC92D" }} size={30} radius="xl">
      <CheckboxIcon style={{ color: '#2b2b2b' }} />
    </ThemeIcon>
  );
};
