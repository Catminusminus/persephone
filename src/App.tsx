import { useEffect } from "react";
import { parser } from "react-split-mde/lib/parser";
import { Editor } from "./containers/Editor";
import { useContents } from "./hooks/contents";
import { useDB } from "./hooks/db";
import { ID, Text } from "./types";
import "react-split-mde/css/index.css";

export const App = () => {
  const { values, addValue, removeValue, changeText } = useContents();
  const { changeContentToDB, deleteContentFromDB, init, storage } = useDB();
  useEffect(() => {
    if (!init) {
      console.log(storage);
      void (async () => {
        for await (const [key, value] of storage) {
          addValue(key as ID, value as Text);
        }
      })();
    }
  }, [init, storage, addValue]);
  console.log(values);
  return (
    <div className="editor-demo">
      <Editor
        values={values}
        addValue={addValue}
        removeValue={removeValue}
        onChange={changeText}
        parser={parser}
        changeContentToDB={changeContentToDB}
        deleteContentFromDB={deleteContentFromDB}
      />
    </div>
  );
};
