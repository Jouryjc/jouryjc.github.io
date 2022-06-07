# type-challenges utils

## Equal
如何证明两个类型相等：
```typescript
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
```

## IsAny
元 any，如何证明 any 类型是 any 类型：
```typescript
export type IsAny<T> = 0 extends (1 & T) ? true : false
```