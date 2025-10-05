import type { ComponentProps } from "react";

import clsx from "clsx";

import styles from "./Form.module.css";

interface FormProps extends ComponentProps<"form"> {
  contentClassName?: string;
  title?: string;
}

export const Form = ({
  title,
  children,
  className,
  contentClassName,
  ...props
}: FormProps) => {
  return (
    <div className={clsx(styles.container, className)}>
      {title && <h1 className={styles.title}>{title}</h1>}
      <form className={clsx(styles.form, contentClassName)} {...props}>
        {children}
      </form>
    </div>
  );
};
