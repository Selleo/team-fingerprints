import { useState, ReactNode } from "react";
import ModalWrapper from "../ModalWrapper";

type Props = {
  children: (
    changeModalState: (modalVisible: boolean) => void
  ) => ReactNode | ReactNode;
  renderTrigger: (
    changeModalState: (modalVisible: boolean) => void
  ) => ReactNode;
  modalMessage: string;
};

const ModalTrigger = ({ children, renderTrigger, ...restProps }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {renderTrigger(setModalVisible)}
      <ModalWrapper
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        {...restProps}
      >
        {typeof children === "function" ? children(setModalVisible) : children}
      </ModalWrapper>
    </>
  );
};

export default ModalTrigger;
