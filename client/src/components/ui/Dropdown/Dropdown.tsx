import { DropdownMenu } from "@radix-ui/themes";

interface DropdownContentProps {
  children: React.ReactNode;
}

export function DropdownContent({ children }: DropdownContentProps) {
  return (
    <DropdownMenu.Content variant="soft" size="2" className="dropdown-content">
      {children}
    </DropdownMenu.Content>
  );
}

// Re-export everything from Radix for convenience
export const Dropdown = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;
export const DropdownItem = DropdownMenu.Item;
export const DropdownSeparator = DropdownMenu.Separator;
