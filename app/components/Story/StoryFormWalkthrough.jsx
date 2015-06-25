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

    if (!this.state.show) {
      return content
    }

    // <Bubble x={200} y={200}>Add details and images if you want.</Bubble>
    // <Bubble x={200} y={200}>Give credit to anyone who helped. Just list their usernames or email addresses.</Bubble>

    return (
      <div className="relative z1" onClick={this.handleClose.bind(this)}>
        <div className="fixed top-0 left-0 right-0 bottom-0 no-select"
             style={{backgroundColor: 'rgba(0,0,0,0.8)'}} />
        <div className="relative">
          {content}
          <div className="absolute white no-select full-width" style={{cursor: 'default'}}>
            <Bubble top={0} right={0} x={100} y={3*16}>
              Features, bug fixes, and designs are all fair game.
            </Bubble>
            <Bubble top={-20} left={-10 * 16} x={50} y={80}>
              Pick an emoji to describe the post.
            </Bubble>
            <Bubble top={16 * 16} right={-8 * 16} x={200} y={200}>
              Add details and images if you want.
            </Bubble>

            <Bubble top={18*16} x={200} y={-100}>
              Give credit to anyone who helped. Just list their usernames or email addresses.
            </Bubble>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 py4 center">
          <Button color="white"
                  style="outline"
                  action={this.handleClose.bind(this)}>
            Ok, gottit
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
    const strokeWidth = 1
    const viewBox = [0, 0, x, y]
    const curve = [strokeWidth / 2, y-(strokeWidth/2)]
    const path = [
      'M', 0, 0,
      'L', x - 8, y - 8
    ]
    return (
      <svg xmlns="http://www.w3.org/svg/2000"
        viewBox={viewBox.join(' ')}
        width={x}
        height={y}
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
          <Arrow x={Math.abs(x)} y={Math.abs(y)} />
        </div>
        <div className="relative bg-green white px2 py1 pill center">
          {this.props.children}
        </div>
      </div>
    )
  }
}
