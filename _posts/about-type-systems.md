---
title: "About Type Systems"
date: "2025-06-30"
excerpt: "This post explores the pivotal role of type systems in programming, detailing their influence, advanced features, and impact on modern coding practices."
author:
  name: "Erdem Hacisalihoglu"
  callsign: "TA2EDH"
tags:
  - "programming languages"
---

Type systems, although fundamental to programming activities, often go unnoticed and are among the topics we rarely discuss regarding the features of programming languages. In this post, I will focus on how type systems guide our everyday programming practices.

## What is a Type System?

Every programming language incorporates a type system, sometimes as the result of a careful mathematical design and sometimes as a reflection of its creator’s preferences. Type systems allow us to make judgments about the validity of operations in a programming language by providing error messages when invalid operations occur. The design of a type system affects how generic our programs can be, the type annotations we need to write, and the type hints provided by our editor.

Let’s begin with a small arithmetic language. We will use a notation called BNF (Backus-Naur Form), which is employed to express the grammar of programming languages, to define the structure of our language.

```bnf  
e ::= e + e | e - e | e && e | e < e | e > e
  | 1 | 2 | 3 …
```

Next, we need to determine the *semantics* of the operations in this language. Our operations include addition (`+`), subtraction (`-`), logical AND (`&&`), less-than (`<`), and greater-than (`>`). What should the expression `(3 < 5) + 2` mean? Should we allow such an expression or produce an error? If allowed, what result should it yield? If not, how should the error be conveyed? Let’s examine how popular programming languages like Python, JavaScript, and C handle `(3 < 5) + 2`:

```txt
3
```

TypeScript:

```txt
Operator '+' cannot be applied to types 'boolean' and 'number'.
```

Rust:

```txt
  error[E0369]: cannot add `{integer}` to `bool`
  --> error.rs:8:13
  |
8 |     (3 < 5) + 2;
  |     ------- ^ - {integer}
  |     |
  |     bool
```

Java:

```txt
error.java:6: error: bad operand types for binary operator '+'
((3 < 5) + 2);
    ^
  first type:  boolean
  second type: int
```

As observed, while Python, JavaScript, and C interpret `(3 < 5) + 2` by treating `(3 < 5)` as `1` in the context of addition (yielding `3`), TypeScript, Rust, and Java reject the operation because no rule exists to add a boolean and a number.

If we want the expression to be well-typed, we need to introduce new rules into the type system that determine the type of such an expression. One approach is:

```txt
Γ, e1 : bool
-----------------(b->i)
Γ, e1 : integer
```

This rule allows us to convert a boolean type (for instance, `(3 < 5): bool`) into an integer type `(3 < 5): integer`. Alternatively, rather than converting any boolean to an integer, we can handle the conversion specifically during addition:

```txt
Γ, e1 : bool           Γ, e2 : integer
---------------------------------------(b+i)
        Γ, e1 + e2 : integer
```

However, this rule alone works for `(3 < 5) + 2` but not for `2 + (3 < 5)`. Therefore, we need the reverse rule as well:

```txt
Γ, e1 : integer            Γ, e2 : bool
---------------------------------------(i+b)
        Γ, e1 + e2 : integer
```

Note that all these rules are syntactic. Although we might notionally consider `a + b` equivalent to `b + a`, within our type system we must explicitly specify both rules. Instead of writing two separate rules for `i+b` and `b+i`, one could write a more general rule reflecting the commutativity of addition:

```txt
Γ, e2 + e1 : T
---------------(commutative)
Γ, e1 + e2 : T
```

Here, in addition to expression variables like `e1` and `e2`, we introduce a type variable `T`. When we extend our language with constructs such as `if-else` or function application, type variables become even more pervasive. For example, consider the rule for an `if-else` expression:

```txt
Γ, e1 : bool        Γ, e2 : T           Γ, e3 : T
---------------------------------------------------(if-else)
          Γ, if e1 then e2 else e3 : T
```

This rule tells us that for an `if-else` expression to be well-typed, the condition `e1` must be boolean, and both the `then` and `else` branches must have the same type `T`.

Another general rule is for function application:

```txt
Γ, e1 : T1     
Γ, e2 : T2 …  Γ, en : Tn
Γ, fn : (T1, T2…Tn) -> T
--------------------------------------------------------(fn-call)
Γ, fn(e1, e2…en) : T
```

This rule indicates that to apply a function that takes arguments of types `T1, T2, …, Tn` and returns type `T`, the provided arguments must have the corresponding types.

With these rules, we gain a brief introduction to constructing a type system. Now, let’s discuss how type systems are utilized.

## Static and Dynamic Type Systems

The first discussion around type systems often centers on their static or dynamic nature. Although this post does not delve deeply into that debate, it is important to note that while static type systems perform type checking at compile time using type information, dynamic type systems rely on type information at run time. This distinction, however, influences the design of the type system, as static systems must ensure that every expression can be assigned a type regardless of which branch (in conditionals) is taken, whereas dynamic systems can adjust based on run-time decisions.

The clearest difference appears in conditional (`if-else`) expressions. Recall that the earlier rule for `if-else` required the `then` and `else` branches to have the same type. This rule is common in static type systems because the compiler does not know which branch will be executed. An alternative is to use union types, as in TypeScript:

```typescript
let a: string | number = Math.random() > 0.5 ? "erdem" : 3;
```

In this ternary expression, the two branches yield different types, so the resulting type is `string | number`. This can be expressed as:

```txt
Γ, e1 : bool     Γ, e2 : T1       Γ, e3 : T2
--------------------------------------------(if-else-union)
    Γ, if e1 then e2 else e3 : T1 | T2
```

In dynamic type systems, such rules are unnecessary since the relevant type information is determined at run time, allowing the system to propagate the type of the branch that is actually executed:

```txt
    Γ, e2 : T
--------------------------------------------(if-true)
    Γ, if True then e2 else e3 : T

    Γ, e3 : T
--------------------------------------------(if-false)
    Γ, if False then e2 else e3 : T
```

Below is an example of a Python program that would result in a type error if `a` is not "erdem". In a static type system, the type checker would flag the inconsistency at compile time because it would be impossible to assign a consistent type to `a` when `a` is not "erdem":

```python
a = input()

if a == "erdem":
  return 3 + 5
else:
  return "a" + 3
```

Dynamic type systems also allow type inspection. One advantage of static type systems is that type information is fixed at compile time and then discarded at run time, thereby avoiding run-time overhead. However, the availability of type information at run time in dynamic systems enables features like heterogeneous lists. Although heterogeneous lists can be constructed in static systems, operations on their elements are often limited. Consider this example in Python:

```python
l = [1, True, "erdem"]

for elem in l:
  if type(elem) == int:
    print("Element is an integer")
  elif type(elem) == bool:
    print("Element is a boolean")
  else:
    print("Unknown element type")
```

## Generic, Polymorphic Programs

As mentioned, in static languages it might seem that forming heterogeneous data structures is challenging. However, generic data structures like lists, stacks, queues, and trees are widely used. These structures are parameterized by a type (e.g., `List<T>, Stack<T>, Queue<T>, Tree<T>`), and because nothing is assumed about `T`, functions operating on these structures cannot make any assumptions about the type of their elements. This is known as Parametric Polymorphism. Programs that use parametric polymorphism must adhere to type bounds defined for the type parameter.

Since there is no restriction on `T` in a `List<T>`, we cannot perform operations on the list’s elements, such as printing them, because there is no guarantee that `T` implements a printing function. So, how do we write functions that manipulate the elements of these data structures?

Rust addresses this issue using its trait system. In Rust, functions can accept parameters that are not only concrete types but are also constrained by traits:

```rust
fn print_list<T: Display>(t: List<T>)
```

The function above restricts the type `T` to those that implement the `Display` trait. Thus, any type that satisfies this bound can be printed using our generic print function.

Parametric polymorphism is not the only method to write polymorphic programs. One can also use ad hoc polymorphism (writing multiple versions of the same function for different types) or subtyping.

### Ad Hoc Polymorphism

Ad hoc polymorphism means writing multiple versions of the same function for different types. For example, one might have two versions of `to_string`: one for booleans and one for integers. When a print function is invoked, the compiler selects the appropriate version based on the argument’s type.

### Subtyping

Object-Oriented Programming provides another mechanism for polymorphism through subtyping. In Java, for instance, all classes are derived from `Object`. Therefore, to create a heterogeneous list, one can use a list of type `List<Object>`, as every type in Java is a subclass of `Object`.

## Structural vs. Nominal Types

Another frequently encountered discussion in type systems is the contrast between structural and nominal types. Some languages enforce a strict choice between them, while many languages support both. Nominal types are based on how a type is defined by name; when I define a type `X`, only a value of type `X` can be compared or exchanged with another of type `X`. Structural types, on the other hand, allow for nameless types. For example, in TypeScript, defining an object type as `{ x: number, y: number }` does not require naming; the type system relies on the object's structure, and objects with the same structure are considered equivalent.

## Type Checking and Type Inference

Earlier, I mentioned type checking in the context of explaining what a type system is. Type checking is the process of determining whether a given program is well-typed or ill-typed. The goal of type checking algorithms is to verify that every expression in the program can be assigned a type based on a derivation tree constructed from the typing rules.

However, in modern programming languages, type systems are used not only for simple type checking but also to gather detailed information about the program. This information can be used for optimizations or to impose specific constraints. For instance, Rust’s type system tracks ownership relationships, ensuring memory safety at compile time without requiring a garbage collector. As the amount of information tracked by the type system increases, so does the need for type inference. In a language like C, it is feasible to write the type of every variable by hand, but in Rust, annotating lifetimes for every reference would be impractical.

Type inference is crucial in both advanced type systems and everyday programming. Manually specifying type annotations for every variable is rarely enjoyable, and various type inference algorithms—most notably the one associated with the Hindley-Milner (HM) type system—are used in languages like Rust, OCaml, and Haskell.

## Advanced Type Systems

Let me conclude by briefly discussing advanced type system features. Earlier, I mentioned Rust; systems like Rust’s are known as resource-oriented type systems because they track ownership relationships to prevent misuse of resources. Other systems use liquid types, which allow for more comprehensive constraints on types. For example, in a liquid type system, we might express a type that contains only even numbers as `{ n | n % 2 == 0 }`. Liquid Haskell, Flux (Rust), and similar systems aim to enrich classical type systems with such capabilities. Additionally, dependent types blur the lines between programming languages and logic, enabling programs to serve as proof assistants. With systems like Coq, Agda, or Lean, one can develop algorithms and programs whose correctness can be formally verified. There are also type systems based on Information Flow Control (IFC) that ensure sensitive data does not leak, and recent type systems that can prove a program does not exceed certain time or space complexities.

## Conclusion

As stated at the beginning, type systems significantly affect our programming practices. They influence everything from the error messages we encounter in ill-typed programs to our approaches to error handling and concurrent programming. In languages like Swift, the type checker can take an extraordinarily long time to report errors in even short pieces of code due to exponential backtracking in its type checking algorithm—so much so that techniques for writing fast-compiling Swift programs have become a topic of discussion.

It has always saddened me that type systems operate so opaquely in our daily programming, often leaving us unaware of why type errors occur. This is one reason I originally wrote this post in Turkish—to contribute a new perspective to Turkish programming literature. Thank you very much for reading this far.

Best regards,

Erdem Hacisalihoglu
