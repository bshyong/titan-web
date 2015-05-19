# Testing

So you want to write a test?

![](http://media4.giphy.com/media/U50kyGOHYjphS/200.gif)

Great!

1. [Stores](#stores)
    1. [Writing a Fake Store Test](#writing-a-fake-store-test) - The basics
    2. [Writing a Real Store Test](#writing-a-real-store-test) - The good stuff
2. [Components](#components)
    1. [Writing a Fake Component Test](#writing-a-fake-component-test) - The basics
    2. [Writing a Real Component Test](#writing-a-real-component-test) - The good stuff

## Stores

### Writing a Fake Store Test

Always remember, [Jest](http://facebook.github.io/jest/) mocks everything by default &mdash; and I mean _everything_.

```javascript
// my_store.js

import Store from '../lib/store'

class MyStore extends Store {
  // ... omitting boilerplate

  foo() {
    return 'foo'
  }
}

let store = new MyStore()

store.foo() // -> 'foo'

export default store
```

```javascript
// my_store-test.js
describe('MyStore', () => {
  it('mocks f*cking everything', () => {
    let store = require('../my_store')

    // this test fails
    expect(store.foo()).toEqual('foo')
  })
})
```

What went wrong? Jest mocked `MyStore`, so while you can call `foo()`, its internals are mocked and return nothing.

![](http://img.pandawhale.com/83932-effy-stonem-nothing-gif-wniH.gif)

If you want to test a method on `MyStore`, you need to tell Jest not to mock it:

```javascript
// my_store-test.js
jest.dontMock('../my_store')

describe('MyStore', () => {
  it('mocks f*cking everything', () => {
    let store = require('../my_store')

    // now the test passes
    expect(store.foo()).toEqual('foo')
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

```javascript
// app/stores/__tests__/attachment_store-test.js
'use strict'

jest.dontMock('../attachment_store')
```

We add a `'use strict'` declaration so that we can use `let` effectively inside the test, and we tell Jest not to mock the store that we're targeting.

![](http://38.media.tumblr.com/111d9fc01bc2fa0122fdfbd2f75655fc/tumblr_inline_mp08yvEzE21qz4rgp.gif)

Next, let's start defining our tests:

```javascript
describe('AttachmentStore', () => {
  let ATTACHMENT_FAILED, ATTACHMENT_UPLOADED, AttachmentStore, callback, Dispatcher

  beforeEach(() => {
    ATTACHMENT_FAILED = require('../../constants').ATTACHMENT_FAILED
    ATTACHMENT_UPLOADED = require('../../constants').ATTACHMENT_UPLOADED
    Dispatcher = require('../../lib/dispatcher')
    AttachmentStore = require('../attachment_store')
    callback = Dispatcher.register.mock.calls[0][0]
  })
})
```

This `describe` block will contain all of our tests. At the top, we declare the variables that we want to be available in the top level of this closure &mdash; they include the constants that `AttachmentStore` uses, `AttachmentStore` itself, a `callback`, and a (mocked) `Dispatcher`.

We want to assign a fresh instance of the value for each of these variables every time a test runs, so we perform the assignment inside a `beforeEach` call. Note that you _must_ assign `Dispatcher` before assigning your store to its variable. This order guarantees that `Dispatcher.register.mock.calls[0][0]` references the callback that your store passed in its call to `Dispatcher.register`. If that's kind of confusing, read [this](https://facebook.github.io/react/blog/2014/09/24/testing-flux-applications.html#testing-stores).

![](http://media4.giphy.com/media/FRNQuq6FtiQHC/200.gif)

Inside of the block `describe`-ing `AttachmentStore`, add another `describe` block:

```javascript
describe('getAttachment()', () => {
  beforeEach(() => {
    callback({
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

Notice that we're using `callback` directly &mdash; by using the mocked `register` callback, we can bypass the action creator (and test it separately). We simply pass `callback` an object containing all of the properties that an action contains so that the store has the expected state.

Then, in the `it` block, we call the method we're testing (in this case, `getAttachment()`) with any necessary parameters (`commentId`). We know that `AttachmentStore.getAttachment()` returns an object, so we simply make sure that its properties match the properties that we passed in `callback`.

```shell
[user]$ jest app/stores/__tests__/attachment_store-test.js
Using Jest CLI v0.4.5
Waiting on 1 test...
 PASS  app/stores/__tests__/attachment_store-test.js (1.534s)
1 test passed (1 total)
Run time: 1.787s
```

And that's that.

![](https://33.media.tumblr.com/c315040dde64b326195f9d61f191f6bb/tumblr_ml9zcsHuyz1qh9nffo1_500.gif)


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

But it's a well known fact that VCs don't fund untested React components. Trust me.

![](http://media3.giphy.com/media/10YRbZ33HcLZbW/200.gif)

So let's test it:

```javascript
// __tests__/my_component-test.js

'use strict'

jest.dontMock('../my_component.jsx')

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

1. We tell Jest not to mock `MyComponent` &mdash; you remember that from above, right?
2. We reinitialize React and MyComponent before every test. This ensures that we're testing a blank slate and aren't depending on any state that might be left over from a previous test.
3. `TestUtils`'s API includes a bunch of long, difficult-to-remember-but-very-descriptive methods like `findRenderedDOMComponentWithTag`. I suspect it was written by someone who spent too long hacking Java.

![](http://i.imgur.com/5nfca5U.gif)

4. Also note that you can check the state of an instance of `MyComponent` directly. Don't update it &mdash; obviously &mdash; but do make sure it has the values it should have based on the interaction at that point.

And now you've got a passing test!

![](http://media3.giphy.com/media/r040VQS7kEtRm/200.gif)

### Writing a Real Component Test

Now that you've seen how to write a component test in the abstract, let's make it concrete by testing `FollowButton.`

We start by scaffolding the test:

```javascript
// app/components/__tests__/follow_button-test.js

'use strict'

jest.dontMock('../follow_button.jsx')

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
    SessionActions = require('../../actions/session_actions')
  })

  describe('not signed in', () => {
    it('calls SessionActions.signin()', () => {
      let followButton = TestUtils.renderIntoDocument(
        <FollowButton changelogId="changelog" toggled={true} />
      )

      let button = TestUtils.findRenderedDOMComponentWithTag(
        followButton,
        'button'
      )

      TestUtils.Simulate.click(button)

      expect(SessionActions.signin).toBeCalled()
    })
  })
})
```

We're first going to test that the user is sent to the sign in page if they aren't signed in when clicking the `FollowButton`. Remember that Jest mocks everything for us, so `SessionActions.signin()` is already mocked (and spied on) for us.

We render an instance of `FollowButton` using `TestUtils.renderIntoDocument`. Jest has mounted a [jsdom](https://github.com/tmpvar/jsdom) DOM for us, and `TestUtils` knows to render into that.

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
expect(SessionActions.signin).toBeCalled()
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

    SessionStore.isSignedIn.mockImpl(() => {
      return true
    })
  })
})
```

We can see in `FollowButton` that `handleClick()` is checking `SessionStore.isSignedIn()` &mdash; we can override this method easily since Jest has already mocked it for us. We add this override in a `beforeEach`, along with `FollowActions`, which we'll be spying on to make sure that the right methods are called. (Remember, Jest adds the spies automatically unless we tell it not to. You'll agree that this is awesome.)

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
  let followButton = TestUtils.renderIntoDocument(
    <FollowButton changelogId="changelog" toggled={true} />
  )

  let button = TestUtils.findRenderedDOMComponentWithTag(
    followButton,
    'button'
  )

  TestUtils.Simulate.click(button)

  expect(FollowActions.unfollow).toBeCalledWith('changelog')
})

it('calls FollowActions.follow() if untoggled', () => {
  let followButton = TestUtils.renderIntoDocument(
    <FollowButton changelogId="changelog" toggled={false} />
  )

  let button = TestUtils.findRenderedDOMComponentWithTag(
    followButton,
    'button'
  )

  TestUtils.Simulate.click(button)

  expect(FollowActions.follow).toBeCalledWith('changelog')
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
  TestUtils.Simulate.click(makeButton(true))

  expect(FollowActions.unfollow).toBeCalledWith('changelog')
})

it('calls FollowActions.follow() if untoggled', () => {
  TestUtils.Simulate.click(makeButton(false))

  expect(FollowActions.follow).toBeCalledWith('changelog')
})
```

Beautiful!

![](http://img.pandawhale.com/post-56469-iimgurcom-t72I.gif)

Action tests coming soon.
