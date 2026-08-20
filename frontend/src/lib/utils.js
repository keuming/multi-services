import clsx from "clsx";

/** Small wrapper so every component imports classnames from one place. */
export function cn(...inputs) {
  return clsx(...inputs);
}
