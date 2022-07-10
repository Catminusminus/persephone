import { useState } from "react";
import { parser } from "react-split-mde/lib/parser";
import { nanoid } from "nanoid";
import { Editor } from "./containers/Editor";
import "react-split-mde/css/index.css";
import { Text, Contents, ID } from "./types";
import { createContents } from "./util";

const defaultText = "# React Split MDE" as Text;
const defaultID = nanoid() as ID;

export const App = () => {
  const [values, setValues] = useState<Contents>(
    new Map<ID, Text>([[defaultID, defaultText]])
  );
  const addValue = (newText: Text) => {
    setValues((oldValues) => {
      oldValues.set(nanoid() as ID, newText);
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
  console.log(values);
  return (
    <div className="editor-demo">
      <Editor
        values={values}
        addValue={addValue}
        removeValue={removeValue}
        onChange={changeText}
        parser={parser}
      />
    </div>
  );
};
