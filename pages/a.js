import React, { Fragment } from 'react'

class Page extends React.Component {
  linkClicked(e) {

  }

  render() {
    return (
      <div onClick={this.linkClicked}>test</div>
    )
  }
}

export default Page
