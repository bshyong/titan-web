import ApplicationNavbar from 'components/application_navbar.jsx'
import Markdown from '../ui/Markdown.jsx'
import React from 'react'

const content = `

This section of the FAQ is for anyone who was using Assembly prior to July 2015, and is curious about the changes. If you’re new to Assembly, the other FAQ sections will likely be more interesting to you.

----

# Intro

The Assembly you are familiar with, now affectionately called 1.0, will have a new home at cove.assembly.com for the time being. We will support the existing profitable products on version 1.0 as well as provide ways to migrate your product’s data to the next version of Assembly. We've also open sourced the codebase so you can continue running your product if you choose to self-host the platform.

Our mission when we created Assembly was to connect creators around the world; so they could build products together that were greater than what one person could on their own. Thanks to you and the amazing Assembly community, we’ve learned much over the last two years. We’ve seen products collectively reach millions of users and paid out thousands of dollars to contributors. 

There have also been challenges as the number of products on Assembly grew, leading to these product changes. Every product is unique and so are their needs when managing, hosting, and monetizing them. There were also needs for additional flexibility in the way products reward those in the community who help contribute to them. We realized there wasn’t any solution that could do justice to the breadth of creativity and innovation we were seeing from the Assembly community.

So, here we are with an exciting iteration on our original concept. Read below to get a better understanding of how this new version relates to Assembly 1.0, or explore the site to learn all about the new Assembly.

If you’re looking for a product from Assembly 1.0, it will be on cove.assembly.com. (For example, cove.assembly.com/coderwall

If you’re having trouble logging in to your existing account, click “I forgot my password”

If you want to bring your product onto Assembly Changelog, follow our migration guide.

If you’re curious about how we ended up with this new platform, read this [quick update about Assembly’s future](https://cove.assembly.com/meta/posts/a-quick-update-about-assembly-s-future)

----

# How can I migrate my Assembly 1.0 product to Assembly 2.0?

Follow our migration guide.

----

# What happened to App Coins?

A product only needs a few actively engaged core team members to get it on its way to success. We haven’t observed App coins adding significant value to those early team members once relationships and trust formed among them. We do have plans to add a similar concept that core teams can use to recognize and reward new contributors that briefly help out, but the actual reward and how they are used will be defined by each product.

If you want to still use App Coins for your product you can self host your own Assembly 1.0 instance. We’ve also open sourced the core infrastructure we used for App Coins which you can find at coins.assembly.com.

----

# I need access to my domain/Heroku/repo for an Assembly 1.0 product

Contact us: support@assembly.com

----

# If I migrate a product from v1, can I keep the ownership distribution I have today?

When v1 eventually reaches it's end of life we'll provide alternative suggestions to maintaining an App Coin ledger. For the time being, you can continue to access the your product's App Coin ledger and award new App Coins on v1 (cove.assembly.com). 

Products have already started collecting their own revenue so it is their responsibility to handling how they recognize the App Coins they have distributed. Coderwall as an example is continuing to do so.

----

# I earn monthly revenue from an Assembly 1.0 product, what will happen to this?

You’ll continue to earn revenue while the product is running, is profitable, and you have App Coins. You’ll continue to have access to your account on cove.assembly.com which you can use to request withdrawals, update information, and continue participating on the product’s bounties.

----

# Can you outline all the differences between the way I built a distributed product on Assembly v1 and the way I can build one on Assembly v2?

Sure thing:

On Assembly v1, domains, payments and hosting were held by Assembly – meaning you were restricted to Stripe, Heroku, and a specific code license. Now, you and your team can manage these things with any tools and licenses you like.

On Assembly v1, you could start with an idea and try to form a team to start building it. Now, there’s a bias toward action. You can just go ahead and start building in public and let people get involved along the way. By creating a “Pinned Post” with the details of how someone can get involved, you can open your product up to the community.

On Assembly v1, each product used Assembly Chat for communication and Bounties for product management. Now, you can use any tools you like (lots of people are using Slack for chat and Trello for product management) – and they are tightly integrated with Assembly.

On Assembly v1, all the products had to use Assembly’s tools for product management and communication. Now, you can use Trello, Slack, or whatever other powerful tools you want. Each product has a Pinned Post that points you to the pertinent info you’d need to get involved.


On Assembly v1, ownership was handled on the platform. Now, you can manage this as you see fit. You might use a Google Spreadsheet to start off until you make enough progress to formalize things, you might use a tool like Coin Prism on the Blockchain, or you might incorporate and create a company with an equity cap table. It means you don’t need to rely on Assembly a the source of truth for ownership distribution.

On Assembly v1, revenue was distributed by Assembly, and restricted to Stripe Subscriptions. Now your team can use any payments tools you want and handle revenue sharing as you see fit.

On Assembly v1, you could create Bounties that were aimed at recruiting new team members to work on your product. Assembly v2 instead creates a better way to showcase your team and its progress in building the product, which gets exposed to the community and will organically foster interest from people who can help make your product better.

On Assembly v1, you could submit an idea and other people would build it for you for free – and you’d keep most of the ownership. Nope, that wasn’t how it worked. On Assembly v2, you can share your ideas on the [Requests For Startups](http://changelog.assembly.com/rfs changelog, and you can connect with great people in the community and build products together.

----

# I have a question that isn't answered here.

Email us at [support@assembly.com](mailto:support@assembly.com)
`

export default class NewFaqPage extends React.Component {
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
