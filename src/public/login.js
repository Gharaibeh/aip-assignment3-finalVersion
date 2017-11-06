import React, { Component}  from 'react';
import jQuery from 'jquery'; 
import Cookies from 'universal-cookie';
import apiUrl from '../settings.js';
const cookies = new Cookies();

class LoginForm extends Component{
  constructor(props) {
    super(props);

    this.state = {
      Email: '',
      Email_valid: true,
      Password: '',
      Password_valid: true,
      Response_txt: '',
      Error: false,
    }

    this.submitFormHandler = this.submitFormHandler.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
  }

  submitFormHandler(event) {
    const Email_filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if ( ! Email_filter.test(this.state.Email) ) {
      this.setState({Email_valid: false});
    } else if ( this.state.Password === "" ) {
      this.setState({Password_valid: false});
    } else {
        
       var url = apiUrl + '/login?'
                +'&Email='+this.state.Email
                +'&Password='+this.state.Password;
        if (!(cookies.get('Id') === undefined))
        {
            url += '&Id='+ cookies.get('Id').toString();   
        }
               
        jQuery.getJSON(url,function (res){
             if (res.Error)
            {
                this.setState({Response_txt : res.Error});
                this.setState({Error : true});
            } else {
               this.setState({Error: false});
               this.setState({Response_txt : res.Ok}); 
               const Type = res.User.Type;
              cookies.set('Id',res.Id, { path: '/' });
                  if (Type == 'Admin' || Type == 'Doctor') {
                 window.location.replace(window.location.origin + '/users');
              } else if (Type == 'Patient') {
                   window.location.replace(window.location.origin + '/appointments');
              } 

            }
        }.bind(this));
            
    }
  
       event.preventDefault();
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleInputFocus(event) {
    this.setState({
      [event.target.name+'_valid'] : true
    })
  }
Response () {
        const danger = this.state.Error ? <div className="text-danger">{this.state.Response_txt}</div> : <div>{this.state.Response_txt}</div>;
        return (<div className="form-group">
    {danger}
    </div>
                        )
        }
  Email () {
    const danger = this.state.Email_valid ? '' : <div className="text-danger">Check your E-mail address.</div>;
    return (
      <div className="form-group">
        <label>E-mail address</label>
        <input type="Email" className="form-control" value={this.state.Email} name="Email" onChange={this.handleInputChange} onFocus={this.handleInputFocus}/>
        {danger}
      </div>
    )
  }

  Password () {
    const danger = this.state.Password_valid ? '' : <div className="text-danger">Check your Password.</div>;
    return (
      <div className="form-group">
        <label>Password</label>
        <input type="Password" className="form-control" value={this.state.Password} name="Password" onChange={this.handleInputChange} onFocus={this.handleInputFocus}/>
        {danger}
      </div>
    )
  }

  render () {
    return (
      <div className="container">
          <form onSubmit={this.submitFormHandler} className="col-lg-6 col-lg-offset-3">
          <h1>Login</h1>
          {this.Response()}
          {this.Email()}
          {this.Password()}
          <button type="submit"  className="btn btn-success">Sign-In</button>
          </form>
      </div>
    );
  }
}

export default LoginForm;
