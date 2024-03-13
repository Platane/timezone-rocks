import { styled } from "@linaria/react";
import React from "react";

export const DialogModal = ({
  open,
  ...props
}: React.ComponentProps<"dialog">) => {
  const ref = React.useRef<HTMLDialogElement | null>(null);
  React.useLayoutEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);

  return (
    <DialogModalContainer ref={ref} {...props} onClick={onClickOutSideClose} />
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

const DialogModalContainer = styled.dialog`
  border-radius: 8px;
  box-shadow: 0 0 6px 0 #333;
  border: solid #aaa 1px;
  background-color: #fff;
  min-width: min(720px, 100vw - max(16px, var( --scrollbar-width )) * 2);
  min-height: min(500px, 60vh);
  max-height: min(720px, 100vh - 32px);
  position: relative;

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.25);
    background-image: radial-gradient(
      ellipse at center,
      transparent 0,
      transparent 70%,
      rgba(0, 0, 0, 0.05) 100%
    );
  }
`;

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
  <CloseDialogButtonContainer onClick={closeDialog}>
    {props.children ?? "×"}
  </CloseDialogButtonContainer>
);

const CloseDialogButtonContainer = styled.button`
  all: unset;
  position: absolute;
  top: 12px;
  right: 12px;
  border-radius: 50%;
  height: 24px;
  width: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:focus-visible {
    box-shadow: 0 0 0 2px -webkit-focus-ring-color;
    box-shadow: 0 0 0 2px Highlight;
  }
`;
