export type Text = string & { _textBrand: never };
export type ID = string & { _idBrand: never };
export type Content = { index: number; text: Text };
export type AtLeast1<T> = [T, ...T[]];
export type Contents = Map<ID, Content>;
