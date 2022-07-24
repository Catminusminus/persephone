import { useLayoutEffect, useState } from "react";
import { kvsIndexedDB } from "@kvs/indexeddb";
import { useContents } from "./contents";
import { ID, Text, Contents, Content } from "../types";

const storage = await kvsIndexedDB({
  name: "contents",
  version: 1,
});

export const changeContentToDB = async (
  id: string,
  index: number,
  text: string
) => {
  console.log(storage);
  await storage.set(id, { index, text });
};

export const deleteContentFromDB = async (id: string, index: number) => {
  await storage.delete(id);
  const oldIndex = index;
  for await (const [key, value] of storage) {
    if (value.index <= oldIndex) {
      await storage.set(key, value);
    } else {
      await storage.set(key, { index: value.index - 1, text: value.text });
    }
  }
};

export const useApp = () => {
  const [appInit, setAppInit] = useState(true);
  const { defaultID, values, addValue, removeValue, changeText, setValues } =
    useContents();
  useLayoutEffect(() => {
    if (appInit) {
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
  }, [appInit]);
  return {
    values,
    addValue,
    removeValue,
    changeText,
    appInit,
  };
};
