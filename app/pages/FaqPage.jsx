import ApplicationNavbar from 'components/application_navbar.jsx'
import Markdown from '../ui/Markdown.jsx'
import React from 'react'

const content = `
# How does Assembly work?

Assembly enables people building products -- including software companies, hardware companies, open source projects, online communities and side projects -- to craft a narrative (i.e. a Changelog) of their progress.

It looks like this:

![changelog](http://cl.ly/image/0b0g151a2Y1y/Screen%20Shot%202015-06-30%20at%2010.07.40%20AM.png)

The benefits of maintaining a Changelog include:

Keeping your team on the same page with new designs and developments
Encouraging celebration of wins – big and small
Looping your community in as you build your product – to capture feedback early and often
Growing your audience by exposing your Changelog to the 500,000 people in the Assembly community.

----

# What is the best way to get the feel for Assembly?

Head over to [our Changelog](http://changelog.assembly.com/assembly). This is where we’re building the Changelog *on the Changelog*.

Go ahead and explore some posts, leave a comment (or an animated GIF), and let us know what you think.

After that, the next step is to [create your own Changelog](http://changelog.assembly.com).

----

# I was using Assembly 1.0, and now I’m confused.

If you’re looking for a product from Assembly 1.0, it will be on cove.assembly.com. (For example, cove.assembly.com/coderwall)

If you’re having trouble logging in to your existing account, click “I forgot my password”

If you want to bring your product onto Assembly Changelog, follow our [migration guide](https://assembly.com/migration).

If you have more questions about the differences between Assembly 1.0 and Assembly 2.0, [we've created an FAQ just for that](http://assembly.com/new-assembly-faq)

----

# I have a question that isn't answered here.

Email us at [support@assembly.com](mailto:support@assembly.com)
`

export default class FaqPage extends React.Component {
  render() {
    return (
      <div>
        <ApplicationNavbar title="FAQ" />
        <div className="container px2 mb4">
          <div className="mb3">
            <h2 className="bold">FAQ</h2>
            <Markdown markdown={content} />
          </div>
        </div>
      </div>
    )
  }
}
