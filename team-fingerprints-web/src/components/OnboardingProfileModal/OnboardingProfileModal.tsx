import { Button } from "@mantine/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../routes";
import ModalWrapper from "../Modals/ModalWrapper";

import "./styles.sass";

const LOCAL_STORAGE_FLAG = "profileCheck";

export const OnboardingProfileModal = () => {
  const [visible, setVisible] = useState(false);
  const { profile } = useContext(ProfileContext);
  const navigate = useNavigate();
  const guardCheck = useRef<boolean>(false);

  useEffect(() => {
    if (profile && !guardCheck.current) {
      if (!profile.userDetails && !localStorage.getItem(LOCAL_STORAGE_FLAG)) {
        setVisible(true);
      }
      guardCheck.current = true;
    }
  }, [profile]);

  return (
    <ModalWrapper
      modalMessage="It looks like you are logging in for the first time. You are only one
      step away from getting started with Fingerprints! Fill in your basic
      information like gender and job title."
      modalVisible={visible}
      setModalVisible={setVisible}
    >
      <Button
        onClick={() => {
          navigate("profile");
          setVisible(false);
          localStorage.setItem(LOCAL_STORAGE_FLAG, "done");
        }}
        className="onboarding-profile-modal__button"
      >
        Go to profile
      </Button>
    </ModalWrapper>
  );
};

export default OnboardingProfileModal;
