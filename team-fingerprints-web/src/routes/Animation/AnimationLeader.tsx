import { Button } from "@mantine/core";
import { useLottie } from "lottie-react";
import { useNavigate } from "react-router-dom";
import json from "./leader.json";

import "./styles.sass";

const AnimationLeader = () => {
  const navigate = useNavigate();

  const skip = () => navigate("/landing");

  const { View } = useLottie({
    animationData: json,
    autoPlay: true,
    loop: false,
    onComplete: () => {
      skip();
    },
  });

  return (
    <div className="animation">
      {View}
      <Button
        variant="subtle"
        className="animation__floating-button"
        onClick={skip}
      >
        Skip
      </Button>
    </div>
  );
};

export default AnimationLeader;
