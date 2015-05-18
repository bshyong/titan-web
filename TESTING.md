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

Here's what you need to know for testing stores:

1. [Jest](http://facebook.github.io/jest/) mocks everything by default &mdash; and I mean _everything_.

```javascript
// my_store.js

class MyStore extends Store {
  // ... omitting boilerplate

  foo() {
    return 'foo'
  }
}

let store = new MyStore()

store.foo() // -> 'foo'

export default store

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

Let's first create the file:x:

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

This `describe` block will contain all of our tests. At the top, we declare the variables that we want to be available in the top level of this closure &mdash; they include the constants that `AttachmentStore` uses, `AttachmentStore` itself, a `callback`, and a (mocked) `Dispatcher`. We want to assign a fresh instance of the value for each of these variables every time a test runs, so we perform the assignment inside a `beforeEach` call. Note that you _must_ assign `Dispatcher` before assigning your store to its variable. This order guarantees that `Dispatcher.register.mock.calls[0][0]` references the callback that your store passed in its call to `Dispatcher.register`. If that's kind of confusing, read [this](https://facebook.github.io/react/blog/2014/09/24/testing-flux-applications.html#testing-stores).

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

Notice that we're using `callback` directly &mdash; by using the mocked `register` callback, we can bypass the action creator (and test it separately). We simply pass `callback` an object containing all of the properties that an action might contain so that a store has the expected state.

Then, in the `it` block, we call the method we're testing (in this case, `getAttachemnt()`) with any necessary parameters (`commentId`). We know that `AttachmentStore.getAttachment()` returns an object, so we simply make sure that its properties match the properties that we passed in `callback`.

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

TODO

### Writing a Real Component Test

TODO
