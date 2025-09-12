import React from "react";
type ModalProps = {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
};
declare const Modal: React.FC<ModalProps>;
export default Modal;
