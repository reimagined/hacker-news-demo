import React from 'react'
import { gql, graphql } from 'react-apollo'
import { connect } from 'react-redux'

import Stories from '../components/Stories'

class NewestByPage extends React.PureComponent {
  componentDidUpdate = () => {
    const { refetchStories, onRefetched, data: { refetch } } = this.props

    if (refetchStories.newest) {
      refetch()
      onRefetched()
    }
  }

  render() {
    const {
      match: { params: { page } },
      data: { stories = [], refetch }
    } = this.props

    return (
      <Stories
        refetch={refetch}
        items={stories}
        page={page || '1'}
        type="newest"
      />
    )
  }
}

const withGraphql = graphql(
  gql`
    query($page: Int!) {
      stories(page: $page) {
        id
        type
        title
        link
        commentCount
        votes
        createdAt
        createdBy
        createdByName
      }
    }
  `,
  {
    options: ({ match: { params: { page } } }) => ({
      variables: {
        page: page || '1'
      }
    })
  }
)

const mapStateToProps = ({ ui: { refetchStories } }) => ({
  refetchStories
})

const mapDispatchToProps = dispatch => ({
  onRefetched: () =>
    dispatch({
      type: 'STORIES_REFETCHED',
      page: 'newest'
    })
})

export default withGraphql(
  connect(mapStateToProps, mapDispatchToProps)(NewestByPage)
)
