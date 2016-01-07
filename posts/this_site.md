---
title: Blogging With Webpack and React
date: 2015-12-23
tags: 
    - react
    - blog
    - development
    - webpack
    - react-router
hasktag: blogwithreact
---
<img src="images/webpack-logo.png" alt="Webpack logo" height="150" style="float:left" />
A couple of nights ago I was browsing the [Wepack loader list](https://webpack.github.io/docs/list-of-loaders.html) and I noticed the [markdown-loader](https://github.com/peerigon/markdown-loader). I thought it might be interesting to try and build something using it and the first thing that came to mind was a blog. So I built this site.

Being a huge [React](https://facebook.github.io/react/) fan I thought I'd use that for rendering. Actually I've found (to no surprise really with React) the whole process to be very simple.

### tl;dr;
[View the source](https://github.com/lukehansell/lukehansell.github.io)

### Installing and Setting up the Environment

I have a pretty standard set of commands that I use to set up most React projects now. After running `npm init` I always go for:
```
> npm i --save webpack webpack-dev-server babel-loader babel-core babel-preset-es2015 babel-preset-react react react-dom
> echo '{"presets":["es2015","react"]}' > ./.babelrc
> mkdir src
```

The `.babelrc` file here tells [Babel](https://babeljs.io/) to use the es2015 and React presets when parsing files.

Since this is going to be a website I'll add a directory to source it from as well as a basic index page.

```
> mkdir public
> echo '<html><head></head><body><div id="app"/><script src="assets/app.js"></script></body></html>' > public/index.html
```

This will create an index page with a `div` and attempt to load the built asset. I always use a `div` to render into when using React. Some people like to render to the `body` but I find this messier and prefer the ability to write other things to the body that don't get overwritten.

The next task is to set up our `webpack.config.js`. In your favourite editor create a file in the root directory of your project called `webpack.config.js` and add the following:

```
module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/public/assets',
        filename: 'app.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: "babel-loader"
        }]
    }
}
```

The `entry` bit tells Webpack where to begin loading from and the `output` section tells it where to write to. The `module` section currently provides an array of loaders. These arrays have a RegEx `test` in them. If the filename being loaded matches that RegEx then the specified `loader` is applied. Here we are using the Babel-loader.

And we'll create a build task to make running Webpack easier.

In your `package.json` file, modify your scripts section like so:

```
...
"scripts": {
    "build": "webpack"
}
...
```

But we need something to build. In the `src` directory create a file `index.js` and add the following:

```
document.write('hello world')
```

If you run `npm run build`, in `public/assets`, you will have an `app.js` file which contains a load of Webpack boilerplate code and your `document.write` line.

So now we have a built asset we want to be able to see what it will look like in the browser.

In your `webpack.config.js` file, modify the output section as so:

```
...
output: {
    path: __dirname + '/public/assets',
    publicPath: '/assets/',
    filename: 'app.js'
}
...
```

The `publicPath` will tell the [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) where your site expects the scripts to be located.

And now in your `package.json` add another script:
```
"scripts": {
    ...
    "start": "webpack-dev-server --inline --hot --content-base public"
}
```

This command starts up the webpack-dev-server in inline mode with hot reloading, so we don't have to refresh between code changes and sets the base of the server to the `public` directory, where our html and built files reside.

Run `npm start` and in your browser navigate to `localhost:8080`. You should see the phrase 'hello world' displayed.

### The Application

*Please note that the following section is simplified from how I actually did this, though it does work. For a more modularised method take a look at the [source code](https://github.com/lukehansell/lukehansell.github.io)*

Now that we have a running development environment things get easier. We need to load our posts and display them on the page. To do this we will create a React component.

For simplicities sake we'll create our components in the `src/index.js` file, but you could divide these out to other files if you wish.

We'll create a simple component to display posts:
```
import React, {Component} from 'react'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: []
        }
    }

    render() {
        return (
            <ul>
                {this.state.posts.map( (post, i) => {
                    return (
                        <li>
                            <div dangerouslySetInnerHTML={{__html: post}} />
                        </li>
                    )
                })}
            </ul>
        )
    }   
}
```

Here we create a React component class with an initial "state" object consisting of "posts" which is an empty array. The render method maps through this array and uses `dangerouslySetInnerHTML` to render the contents of the array in to a div. 

**Be advised**, `dangerouslySetInnerHTML` is named as such for a reason as it doesn't clean your code, so if you're using input from unknown sources you could open your site to XSS attacks. Since we're only loading our known files we should be okay here.

The next thing to do would be to render this component out. To do that we need to add the following:

```
import {render} from 'react-dom'

render(<App />, document.getElementById('app'))
```

This takes our App element and renders it into an element with the `app` ID (remember when we added that earlier?). Now if you reload your page it will be blank...

That's all well and good, but we want to actually display a blog, not a blank page, so I suppose we should load in some data?

### Fetching the data

Our posts will be stored in markdown files to make them easy to write. We'll create a place to store them first. In your terminal run the following command:

```
> mkdir posts
```

Then in this folder create a file with the `.md` extension and write some content into there.

Next we'll need to be able to load this content. Webpack doesn't natively support markdown files so we'll add a loader to do this. Remember how earlier we specified a babel-loader? Now we'll do the same for markdown.

First install the required loaders.

```
> npm i --save markdown-loader html-loader
```

Since the markdown-loader parses the content into HTML we also need to be able to load HTML, hence the html-loader.

Then in your `webpack.config.js` add it to the `module.loaders` section.

```
module: {
    loaders: [
        ...
        {
            test: /\.md$/,
            loader: 'html-loader!markdown-loader'
        }
    ]
}
```

Now restart your `npm start` script and you will support ".md" files.

Next comes the tricky bit, loading the data into the React component.

Inside your `App` component in `src/index.js` we need to add a `componentDidMount` method to load the posts.

```
...
componentDidMount() {
    const req = require.context('../../posts', true, /.*\.md$/)

    const posts = req.keys().map( key => {
        return req(key)
    })

    this.setState({
        posts
    })
}
...
```

Because our app runs on the client we don't have access to the filesystem with the posts on. We therefore need to bundle these into our application and send it to the client as one package. Using `require.context` we can get a list of all the files in the `posts` directory. Then, using the contextualised require, we simply loop over the files and require them in. The markdown and html loaders take care of parsing the content for us and we can simply set the new state of `posts`.

If you go back to your browser you should now see your post you created. By adding more files to the `posts` directory you can now create a blog and it will automatically load them.

### Things Still To Do

So we have the posts displaying on the page, but it's not very pretty. We could add some styling to this.

Also, in this tutorial version there's no way of ordering the content or providing meta data. In the source for this blog I use the [raw-loader](https://github.com/webpack/raw-loader) to load the content, a RegEx to parse the head of the file, which includes meta data, and then I parse it with [Marked](https://www.npmjs.com/package/marked). That way I can add things like publish dates and tags. I'll cover this in a later post (or just[view the source](https://github.com/lukehansell/lukehansell.github.io)).

We're not publishing this anywhere. It's all well and good that we've got this up and running, but if no one can see it then what's the point! You could use [Surge](http://surge.sh) to publish the `public` folder or you could push to Github-pages. Surge is one of my favourite tools at the moment, I'll do a post on it soon.

### Issues With This Approach
This approach isn't as good as static site generators as you have to load all of your blog at once! Therefore the more content you have overall, the longer it takes to load your site. We can get around this by using Webpack's chunking, it wasn't covered in this post. In fact I still have to do it at this point to the this blog itself!

I'll write another post when I address this issue.

But there you have it: building a blog with Webpack, markdown and React!