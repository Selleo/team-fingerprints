import classNames from "classnames";
import { ReactNode } from "react";
import { Modal } from "@mantine/core";

import "./styles.sass";

type Props = {
  children: ReactNode;
  modalVisible?: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  modalMessage?: string;
  className?: string;
};

const ModalWrapper = ({
  children,
  modalVisible,
  setModalVisible,
  modalMessage,
  className,
}: Props) => {
  return (
    <Modal
      opened={Boolean(modalVisible)}
      onClose={() => setModalVisible(false)}
      classNames={{
        modal: `modal ${className}`,
        header: classNames("modal__header", {
          [`${className}__header`]: className,
        }),
      }}
    >
      <div
        className={classNames("modal__content", {
          [`${className}__content`]: className,
        })}
      >
        {modalMessage && (
          <div
            className={classNames("modal__msg", {
              [`${className}__msg`]: className,
            })}
          >
            {modalMessage}
          </div>
        )}
        <div
          className={classNames("modal__wrapper", {
            [`${className}__wrapper`]: className,
          })}
        >
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default ModalWrapper;
