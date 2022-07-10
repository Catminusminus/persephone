import { Tab } from "@headlessui/react";
import { PlusSmIcon, XIcon, DocumentIcon } from "@heroicons/react/solid";
import { useRef, useState, useCallback } from "react";
import * as defaultCommands from "react-split-mde/lib/commands";
import { Preview } from "react-split-mde/lib/components/Preview";
import { Textarea } from "react-split-mde/lib/components/Textarea";
import { useDebounce } from "react-split-mde/lib/hooks/debounce";
import { Command } from "react-split-mde/lib/types";
import { Contents, Text, ID } from "../types";

type Props = {
  commands?: Record<string, Command>;
  previewClassName?: string;
  textareaClassName?: string;
  previewCallback?: Record<string, (node: any) => any>;
  parser: (text: string) => Promise<string>;
  values: Contents;
  onChange?: (id: ID, text: Text) => void;
  addValue: (text: Text) => void;
  removeValue: (id: ID) => void;
  psudoMode?: boolean;
  debounceTime?: number;
  scrollSync?: boolean;
  placeholder?: string;
};

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
  debounceTime = 200,
  scrollSync = true,
  placeholder = "",
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTextareaChange = useCallback(
    (text: string) => {
      if (onChange) {
        onChange([...values.keys()][selectedTab], text as Text);
      }
    },
    [selectedTab, onChange, values]
  );
  const debouncedText = useDebounce(
    [...values.values()][selectedTab],
    debounceTime
  ) as string;
  return (
    <div className="react-split-mde-wrap">
      <Tab.Group onChange={setSelectedTab} selectedIndex={selectedTab}>
        <Tab.List className="flex">
          {[...values.keys()].map((id, index) => (
            <Tab
              key={id}
              className={({ selected }) =>
                selected ? "w-full bg-blue-500" : "w-full"
              }
            >
              {index === selectedTab ? (
                <button
                  type="button"
                  onClick={() => {
                    if (values.size === 1) {
                      return;
                    }
                    if (selectedTab === 0) {
                      setSelectedTab(1);
                      removeValue(id);
                    }
                    setSelectedTab((selected) => selected - 1);
                    removeValue(id);
                  }}
                >
                  <XIcon className="h-5 w-5 hover:bg-slate-200" />
                </button>
              ) : (
                <DocumentIcon className="h-5 w-5" />
              )}
            </Tab>
          ))}
        </Tab.List>
        <button type="button" onClick={() => addValue("" as Text)}>
          <PlusSmIcon className="h-5 w-5 hover:bg-slate-200" />
        </button>
        <Tab.Panels>
          {[...values.entries()].map(([id, text]) => (
            <Tab.Panel key={id}>
              <div className="react-split-mde react-split-mde-box">
                <Textarea
                  ref={ref}
                  placeholder={placeholder}
                  scrollSync={scrollSync}
                  className={textareaClassName}
                  psudoMode={psudoMode}
                  onChange={handleTextareaChange}
                  commands={commands}
                  value={text as string}
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
