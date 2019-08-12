import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag'
 


class UsersList extends Component {
  getUsersList() {
    const { loading, error, data } = useQuery(USER_QUERY);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    
    const usersToRender = data.GlideRecord_Query.sys_user._results

    return (
            <div>
              {usersToRender.map(user => <span>{user.name}</span>)}
            </div>
    );
  }
  render(){
    return (
      <div>Hello World 22</div>
    )
  }
}

const USER_QUERY = gql`
query{
  GlideRecord_Query{
    sys_user {
      _results{
        name {
          value
        }
      }
    }
  }
}
`

class App extends Component {
  
   render() {
     return (
       <div className="App">
         <div className="App-header">
           <img src={logo} className="App-logo" alt="logo" />
           <h2>Welcome to Apollo</h2>
         </div>
         <UsersList />
       </div>
     );
   }
 }
export default App;