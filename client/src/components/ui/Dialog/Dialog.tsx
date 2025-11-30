import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Theme } from "@radix-ui/themes";
import styles from "./Dialog.module.css";

// Regular Dialog
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay() {
  return <DialogPrimitive.Overlay className={styles.overlay} />;
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return (
    <DialogPrimitive.Content className={styles.content}>
      <Theme>{children}</Theme>
    </DialogPrimitive.Content>
  );
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return (
    <DialogPrimitive.Title className={styles.title}>
      {children}
    </DialogPrimitive.Title>
  );
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return (
    <DialogPrimitive.Description className={styles.description}>
      {children}
    </DialogPrimitive.Description>
  );
}

// Alert Dialog
export const AlertDialog = AlertDialogPrimitive.Root;

export function AlertDialogOverlay() {
  return <AlertDialogPrimitive.Overlay className={styles.overlay} />;
}

export function AlertDialogContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content className={styles.content}>
        <Theme>{children}</Theme>
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogTitle({ children }: { children: React.ReactNode }) {
  return (
    <AlertDialogPrimitive.Title className={styles.title}>
      {children}
    </AlertDialogPrimitive.Title>
  );
}

export function AlertDialogDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AlertDialogPrimitive.Description className={styles.description}>
      {children}
    </AlertDialogPrimitive.Description>
  );
}

export const AlertDialogCancel = AlertDialogPrimitive.Cancel;
export const AlertDialogAction = AlertDialogPrimitive.Action;
