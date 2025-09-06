---
title: "About Programming Languages"
date: "2025-09-04"
excerpt: "Explore programming languages beyond mere syntax – delve into their complex semantics, evaluation strategies, and design innovations that shape modern coding practices."
author:
  name: "Erdem Hacisalihoglu"
  callsign: "TA2EDH"
tags:
  - "programming languages"
---

Programming languages are the most fundamental communication channel between a programmer and a computer. The programs we write are transformed by compilers and interpreters into forms that computers can execute, enabling users to utilize the software we create. Although we spend a significant portion of our time using programming languages to make computers do what we want, understanding both the theory and practice of these languages is not merely an expectation but a rare expertise among programmers. Its impact on popular culture is evident through:

- The belief that once you learn one programming language, you can write others by just learning their syntax.
- Jokes about the quirks of JavaScript.
- The claim that Python is simpler or easier because it uses English words like `in` and `is`.

In the remainder of this post, I aim to describe how I evaluate programming languages from my perspective, explore the distinctive features of different languages, and discuss how languages can diverge when stepping outside the mainstream. This post serves as a continuation and complement to the post I wrote last year titled [About Type Systems](/posts/about-type-systems); if you find this topic interesting, I recommend reading that one as well.

## What is a Programming Language

In my view, programming languages fundamentally consist of two theoretical components: syntax and semantics. On top of these, practical implementations (compilers or interpreters), a set of tools (such as Language Servers, Code Formatters, Package Managers, Package Registries), and a library ecosystem transform a mathematically defined programming language into a social object. In this post, I will treat programming languages as mathematical objects as much as possible, only occasionally discussing how certain design aspects influence their implementation, tooling, or ecosystems.

### Syntax

In the opening paragraph, I mentioned that programming languages serve as a communication channel between a programmer and a computer, and here we need a bridge – that bridge is syntax. The syntax of a language defines its textual form, meaning that technically, the same language can have different syntaxes without altering its meaning. One of the best examples of this is the use of macros. Macros allow us to express syntactical constructs that the language does not inherently support. One of the simplest examples is seen in C macros; unfortunately, many programmers never move beyond basic macro usage. Consider a small example: in C, as you know, there isn’t much type-safety, so you cannot write an expression like `Vector<String>` as you would in Java or C++. One way to resolve this issue is to bypass C's type system by defining the elements of your collection as `void*`, leaving it up to the user to manage the types of objects in the collection. You can solve a similar problem with macros. In the example below, the `DEFINE_VECTOR` macro essentially lets you overcome the syntactical limitations of the language, effectively extending it.

```C
// Define a type-safe vector for any element type
#define DEFINE_VECTOR(T, Name)                                      \
typedef struct { T *data; size_t len, cap; } Name;                  \
static inline void Name##_init(Name *v){ v->data=NULL; v->len=v->cap=0; } \
static inline void Name##_push(Name *v, T x){                        \
    if(v->len==v->cap){ v->cap=v->cap? v->cap*2:4;                   \
        v->data=realloc(v->data, v->cap*sizeof(T)); }               \
    v->data[v->len++]=x;                                            \
}                                                                   \
static inline void Name##_free(Name *v){ free(v->data); }

// Example: make IntVec and StrVec
DEFINE_VECTOR(int, IntVec)
DEFINE_VECTOR(char*, StrVec)

int main(void){
    IntVec iv; IntVec_init(&iv);
    for(int i=0;i<5;i++) IntVec_push(&iv, i*i);
    for(size_t i=0;i<iv.len;i++) printf("%d\n", iv.data[i]);
    IntVec_free(&iv);

    StrVec sv; StrVec_init(&sv);
    StrVec_push(&sv, "hello"); StrVec_push(&sv, "world");
    for(size_t i=0;i<sv.len;i++) printf("%s\n", sv.data[i]);
    StrVec_free(&sv);
}
```

C macros are considered weak and unsafe compared to macro systems in other languages. LISP macros, on the other hand, offer you the opportunity to design an almost entirely new language from scratch. With Racket, which embodies the "Language-Oriented Programming" philosophy derived from the LISP family, you can write different "languages" for various problems—the underlying semantics, however, remain those of Racket. In fact, there is even a language called Rhombus, introduced in the last two years, that resembles Python in syntax but is built entirely using Racket macros.

The importance of syntax often becomes apparent not when you write code correctly, but when you write it incorrectly. A well-designed syntax helps localize errors; if a typo on line 17 causes an error on line 42, it means the language’s syntax has betrayed you. Similarly, a language that silently swallows your errors is also exhibiting a syntactical flaw. A well-known example is JavaScript's ASI (Automatic Semicolon Insertion):

```js
function getObject() {
  return
  {
    value: 42
  }
}

console.log(getObject());
// undefined
```

ASI is part of JavaScript's syntactical design—a consequence of making the language more accessible to beginners by automatically appending semicolons where appropriate. In my opinion, this is an example of poor design. Other syntactic considerations include Python's historical rejection of curly braces (`{}`) in favor of indentation-based blocks (a significant departure from earlier constructs like `BEGIN END`, `IF FI`, `FOR ENDFOR`). Perhaps the most notable syntactic choice is found in languages that, instead of conventional blocks, pointers, or operator precedence, use S-expressions; this is characteristic of the parenthesized code typical of the LISP family.

Even if it might not seem obvious, a further example of disregarding traditional syntax is the popularity of JSON or YAML-based approaches in the DevOps world. The YAML file you write for GitHub Actions is essentially a programming language in its own right.

If we consider two different syntactical renditions of the same language—where the semantics remain unchanged—the adage "once you learn one programming language, they are all the same" might seem accurate. However, I do not believe it is entirely true, because syntax affects how easily certain constructs are used. For instance, if a language provides a special syntax for a particular data structure, programmers are much more inclined to use it. Both Python and JavaScript have since adopted static type systems; however, TypeScript is far more popular than MyPy in this regard, in my view because its syntax for types is much more straightforward compared to Python's type hints. Even though objects operate similarly in JavaScript, they are significantly more popular than Maps because of the specialized syntax for object creation that is ingrained in the language.

Syntax influences our social perception of a language, which in turn shapes the language as a social object, affecting its ecosystem, tooling, usage, and evolution.

## Semantics

While syntax defines the "how" of communication between a programmer and a computer, semantics defines the "what" of that communication. To delve deeper into this, we need to engage with some mathematics—so fasten your seatbelts and hold on tight. When we interpret programming languages, we parse the text (provided by the user) according to the language’s syntax, resulting in an abstract representation known as an Abstract Syntax Tree (AST).

Before discussing the semantic differences among languages (see [Evaluation Strategies](#evaluation-strategies)), let me take a brief theoretical detour and explain how language semantics are formally defined, using an example from the [Caltech Programming Languages](https://www.cms.caltech.edu/academics/courses/cs-131) course. If mathematical notation isn’t your cup of tea, feel free to skip this section.

Our language is a simple calculational language encompassing arithmetic and Boolean expressions. We use EBNF (Extended Backus Naur Form) to describe its structure:

```ebnf
e ::= true | false | n | e1 + e2 | e1 * e2 | e1 > e2 | if e1 then e2 else e3 | (e)
v ::= true | false | n
```

Expressing the same definition in TypeScript would look like this:

```ts
type Expr = 
    | { t: "Number", n: number         }
    | { t: "Bool", b: boolean          }
    | { t: "Add", lhs: Expr, rhs: Expr }
    | { t: "Mul", lhs: Expr, rhs: Expr }
    | { t: "Gt",  lhs: Expr, rhs: Expr }
    | { t: "If", b: Expr, then: Expr, else: Expr }
type Value =
    | { t: "Number", n: number         }
    | { t: "Bool", b: boolean          }
```

By parsing the textual code according to a programmer’s adherence to the syntax, we convert it into an Abstract Syntax Tree (AST). Below is an illustration of that transformation:

![1 - (2 + 1)](https://i.ibb.co/N2mdg40P/image.png)

Had we associated the parenthesis to the left, we would have obtained a very different tree, and consequently, a different meaning.

![(1 - 2) + 1](https://i.ibb.co/mLTWSgc/image-1.png)

Now our language has a form, but it still lacks meaning. At this point, the rules we define dictate the outcome of evaluating expressions. For instance, the "If-True" rule states that if `if e1 then e2 else e3` is evaluated and `e1` yields true, and `e2` evaluates to `v`, then the overall expression evaluates to `v`.

In short, consider the example: `if (1+2 > 2*1) then 5 else 9  ⇓  5`

```tt
1 ⇓ 1   2 ⇓ 2   3 = 1 + 2     2 ⇓ 2   1 ⇓ 1   2 = 2 * 1
────────────────────────Add   ─────────────────────────Mul
1 + 2 ⇓ 3                     2 * 1 ⇓ 2                    3 > 2      
────────────────────────────────────────────────────────────────Gt-True   ───────Num
1 + 2 > 2 * 1 ⇓ true                                                      5 ⇓ 5 
───────────────────────────────────────────────────────────────────────────────If-True
if (1+2 > 2*1) then 5 else 9  ⇓  5
```

At first glance, the diagram may seem complex, but each line represents an application of the inference rules we have defined—collectively known as "Big Step Semantics." When combined, these rules form a "Derivation Tree."

For simple arithmetic expressions, there are not many ways to write these rules, as arithmetic doesn’t play a major role in designing language semantics. However, when it comes to more complex concepts such as function calls, references, pointers, memory management, and concurrent programming, slight differences in the rules can drastically change the meaning of a program.

Since detailing these complex semantics would be too extensive for a single blog post, I will now focus on discussing, in broad terms, how semantics vary across languages and the implications of these variations.

### Evaluation Strategies

A common design pattern in mainstream programming languages is strict evaluation. One notable exception is Haskell, which employs non-strict evaluation. In strict evaluation, a function’s arguments are evaluated before the function is invoked. Consider the `square` function that calculates the square of a number:

```ts
function square(n: number): number {
    return n * n;
}
```

When calling this function as `square(1 + 2)` in TypeScript, evaluation proceeds as follows:

```ts
square(1 + 2) // 1 + 2 -> 3
square(3)     // square(3) -> 3 * 3
3 * 3         // 3 * 3 = 9
9
```

In contrast, calling the same function in Haskell leads to the same result following a very different process:

```ts
square(1 + 2) // square(1 + 2) -> (1 + 2) * (1 + 2) 
(1 + 2) * (1 + 2) // (1 + 2) -> 3
3 * 3         // 3 * 3 = 9
9
```

In TypeScript, the arguments are evaluated before the function call, whereas in Haskell, the function is applied to a computation rather than a value, and the computation is delayed until its result is needed. This allows for the creation of infinite data structures—like the sequence `1, 4, 9, ...`—because elements are computed only on demand. For instance, here’s an example using an infinite list to calculate Fibonacci numbers:

```haskell
-- Infinite Fibonacci list
fibs :: [Integer]
fibs = 0 : 1 : zipWith (+) fibs (tail fibs)

-- Get the first 10 Fibonacci numbers
main = print (take 10 fibs)
```

Strict and non-strict evaluation strategies have various subcategories. For example, Haskell not only uses non-strict evaluation but also lazy evaluation, which avoids redundant computations by sharing results. The differences between JavaScript’s `==` and `===`, or Python’s `==` and `is`, stem partly from the distinction between references and values. In C, every argument is passed by value (call by value), meaning that large objects may be copied, potentially impacting performance; thus, functions are often invoked with pointers rather than the objects themselves. In languages such as Java, JavaScript, and Python, primitive types like numbers and characters are passed by value, while objects are passed by reference—a strategy known as "call by sharing." Meanwhile, Rust employs move semantics; if you pass an object to a function without explicitly borrowing it, Rust transfers ownership of that object, making it inaccessible after the function call.

### Memory Management

We have mentioned objects, values, copies, and moves—how do these occur? Fundamentally, computers are simple machines capable of executing a set of operations defined by their architectures. Compilers and interpreters construct the complex semantics of programming languages on top of these operations, using the computer’s memory to store objects created by our programs. When managing memory, caution is necessary because, despite ever-improving hardware, memory is finite. When your program requires memory, it requests it from the operating system, and when that memory is no longer needed, it should be returned. Failing to release memory can lead to memory leaks, causing long-running programs to eventually run out of memory.

This process is known as "manual memory management," typical in languages like C, Zig, and Odin, where programmers explicitly call functions like `malloc` to allocate memory and `free` to deallocate it. Due to the many disadvantages—including security concerns—associated with manual memory management, many modern languages adopt automatic memory management strategies.

One such strategy is RAII (Resource Acquisition Is Initialization), where memory management is handled in an object’s constructor and destructor, thus simplifying memory management without tracking individual `malloc/free` pairings; C++ and Rust utilize RAII. Another approach is dynamic reference counting, in which an object’s reference count is tracked to determine when it is no longer accessible and can be deallocated. Finally, garbage collection algorithms are employed, especially in languages like Java and Go, and Python uses a hybrid of reference counting and garbage collection to manage memory automatically.

Memory management, like evaluation strategies, is a semantic component that requires adapting your programming approach and learning new techniques when switching languages. Perhaps the most dramatic example is Rust, which distinguishes itself with a static memory management system built on its type system—ownership, borrowing, and lifetimes—that helps avoid the performance pitfalls of dynamic memory management while also preventing errors typical in manual memory management. Consequently, Rust is considered one of the more challenging languages to master among mainstream programming languages.

### Concurrent Programming

Although most programs we encounter today are single-threaded, a significant portion of the programs running on our computers, which tax our CPUs, are multi-threaded. Concurrency has been an important concept in programming since the days of batch programming, as we need to somehow divide the processor's time between subprocesses that perform different tasks in programs like operating systems and browsers, even if we have a single processor. With the advent of multi-core processors, parallelism emerged as a separate concept, allowing us to divide the computations we want to perform on the computer into smaller units and process each with a different processor, thus solving problems more quickly.

Over the past 40 years, the once-divergent single-threaded semantics of programming languages have converged, enabling quick transitions between languages for writing superficially similar programs. If you were to travel back to 1980, you would find it much harder to make such transitions, as each language would be optimized for different problems. This 40-year evolution of programming languages has been influenced by various factors, including social challenges like writing clearer code, reducing errors, and speeding up large project development, as well as the limitations and capabilities of the hardware we use. For instance, the reason we use the IEEE-754 model for programming with decimal numbers today, and why languages have semantics that lead to results like `0.1 + 0.2 != 0.3`, is that the IEEE-754 can be executed quickly on hardware, not because it aligns with our mathematical models. In fact, there are libraries in most languages that allow for programming with rational numbers, which would yield results much closer to our ideal mathematical semantics, but we are limited by the capabilities of our hardware.

Returning to the topic of concurrent programming, almost every programming language today offers some form of concurrent programming capabilities. However, the current state of affairs is reminiscent of the single-threaded programming days of the 80s, with each language providing different mechanisms and methods. One popular paradigm is `async/await`, where functions marked as `async` have asynchronous semantics, meaning we do not want to waste processor time waiting for their results synchronously. Another paradigm is the actor model, where asynchronous actors communicate by sending messages to each other, with the programming language organizing the sending and receiving of these messages to manage concurrency. On the other hand, shared-memory concurrency allows concurrent flows (threads) to use locking mechanisms to read and modify shared resources, employing data structures like mutexes, rwlocks, and semaphores to control access. Additionally, we can write programs with shared-access resources using atomic operations without using locks.

I have only scratched the surface of the existing concurrent programming methods; a well-versed individual could talk for hours about the various options, and different programming languages offer, optimize, and provide ecosystem or language-level support for these methods. This significantly challenges the earlier mentioned "you can quickly learn a language by just picking up its syntax" notion, as concurrent programming paradigms have not undergone the same evolutionary convergence as single-threaded ones; languages still exhibit significant differences, with sometimes impossible-to-transfer semantics.

### Type Systems

As mentioned at the beginning of this post, I have written a long and detailed separate article about [type systems](/about-type-systems). Nevertheless, I wanted to briefly touch upon how type systems can differentiate programming languages. We are generally aware that dynamic and static type systems separate languages; for instance, the following Python code cannot be directly written in many languages.

```python
if x is not str:
  return False
else:
  return x
```

Firstly, for the control `x is not str` to be executable during the program's run, the language must be dynamically typed. Secondly, for the case `x: str`, the function returns `x`, and for other cases, it returns `false`, leading to a complex type like `(str -> str)&(Any -> bool[False])`. Most type systems cannot express such complex types.

However, looking at the social usage of programming languages, mainstream type systems do not seem to be a significant barrier for transitioning between languages. For instance, transitions like Python -> Java or C++ -> JavaScript do not seem to cause major complaints among users. Therefore, in line with the theme of this post, I will briefly examine situations where type systems have prevented users from transitioning between languages.

#### Resource Types

In classic type systems, types are not seen as limited resources. For instance, when calculating the type of `a + b`, you might reason `a: int, b: int -> a + b: int`, and you can reuse these variables. However, if you are using a resource-based type system like Rust's, then each variable can only be used a limited number of times, as variables are seen as "resources". Therefore, if you try to run the program below in Rust, `let y = f(a, b)` will cause an error because `let x = f(a, b)` has already "moved" (taşındı) `a` and `b` to the function `f`, making them inaccessible.

```rust
let a = "alp".to_string();
let b = "keles".to_string();

let f : fn(string, string) -> bool = |a, b| a > b;
let x = f(a, b);
let y = f(a, b);
```

#### Dependent Types

In classic type systems, the types of programs do not depend on values but rather on the inputs to functions. For example, you cannot write a function that returns `bool` for the input `0` and `int` for any other number. As mentioned earlier, Python's dynamic typing allows for such behavior, but with dependent types, you can write programs where the return type of a function depends on the value of its input. I will save a detailed discussion on the capabilities of dependent types for a future post, but using dependent types, you can write programs that not only execute certain computations but also prove properties about them, enabling the creation of data structures like "Finger Trees" that are not possible in classic type systems.

#### Liquid Types

One of the significant drawbacks of classic type systems is that they do not account for the properties of the computations we perform in their types. For instance, the type of the expression `filter(|x| x % 2 == 0)` remains `int` even though it is guaranteed not to return odd numbers. We have to remember these properties ourselves. This might seem like a toy example, so let's examine a more complex case where TypeScript's narrowing mechanism fails.

```ts
type A = { a: string | null };
type B = { b: number | null };
type U = A | B;

function pick(u: U, k: 'a' | 'b') {
  if (k in u && u[k] !== null) { // safe, but rejected by TypeScript.
    return u[k]; 
  }
  return undefined;
}
```

Of course, this could also be a long-term fixable implementation deficiency in TypeScript, but without a liquid type system, such type updates will always be made with the aim of working under certain conditions, making it possible to produce cases where they do not work.

#### Effect Typing

You might have come across the term "effect" in the context of programming languages, referring to a program's capabilities, such as reading files, throwing errors, printing to the console, generating random results, or entering infinite loops. In languages with effect typing, the effects of functions are part of their type, requiring you to explicitly specify certain capabilities as part of the type, and potentially develop separate handling strategies for each effect.

### Others

This post has become quite lengthy, and I had also intended to discuss topics like tail call optimization, undefined behavior in different languages, how macro systems can alter programs, and the variations of constructs like `defer` and `yield` in different languages. I will leave those for future posts.

## Understanding Languages

Before concluding, I want to return to a problem I mentioned at the beginning: **we do not understand the programming languages we use**. Often, after learning the syntax of a language and managing to run a program without complaints from the compiler or interpreter, we treat programming as a trial-and-error game, trying different configurations until we stumble upon the correct one. This is especially common among beginners. However, every programming language we use has a definite semantics, however quirky or interesting it may be. There is a clear definition of what a program does once written, and learning these is not very difficult. To illustrate this, I will demystify two classic examples.

### JavaScript: `"b" + "a" + +"a" + "a"; // -> 'baNaNa'`

The quirks of JavaScript have become a popular joke in the culture surrounding programming. Many people are often surprised or believe there is a flaw in the language, but a little investigation reveals that the semantics are quite straightforward.

One of the primary design goals of JavaScript has been to ensure programs do not break easily, and will try to execute and produce some result even in the case of errors. When combined with the language's dynamic typing, this leads to "implicit type conversions". JavaScript automatically converts values to `string` in situations where other languages would throw a type error, thus allowing operations to proceed, albeit with potentially unintended results.

The expression `"b" + "a" + +"a" + "a"` is parsed by JavaScript as:

```JavaScript
"b" + "a" + (+"a") + "a"
```

Here, `+"a"` is an "explicit type conversion" to `number`. JavaScript uses the `parseNumber` function for `string -> number` conversions, so `+"a"` becomes `NaN` (Not a Number).

```JavaScript
"b" + "a" + (+"a") + "a"
"b" + "a" + NaN + "a"
```

The `+` operator, when used between two strings, concatenates them. So, `"b" + "a"` results in `"ba"`.

```JavaScript
"b" + "a" + NaN + "a"
"ba" + NaN + "a"
```

However, at this point, there is a type mismatch for the `+` operator in the `string + number` context. JavaScript first converts `number -> string` and then performs the `string + string` operation.

```JavaScript
"ba" + NaN + "a"
"ba" + "NaN" + "a"
"baNaN" + "a"
"baNaNa"
```

And there you have it, the result is `'baNaNa'`. Looking at all the intermediary steps, they are quite simple and comprehensible, and the complexity lies in understanding the why and how of JavaScript's implicit type conversions.

### Python

Before wrapping up, I wanted to touch upon Python, which is often considered easier for beginners due to its English-like syntax. However, as we have seen, JavaScript and Python are not as different as they seem. Both languages perform implicit type conversions; for instance, in Python, an expression like `if "a" + "b" then 1 else None` first converts `"a" + "b"` to `bool` before evaluating the result. There is even a detailed paper discussing the semantic quirks and issues of Python from Brown University. This serves to illustrate that when commenting on programming languages, one should consider not just the superficial syntax or keyword usage, but also the semantics of the language.

## Closing

I acknowledge that there may be errors, inconsistencies, or unresolved issues within this post. If you notice any such matters, please feel free to email me at [ehacisalihoglu@caltech.edu](mailto:ehacisalihoglu@caltech.edu), and I will make every effort to correct them and address your questions. Best regards.