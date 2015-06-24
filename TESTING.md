# Testing

So you want to write a test?

![](http://media4.giphy.com/media/U50kyGOHYjphS/200.gif)

Great!

NOTE: We've switched out [Jest](http://facebook.github.io/jest/) for [Jasmine](http://jasmine.github.io/). Jest actually depends on Jasmine 1.3, so much of the API will look the same. The big changes are that everything isn't automatically mocked (which means you're in charge of setting up and tearing down your mocks and spies), and `toBeCalled{With}` is now `toHaveBeenCalled{With}`.

This would usually mean that you'd want to have an `afterEach` for every `beforeEach` call, but there's a bit of magic in `tests.webpack.js` that resets a module's state on every `require`. If you find yourself writing an `afterEach`, first make sure that your tests are set up correctly.

1. [Stores](#stores)
    1. [Writing a Fake Store Test](#writing-a-fake-store-test) - The basics
    2. [Writing a Real Store Test](#writing-a-real-store-test) - The good stuff
2. [Components](#components)
    1. [Writing a Fake Component Test](#writing-a-fake-component-test) - The basics
    2. [Writing a Real Component Test](#writing-a-real-component-test) - The good stuff

## Stores

### Writing a Fake Store Test

~~Always remember, [Jest](http://facebook.github.io/jest/) mocks everything by default &mdash; and I mean _everything_.~~

We aren't using Jest anymore; mock when you need to.

```javascript
// app/stores/my_store.js

import { FOO } from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class MyStore extends Store {
  this._foo = null

  this.dispatchToken = Dispatcher.register((action) => {
    switch (action.type) {
      case FOO:
        this._foo = action.foo
        this.emitChange()
        break
    }
  })

  get foo() {
    return this._foo
  }
}

export default new MyStore()
```

```javascript
// app/stores/__tests__/my_store-test.js
describe('MyStore', () => {
  let Dispatcher, MyStore
  beforeEach(() => {
    Dispatcher = require('../../lib/dispatcher')
    MyStore = require('../my_store')
  })

  it('foo returns the current foo', () => {
    expect(MyStore.foo).toBeNull()

    Dispatcher.dispatch({
      type: 'FOO',
      foo: 'bar'
    })

    expect(MyStore.foo).toEqual('bar')
  })
})
```

That was pretty easy, right?

![](http://media4.giphy.com/media/XMBJ0l20sNWEM/200.gif)

### Writing a Real Store Test

Now that you've got a handle on the basics, let's write a real store test together. The test covered here will have been written by the time you read this tutorial &mdash; it might even have changed &mdash; but you'll follow generally the same pattern when you write your tests.

Let's first create the file:

```shell
[user]$ touch app/stores/__tests__/attachment_store-test.js
```

And add the basics to the top of the file

Next, let's start defining our tests:

```javascript
describe('AttachmentStore', () => {
  let ATTACHMENT_FAILED, ATTACHMENT_UPLOADED, AttachmentStore, Dispatcher

  beforeEach(() => {
    ATTACHMENT_FAILED = require('../../constants').ATTACHMENT_FAILED
    ATTACHMENT_UPLOADED = require('../../constants').ATTACHMENT_UPLOADED
    Dispatcher = require('../../lib/dispatcher')
    AttachmentStore = require('../attachment_store')
  })
})
```

This `describe` block will contain all of our tests. At the top, we declare the variables that we want to be available in the top level of this closure &mdash; they include the constants that `AttachmentStore` uses, `AttachmentStore` itself, and the `Dispatcher`.

We want to assign a fresh instance of the value for each of these variables every time a test runs, so we perform the assignment inside a `beforeEach` call.

![](http://media4.giphy.com/media/FRNQuq6FtiQHC/200.gif)

Inside of the block `describe`-ing `AttachmentStore`, add another `describe` block:

```javascript
describe('getAttachment()', () => {
  beforeEach(() => {
    Dispatcher.dispatch({
      type: ATTACHMENT_UPLOADED,
      commentId: 1,
      attachment: { url: '/test.jpg', name: 'test.jpg' }
    })
  })

  it('gets the attachment matching the given commentId', () => {
    let attachment = AttachmentStore.getAttachment(1)

    expect(attachment.url).toEqual('/test.jpg')
    expect(attachment.name).toEqual('test.jpg')
  })
})
```

Notice that we're using `Dispatcher.dispatch` directly &mdash; by using the mocked `register` callback, we can bypass the action creator (and test it separately). We simply pass `Dispatcher.dispatch` an object containing all of the properties that an action contains so that the store has the expected state.

Then, in the `it` block, we call the method we're testing (in this case, `getAttachment()`) with any necessary parameters (`commentId`). We know that `AttachmentStore.getAttachment()` returns an object, so we simply make sure that its properties match the properties that we passed in `Dispatcher.dispatch`.

```shell
[user]$ npm test
.
Chrome 43.0.2357 (Mac OS X 10.10.3): Executed 1 of 1 SUCCESS (0.009 secs / 0.425 secs)
```

And that's that.

![](https://33.media.tumblr.com/c315040dde64b326195f9d61f191f6bb/tumblr_ml9zcsHuyz1qh9nffo1_500.gif)

If you want to run only one test suite (one `describe` block), simply go to the test file and change the `describe` of your choice to `fdescribe`. Similarly, to run a single test, chang its `it` to `fit`. 

## Components

### Writing a Fake Component Test

Now let's test some interactions. We'll fake it first to get the hang of things.

![](http://38.media.tumblr.com/tumblr_m7zp7cmMnY1qlvwnco1_400.gif)

Let's say we have a component:

```javascript
// my_component.jsx

import React from 'react'

export default MyComponent extends React.Component {
  constructor() {
    super()

    this.state = {
      count: 0
    }
  }

  incrementCount(e) {
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    return (
      <div>
        {this.state.count}
        <button onClick={this.incrementCount.bind(this)}>Click me</button>
      </div>
    )
  }
}
```

It's a pretty basic component &mdash; you can click a button, and there's a counter that shows how many times the button has been clicked. Hook it up to the [blockchain](https://blockchain.info/) and you could probably get VC funding.

![](http://media2.giphy.com/media/5xtDarJ7d5HXTRULbSo/200.gif)

But it's a well known fact that VCs don't fund untested React components.

![](http://media3.giphy.com/media/10YRbZ33HcLZbW/200.gif)

So let's test it:

```javascript
// __tests__/my_component-test.js

describe('MyComponent', () => {
  let React, MyComponent, TestUtils;

  beforeEach(() => {
    React = require('react/addons')
    MyComponent = require('../my_component.jsx')
    TestUtils = React.addons.TestUtils
  })

  it('increments the count when the button is clicked', () => {
    let myComponent = TestUtils.renderIntoDocument(<MyComponent />)
    let button = TestUtils.findRenderedDOMComponentWithTag(
      myComponent, 'button'
    )

    expect(myComponent.state.count).toEqual(0)

    // note the capital 'S' in 'simulate'
    TestUtils.Simulate.click(button)

    expect(myComponent.state.count).toEqual(1)
  })
})
```

A couple of things to note:

1. We reinitialize React and MyComponent before every test. This ensures that we're testing a blank slate and aren't depending on any state that might be left over from a previous test.
2. `TestUtils`'s API includes a bunch of long, difficult-to-remember-but-very-descriptive methods like `findRenderedDOMComponentWithTag`. I suspect it was written by someone who spent too long hacking Java.

![](http://i.imgur.com/5nfca5U.gif)

3. Also note that you can check the state of an instance of `MyComponent` directly. Don't update it &mdash; obviously &mdash; but do make sure it has the values it should have based on the interaction at that point.

And now you've got a passing test!

![](http://media3.giphy.com/media/r040VQS7kEtRm/200.gif)

### Writing a Real Component Test

Now that you've seen how to write a component test in the abstract, let's make it concrete by testing `FollowButton.`

We start by scaffolding the test:

```javascript
// app/components/__tests__/follow_button-test.js

describe('FollowButton', () => {
  let React, FollowButton, TestUtils;

  beforeEach(() => {
    React = require('react/addons')
    FollowButton = require('../follow_button.jsx')
    TestUtils = React.addons.TestUtils
  })
})
```

Take a deep breath. It's about to get awesome.

![](http://i.giphy.com/nkus6a648V1SM.gif)

Inside the `'FollowButton'` `describe` block, add another `describe`:

```javascript
// app/components/__tests__/follow_button-test.js

describe('handleClick()', () => {
  let SessionActions

  beforeEach(() => {
    SessionActions = require('../../actions/SessionActions')
  })

  describe('not signed in', () => {
    it('calls SessionActions.signin()', () => {
      spyOn(SessionActions, 'signin')

      let followButton = TestUtils.renderIntoDocument(
        <FollowButton changelogId="changelog" toggled={true} />
      )

      let button = TestUtils.findRenderedDOMComponentWithTag(
        followButton,
        'button'
      )

      TestUtils.Simulate.click(button)

      expect(SessionActions.signin).toHaveBeenCalled()
    })
  })
})
```

We're first going to test that the user is sent to the sign in page if they aren't signed in when clicking the `FollowButton`.

We render an instance of `FollowButton` using `TestUtils.renderIntoDocument`. Karma has launched the test in a browser, and `TestUtils` knows to render into its DOM.

But what's that `spyOn` thing?

![](http://i.giphy.com/KYlTGWshxs9fG.gif)

`spyOn` is injected globally by Jasmine, our testing framework. Use it to set up your spies (and mocks using, e.g., `spyOn(thing, 'foo').and.callFake(() => { return true })`). For this test, we just want to replace the default `SessionActions.signin` method with a spy so that we can verify it's been called.

Next, we find the actual button that we'll be clicking:

```javascript
let button = TestUtils.findRenderedDOMComponentWithTag(
  followButton,
  'button'
)
```

And we click it:

```javascript
TestUtils.Simulate.click(button)
```

And then we check our expectation:

```javascript
expect(SessionActions.signin).toHaveBeenCalled()
```

![](https://media1.giphy.com/media/12jnTh8Dp0cFJS/200.gif)

All right, that was simple enough. But how do we test what happens when we're signed in?

Let's add another describe block below `describe('not signed in', () => { ... })`:

```javascript
// app/components/__tests__/follow_button-test.js

describe('signed in', () => {
  let FollowActions, SessionStore

  beforeEach(() => {
    FollowActions = require('../../actions/follow_actions')
    SessionStore = require('../../stores/session_store')

    spyOn(SessionStore, 'isSignedIn').and.callFake(() => {
      return true
    })
  })
})
```

We can see in `FollowButton` that `handleClick()` is checking `SessionStore.isSignedIn()` &mdash; we can override this method easily since Jest has already mocked it for us. We add this override in a `beforeEach`, along with `FollowActions`, which we'll be spying on to make sure that the right methods are called.

In `FollowButton`, there are two branches of an `if` block checking `this.props.toggled`:

```javascript
// app/components/follow_button.jsx

if (this.props.toggled) {
  FollowActions.unfollow(this.props.changelogId)
} else {
  FollowActions.follow(this.props.changelogId)
}
```

So we'll need two tests:

```javascript
// app/components/__tests__/follow_button-test.js

it('calls FollowActions.unfollow() if toggled', () => {
  spyOn(FollowActions, 'unfollow')

  let followButton = TestUtils.renderIntoDocument(
    <FollowButton changelogId="changelog" toggled={true} />
  )

  let button = TestUtils.findRenderedDOMComponentWithTag(
    followButton,
    'button'
  )

  TestUtils.Simulate.click(button)

  expect(FollowActions.unfollow).toHaveBeenCalledWith('changelog')
})

it('calls FollowActions.follow() if untoggled', () => {
  spyOn(FollowActions, 'follow')

  let followButton = TestUtils.renderIntoDocument(
    <FollowButton changelogId="changelog" toggled={false} />
  )

  let button = TestUtils.findRenderedDOMComponentWithTag(
    followButton,
    'button'
  )

  TestUtils.Simulate.click(button)

  expect(FollowActions.follow).toHaveBeenCalledWith('changelog')
})
```

These tests pass &mdash; nice!

![](http://img4.wikia.nocookie.net/__cb20131201013520/the-house-of-anubis/images/0/00/Youre_awesome_gif.gif)

But there's a bit of duplication that we should refactor out: notice how the only difference between the two tests when initializing a `button` to click is whether or not `FollowButton.props.toggled` is `true` or `false`. Let's move that initialization to a function at the top of this describe block:

```javascript
// app/components/__tests__/follow_button-test.js

const makeButton = (toggled) => {
  let followButton = TestUtils.renderIntoDocument(
    <FollowButton changelogId="changelog" toggled={toggled} />
  )

  return TestUtils.findRenderedDOMComponentWithTag(
    followButton,
    'button'
  )
}
```

Now we can rewrite our tests to look like:

```javascript
it('calls FollowActions.unfollow() if toggled', () => {
  spyOn(FollowActions, 'unfollow')

  TestUtils.Simulate.click(makeButton(true))

  expect(FollowActions.unfollow).toBeCalledWith('changelog')
})

it('calls FollowActions.follow() if untoggled', () => {
  spyOn(FollowActions, 'follow')

  TestUtils.Simulate.click(makeButton(false))

  expect(FollowActions.follow).toBeCalledWith('changelog')
})
```

Beautiful!

![](http://img.pandawhale.com/post-56469-iimgurcom-t72I.gif)

Action tests coming soon.
