import { useState, useEffect } from "react";
import { KVSIndexedSchema, KVSIndexedDB, kvsIndexedDB } from "@kvs/indexeddb";

export const useDB = () => {
  const [init, setInit] = useState(true);
  const [storage, setStorage] = useState<KVSIndexedDB<KVSIndexedSchema>>(null);
  useEffect(() => {
    if (init) {
      // TODO
      // eslint-disable-next-line no-void
      void (async () => {
        const db = await kvsIndexedDB({
          name: "contents",
          version: 1,
        });
        setStorage(db);
      })();
      setInit(false);
    }
  }, [init]);
  const changeContentToDB = async (id: string, text: string) => {
    await storage.set(id, text);
    console.log(text);
  };
  const deleteContentFromDB = async (id: string) => {
    await storage.delete(id);
  };
  return {
    changeContentToDB,
    deleteContentFromDB,
    init,
    storage,
  };
};
