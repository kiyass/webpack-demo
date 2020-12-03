import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

class Search extends React.Component {

  componentDidMount () {
    console.log(_.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 }));
  }

  render () {
    return <div>Search Text</div>
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
)