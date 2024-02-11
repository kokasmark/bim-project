import './App.css';
import React, {Component} from 'react';
import logo from './assets/logo.png';
import { Link } from 'react-router-dom';


class NavBar extends Component{
  render(){
    return(
      <div className='navbar'>
        <Link to={'/'}><img src={logo}/></Link>
        <Link to={'/dashboard'}><p>Dashboard</p></Link>
        <Link to={'/orders'}><p>Orders</p></Link>

        {!localStorage.getItem("login-token") && <div>
          <Link to={'/signup'}><button  className='rounded-btn-secondary' style={{right: 120, marginTop: 15}}>Sign Up</button></Link>
          <Link to={'/signin'}><button className='rounded-btn-primary'>Sign In</button></Link>
        </div>}

        {localStorage.getItem("login-token") && 
          <div style={{position: "absolute", right: 100}}>
              <h5>Logged in as {localStorage.getItem("login-name")}</h5>
          </div>
        }

      </div>
    )
  }
}

export default NavBar;
