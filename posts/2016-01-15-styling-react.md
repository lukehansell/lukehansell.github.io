---
title: Styling React v1
date: 2016-01-15
tags: 
    - react
    - css
    - style
hashtag: stylingreact
slug: styling-react
---

**tl;dr;** checkout out [this repo](https://github.com/lukehansell/style-test) for different ways of styling a react app.

### Intro
Today I spent some time looking into styling with React apps. To do this I built [simple app](https://github.com/lukehansell/style-test) which uses one big CSS file to style everything. I then set about investigating different ways of refactoring this style to find the best.

<img src="/images/screenshot-style-app.png" alt="Desktop image of style app" style="width:100%"/>

### Requirements

1. I require the ability to overwrite the styles to provide themes.

2. I want to keep the style for a component as close to the component as possible.

### Solution 1 (Inline Styles)

**tl;dr;** I've committed my messing around regarding inline styles to the branch [inline-styles](https://github.com/lukehansell/style-test/tree/inline-styles)

My second requirement is that I keep the styles with the components. A simple way of keeping the style within the components is by using inline styles.

I know a few people who are against inline styles, but after listening to [Michael Chan](https://www.youtube.com/watch?v=ERB1TJBn32c) discussing them I'm sold on the idea. CSS is a part of style, but style is not CSS.

Also, with inline styles, since the style is tied to the component it's easy to see what relates to what and you don't rely on flaky relations via classes.

Inline styles are exactly what they sound like. In HTML you can write your styles within your DOM nodes: `<a style="color:blue;" />`. You can do the [same in React](https://facebook.github.io/react/tips/inline-styles.html). The differences are that you must use the javascript (camelCased) equivalent of each property and pass them into your elements in an object.

Doing styles inline with React though (therefore in js) with objects means that you get the benefits of being able to manipulate and export these objects wherever you like.

The first requirement is the need to be able to override the styles. 

I could use something like [redirectify](https://www.npmjs.com/package/redirectify) (though that's a browserify tool) to build multiple outputs with redirected requires. But I think there are other, better, ways.

My idea for this is pretty simple. React gives us ways of passing around data: *props* and *context*. We can use these (and the default props) to specify styles and override them from above.

In decending priority we have:
- **props** - provided from a parent these are like writing inline css in your browser and will override any other styles given.
- **context** - from higher up the tree we can pass context to provide defaults for huge swathes of our apps (i.e. our primary colour is xyz)
- **defaultProps** - when no style is provided? Fall back to a default.

<br/>

That as a concept is simple enough, the first problem I came across was merging. I attempted to use `Object.assign`. But that's only a dumb merge, it takes the top most and ignores and other attributes at that level from the other objects. I needed a deep merge. NPM provides [`npm i --save merge`](https://www.npmjs.com/package/merge) which gives `merge.recursive`.

Problem solved.

New problem introduced. My components that want to do this style of merging will have a dependency on this. I'll need to also add my merging code to every component. It's one line, but it's one line repeated everywhere...

```
let style = merge.recursive(defaultStyle, context.style, props.style)
```

I could wrap each of the components in a `StyleWrapperThingy` component which will do this for me and then pass the result on as the `style` property. For now however I'll live with this ugly duplication...

Now I have my object of nested styles for my component. Let's say, for example, my component renders the DOM structure:

```
<ul>
    <li>
        <a>hey</a>
    </li>
</ul>
```

and I have the corresponding style object:
```
{
    ul: {
        listStyle: 'none',
        li: {
            background: 'grey',
            a: {
                color:'blue'
            }
        }
    }
}
```

If I attach that to the `<ul>` via `style={style.ul}` we expect the styles underneath to nicely cascade down right? Of course not. What we do get however is `style="list-style:none;li:[Object object]"`.

Well that sucks. To resolve this issue I created a helper which I named after the styling and profiling [Rick Flair](http://www.ricflair.com/) (in hindsight I could have looked for something in npm and probably found a better solution, but I like it when I come up with a good name. Also, second dependency). All this did was look at the object you were attempting to render and strip out any nested objects. Simples.

So now we can pass `style.ul` to the `ul`, `style.ul.li` to the `li` and `style.ul.li.a` to the anchor. Once again, problem solved.

So how do you deal with CSS pseudo selectors? My simple answer is that you don't. When you consider these, most of the time they're adding some functionality to your styling. Consider `:hover`, well that's just a state based on mouse events. What about `nth-child()`? Well we already have that in our loops. Here we can add the styles that we require when we require them, as javascript dictates. Therefore the behaviour is again controlled wholly by our javascript and functionality can't be broken by CSS changes.

So as a little investigation, it seems like it works quite nicely as a solution. The major problem for me is the amount of boilerplate code required in order to achieve this. I've mentioned using a wrapper component to resolve this, I just need to develop it.

No doubt I'll keep playing with this and will update if I come across something new...

There are other potential solutions to this problem. I'll write my solutions as I develop them...