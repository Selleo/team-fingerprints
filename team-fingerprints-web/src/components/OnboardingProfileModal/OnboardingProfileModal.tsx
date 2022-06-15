import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../Modals/ModalWrapper";

import "./styles.sass";

export type Props = {
  visibleProfileModal: boolean;
  setVisibleProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const OnboardingProfileModal = ({
  visibleProfileModal,
  setVisibleProfileModal,
}: Props) => {
  const navigate = useNavigate();

  return (
    <ModalWrapper
      modalMessage="Oh no! It looks like your profile is not filled. You are only one
      step away from getting started with Fingerprints! Fill your profile before answering surveys."
      modalVisible={visibleProfileModal}
      setModalVisible={setVisibleProfileModal}
    >
      <Button
        onClick={() => {
          navigate("profile");
          setVisibleProfileModal(false);
        }}
        className="onboarding-profile-modal__button"
      >
        Go to profile
      </Button>
    </ModalWrapper>
  );
};

export default OnboardingProfileModal;
