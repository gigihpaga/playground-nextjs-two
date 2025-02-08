/**
 * utilities to infer the key from some object
 *
 * @example
 * ```ts
 * const Person = { name: 'paga', size: 2 };
 * type KeyOfPerson = GetKey<typeof Person> // infer ==> "name" | "size"
 * ```
 * [Get Keys of an Object Where Values Are of a Given Type](https://www.totaltypescript.com/get-keys-of-an-object-where-values-are-of-a-given-type)
 */
export type GetKeys<Obj extends Record<string, unknown>> = { [Key in keyof Obj]: Key }[keyof Obj];

/**
 * utilities to transform type record required to optional
 *
 * [Make the TypeScript interface partially optional/required](https://pawelgrzybek.com/make-the-typescript-interface-partially-optional-required/)
 * @example
 * ```ts
 * type People = { rumah: string; phonenumber: number };
 * type NewPeople = PartiallyOptional<People, 'rumah'>;
 * // now the type of NewPeople = { rumah?: string; phonenumber: number }
 * const newPeople: NewPeople = {
 * phonenumber: 821,
 * rumah: undefined,
 * };
 * ```
 */
export type PartiallyOptional<RecordType, Key extends keyof RecordType> = Omit<RecordType, Key> & Partial<Pick<RecordType, Key>>;

/**
 * utilities to transform type record required to optional
 *
 * [Make the TypeScript interface partially optional/required](https://pawelgrzybek.com/make-the-typescript-interface-partially-optional-required/)
 * @example
 * ```ts
 * type People = { rumah: string; phonenumber: number, hobby?: string };
 * type NewPeople = PartiallyRequired<People, 'rumah'>;
 * // now the type of NewPeople = { rumah: string; phonenumber: number, hobby: string }
 * const newPeople: NewPeople = {
 * phonenumber: 821,
 * rumah: "jakarta",
 * hobby: "ngoding"
 * };
 * ```
 */
export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// type a = Required
export type OmitUndefined<T> = T extends undefined ? never : T;
export type OmitNull<T> = T extends null ? never : T;

export type Prettyfy<Obj> = {
    [K in keyof Obj]: Obj[K];
};

type People = { rumah?: string; phonenumber: number };
type KeyTypePeople = keyof People; //  "rumah" | "phonenumber"
type ValueTypePeople = People[keyof People]; // "string" | "number"
export type ShapeCondition<ShapeSchema extends Record<string, unknown>, TypeKey extends ShapeSchema['type']> = ShapeSchema extends {
    type: TypeKey;
}
    ? ShapeSchema
    : never;

export type ShapeCondition2<ShapeSchema extends Record<string, unknown>, TypeKey extends ShapeSchema['type']> = TypeKey extends undefined
    ? never
    : ShapeSchema extends {
            type: TypeKey;
        }
      ? ShapeSchema
      : never;

// const a: NodeLuffyProps['data'] = {};
// const b: CustomNodeTypePopulation['type'] = {};
// type iiii = MyNode<'NodeShape'>;
type Boy = { type: 'boy'; name: string; hoby?: string; motor?: string };
type Man = { type: 'man'; name: string; isMarried: boolean; job: string };

type Girl = { type: undefined; name: string; isMarried: boolean; job: string };
type Person = Boy | Man | Girl;
type pp = Person['type'];
type c = Person['type'];
type yy = ShapeCondition2<Person, 'man'>;
// type o<typekey extends Person['type'], obj extends Person = Person> = typekey extends obj['type'] ? obj : never;
// type o<t extends hh['type'], b extends hh = hh> = Exclude<b, { type: t }>;
// type o<t extends hh['type'], b extends hh = hh> = Exclude<b, { type: t }>;
type MakeRequired<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? NonNullable<T[P]> : T[P];
};

type RemoveUndefined<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? Exclude<T[P], undefined> : T[P];
};

type MakeRequired2<T, K extends keyof T> = {
    [P in keyof T]-?: P extends K ? Exclude<T[P], undefined> : T[P];
};

type MakeRequired3<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? Exclude<T[P], undefined> : T[P];
} & {
    [P in K]-?: Exclude<T[P], undefined>;
};
type MakeRequired4<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? Exclude<T[P], undefined> : T[P];
}; /* & {
    [P in K]-?: Exclude<T[P], undefined>;
  }; */

type MakeRequired5<T, K extends keyof T> = Omit<T, K> & {
    [P in K]-?: Exclude<T[P], undefined>;
};

type MakeRequired6<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? Exclude<T[P], undefined> : T[P];
} & {
    [P in K]-?: Exclude<T[P], undefined>;
};

type NewBoy = MakeRequired4<Boy, 'motor'>;

/**
 * [Understanding infer in TypeScript](https://blog.logrocket.com/understanding-infer-typescript/)
 */
