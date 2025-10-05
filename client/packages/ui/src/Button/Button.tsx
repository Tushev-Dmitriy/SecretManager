import type { ComponentProps } from "react";

import clsx from "clsx";

import styles from "./Button.module.css";

interface ButtonProps extends ComponentProps<"button"> {
  size?: "m" | "s";
}

export const Button = ({
  type = "button",
  size = "m",
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(styles.button, styles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
