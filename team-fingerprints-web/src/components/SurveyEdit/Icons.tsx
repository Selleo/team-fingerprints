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
    <ThemeIcon className="survey-edit__secondary-icon" size={30} radius="xl">
      <Text className="survey-edit__secondary-icon-text">S</Text>
    </ThemeIcon>
  );
};

export const PrimaryIcon = () => {
  return (
    <ThemeIcon className="survey-edit__primary-icon" size={30} radius="xl">
      <Text className="survey-edit__primary-icon-text">P</Text>
    </ThemeIcon>
  );
};
