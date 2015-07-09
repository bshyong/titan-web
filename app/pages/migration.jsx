import ApplicationNavbar from 'components/application_navbar.jsx'
import Markdown from '../ui/Markdown.jsx'
import React from 'react'

const content = `

Do you have an Assembly product you’d like to migrate to Assembly v2? Great, you’re in the right place.

## 1. Secure domain, hosting, payments, etc.

Assembly has initiated the process of transferring web domains, Heroku apps, and Stripe accounts back to the community in recent weeks. If Assembly still holds a piece of your product, check your inbox for steps to claim it, or [contact us](mailto:support@assembly.com).

## 2. Start a changelog

Head over to [Assembly.com](http://assembly.com), sign in, and click “Create Changelog”.

Fill in the pertinent details, walk through the onboarding process – where you can invite your team members by email or Assembly username, and create your first post (lots of people’s first post is “welcome to our new Changelog!”)

![Screen Shot 2015-07-07 at 4.13.22 PM.png](https://d1015h9unskp4y.cloudfront.net/attachments/7c63ab18-26be-4393-ab5a-677f1f13ff8e/Screen Shot 2015-07-07 at 4.13.22 PM.png)


## 3. Import your product

Visit your new Changelog. Click “settings” and scroll down until you see “Import a product from v1”.


Paste the URL of your v1 product (example: cove.assembly.com/coderwall), and click import.


![Screen Shot 2015-07-07 at 4.12.36 PM.png](https://d1015h9unskp4y.cloudfront.net/attachments/e9d53e76-e112-48ac-8f33-43c325a4b239/Screen Shot 2015-07-07 at 4.12.36 PM.png)


## 4. Polish up your new Changelog

Edit the wording for post titles that are unclear
Add a cover image
Change the emoji tags to your imported posts
Create a “Pinned Post” that details how someone can get involved (links to repos, Slack channels, Trello boards, etc.)

![changelogs.png](https://d1015h9unskp4y.cloudfront.net/attachments/c82424ce-65b9-49a6-84b7-50ce8cd05fa2/changelogs.png)

## 5. Spread the word

Go out and tell your friends about this new Changelog. It’s a great way for people to see all the progress you’ve made, to get involved and offer feedback, and to jump in and help out.


The benefits of maintaining a Changelog include:


Keeping your team on the same page with new designs and developments
Encouraging celebration of wins – big and small
Looping your community in as you build your product – to capture feedback early and often
Growing your audience by exposing your Changelog to the 500,000 people in the Assembly community.


Let us know if you have any questions along the way!

![Screen Shot 2015-07-09 at 2.04.09 PM.png](https://d1015h9unskp4y.cloudfront.net/attachments/4e04040d-78be-4fcd-8e6f-bc3d82d1f652/Screen Shot 2015-07-09 at 2.04.09 PM.png)

`

export default class migration extends React.Component {
  render() {
    return (
      <div>
        <ApplicationNavbar title="Migration Guide" />
        <div className="container px2 mb4">
          <div className="mb3">
            <h2 className="bold">Migration Guide</h2>
            <Markdown markdown={content} />
          </div>
        </div>
      </div>
    )
  }
}
