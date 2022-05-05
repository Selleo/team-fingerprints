import { ReactNode } from "react";
import { Modal } from "@mantine/core";

import "./styles.sass";

type Props = {
  children: ReactNode;
  modalVisible: boolean;
  setModalVisible: (arg0: boolean) => void;
  modalMessage?: string;
};

const ModalWrapper = ({
  children,
  modalVisible,
  setModalVisible,
  modalMessage,
}: Props) => {
  return (
    <>
      <Modal
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        classNames={{
          modal: "modal",
          header: "modal__header",
        }}
      >
        <div className="modal__content">
          {modalMessage && <div className="modal__msg">{modalMessage}</div>}
          <div className="modal__buttons-wrapper">{children}</div>
        </div>
      </Modal>
    </>
  );
};

export default ModalWrapper;
