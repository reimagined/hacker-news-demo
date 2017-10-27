import React from 'react'
import { Link } from 'react-router-dom'
import sanitizer from 'sanitizer'
import styled from 'styled-components'

import Splitter from './Splitter'
import timeAgo from '../helpers'

const Wrapper = styled.div`
  margin-bottom: 0.75em;
  padding-right: 1.25em;
  padding-top: 0.65em;
  padding-left: ${2.5}em;
`

const Meta = styled.div`
  color: #666;
  margin-bottom: 0.5em;
`

const Collapse = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.33em;
  cursor: pointer;
`

const Href = styled.div`
  display: inline-block;
  vertical-align: middle;
  text-decoration: none;
  color: #666;

  &:hover {
    text-decoration: underline;
  }
`

const Time = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-left: 0.33em;
`

class Comment extends React.PureComponent {
  state = {
    expanded: true
  }

  expand = () => this.setState({ expanded: !this.state.expanded })

  render() {
    const {
      id,
      storyId,
      text,
      createdBy,
      createdByName,
      createdAt,
      parentId,
      children
    } = this.props

    if (!id) {
      return null
    }

    const parent =
      parentId === storyId
        ? `/storyDetails/${storyId}`
        : `/storyDetails/${storyId}/comments/${parentId}`

    return (
      <Wrapper>
        <Meta>
          <Collapse onClick={this.expand} tabIndex="0">
            {'['}
            {this.state.expanded ? '−' : '+'}
            {']'}
          </Collapse>
          <Link to={`/user/${createdBy}`}>
            <Href>
              <b>{createdByName}</b>
            </Href>
          </Link>
          <Time>{timeAgo(createdAt)}</Time>
          <Splitter />
          <Link to={`/storyDetails/${storyId}/comments/${id}`}>
            <Href>link</Href>
          </Link>
          <Splitter />
          <Link to={parent}>
            <Href>parent</Href>
          </Link>
        </Meta>
        {this.state.expanded ? (
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizer.sanitize(text)
            }}
          />
        ) : null}
        {this.state.expanded ? children : null}
      </Wrapper>
    )
  }

  static defaultProps = {
    level: 0
  }
}

export default Comment
