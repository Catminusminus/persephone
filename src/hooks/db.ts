import { useState, useEffect } from "react";
import { KVSIndexedSchema, KVSIndexedDB, kvsIndexedDB } from "@kvs/indexeddb";

export const useDB = () => {
  const [init, setInit] = useState(true);
  const [storage, setStorage] = useState<KVSIndexedDB<KVSIndexedSchema>>(null);
  useEffect(() => {
    if (init) {
      // eslint-disable-next-line no-void
      void (async () => {
        const db = await kvsIndexedDB({
          name: "contents",
          version: 1,
        });
        setStorage(db);
      })().then(() => setInit(false));
    }
  }, [init]);
  const changeContentToDB = async (id: string, index: number, text: string) => {
    await storage.set(id, { index, text });
  };
  const deleteContentFromDB = async (id: string, index: number) => {
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
  return {
    changeContentToDB,
    deleteContentFromDB,
    init,
    storage,
  };
};
