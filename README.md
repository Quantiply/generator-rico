
## Rico generator


## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
npm install -g yo
```

Yeoman Generators
---

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-rico from npm, run:

```bash
npm install -g git+https://git@github.com/quantiply/generator-rico.git
```

Finally, initiate the generator:

```bash
mkdir project_name
cd project_name
yo rico
```

To generate a Samza task
```
cd project_name
yo rico:task
```

Development mode
---

1. Clone the github repo `git clone git@github.com:Quantiply/generator-rico.git`
2. Install all required deps `npm install`
2. Link the code in npm  `npm link`

Use the generator as described above.




