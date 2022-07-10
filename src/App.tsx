import { FC, useState, startTransition } from "react";
import { RecoilRoot } from "recoil";
import { Editor } from "./containers/Editor";
import { parser } from "react-split-mde/lib/parser";
import "react-split-mde/css/index.css";
import { Text, Contents, ID } from "./types";
import { nanoid } from "nanoid";

const defaultText = "# React Split MDE" as Text;
const defaultID = nanoid() as ID;

export const App = () => {
  const [values, setValues] = useState<Contents>([{id:defaultID, text:defaultText}]);
  const [v, setV] = useState(0);
  const addValue = (newText: Text) => {
    setValues(oldValues => [...oldValues, {id: nanoid() as ID, text: newText}]);
  };
  const removeValue = (id: ID) => {
    setValues(oldValues => oldValues.length > 1? (oldValues.filter(value => value.id !== id)) as Contents: oldValues);
  };
  const changeText = (id: number, text: Text) => {
    setValues(oldValues => {
      oldValues[id].text = text;
      return [...oldValues];
    });
  }
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
