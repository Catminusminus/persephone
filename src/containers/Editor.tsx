import { Tab } from "@headlessui/react";
import { PlusSmIcon } from "@heroicons/react/solid";
import { useRef, useState, useCallback, useDeferredValue, memo } from "react";
import * as defaultCommands from "react-split-mde/lib/commands";
import { Preview } from "react-split-mde/lib/components/Preview";
import { Textarea } from "react-split-mde/lib/components/Textarea";
import { Command } from "react-split-mde/lib/types";
import { nanoid } from "nanoid";
import { Contents, Text, ID } from "../types";
import { TabItem } from "../components/TabItem";

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

export const Editor: React.FC<Props> = ({
  commands = defaultCommands,
  textareaClassName,
  previewClassName = "react-split-mde-preview mx-4",
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
    <div className="flex h-full">
      <div className="w-1/2 h-full">
        <Tab.Group onChange={setSelectedTab} selectedIndex={selectedTab}>
          <div className="flex divide-x h-6">
            <Tab.List className="divide-x">
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
              className="h-5 w-5 hover:bg-slate-200"
              type="button"
              onClick={() => {
                const id = nanoid();
                // eslint-disable-next-line no-void
                void changeContentToDB(id, values.size, "");
                addValue(id as ID, values.size, "" as Text);
              }}
            >
              <PlusSmIcon className="" />
            </button>
          </div>
          <Tab.Panels className="">
            {[...values.entries()]
              .sort((a, b) => (a[1].index < b[1].index ? -1 : 1))
              .map(([id, value], index) => (
                <Tab.Panel key={value.index} className="h-full">
                  <div className="bg-gray-200 h-full">
                    <Textarea
                      ref={ref}
                      placeholder={placeholder}
                      scrollSync={scrollSync}
                      className="h-full mx-4"
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
      </div>
      <div className="w-1/2">
        <div className="h-6">Preview</div>
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
