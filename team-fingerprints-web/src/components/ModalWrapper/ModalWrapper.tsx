import { ReactNode } from "react";
import { Modal, Button } from "@mantine/core";

import "./styles.sass";

type Props = {
  children: ReactNode;
  modalVisible: boolean;
  setModalVisible: (arg0: boolean) => void;
  modalMsg: string;
  onConfirm: () => void;
};

const ModalWrapper = ({
  children,
  modalVisible,
  setModalVisible,
  modalMsg,
  onConfirm,
}: Props) => {
  return (
    <>
      {children}
      <Modal
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        classNames={{
          modal: "modal",
          header: "modal__header",
        }}
      >
        <div className="modal__content">
          <div className="modal__msg">{modalMsg}</div>
          <div className="modal__buttons-wrapper">
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
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalWrapper;
