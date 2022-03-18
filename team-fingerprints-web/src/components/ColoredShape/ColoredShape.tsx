import React, { FC } from "react";
import "./styles.sass";
import { Shape } from "../../types/models";

import { ReactComponent as SquareIcon } from "../../assets/shapes/Square.svg";
import { ReactComponent as CircleIcon } from "../../assets/shapes/Circle.svg";
import { ReactComponent as TriangleIcon } from "../../assets/shapes/Triangle.svg";

interface IProps {
  color?: string;
  shape?: Shape;
  className: string;
}

const ColoredShape: FC<IProps> = ({ color, shape, className }) => {
  if (!color || !shape) return null;

  switch (shape) {
    case "square":
      return <SquareIcon className={className} stroke={color} />;
    case "circle":
      return <CircleIcon className={className} stroke={color} />;
    case "triangle":
      return <TriangleIcon className={className} stroke={color} />;
    case "trapeze":
      return <SquareIcon className={`trapeze ${className}`} stroke={color} />;
  }
};

export default ColoredShape;
