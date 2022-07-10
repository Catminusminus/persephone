import {
  atom,
  useRecoilState
} from "recoil";

const textAtom = atom({
  key: "text",
  default: "",
});

const useText = () => {
  const [text, setText] = useRecoilState(textAtom);
  return {
    text, setText
  };
}
