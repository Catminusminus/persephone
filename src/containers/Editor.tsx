import { Tab } from "@headlessui/react";
import { PlusSmIcon } from "@heroicons/react/solid";
import { useRef, useState, useCallback, useDeferredValue, memo } from "react";
import * as defaultCommands from "react-split-mde/lib/commands";
import { Preview } from "react-split-mde/lib/components/Preview";
import { Textarea } from "react-split-mde/lib/components/Textarea";
import { Command } from "react-split-mde/lib/types";
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

const TextareaWrapper = ({
  placeholder,
  scrollSync,
  psudoMode,
  handleTextareaChange,
  changeContentToDB,
  id,
  index,
  value,
  commands,
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const onChange = (text_: string) => {
    console.log(id);
    handleTextareaChange(id, index, text_);
    // eslint-disable-next-line no-void
    void changeContentToDB(id as string, index, text_);
  };
  console.log(id);
  return (
    <Textarea
      ref={ref}
      placeholder={placeholder}
      scrollSync={scrollSync}
      className="h-full px-4"
      psudoMode={psudoMode}
      onChange={onChange}
      commands={commands}
      value={value.text as string}
    />
  );
};

export const Editor: React.FC<Props> = ({
  commands = defaultCommands,
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
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTextareaChange = useCallback(
    (id: ID, index: number, text: string) => {
      if (onChange) {
        onChange(id, index, text as Text);
      }
    },
    [onChange]
  );
  const debouncedText = useDeferredValue(
    [...values.values()][selectedTab].text
  ) as string;
  console.log(values);
  return (
    <div className="flex h-full">
      <div className="w-1/2 h-full">
        <Tab.Group onChange={setSelectedTab} selectedIndex={selectedTab}>
          <div className="h-full">
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
                  const id = values.size.toString();
                  // eslint-disable-next-line no-void
                  void changeContentToDB(id, values.size, "");
                  addValue(id as ID, values.size, "" as Text);
                }}
              >
                <PlusSmIcon className="" />
              </button>
            </div>
            <div className="h-[calc(100%_-_1.5rem)]">
              <Tab.Panels className="h-full">
                {[...values.entries()]
                  .sort((a, b) => (a[1].index < b[1].index ? -1 : 1))
                  .map(([id, value], index) => (
                    <Tab.Panel key={value.index} className="h-full">
                      <div className="bg-gray-200 h-full">
                        <TextareaWrapper
                          value={value}
                          commands={commands}
                          placeholder={placeholder}
                          handleTextareaChange={handleTextareaChange}
                          changeContentToDB={changeContentToDB}
                          scrollSync={scrollSync}
                          psudoMode={psudoMode}
                          id={id}
                          index={index}
                        />
                      </div>
                    </Tab.Panel>
                  ))}
              </Tab.Panels>
            </div>
          </div>
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
