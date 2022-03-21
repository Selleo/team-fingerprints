import React, { FC } from "react";
import "./styles.sass";
import { Shape } from "../../types/models";

import { ReactComponent as SquareIcon } from "../../assets/shapes/Square.svg";
import { ReactComponent as CircleIcon } from "../../assets/shapes/Circle.svg";
import { ReactComponent as TriangleIcon } from "../../assets/shapes/Triangle.svg";

interface IProps {
  color?: string;
  shape?: Shape;
  className?: string;
}

const tomatoColor = "#c99284";

const ColoredShape: FC<IProps> = ({ color, shape, className }) => {
  switch (shape) {
    case "circle":
      return <CircleIcon className={className} stroke={color || tomatoColor} />;
    case "triangle":
      return (
        <TriangleIcon className={className} stroke={color || tomatoColor} />
      );
    case "trapeze":
      return (
        <SquareIcon
          className={`trapeze ${className}`}
          stroke={color || tomatoColor}
        />
      );
    default:
      return <SquareIcon className={className} stroke={color || tomatoColor} />;
  }
};

export default ColoredShape;
