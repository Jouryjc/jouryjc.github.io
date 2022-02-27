# 反转链表
::: info 题目描述
给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。
```
输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]
```

```
输入：head = [1,2]
输出：[2,1]
```

```
输入：head = []
输出：[]
```
:::

```typescript
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function reverseList(head: ListNode | null): ListNode | null {
  if (head === null) {
    return null
  }

  let tail = head
  while(tail) {
    tail = tail.next
    head.next.next = head
    head.next = null
  }
};
```
