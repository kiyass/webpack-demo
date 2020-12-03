import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { a } from './test';

class Search extends React.Component {

  componentDidMount () {
    console.log(_.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 }));
    console.log('hot')
    const val = a();
  }

  render () {
    return <div>Search Text</div>
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
)