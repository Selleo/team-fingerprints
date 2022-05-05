import { useState, ReactNode } from "react";
import ModalWrapper from "../ModalWrapper";

type Props = {
  children: (arg0: (arg0: boolean) => void) => ReactNode | ReactNode;
  renderTrigger: (arg0: (arg0: boolean) => void) => ReactNode;
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
