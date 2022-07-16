import { Tab } from "@headlessui/react";
import { PlusSmIcon, XIcon, DocumentIcon } from "@heroicons/react/solid";
import { useRef, useState, useCallback, useDeferredValue, memo } from "react";
import * as defaultCommands from "react-split-mde/lib/commands";
import { Preview } from "react-split-mde/lib/components/Preview";
import { Textarea } from "react-split-mde/lib/components/Textarea";
import { Command } from "react-split-mde/lib/types";
import { nanoid } from "nanoid";
import { Contents, Text, ID } from "../types";

type Props = {
  commands?: Record<string, Command>;
  previewClassName?: string;
  textareaClassName?: string;
  previewCallback?: Record<string, (node: any) => any>;
  parser: (text: string) => Promise<string>;
  values: Contents;
  onChange?: (id: ID, index: number, text: Text) => void;
  addValue: (id: ID, index: number, text: Text) => void;
  removeValue: (id: ID, index: number) => void;
  psudoMode?: boolean;
  debounceTime?: number;
  scrollSync?: boolean;
  placeholder?: string;
  changeContentToDB: (id: string, index: number, text: string) => Promise<void>;
  deleteContentFromDB: (id: string, index: number) => Promise<void>;
};

type TabItemProps = {
  index: number;
  id: ID;
  selectedTab: number;
  size: number;
  setSelectedTab: any;
  removeValue: any;
  deleteContentFromDB: any;
};

const TabItem: React.FC<TabItemProps> = memo(
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

export const Editor: React.FC<Props> = ({
  commands = defaultCommands,
  textareaClassName,
  previewClassName = "react-split-mde-preview",
  previewCallback = {},
  parser,
  values,
  onChange,
  addValue,
  removeValue,
  psudoMode = false,
  scrollSync = true,
  placeholder = "",
  changeContentToDB,
  deleteContentFromDB,
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTextareaChange = useCallback(
    (index: number, text: string) => {
      if (onChange) {
        onChange([...values.keys()][selectedTab], index, text as Text);
      }
    },
    [selectedTab, onChange, values]
  );
  const debouncedText = useDeferredValue(
    [...values.values()][selectedTab].text
  ) as string;
  return (
    <div className="react-split-mde-wrap">
      <Tab.Group onChange={setSelectedTab} selectedIndex={selectedTab}>
        <Tab.List className="flex">
          {[...values.entries()]
            .sort((a, b) => (a[1].index < b[1].index ? -1 : 1))
            .map(([id, value], index) => (
              <TabItem
                key={index}
                size={values.size}
                index={value.index}
                id={id}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                removeValue={removeValue}
                deleteContentFromDB={deleteContentFromDB}
              />
            ))}
        </Tab.List>
        <button
          type="button"
          onClick={() => {
            const id = nanoid();
            // eslint-disable-next-line no-void
            void changeContentToDB(id, values.size, "");
            addValue(id as ID, values.size, "" as Text);
          }}
        >
          <PlusSmIcon className="h-5 w-5 hover:bg-slate-200" />
        </button>
        <Tab.Panels>
          {[...values.entries()]
            .sort((a, b) => (a[1].index < b[1].index ? -1 : 1))
            .map(([id, value], index) => (
              <Tab.Panel key={value.index}>
                <div className="react-split-mde react-split-mde-box">
                  <Textarea
                    ref={ref}
                    placeholder={placeholder}
                    scrollSync={scrollSync}
                    className={textareaClassName}
                    psudoMode={psudoMode}
                    onChange={(text_) => {
                      handleTextareaChange(index, text_);
                      // eslint-disable-next-line no-void
                      void changeContentToDB(id as string, index, text_);
                    }}
                    commands={commands}
                    value={value.text as string}
                  />
                </div>
              </Tab.Panel>
            ))}
        </Tab.Panels>
      </Tab.Group>

      <div className="react-split-mde-box">
        <Preview
          value={debouncedText}
          className={previewClassName}
          callback={previewCallback}
          parser={parser}
        />
      </div>
    </div>
  );
};
