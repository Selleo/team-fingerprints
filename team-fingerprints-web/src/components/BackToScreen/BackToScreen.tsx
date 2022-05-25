import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as LeftArrowIcon } from "../../assets/LeftArrow.svg";

import "./styles.sass";

interface IProps {
  name?: string;
}

const BackToScreen: FC<IProps> = ({ name = "Dashboard" }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(-1)} className="back__wrapper">
      <LeftArrowIcon className="left-arrow" />
      <span>Back to {name}</span>
    </div>
  );
};

export default BackToScreen;
