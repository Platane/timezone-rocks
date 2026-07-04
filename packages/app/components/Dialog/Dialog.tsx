import React from "react";
import s from "./Dialog.module.css";

export const DialogModal = ({
  open,
  className,
  ...props
}: React.ComponentProps<"dialog">) => {
  return (
    <dialog
      {...(props as any)}
      className={[s.dialogModal, className].filter(Boolean).join(" ")}
      ref={React.useCallback(
        (dialog: HTMLDialogElement | null) => {
          if (!dialog) return;
          if (open) dialog.showModal();
          else dialog.close();
        },
        [open]
      )}
      onClick={onClickOutSideClose}
    />
  );
};

const onClickOutSideClose = (e: React.MouseEvent) => {
  const target = e.target;

  if (!isHTMLDialogElement(target)) return;

  const rect = target.getBoundingClientRect();

  const clickedInDialog =
    rect.top <= e.clientY &&
    e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX &&
    e.clientX <= rect.left + rect.width;

  if (clickedInDialog === false) target.close();
};

const isHTMLDialogElement = (e: any): e is HTMLDialogElement =>
  e?.tagName === "DIALOG";
const isHTMLElement = (e: any): e is HTMLElement => !!e?.tagName;

/**
 * attach that to a onClick to close the parent dialog
 */
export const closeDialog = (e: React.MouseEvent) => {
  let target: HTMLElement | null = e.target as HTMLElement;
  while (isHTMLElement(target)) {
    if (isHTMLDialogElement(target)) {
      target.close();
      return;
    }
    target = target.parentElement;
  }
};

export const CloseDialogButton = (props: React.ComponentProps<"button">) => (
  <button type="button" className={s.closeDialogButton} onClick={closeDialog}>
    {(props.children as any) ?? "×"}
  </button>
);
