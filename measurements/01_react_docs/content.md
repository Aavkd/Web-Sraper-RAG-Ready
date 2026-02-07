# Extracted Content from react.dev

**Source:** https://react.dev/learn
**Crawled:** 2026-02-02T05:17:35.433Z
**Pages:** 5 extracted, 5 skipped
**Tokens:** ~11 532 estimated
**Duration:** 9s

---

## Table of Contents

1. [Quick Start – React](#quick-start-react)
2. [React](#react)
3. [React Versions – React](#react-versions-react)
4. [React Reference Overview – React](#react-reference-overview-react)
5. [React Community – React](#react-community-react)

---

## Quick Start – React

> Source: https://react.dev/learn
> Tokens: ~3 954

Welcome to the React documentation! This page will give you an introduction to 80% of the React concepts that you will use on a daily basis.

### You will learn

- How to create and nest components- How to add markup and styles- How to display data- How to render conditions and lists- How to respond to events and update the screen- How to share data between components

## Creating and nesting components

React apps are made out of *components*. A component is a piece of the UI (user interface) that has its own logic and appearance. A component can be as small as a button, or as large as an entire page.

React components are JavaScript functions that return markup:

```javascript
function MyButton() {return (<button>I'm a button</button>);}
```

Now that you’ve declared `MyButton`, you can nest it into another component:

```javascript
export default function MyApp() {return (<div><h1>Welcome to my app</h1><MyButton /></div>);}
```

Notice that `<MyButton />` starts with a capital letter. That’s how you know it’s a React component. React component names must always start with a capital letter, while HTML tags must be lowercase.

Have a look at the result:

```javascript
function MyButton() {
return (
<button>
I'm a button
</button>
);
}

export default function MyApp() {
return (
<div>
<h1>Welcome to my app</h1>
<MyButton />
</div>
);
}
```

The `export default` keywords specify the main component in the file. If you’re not familiar with some piece of JavaScript syntax, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) and [javascript.info](https://javascript.info/import-export) have great references.

## Writing markup with JSX

The markup syntax you’ve seen above is called *JSX*. It is optional, but most React projects use JSX for its convenience. All of the [tools we recommend for local development](https://react.dev/learn/installation) support JSX out of the box.

JSX is stricter than HTML. You have to close tags like `<br />`. Your component also can’t return multiple JSX tags. You have to wrap them into a shared parent, like a `<div>...</div>` or an empty `<>...</>` wrapper:

```javascript
function AboutPage() {return (<><h1>About</h1><p>Hello there.<br />How do you do?</p></>);}
```

If you have a lot of HTML to port to JSX, you can use an [online converter.](https://transform.tools/html-to-jsx)

## Adding styles

In React, you specify a CSS class with `className`. It works the same way as the HTML [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) attribute:

```text
<img className="avatar" />
```

Then you write the CSS rules for it in a separate CSS file:

```text
/* In your CSS */.avatar {border-radius: 50%;}
```

React does not prescribe how you add CSS files. In the simplest case, you’ll add a [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) tag to your HTML. If you use a build tool or a framework, consult its documentation to learn how to add a CSS file to your project.

## Displaying data

JSX lets you put markup into JavaScript. Curly braces let you “escape back” into JavaScript so that you can embed some variable from your code and display it to the user. For example, this will display `user.name`:

```text
return (<h1>{user.name}</h1>);
```

You can also “escape into JavaScript” from JSX attributes, but you have to use curly braces *instead of* quotes. For example, `className="avatar"` passes the `"avatar"` string as the CSS class, but `src={user.imageUrl}` reads the JavaScript `user.imageUrl` variable value, and then passes that value as the `src` attribute:

```text
return (<imgclassName="avatar"src={user.imageUrl}/>);
```

You can put more complex expressions inside the JSX curly braces too, for example, [string concatenation](https://javascript.info/operators#string-concatenation-with-binary):

```javascript
const user = {
name: 'Hedy Lamarr',
imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
imageSize: 90,
};

export default function Profile() {
return (
<>
<h1>{user.name}</h1>
<img
className="avatar"
src={user.imageUrl}
alt={'Photo of ' + user.name}
style={{
width: user.imageSize,
height: user.imageSize
}}
/>
</>
);
}
```

In the above example, `style={{}}` is not a special syntax, but a regular `{}` object inside the `style={ }` JSX curly braces. You can use the `style` attribute when your styles depend on JavaScript variables.

## Conditional rendering

In React, there is no special syntax for writing conditions. Instead, you’ll use the same techniques as you use when writing regular JavaScript code. For example, you can use an [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) statement to conditionally include JSX:

```javascript
let content;if (isLoggedIn) {content = <AdminPanel />;} else {content = <LoginForm />;}return (<div>{content}</div>);
```

If you prefer more compact code, you can use the [conditional `?` operator.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) Unlike `if`, it works inside JSX:

```html
<div>{isLoggedIn ? (<AdminPanel />) : (<LoginForm />)}</div>
```

When you don’t need the `else` branch, you can also use a shorter [logical `&&` syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):

```html
<div>{isLoggedIn && <AdminPanel />}</div>
```

All of these approaches also work for conditionally specifying attributes. If you’re unfamiliar with some of this JavaScript syntax, you can start by always using `if...else`.

## Rendering lists

You will rely on JavaScript features like [`for` loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) and the [array `map()` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) to render lists of components.

For example, let’s say you have an array of products:

```javascript
const products = [{ title: 'Cabbage', id: 1 },{ title: 'Garlic', id: 2 },{ title: 'Apple', id: 3 },];
```

Inside your component, use the `map()` function to transform an array of products into an array of `<li>` items:

```javascript
const listItems = products.map(product =><li key={product.id}>{product.title}</li>);return (<ul>{listItems}</ul>);
```

Notice how `<li>` has a `key` attribute. For each item in a list, you should pass a string or a number that uniquely identifies that item among its siblings. Usually, a key should be coming from your data, such as a database ID. React uses your keys to know what happened if you later insert, delete, or reorder the items.

```javascript
const products = [
{ title: 'Cabbage', isFruit: false, id: 1 },
{ title: 'Garlic', isFruit: false, id: 2 },
{ title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
const listItems = products.map(product =>
<li
key={product.id}
style={{
color: product.isFruit ? 'magenta' : 'darkgreen'
}}
>
{product.title}
</li>
);

return (
<ul>{listItems}</ul>
);
}
```

## Responding to events

You can respond to events by declaring *event handler* functions inside your components:

```javascript
function MyButton() {function handleClick() {alert('You clicked me!');}return (<button onClick={handleClick}> Click me</button>);}
```

Notice how `onClick={handleClick}` has no parentheses at the end! Do not *call* the event handler function: you only need to *pass it down*. React will call your event handler when the user clicks the button.

## Updating the screen

Often, you’ll want your component to “remember” some information and display it. For example, maybe you want to count the number of times a button is clicked. To do this, add *state* to your component.

First, import [`useState`](https://react.dev/reference/react/useState) from React:

```javascript
import { useState } from 'react';
```

Now you can declare a *state variable* inside your component:

```javascript
function MyButton() {const [count, setCount] = useState(0);// ...
```

You’ll get two things from `useState`: the current state (`count`), and the function that lets you update it (`setCount`). You can give them any names, but the convention is to write `[something, setSomething]`.

The first time the button is displayed, `count` will be `0` because you passed `0` to `useState()`. When you want to change state, call `setCount()` and pass the new value to it. Clicking this button will increment the counter:

```javascript
function MyButton() {const [count, setCount] = useState(0);function handleClick() {setCount(count + 1);}return (<button onClick={handleClick}> Clicked {count} times</button>);}
```

React will call your component function again. This time, `count` will be `1`. Then it will be `2`. And so on.

If you render the same component multiple times, each will get its own state. Click each button separately:

```javascript
import { useState } from 'react';

export default function MyApp() {
return (
<div>
<h1>Counters that update separately</h1>
<MyButton />
<MyButton />
</div>
);
}

function MyButton() {
const [count, setCount] = useState(0);

function handleClick() {
setCount(count + 1);
}

return (
<button onClick={handleClick}>
Clicked {count} times
</button>
);
}
```

Notice how each button “remembers” its own `count` state and doesn’t affect other buttons.

## Using Hooks

Functions starting with `use` are called *Hooks*. `useState` is a built-in Hook provided by React. You can find other built-in Hooks in the [API reference.](https://react.dev/reference/react) You can also write your own Hooks by combining the existing ones.

Hooks are more restrictive than other functions. You can only call Hooks *at the top* of your components (or other Hooks). If you want to use `useState` in a condition or a loop, extract a new component and put it there.

## Sharing data between components

In the previous example, each `MyButton` had its own independent `count`, and when each button was clicked, only the `count` for the button clicked changed:

![Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. Both MyButton components contain a count with value zero.](https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fsharing_data_child.dark.png&w=828&q=75)

![Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. Both MyButton components contain a count with value zero.](https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fsharing_data_child.png&w=828&q=75)

Initially, each `MyButton`’s `count` state is `0`

![The same diagram as the previous, with the count of the first child MyButton component highlighted indicating a click with the count value incremented to one. The second MyButton component still contains value zero.](https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fsharing_data_child_clicked.dark.png&w=828&q=75)

![The same diagram as the previous, with the count of the first child MyButton component highlighted indicating a click with the count value incremented to one. The second MyButton component still contains value zero.](https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fsharing_data_child_clicked.png&w=828&q=75)

The first `MyButton` updates its `count` to `1`

However, often you’ll need components to *share data and always update together*.

To make both `MyButton` components display the same `count` and update together, you need to move the state from the individual buttons “upwards” to the closest component containing all of them.

In this example, it is `MyApp`:

![Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. MyApp contains a count value of zero which is passed down to both of the MyButton components, which also show value zero.](https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fsharing_data_parent.dark.png&w=828&q=75)

![Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. MyApp contains a count value of zero which is passed down to both of the MyButton components, which also show value zero.](https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fsharing_data_parent.png&w=828&q=75)

Initially, `MyApp`’s `count` state is `0` and is passed down to both children

![The same diagram as the previous, with the count of the parent MyApp component highlighted indicating a click with the value incremented to one. The flow to both of the children MyButton components is also highlighted, and the count value in each child is set to one indicating the value was passed down.](https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fsharing_data_parent_clicked.dark.png&w=828&q=75)

![The same diagram as the previous, with the count of the parent MyApp component highlighted indicating a click with the value incremented to one. The flow to both of the children MyButton components is also highlighted, and the count value in each child is set to one indicating the value was passed down.](https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fsharing_data_parent_clicked.png&w=828&q=75)

On click, `MyApp` updates its `count` state to `1` and passes it down to both children

Now when you click either button, the `count` in `MyApp` will change, which will change both of the counts in `MyButton`. Here’s how you can express this in code.

First, *move the state up* from `MyButton` into `MyApp`:

```javascript
export default function MyApp() {const [count, setCount] = useState(0);function handleClick() {setCount(count + 1);}return (<div><h1>Counters that update separately</h1><MyButton /><MyButton /></div>);}function MyButton() {// ... we're moving code from here ...}
```

Then, *pass the state down* from `MyApp` to each `MyButton`, together with the shared click handler. You can pass information to `MyButton` using the JSX curly braces, just like you previously did with built-in tags like `<img>`:

```javascript
export default function MyApp() {const [count, setCount] = useState(0);function handleClick() {setCount(count + 1);}return (<div><h1>Counters that update together</h1><MyButton count={count} onClick={handleClick} /><MyButton count={count} onClick={handleClick} /></div>);}
```

The information you pass down like this is called *props*. Now the `MyApp` component contains the `count` state and the `handleClick` event handler, and *passes both of them down as props* to each of the buttons.

Finally, change `MyButton` to *read* the props you have passed from its parent component:

```javascript
function MyButton({ count, onClick }) {return (<button onClick={onClick}> Clicked {count} times</button>);}
```

When you click the button, the `onClick` handler fires. Each button’s `onClick` prop was set to the `handleClick` function inside `MyApp`, so the code inside of it runs. That code calls `setCount(count + 1)`, incrementing the `count` state variable. The new `count` value is passed as a prop to each button, so they all show the new value. This is called “lifting state up”. By moving state up, you’ve shared it between components.

```javascript
import { useState } from 'react';

export default function MyApp() {
const [count, setCount] = useState(0);

function handleClick() {
setCount(count + 1);
}

return (
<div>
<h1>Counters that update together</h1>
<MyButton count={count} onClick={handleClick} />
<MyButton count={count} onClick={handleClick} />
</div>
);
}

function MyButton({ count, onClick }) {
return (
<button onClick={onClick}>
Clicked {count} times
</button>
);
}
```

## Next Steps

By now, you know the basics of how to write React code!

Check out the [Tutorial](https://react.dev/learn/tutorial-tic-tac-toe) to put them into practice and build your first mini-app with React.

---

## React

> Source: https://react.dev/
> Tokens: ~984

![logo by @sawaratsuki1004](https://react.dev/_next/image?url=%2Fimages%2Fuwu.png&w=640&q=75)

The library for web and native user interfaces

## Create user interfaces from components

React lets you build user interfaces out of individual pieces called components. Create your own React components like `Thumbnail`, `LikeButton`, and `Video`. Then combine them into entire screens, pages, and apps.

Whether you work on your own or with thousands of other developers, using React feels the same. It is designed to let you seamlessly combine components written by independent people, teams, and organizations.

## Write components with code and markup

React components are JavaScript functions. Want to show some content conditionally? Use an `if` statement. Displaying a list? Try array `map()`. Learning React is learning programming.

This markup syntax is called JSX. It is a JavaScript syntax extension popularized by React. Putting JSX markup close to related rendering logic makes React components easy to create, maintain, and delete.

## Add interactivity wherever you need it

React components receive data and return what should appear on the screen. You can pass them new data in response to an interaction, like when the user types into an input. React will then update the screen to match the new data.

You don’t have to build your whole page in React. Add React to your existing HTML page, and render interactive React components anywhere on it.

[Add React to your page](https://react.dev/learn/add-react-to-an-existing-project)

## Go full-stack with a framework

React is a library. It lets you put components together, but it doesn’t prescribe how to do routing and data fetching. To build an entire app with React, we recommend a full-stack React framework like [Next.js](https://nextjs.org/) or [React Router](https://reactrouter.com/).

React is also an architecture. Frameworks that implement it let you fetch data in asynchronous components that run on the server or even during the build. Read data from a file or a database, and pass it down to your interactive components.

[Get started with a framework](https://react.dev/learn/creating-a-react-app)

## Use the best from every platform

People love web and native apps for different reasons. React lets you build both web apps and native apps using the same skills. It leans upon each platform’s unique strengths to let your interfaces feel just right on every platform.

With React, you can be a web *and* a native developer. Your team can ship to many platforms without sacrificing the user experience. Your organization can bridge the platform silos, and form teams that own entire features end-to-end.

[Build for native platforms](https://reactnative.dev/)

## Upgrade when the future is ready

React approaches changes with care. Every React commit is tested on business-critical surfaces with over a billion users. Over 100,000 React components at Meta help validate every migration strategy.

The React team is always researching how to improve React. Some research takes years to pay off. React has a high bar for taking a research idea into production. Only proven approaches become a part of React.

[Read more React news](https://react.dev/blog)

## Join a community of millions

You’re not alone. Two million developers from all over the world visit the React docs every month. React is something that people and teams can agree on.

This is why React is more than a library, an architecture, or even an ecosystem. React is a community. It’s a place where you can ask for help, find opportunities, and meet new friends. You will meet both developers and designers, beginners and experts, researchers and artists, teachers and students. Our backgrounds may be very different, but React lets us all create user interfaces together.

![logo by @sawaratsuki1004](https://react.dev/images/uwu.png)

## Welcome to the React community

[Get Started](https://react.dev/learn)

---

## React Versions – React

> Source: https://react.dev/versions
> Tokens: ~5 313

The React docs at [react.dev](https://react.dev/) provide documentation for the latest version of React.

We aim to keep the docs updated within major versions, and do not publish versions for each minor or patch version. When a new major is released, we archive the docs for the previous version as `x.react.dev`. See our [versioning policy](https://react.dev/community/versioning-policy) for more info.

You can find an archive of previous major versions below.

## Latest version: 19.2

- [react.dev](https://react.dev/)

## Previous versions

- [18.react.dev](https://18.react.dev/)
- [17.react.dev](https://17.react.dev/)
- [16.react.dev](https://16.react.dev/)
- [15.react.dev](https://15.react.dev/)

### Note

## Changelog

### React 19

**Blog Posts**

- [React v19](https://react.dev/blog/2024/12/05/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [React Compiler Beta Release](https://react.dev/blog/2024/10/21/react-compiler-beta-release)
- [React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1)
- [React 19.2](https://react.dev/blog/2025/10/01/react-19-2)

**Talks**

- [React 19 Keynote](https://www.youtube.com/watch?v=lyEKhv8-3n0)
- [A Roadmap to React 19](https://www.youtube.com/watch?v=R0B2HsSM78s)
- [What’s new in React 19](https://www.youtube.com/watch?v=AJOGzVygGcY)
- [React for Two Computers](https://www.youtube.com/watch?v=ozI4V_29fj4)
- [React Compiler Deep Dive](https://www.youtube.com/watch?v=uA_PVyZP7AI)
- [React Compiler Case Studies](https://www.youtube.com/watch?v=lvhPq5chokM)
- [React 19 Deep Dive: Coordinating HTML](https://www.youtube.com/watch?v=IBBN-s77YSI)

**Releases**

- [v19.2.1 (December, 2025)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1922-dec-11-2025)
- [v19.2.1 (December, 2025)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1921-dec-3-2025)
- [v19.2.0 (October, 2025)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1920-october-1st-2025)
- [v19.1.3 (December, 2025)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1913-dec-11-2025)
- [v19.1.2 (December, 2025)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1912-dec-3-2025)
- [v19.1.1 (July, 2025)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1911-july-28-2025)
- [v19.1.0 (March, 2025)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1910-march-28-2025)
- [v19.0.2 (December, 2025)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1902-dec-11-2025)
- [v19.0.1 (December, 2025)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1901-dec-3-2025)
- [v19.0.0 (December, 2024)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1900-december-5-2024)

### React 18

**Blog Posts**

- [React v18.0](https://react.dev/blog/2022/03/29/react-v18)
- [How to Upgrade to React 18](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [The Plan for React 18](https://react.dev/blog/2021/06/08/the-plan-for-react-18)

**Talks**

- [React 18 Keynote](https://www.youtube.com/watch?v=FZ0cG47msEk)
- [React 18 for app developers](https://www.youtube.com/watch?v=ytudH8je5ko)
- [Streaming Server Rendering with Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc)
- [React without memo](https://www.youtube.com/watch?v=lGEMwh32soc)
- [React Docs Keynote](https://www.youtube.com/watch?v=mneDaMYOKP8)
- [React Developer Tooling](https://www.youtube.com/watch?v=oxDfrke8rZg)
- [The first React Working Group](https://www.youtube.com/watch?v=qn7gRClrC9U)
- [React 18 for External Store Libraries](https://www.youtube.com/watch?v=oPfSC5bQPR8)

**Releases**

- [v18.3.1 (April, 2024)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1831-april-26-2024)
- [v18.3.0 (April, 2024)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1830-april-25-2024)
- [v18.2.0 (June, 2022)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1820-june-14-2022)
- [v18.1.0 (April, 2022)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1810-april-26-2022)
- [v18.0.0 (March 2022)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1800-march-29-2022)

### React 17

**Blog Posts**

- [React v17.0](https://legacy.reactjs.org/blog/2020/10/20/react-v17.html)
- [Introducing the New JSX Transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)
- [React v17.0 Release Candidate: No New Features](https://legacy.reactjs.org/blog/2020/08/10/react-v17-rc.html)

**Releases**

- [v17.0.2 (March 2021)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1702-march-22-2021)
- [v17.0.1 (October 2020)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1701-october-22-2020)
- [v17.0.0 (October 2020)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1700-october-20-2020)

### React 16

**Blog Posts**

- [React v16.0](https://legacy.reactjs.org/blog/2017/09/26/react-v16.0.html)
- [DOM Attributes in React 16](https://legacy.reactjs.org/blog/2017/09/08/dom-attributes-in-react-16.html)
- [Error Handling in React 16](https://legacy.reactjs.org/blog/2017/07/26/error-handling-in-react-16.html)
- [React v16.2.0: Improved Support for Fragments](https://legacy.reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html)
- [React v16.4.0: Pointer Events](https://legacy.reactjs.org/blog/2018/05/23/react-v-16-4.html)
- [React v16.4.2: Server-side vulnerability fix](https://legacy.reactjs.org/blog/2018/08/01/react-v-16-4-2.html)
- [React v16.6.0: lazy, memo and contextType](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html)
- [React v16.7: No, This Is Not the One With Hooks](https://legacy.reactjs.org/blog/2018/12/19/react-v-16-7.html)
- [React v16.8: The One With Hooks](https://legacy.reactjs.org/blog/2019/02/06/react-v16.8.0.html)
- [React v16.9.0 and the Roadmap Update](https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html)
- [React v16.13.0](https://legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html)

**Releases**

- [v16.14.0 (October 2020)](https://github.com/facebook/react/blob/main/CHANGELOG.md#16140-october-14-2020)
- [v16.13.1 (March 2020)](https://github.com/facebook/react/blob/main/CHANGELOG.md#16131-march-19-2020)
- [v16.13.0 (February 2020)](https://github.com/facebook/react/blob/main/CHANGELOG.md#16130-february-26-2020)
- [v16.12.0 (November 2019)](https://github.com/facebook/react/blob/main/CHANGELOG.md#16120-november-14-2019)
- [v16.11.0 (October 2019)](https://github.com/facebook/react/blob/main/CHANGELOG.md#16110-october-22-2019)
- [v16.10.2 (October 2019)](https://github.com/facebook/react/blob/main/CHANGELOG.md#16102-october-3-2019)
- [v16.10.1 (September 2019)](https://github.com/facebook/react/blob/main/CHANGELOG.md#16101-september-28-2019)
- [v16.10.0 (September 2019)](https://github.com/facebook/react/blob/main/CHANGELOG.md#16100-september-27-2019)
- [v16.9.0 (August 2019)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1690-august-8-2019)
- [v16.8.6 (March 2019)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1686-march-27-2019)
- [v16.8.5 (March 2019)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1685-march-22-2019)
- [v16.8.4 (March 2019)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1684-march-5-2019)
- [v16.8.3 (February 2019)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1683-february-21-2019)
- [v16.8.2 (February 2019)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1682-february-14-2019)
- [v16.8.1 (February 2019)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1681-february-6-2019)
- [v16.8.0 (February 2019)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1680-february-6-2019)
- [v16.7.0 (December 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1670-december-19-2018)
- [v16.6.3 (November 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1663-november-12-2018)
- [v16.6.2 (November 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1662-november-12-2018)
- [v16.6.1 (November 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1661-november-6-2018)
- [v16.6.0 (October 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1660-october-23-2018)
- [v16.5.2 (September 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1652-september-18-2018)
- [v16.5.1 (September 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1651-september-13-2018)
- [v16.5.0 (September 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1650-september-5-2018)
- [v16.4.2 (August 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1642-august-1-2018)
- [v16.4.1 (June 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1641-june-13-2018)
- [v16.4.0 (May 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1640-may-23-2018)
- [v16.3.3 (August 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1633-august-1-2018)
- [v16.3.2 (April 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1632-april-16-2018)
- [v16.3.1 (April 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1631-april-3-2018)
- [v16.3.0 (March 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1630-march-29-2018)
- [v16.2.1 (August 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1621-august-1-2018)
- [v16.2.0 (November 2017)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1620-november-28-2017)
- [v16.1.2 (August 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1612-august-1-2018)
- [v16.1.1 (November 2017)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1611-november-13-2017)
- [v16.1.0 (November 2017)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1610-november-9-2017)
- [v16.0.1 (August 2018)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1601-august-1-2018)
- [v16.0 (September 2017)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1600-september-26-2017)

### React 15

**Blog Posts**

- [React v15.0](https://legacy.reactjs.org/blog/2016/04/07/react-v15.html)
- [React v15.0 Release Candidate 2](https://legacy.reactjs.org/blog/2016/03/16/react-v15-rc2.html)
- [React v15.0 Release Candidate](https://legacy.reactjs.org/blog/2016/03/07/react-v15-rc1.html)
- [New Versioning Scheme](https://legacy.reactjs.org/blog/2016/02/19/new-versioning-scheme.html)
- [Discontinuing IE 8 Support in React DOM](https://legacy.reactjs.org/blog/2016/01/12/discontinuing-ie8-support.html)
- [Introducing React’s Error Code System](https://legacy.reactjs.org/blog/2016/07/11/introducing-reacts-error-code-system.html)
- [React v15.0.1](https://legacy.reactjs.org/blog/2016/04/08/react-v15.0.1.html)
- [React v15.4.0](https://legacy.reactjs.org/blog/2016/11/16/react-v15.4.0.html)
- [React v15.5.0](https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html)
- [React v15.6.0](https://legacy.reactjs.org/blog/2017/06/13/react-v15.6.0.html)
- [React v15.6.2](https://legacy.reactjs.org/blog/2017/09/25/react-v15.6.2.html)

**Releases**

- [v15.7.0 (October 2017)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1570-october-14-2020)
- [v15.6.2 (September 2017)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1562-september-25-2017)
- [v15.6.1 (June 2017)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1561-june-14-2017)
- [v15.6.0 (June 2017)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1560-june-13-2017)
- [v15.5.4 (April 2017)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1554-april-11-2017)
- [v15.5.3 (April 2017)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1553-april-7-2017)
- [v15.5.2 (April 2017)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1552-april-7-2017)
- [v15.5.1 (April 2017)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1551-april-7-2017)
- [v15.5.0 (April 2017)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1550-april-7-2017)
- [v15.4.2 (January 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1542-january-6-2017)
- [v15.4.1 (November 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1541-november-22-2016)
- [v15.4.0 (November 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1540-november-16-2016)
- [v15.3.2 (September 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1532-september-19-2016)
- [v15.3.1 (August 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1531-august-19-2016)
- [v15.3.0 (July 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1530-july-29-2016)
- [v15.2.1 (July 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1521-july-8-2016)
- [v15.2.0 (July 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1520-july-1-2016)
- [v15.1.0 (May 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1510-may-20-2016)
- [v15.0.2 (April 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1502-april-29-2016)
- [v15.0.1 (April 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1501-april-8-2016)
- [v15.0.0 (April 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#1500-april-7-2016)

### React 0.14

**Blog Posts**

- [React v0.14](https://legacy.reactjs.org/blog/2015/10/07/react-v0.14.html)
- [React v0.14 Release Candidate](https://legacy.reactjs.org/blog/2015/09/10/react-v0.14-rc1.html)
- [React v0.14 Beta 1](https://legacy.reactjs.org/blog/2015/07/03/react-v0.14-beta-1.html)
- [New React Developer Tools](https://legacy.reactjs.org/blog/2015/09/02/new-react-developer-tools.html)
- [New React Devtools Beta](https://legacy.reactjs.org/blog/2015/08/03/new-react-devtools-beta.html)
- [React v0.14.1](https://legacy.reactjs.org/blog/2015/10/28/react-v0.14.1.html)
- [React v0.14.2](https://legacy.reactjs.org/blog/2015/11/02/react-v0.14.2.html)
- [React v0.14.3](https://legacy.reactjs.org/blog/2015/11/18/react-v0.14.3.html)
- [React v0.14.4](https://legacy.reactjs.org/blog/2015/12/29/react-v0.14.4.html)
- [React v0.14.8](https://legacy.reactjs.org/blog/2016/03/29/react-v0.14.8.html)

**Releases**

- [v0.14.10 (October 2020)](https://github.com/facebook/react/blob/main/CHANGELOG.md#01410-october-14-2020)
- [v0.14.8 (March 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0148-march-29-2016)
- [v0.14.7 (January 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0147-january-28-2016)
- [v0.14.6 (January 2016)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0146-january-6-2016)
- [v0.14.5 (December 2015)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0145-december-29-2015)
- [v0.14.4 (December 2015)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0144-december-29-2015)
- [v0.14.3 (November 2015)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0143-november-18-2015)
- [v0.14.2 (November 2015)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0142-november-2-2015)
- [v0.14.1 (October 2015)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0141-october-28-2015)
- [v0.14.0 (October 2015)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0140-october-7-2015)

### React 0.13

**Blog Posts**

- [React Native v0.4](https://legacy.reactjs.org/blog/2015/04/17/react-native-v0.4.html)
- [React v0.13](https://legacy.reactjs.org/blog/2015/03/10/react-v0.13.html)
- [React v0.13 RC2](https://legacy.reactjs.org/blog/2015/03/03/react-v0.13-rc2.html)
- [React v0.13 RC](https://legacy.reactjs.org/blog/2015/02/24/react-v0.13-rc1.html)
- [React v0.13.0 Beta 1](https://legacy.reactjs.org/blog/2015/01/27/react-v0.13.0-beta-1.html)
- [Streamlining React Elements](https://legacy.reactjs.org/blog/2015/02/24/streamlining-react-elements.html)
- [Introducing Relay and GraphQL](https://legacy.reactjs.org/blog/2015/02/20/introducing-relay-and-graphql.html)
- [Introducing React Native](https://legacy.reactjs.org/blog/2015/03/26/introducing-react-native.html)
- [React v0.13.1](https://legacy.reactjs.org/blog/2015/03/16/react-v0.13.1.html)
- [React v0.13.2](https://legacy.reactjs.org/blog/2015/04/18/react-v0.13.2.html)
- [React v0.13.3](https://legacy.reactjs.org/blog/2015/05/08/react-v0.13.3.html)

**Releases**

- [v0.13.3 (May 2015)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0133-may-8-2015)
- [v0.13.2 (April 2015)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0132-april-18-2015)
- [v0.13.1 (March 2015)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0131-march-16-2015)
- [v0.13.0 (March 2015)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0130-march-10-2015)

### React 0.12

**Blog Posts**

- [React v0.12](https://legacy.reactjs.org/blog/2014/10/28/react-v0.12.html)
- [React v0.12 RC](https://legacy.reactjs.org/blog/2014/10/16/react-v0.12-rc1.html)
- [Introducing React Elements](https://legacy.reactjs.org/blog/2014/10/14/introducing-react-elements.html)
- [React v0.12.2](https://legacy.reactjs.org/blog/2014/12/18/react-v0.12.2.html)

**Releases**

- [v0.12.2 (December 2014)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0122-december-18-2014)
- [v0.12.1 (November 2014)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0121-november-18-2014)
- [v0.12.0 (October 2014)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0120-october-28-2014)

### React 0.11

**Blog Posts**

- [React v0.11](https://legacy.reactjs.org/blog/2014/07/17/react-v0.11.html)
- [React v0.11 RC](https://legacy.reactjs.org/blog/2014/07/13/react-v0.11-rc1.html)
- [One Year of Open-Source React](https://legacy.reactjs.org/blog/2014/05/29/one-year-of-open-source-react.html)
- [The Road to 1.0](https://legacy.reactjs.org/blog/2014/03/28/the-road-to-1.0.html)
- [React v0.11.1](https://legacy.reactjs.org/blog/2014/07/25/react-v0.11.1.html)
- [React v0.11.2](https://legacy.reactjs.org/blog/2014/09/16/react-v0.11.2.html)
- [Introducing the JSX Specificaion](https://legacy.reactjs.org/blog/2014/09/03/introducing-the-jsx-specification.html)

**Releases**

- [v0.11.2 (September 2014)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0112-september-16-2014)
- [v0.11.1 (July 2014)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0111-july-24-2014)
- [v0.11.0 (July 2014)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0110-july-17-2014)

### React 0.10 and below

**Blog Posts**

- [React v0.10](https://legacy.reactjs.org/blog/2014/03/21/react-v0.10.html)
- [React v0.10 RC](https://legacy.reactjs.org/blog/2014/03/19/react-v0.10-rc1.html)
- [React v0.9](https://legacy.reactjs.org/blog/2014/02/20/react-v0.9.html)
- [React v0.9 RC](https://legacy.reactjs.org/blog/2014/02/16/react-v0.9-rc1.html)
- [React Chrome Developer Tools](https://legacy.reactjs.org/blog/2014/01/02/react-chrome-developer-tools.html)
- [React v0.8](https://legacy.reactjs.org/blog/2013/12/19/react-v0.8.0.html)
- [React v0.5.2, v0.4.2](https://legacy.reactjs.org/blog/2013/12/18/react-v0.5.2-v0.4.2.html)
- [React v0.5.1](https://legacy.reactjs.org/blog/2013/10/29/react-v0-5-1.html)
- [React v0.5](https://legacy.reactjs.org/blog/2013/10/16/react-v0.5.0.html)
- [React v0.4.1](https://legacy.reactjs.org/blog/2013/07/26/react-v0-4-1.html)
- [React v0.4.0](https://legacy.reactjs.org/blog/2013/07/17/react-v0-4-0.html)
- [New in React v0.4: Prop Validation and Default Values](https://legacy.reactjs.org/blog/2013/07/11/react-v0-4-prop-validation-and-default-values.html)
- [New in React v0.4: Autobind by Default](https://legacy.reactjs.org/blog/2013/07/02/react-v0-4-autobind-by-default.html)
- [React v0.3.3](https://legacy.reactjs.org/blog/2013/07/02/react-v0-4-autobind-by-default.html)

**Releases**

- [v0.10.0 (March 2014)](https://github.com/facebook/react/blob/main/CHANGELOG.md#0100-march-21-2014)
- [v0.9.0 (February 2014)](https://github.com/facebook/react/blob/main/CHANGELOG.md#090-february-20-2014)
- [v0.8.0 (December 2013)](https://github.com/facebook/react/blob/main/CHANGELOG.md#080-december-19-2013)
- [v0.5.2 (December 2013)](https://github.com/facebook/react/blob/main/CHANGELOG.md#052-042-december-18-2013)
- [v0.5.1 (October 2013)](https://github.com/facebook/react/blob/main/CHANGELOG.md#051-october-29-2013)
- [v0.5.0 (October 2013)](https://github.com/facebook/react/blob/main/CHANGELOG.md#050-october-16-2013)
- [v0.4.1 (July 2013)](https://github.com/facebook/react/blob/main/CHANGELOG.md#041-july-26-2013)
- [v0.4.0 (July 2013)](https://github.com/facebook/react/blob/main/CHANGELOG.md#040-july-17-2013)
- [v0.3.3 (June 2013)](https://github.com/facebook/react/blob/main/CHANGELOG.md#033-june-20-2013)
- [v0.3.2 (May 2013)](https://github.com/facebook/react/blob/main/CHANGELOG.md#032-may-31-2013)
- [v0.3.1 (May 2013)](https://github.com/facebook/react/blob/main/CHANGELOG.md#031-may-30-2013)
- [v0.3.0 (May 2013)](https://github.com/facebook/react/blob/main/CHANGELOG.md#031-may-30-2013)

### Initial Commit

React was open-sourced on May 29, 2013. The initial commit is: [`75897c`: Initial public release](https://github.com/facebook/react/commit/75897c2dcd1dd3a6ca46284dd37e13d22b4b16b4)

See the first blog post: [Why did we build React?](https://legacy.reactjs.org/blog/2013/06/05/why-react.html)

React was open sourced at Facebook Seattle in 2013:

---

## React Reference Overview – React

> Source: https://react.dev/reference/react
> Tokens: ~868

This section provides detailed reference documentation for working with React. For an introduction to React, please visit the [Learn](https://react.dev/learn) section.

The React reference documentation is broken down into functional subsections:

## React

Programmatic React features:

- [Hooks](https://react.dev/reference/react/hooks)- Use different React features from your components.- [Components](https://react.dev/reference/react/components)- Built-in components that you can use in your JSX.- [APIs](https://react.dev/reference/react/apis)- APIs that are useful for defining components.- [Directives](https://react.dev/reference/rsc/directives)- Provide instructions to bundlers compatible with React Server Components.

## React DOM

React DOM contains features that are only supported for web applications (which run in the browser DOM environment). This section is broken into the following:

- [Hooks](https://react.dev/reference/react-dom/hooks)- Hooks for web applications which run in the browser DOM environment.- [Components](https://react.dev/reference/react-dom/components)- React supports all of the browser built-in HTML and SVG components.- [APIs](https://react.dev/reference/react-dom)- The `react-dom`package contains methods supported only in web applications.- [Client APIs](https://react.dev/reference/react-dom/client)- The `react-dom/client`APIs let you render React components on the client (in the browser).- [Server APIs](https://react.dev/reference/react-dom/server)- The `react-dom/server`APIs let you render React components to HTML on the server.- [Static APIs](https://react.dev/reference/react-dom/static)- The `react-dom/static`APIs let you generate static HTML for React components.

## React Compiler

The React Compiler is a build-time optimization tool that automatically memoizes your React components and values:

- [Configuration](https://react.dev/reference/react-compiler/configuration)- Configuration options for React Compiler.- [Directives](https://react.dev/reference/react-compiler/directives)- Function-level directives to control compilation.- [Compiling Libraries](https://react.dev/reference/react-compiler/compiling-libraries)- Guide for shipping pre-compiled library code.

## ESLint Plugin React Hooks

The [ESLint plugin for React Hooks](https://react.dev/reference/eslint-plugin-react-hooks) helps enforce the Rules of React:

- [Lints](https://react.dev/reference/eslint-plugin-react-hooks)- Detailed documentation for each lint with examples.

## Rules of React

React has idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications:

- [Components and Hooks must be pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure)– Purity makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.- [React calls Components and Hooks](https://react.dev/reference/rules/react-calls-components-and-hooks)– React is responsible for rendering components and hooks when necessary to optimize the user experience.- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)– Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.

## Legacy APIs

- [Legacy APIs](https://react.dev/reference/react/legacy)- Exported from the `react`package, but not recommended for use in newly written code.

---

## React Community – React

> Source: https://react.dev/community
> Tokens: ~413

React has a community of millions of developers. On this page we’ve listed some React-related communities that you can be a part of; see the other pages in this section for additional online and in-person learning materials.

## Code of Conduct

Before participating in React’s communities, [please read our Code of Conduct.](https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md) We have adopted the [Contributor Covenant](https://www.contributor-covenant.org/) and we expect that all community members adhere to the guidelines within.

## Stack Overflow

Stack Overflow is a popular forum to ask code-level questions or if you’re stuck with a specific error. Read through the [existing questions](https://stackoverflow.com/questions/tagged/reactjs) tagged with **reactjs** or [ask your own](https://stackoverflow.com/questions/ask?tags=reactjs)!

## Popular Discussion Forums

There are many online forums which are a great place for discussion about best practices and application architecture as well as the future of React. If you have an answerable code-level question, Stack Overflow is usually a better fit.

Each community consists of many thousands of React users.

- [DEV’s React community](https://dev.to/t/react)
- [Hashnode’s React community](https://hashnode.com/n/reactjs)
- [Reactiflux online chat](https://discord.gg/reactiflux)
- [Reddit’s React community](https://www.reddit.com/r/reactjs/)

## News

For the latest news about React, [follow **@reactjs** on Twitter](https://twitter.com/reactjs), [**@react.dev** on Bluesky](https://bsky.app/profile/react.dev) and the [official React blog](https://react.dev/blog) on this website.