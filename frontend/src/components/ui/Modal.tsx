import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
};

export function Modal({
  title,
  children,
  onClose,
  wide,
}: ModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        className={`relative w-full ${
          wide ? "max-w-2xl" : "max-w-md"
        } bg-white rounded-xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}