import './App.css';
import React, { Component } from 'react';
import logo from './assets/logo.png';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie } from './cookie';
import AuthRedirect from './authRedirect';
import NavBar from './NavBar';
import { IoRemoveCircle } from 'react-icons/io5';
const ManageWrapper = () => {
  const navigate = useNavigate();

  return <ManagePage navigate={navigate} />;
};
class ManagePage extends Component {
  state = {
    admins:[],
    email: '', 
    worktypes: [],
    newWorkType: ''
  }
  getAdmins(){
    var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify();

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://localhost:3001/api/get-admins", requestOptions)
          .then(response => response.text())
          .then(result => {
            var r = JSON.parse(result);
            if(r.admins.length > 0){
              this.setState({admins: r.admins})
            }
          })
          .catch(error => console.log('error', error));
  }
  addAdmin(){
    var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "token": getCookie("login-token"),
        "email": this.state.email
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("http://localhost:3001/api/add-admin", requestOptions)
        .then(response => response.text())
        .then(result => {
          var r = JSON.parse(result);
          if(r.success){
            Swal.fire(`Admin hozzáadva!`,  this.state.email, "success")
            this.setState({email: ''});
          }
        })
        .catch(error => console.log('error', error));
  }
  getWorktypes(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch("http://localhost:3001/api/get-worktypes", requestOptions)
    .then(response => response.text())
    .then(result => 
        {
            var r = JSON.parse(result);
            console.log(r)
            if(r.success){
                let workTypes = []
                r.workTypes.forEach(wtype => {
                    workTypes.push({label: wtype, value: wtype});
                });
                this.setState({worktypes: workTypes})
            }
        })
    .catch(error => console.log('error', error));
  }
  updateWorktype(wt,add){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "token": getCookie("login-token"),
      "worktype": wt,
      action: add
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3001/api/update-worktype", requestOptions)
      .then(response => response.text())
      .then(result => {
        var r = JSON.parse(result);
        if(r.success){
          Swal.fire(add == 1? `Munkatípus hozzáadva!`: `Munkatípus eltávolítva!`,  wt, "success")
          this.setState({newWorkType: ''})
        }
      })
      .catch(error => console.log('error', error));
  }
  componentDidMount() {
    this.getAdmins();
    this.getWorktypes();
  }

  render() {
    return (
      <div className='page'>
        <div className='manage-panel'>
          <h1>Manage</h1>
            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', background: 'var(--primary)', width: 400, borderRadius: 10, maxHeight: 200, overflowY: 'auto'}}>
              {this.state.admins.map((admin, index) =>(
                <p key={'admin-'+index}><b>{admin.name}</b> - {admin.email}</p>
              ))

              }
            </div>
            <div style={{display: 'flex', gap: 10, justifyContent: 'center', marginTop: 50}}>
              <input style={{width: 300, height: 40}} placeholder='pl.: admin@admin.com' onChange={(e)=> this.setState({email: e.target.value})}></input>
              <div className='rounded-btn-primary' onClick={()=>this.addAdmin()}>Felvétel Adminnak</div>
            </div>

            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', marginTop: 50}}>
              <h3>Munka típusok</h3>
              {this.state.worktypes.map((worktype, index) =>(
                  <div key={'wt-'+index} style={{display: 'flex', gap: 10}}>
                    <b>- {worktype.label}</b>
                    <IoRemoveCircle className='interactable' style={{ fontSize: 20}} onClick={()=>this.updateWorktype(worktype.value, 0)}/>
                  </div>
              ))

              }
               <div style={{display: 'flex', gap: 10, justifyContent: 'center', marginTop: 50}}>
              <input style={{width: 300, height: 40}} placeholder='Új munkatípus' onChange={(e)=> this.setState({newWorkType: e.target.value})}></input>
              <div className='rounded-btn-primary' onClick={(e)=>this.updateWorktype(this.state.newWorkType,1)}>Felvétel</div>
            </div>
            </div>
        </div>
        <NavBar />
      </div>
    )
  }
}

export default AuthRedirect(ManageWrapper, 1);
