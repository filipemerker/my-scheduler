import * as Label from "@radix-ui/react-label";
import styles from "./TextField.module.css";

interface TextFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
  multiline,
  rows = 4,
}: TextFieldProps) {
  const InputComponent = multiline ? "textarea" : "input";

  return (
    <div className={styles.field}>
      {label && <Label.Root className={styles.label}>{label}</Label.Root>}
      <InputComponent
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={multiline ? rows : undefined}
      />
    </div>
  );
}
