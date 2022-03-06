import React, { FC } from "react";
import classnames from "classnames";

import "./styles.sass";

interface IProps {
  value: boolean;
  setValue: (newVal: boolean) => void;
}

export const Switch: FC<IProps> = ({ value, setValue }) => {
  return (
    <div
      className={classnames("switch", { "switch--active": value })}
      onClick={() => setValue(!value)}
    >
      <div className="switch__point"></div>
    </div>
  );
};
