import { useEffect, useState } from "react";
import { useContents } from "./contents";
import { useDB } from "./db";
import { ID, Text, Contents, Content } from "../types";

export const useApp = () => {
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
  }, [init, storage, appInit]);
  return {
    values,
    addValue,
    removeValue,
    changeText,
    changeContentToDB,
    deleteContentFromDB,
  };
};
