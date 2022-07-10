import { Contents, ID, Text } from "./types";

export const classNames = (...classes: string[]) =>
  classes.filter(Boolean).join(" ");
export const createContents = (contents: Contents) =>
  new Map<ID, Text>(contents);
