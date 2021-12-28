import React, { useState } from "react";
import cx from "classnames";

interface ButtonProps {
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<
  ButtonProps & React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, disabled = false, loading = false, ...props }) => {
  return (
    <button
      className={cx(
        "btn",
        className,
        { "opacity-50": disabled || loading },
        { "cursor-not-allowed": disabled || loading }
      )}
      disabled={disabled || loading}
    >
      {children}
    </button>
  );
};
