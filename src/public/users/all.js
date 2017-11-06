import React, { Component}  from 'react';
import jQuery from 'jquery'; 
import Cookies from 'universal-cookie';
import { Switch, Route, Link } from 'react-router-dom'
import apiUrl from '../../settings.js';
const cookies = new Cookies();

class UsersForm extends Component{
    constructor(props) {
    super(props);

    this.state = {
      CurUser: {},
      CurUserDoctor: {},
      users: [],
      Name: '',
      Gender: '',
      City: '',
      DateOfBirth: '',
      Email: '',
      Response_txt: '',
      Error: false,
    }
this.Search = this.Search.bind(this);
this.handleInputChange = this.handleInputChange.bind(this);
this.handleInputFocus = this.handleInputFocus.bind(this);
  }
 
  Search() {
      var url = apiUrl + '/users/search?';
      if (this.state.Name) {
        url += '&FullName='+ this.state.Name;   
      }
      if (this.state.Gender) {
        url += '&Gender='+ this.state.Gender;   
      }
      if (this.state.Email) {
        url += '&Email='+ this.state.Email;   
      }
      if (this.state.DateOfBirth) {
        url += '&DateOfBirth='+ this.state.DateOfBirth;   
      }
      if (this.state.City) {
        url += '&City='+ this.state.City;   
      }
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
               this.setState({users:res});
            }
        }.bind(this));
  
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
 
  componentWillMount() {
       var url = apiUrl + '/users/findById?';
        if (!(cookies.get('Id') === undefined))
        {
            url += 'Id='+ cookies.get('Id').toString();   
        }
               
        jQuery.getJSON(url,function (res){
             if (!res.Error) {
               this.setState({CurUser: res});
            }
        }.bind(this));
      var url = apiUrl + '/users/search';
        if (!(cookies.get('Id') === undefined))
        {
            url += '?Id='+ cookies.get('Id').toString();   
        }
               
        jQuery.getJSON(url,function (res){
             if (res.Error)
            {
                this.setState({Response_txt : res.Error});
                this.setState({Error : true});
            } else {
               this.setState({Error: false});
               this.setState({users:res});
            }
        }.bind(this));
    }
    
    UsersHeader() {
        let users = this.state.CurUser.Type == 'Doctor' ? 'Patients' : 'Doctors';
        if (this.state.CurUser.Doctor !== undefined)
        {
            users += '(You doctor is '+ this.state.CurUser.Doctor.FullName + ")";
        }
        return <h1>{users}</h1>
    }
     
    Response () {
        const danger = this.state.Error ? <div className="text-danger">{this.state.Response_txt}</div> : '';
        return (<div className="form-group">
    {danger}
    </div>
                        )
        }
        
        

TableData (props) {
    const monthes = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const controlButtonStyle = {
        padding: '3px 8px'
    }
    const groupButtonStyle = {
        width: '100%'
    }
    const ButtonStyle = {
        width: '100%'
    }
    const users = props.users ? props.users.map((user) => <tr>
    <td>{user.FullName}</td>
    <td>{user.Gender}</td>
    <td>{user.Email}</td>
    <td>{user.City}</td>   
    <td>{(new Date(user.DateOfBirth)).getDate()} {monthes[(new Date(user.DateOfBirth)).getMonth()]} {(new Date(user.DateOfBirth)).getFullYear()}</td>
    <td style={controlButtonStyle}>
	<div className="btn-group" role="group" style={groupButtonStyle}>
	    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={ButtonStyle}>Action&nbsp;&nbsp;<span className="caret"></span></button>
            <ul className="dropdown-menu">
            {user.Type == 'Patient' ? <li><Link to={`/appointments/${user._id}`}><span className="glyphicon glyphicon-list-alt"></span>&nbsp;&nbsp;Appointments</Link></li> : null}
            {props.CurUser.Type == 'Admin' ? <li><Link to={`/patients/${user._id}`}><span className="glyphicon glyphicon-user"></span>&nbsp;&nbsp;Show patients</Link></li> : null}
            {props.CurUser.Type == 'Admin' ? <li><Link to={`/resetPassword/${user.Email}`}><span className="glyphicon glyphicon-flash"></span>&nbsp;&nbsp;Reset password</Link></li> : null}
            {props.CurUser.Type == 'Admin' || props.CurUser.Type == 'Doctor' ? <li><Link to={`/users/edit/${user.Email}/${user.Type}`}><span className="glyphicon glyphicon-pencil"></span>&nbsp;&nbsp;Edit</Link></li>  : null}
            {props.CurUser.Type == 'Admin' || props.CurUser.Type == 'Doctor' ? <li><Link to={`/users/delete/${user.Email}/${user.Type}`}><span className="glyphicon glyphicon-trash"></span>&nbsp;&nbsp;Delete</Link></li> : null}
            {props.CurUser.Type == 'Patient' ? <li><Link to={`/bind/${props.CurUser._id}/${user._id}`}><span className="glyphicon glyphicon-ok"></span>&nbsp;&nbsp;Select doctor</Link></li> : null}
            </ul>
        </div>
    </td>
    </tr>
            ) : null;
    return users;
}
    
        
        Table() {
            const headerButtonStyle = {
                padding: '3px 8px'
            }
            return (<table className="table table-striped table-bordered" >
        <thead>
        <tr>
    <th>Name</th>
    <th>Gender</th>
    <th>Email</th>
    <th>City</th>
    <th>Date Of Birth</th>
    <th style={headerButtonStyle}>
    {this.state.CurUser.Type == 'Admin' || this.state.CurUser.Type == 'Doctor' ?
         <Link to={`/users/add`} className="btn btn-primary form-control"><span className="glyphicon glyphicon-plus"></span> Add</Link> : null}
    </th>
   </tr>
   </thead>
      <tbody>
      <tr>
        <td><input type="text" className="form-control" value={this.state.Name} name="Name" onChange={this.handleInputChange} onFocus={this.handleInputFocus}/></td>
   <td><input type="text" className="form-control" value={this.state.Gender} name="Gender" onChange={this.handleInputChange} onFocus={this.handleInputFocus}/></td>
   <td><input type="text" className="form-control" value={this.state.Email} name="Email" onChange={this.handleInputChange} onFocus={this.handleInputFocus}/></td>
   <td><input type="text" className="form-control" value={this.state.City} name="City" onChange={this.handleInputChange} onFocus={this.handleInputFocus}/></td>
   <td><input type="text" className="form-control" value={this.state.DateOfBirth} name="DateOfBirth" onChange={this.handleInputChange} onFocus={this.handleInputFocus}/></td>
   <td><button onClick={this.Search} className="btn btn-default form-control"><span className="glyphicon glyphicon-search"></span> Search</button></td>
        </tr>
    <this.TableData users = {this.state.users} CurUser = {this.state.CurUser}/>
       </tbody>
    </table>)
                        
        }

  render () {
    return (
      <div className="container">
          {this.UsersHeader()}
          {this.Response()}
          {this.Table()}
      </div>
    );
  }
}

export default UsersForm;
