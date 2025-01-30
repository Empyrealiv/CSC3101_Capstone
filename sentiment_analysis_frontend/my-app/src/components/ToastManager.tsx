import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToast, removeToast } from "../actions/index.ts";
import { Toast, Button } from "react-bootstrap";
import { selectToastManagerState } from "../selectors/index.ts";

export const ToastManager = () => {
  const dispatch = useDispatch();
  const toasts = useSelector(selectToastManagerState);

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 1050,
      }}
    >
      {toasts && toasts.toastState.map((toast) => (
        <Toast key={toast.id} onClose={() => dispatch(removeToast(toast.id))}>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </div>
  );
};