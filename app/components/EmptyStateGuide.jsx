import React from 'react'
import Button from '../ui/Button.jsx'
import SoloSrc from 'images/solo.svg'
import TeamsSrc from 'images/small-teams.svg'
import ForFunSrc from 'images/for-fun.svg'
import Link from '../components/Link.jsx'

export default class EmptyStateGuide extends React.Component {
  render() {
    return <div>
      <div className="py4 px3 center">
        <h1>Guide to getting started</h1>
        <h4>Create a Changelog, invite your team, and start posting</h4>
        <div className="mt3 sm-flex">
          <div className="flex-auto" />
          <div className="flex-none">
            <Link to="changelog" params={{changelogId: 'tips'}}>
              <Button block={true} bg="orange">View Guide</Button>
            </Link>
          </div>
          <div className="flex-auto" />
        </div>
      </div>
      <div className="border-top py4 center">
        <h4>What are you using Changelog for?</h4>
        <div className="mt3 sm-flex flex-baseline">
          <div className="md-col-4 center p2 bg-smoke-hover pointer">
            <Link to="story"
              params={{
                changelogId: 'tips', year: '2015', month: '07', day: '13',
                storyId: 'changelog-for-indie-developers-small-solo-projects',
              }}>
              <div className="gray gray-hover">
                <img src={SoloSrc} />
                <h3>Solo Projects</h3>
                <h4>Read tips</h4>
              </div>
            </Link>
          </div>
          <div className="md-col-4 center p2 bg-smoke-hover pointer">
            <Link to="story"
              params={{
                changelogId: 'tips', year: '2015', month: '07', day: '13',
                storyId: 'changelogs-for-small-functional-teams',
              }}>
              <div className="gray gray-hover">
                <img src={TeamsSrc} />
                <h3>Small teams</h3>
                <h4>Read tips</h4>
              </div>
            </Link>
          </div>
          <div className="md-col-4 center p2 bg-smoke-hover pointer">
            <Link to="story"
              params={{
                changelogId: 'tips', year: '2015', month: '07', day: '13',
                storyId: 'changelogs-for-fun-anything-and-everything',
              }}>
              <div className="gray gray-hover">
                <img src={ForFunSrc} />
                <h3>For fun</h3>
                <h4>Read tips</h4>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  }
}
