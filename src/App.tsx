import { useEffect, useState } from "react";
import { parser } from "react-split-mde/lib/parser";
import { Editor } from "./containers/Editor";
import { useContents } from "./hooks/contents";
import { useDB } from "./hooks/db";
import { ID, Text, Contents, Content } from "./types";
import "react-split-mde/css/index.css";

export const App = () => {
  const [appInit, setAppInit] = useState(true);
  const { defaultID, values, addValue, removeValue, changeText, setValues } =
    useContents();
  const { changeContentToDB, deleteContentFromDB, init, storage } = useDB();
  useEffect(() => {
    if (!init && appInit) {
      console.log(storage);
      void (async () => {
        const newValues: Contents = new Map<ID, Content>();
        for await (const [key, value] of storage) {
          newValues.set(key, { index: value.index, text: value.text as Text });
        }
        if (newValues.size === 0) {
          await storage.set(defaultID, values.get(defaultID));
          newValues.set(defaultID, values.get(defaultID));
        }
        setAppInit(false);
        setValues(newValues);
      })();
    }
  }, [init, storage, addValue, appInit]);
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
