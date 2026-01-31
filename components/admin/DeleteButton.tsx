"use client";

interface DeleteButtonProps {
  confirmMessage: string;
  children: React.ReactNode;
  className?: string;
}

export default function DeleteButton({
  confirmMessage,
  children,
  className = "",
}: DeleteButtonProps) {
  const handleClick = (e: React.FormEvent) => {
    if (!confirm(confirmMessage)) {
      e.preventDefault();
    }
  };

  return (
    <button type="submit" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
