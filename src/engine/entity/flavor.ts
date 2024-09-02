type NonNullable<T> = {
    [K in keyof T as T[K] extends null ? never : K]: T[K];
};

export type Flavoring<T = any> = { _flavor?: T; };
export type Flavor<D = any, Flavor = D> = D & Flavoring<Flavor>;
export type FilterFlavorable<T> = T extends Flavoring ? T : null;
export type ExcludeFlavor<F extends Flavor> = Omit<F, '_flavor'>;
export type IsFlavored<T = any> = T extends { _flavor?: infer Flavor; }
    ? Flavor extends never
    ? false
    : true
    : false;
export type FilterFlavors<T> = NonNullable<{
    [K in keyof T]: FilterFlavorable<T[K]>;
}>;
export type Flavorables<D, T = FilterFlavors<D>> = {
    [K in keyof T]: ExcludeFlavor<T[K]>;
};

export type Brand<D = any, B = D> = D & { _brand: B; };
export type IsBranded<D> = D extends { _brand: infer Brand; }
    ? Brand extends never
    ? false
    : true
    : false;
