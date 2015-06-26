import React from 'react'
import Button from '../../ui/Button.jsx'

export default class StoryFormWalkthrough extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: true
    }
  }

  render() {
    const content = <div className="relative" ref="content">{this.props.children}</div>

    // TODO Only on first post
    // TODO Disable on mobile
    if (!this.state.show) {
      return content
    }

    return (
      <div className="relative z1" onClick={this.handleClose.bind(this)}>
        <div className="fixed top-0 left-0 right-0 bottom-0 no-select"
             style={{backgroundColor: 'rgba(0,0,0,0.8)'}} />
        <div className="relative">
          {content}
          <div className="absolute top-0 right-0 bottom-0 left-0" />
          <div className="absolute white no-select full-width z1 top-0 left-0" style={{cursor: 'default'}}>
            <Bubble top={-4 * 16} left={-10 * 16} x={1*16} y={3*16}>
              Pick an emoji to describe the post.
            </Bubble>

            <Bubble top={-5*16} right={6*16} x={-6*16} y={5*16}>
              Features, bug fixes, and designs are all fair game.
            </Bubble>

            <Bubble top={10*16} right={-8 * 16} x={-2*16} y={-4*16}>
              Give credit to anyone who helped. Just list their usernames or email addresses.
            </Bubble>

            <Bubble top={12 * 16} x={-20} y={-120}>
              Add details and images if you want.
            </Bubble>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z2 py4 center">
          <Button color="white"
                  bg="blue"
                  action={this.handleClose.bind(this)}>
            Got it!
          </Button>
        </div>
      </div>
    )
  }


  handleClose(e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({show: false})
  }
}

// React doesn't pass down the correct props fro the marker so this needs
// to be a template string. Doesn't change much so ¯\_(ツ)_/¯
const svgMarkerHtml = `
  <marker id="markerArrow"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto">
      <path d="M0,0 L0,8 L8,4 L0,0" style="fill:#93BD16;stroke-width:0;" />
  </marker>
`

class Arrow extends React.Component {
  render() {
    const { children, x, y } = this.props
    const width = Math.abs(x)
    const height = Math.abs(y)
    const strokeWidth = 1
    const viewBox = [0, 0, width+16, height+16]
    const path = [
      'M', (x < 0 ? width : 0) + 8, (y < 0 ? height : 0) + 8,
      'l', x, y
    ]
    return (
      <svg xmlns="http://www.w3.org/svg/2000"
        viewBox={viewBox.join(' ')}
        width={width + 16}
        height={height + 16}
        fill="transparent"
        stroke="#93BD16"
        strokeWidth={strokeWidth}>
        <defs dangerouslySetInnerHTML={{__html: svgMarkerHtml}} />
        <path d={path.join(' ')}
              style={{
                markerEnd: 'url(#markerArrow)',
                strokeWidth: 2}} />
      </svg>
    )
  }
}

class Bubble extends React.Component {

  static defaultProps = {
    top: 0,
    x: 100,
    y: 100,
    width: 300
  }

  render() {
    const { top, left, right, x, y, width } = this.props
    const halfWidth = width / 2
    const style = {
      main: {
        minWidth: width,
        left, right, top
      },
      arrow: {
        left: '50%',
        top:  '50%',
        marginTop: (y < 0 ? y : 0),
        marginLeft: (x < 0 ? x : 0)
      }
    }

    return (
      <div className="absolute inline-block" style={style.main}>
        <div className="absolute" style={style.arrow}>
          <Arrow x={x} y={y} />
        </div>
        <div className="relative bg-green white px2 py1 pill center">
          {this.props.children}
        </div>
      </div>
    )
  }
}
