export type Text = string & { _textBrand: never };
export type ID = string & { _idBrand: never };
export type Content = { id: ID, text: Text };
export type AtLeast1<T> = [T, ...T[]];
export type Contents = AtLeast1<Content>;
//export type Contents = Map<ID, Text>;
