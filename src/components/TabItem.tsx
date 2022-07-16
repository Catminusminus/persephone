import { Tab } from "@headlessui/react";
import { XIcon, DocumentIcon } from "@heroicons/react/solid";
import { memo } from "react";
import { ID } from "../types";

type TabItemProps = {
  index: number;
  id: ID;
  selectedTab: number;
  size: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  removeValue: (id: ID, index: number) => void;
  deleteContentFromDB: (id: string, index: number) => Promise<void>;
};

export const TabItem: React.FC<TabItemProps> = memo(
  ({
    index,
    id,
    selectedTab,
    size,
    setSelectedTab,
    removeValue,
    deleteContentFromDB,
  }) => (
    <Tab
      key={index}
      className={({ selected }) => (selected ? "w-full bg-blue-500" : "w-full")}
    >
      {index === selectedTab ? (
        <button
          type="button"
          onClick={() => {
            if (size === 1) {
              return;
            }
            if (selectedTab === 0) {
              setSelectedTab(1);
              removeValue(id, index);
              // eslint-disable-next-line no-void
              void deleteContentFromDB(id as string, index);
            }
            setSelectedTab((selected) => selected - 1);
            removeValue(id, index);
            // eslint-disable-next-line no-void
            void deleteContentFromDB(id as string, index);
          }}
        >
          <XIcon className="h-5 w-5 hover:bg-slate-200" />
        </button>
      ) : (
        <DocumentIcon className="h-5 w-5" />
      )}
    </Tab>
  )
);
