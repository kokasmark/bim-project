import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from './cookie';

const AuthRedirect = (WrappedComponent, roleNeeded = 0) => {
  const RedirectComponent = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      // Check for the presence of the login token
      const hasToken = getCookie("login-token") != "";

      // If the token is not present, redirect to the login page
      if (!hasToken) {
        navigate('/');
      }
      else{
        var role = -1;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "token": getCookie("login-token")
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        fetch("http://localhost:3001/api/role", requestOptions)
          .then(response => response.text())
          .then(result => {
            var r = JSON.parse(result);
            if(r.success){
              console.log(roleNeeded, r.role)
              if(roleNeeded >  r.role){
                navigate('/')
              }
            }
            else{
              navigate('/')
            }
          })
          .catch(error => console.log('error', error));
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };

  return RedirectComponent;
};

export default AuthRedirect;
