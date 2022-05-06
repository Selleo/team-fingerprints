import { Button } from "@mantine/core";
import { ReactNode } from "react";
import ModalTrigger from "../ModalTrigger";

type Props = {
  onConfirm: () => void;
  renderTrigger: (
    changeModalState: (modalVisible: boolean) => void
  ) => ReactNode;
  modalMessage: string;
};

const ModalConfirmTrigger = ({ onConfirm, ...restProps }: Props) => {
  return (
    <ModalTrigger {...restProps}>
      {(setModalVisible) => (
        <>
          <Button
            className="modal__button modal__button__confirm"
            onClick={() => {
              onConfirm();
              setModalVisible(false);
            }}
          >
            Confirm
          </Button>
          <Button
            className="modal__button modal__button__cancel"
            onClick={() => setModalVisible(false)}
          >
            Cancel
          </Button>
        </>
      )}
    </ModalTrigger>
  );
};

export default ModalConfirmTrigger;
