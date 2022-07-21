import { useState } from "react";
import { Text, Contents, ID, Content } from "../types";
import { createContents } from "../util";

const defaultText = "# React Split MDE" as Text;
const zero = 0;
const defaultID = zero.toString() as ID;
export const useContents = () => {
  const [values, setValues] = useState<Contents>(
    new Map<ID, Content>([[defaultID, { index: zero, text: defaultText }]])
  );
  const addValue = (id: ID, index: number, text: Text) => {
    setValues((oldValues) => {
      oldValues.set(id, { index, text });
      return createContents(oldValues);
    });
  };
  const removeValue = (id: ID, index: number) => {
    setValues((oldValues) => {
      const oldIndex = index;
      oldValues.delete(id);
      const newValue = new Map<ID, Content>();
      for (const [id, value] of oldValues) {
        if (value.index <= oldIndex) {
          newValue.set(id, value);
        } else {
          newValue.set(id, { index: value.index - 1, text: value.text });
        }
      }
      return newValue;
    });
  };
  const changeText = (id: ID, index: number, text: Text) => {
    setValues((oldValues) => {
      oldValues.set(id, { index, text });
      return createContents(oldValues);
    });
  };
  return {
    defaultID,
    values,
    addValue,
    removeValue,
    changeText,
    setValues,
  };
};
