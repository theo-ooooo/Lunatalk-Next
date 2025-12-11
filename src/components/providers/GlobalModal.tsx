"use client";

import Modal from "@/components/ui/Modal";
import { useModalStore } from "@/store/useModalStore";

export default function GlobalModal() {
  const { isOpen, title, content, footer, closeModal } = useModalStore();

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={title}
      footer={footer}
    >
      {content}
    </Modal>
  );
}

