import { useState } from "react";
import { nanoid } from "nanoid";
import { Text, Contents, ID } from "../types";
import { createContents } from "../util";

const defaultText = "# React Split MDE" as Text;
const defaultID = nanoid() as ID;
export const useContents = () => {
  const [values, setValues] = useState<Contents>(
    new Map<ID, Text>([[defaultID, defaultText]])
  );
  const addValue = (id: ID, newText: Text) => {
    setValues((oldValues) => {
      oldValues.set(id, newText);
      return createContents(oldValues);
    });
  };
  const removeValue = (id: ID) => {
    setValues((oldValues) => {
      oldValues.delete(id);
      return createContents(oldValues);
    });
  };
  const changeText = (id: ID, text: Text) => {
    setValues((oldValues) => {
      oldValues.set(id, text);
      return createContents(oldValues);
    });
  };
  return {
    values,
    addValue,
    removeValue,
    changeText,
  };
};
