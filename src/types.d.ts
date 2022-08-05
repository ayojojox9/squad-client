interface Array<T> {
  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): Array<T>;
}

type PickByType<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] };
type Keyed<T = any> = { [key:string | number]: T };
type StringKey<T, V = any> = keyof PickByType<T, V> & string;
type Tuple<T, K = T> = [T, K];

type Validator<Values extends Keyed, Field extends StringKey<Values>> =
  (values: Values, ctx: {
    field: Field,
    value?: Values[Field],
    required: (field: StringKey<Values>, assertions:ValidatorSuite<Values[Field]>) => ValidatorSuite<Values[Field]>
  }) => ValidatorSuite<Values[Field]>;

type Assertion<Value> = ((val: Value) => boolean);
type AssertionWithMessage<Value> = Tuple<Assertion<Value>, string>;
type AssertionResult<Value> = Tuple<true, Value> | Tuple<false, string>
type ValidatorSuite<Value> = Array<AssertionWithMessage<Value> | ValidatorSuite<Value>>
