import React, { Component}  from 'react';
import jQuery from 'jquery'; 
import Cookies from 'universal-cookie';
import { Switch, Route, Link } from 'react-router-dom'
import apiUrl from '../../settings.js';
const cookies = new Cookies();

class PatientsWithDoctorForm extends Component{
    constructor(props) {
    super(props);

    this.state = {
      users: [],
      Response_txt: '',
      Error: false,
    }

  }
 
  componentWillMount() {
      var url = apiUrl + '/users/search?Id='+this.props.match.params.doctorId;
               
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
    
    Response () {
        const danger = this.state.Error ? <div className="text-danger">{this.state.Response_txt}</div> : '';
        return (<div className="form-group">
    {danger}
    </div>
                        )
        }
        
        

Table (props) {
    const controlButtonStyle = {
        padding: '3px 8px'
    }
    
    const users = props.users ? props.users.map((user) => <tr>
    <td>{user.FullName}</td>
    <td>{user.Gender}</td>
    <td>{user.Email}</td>
    <td>{user.City}</td>   
    <td>{user.DateOfBirth.substr(0,10)}</td>
    <td style={controlButtonStyle}>
    <Link to={`/resetPassword/${user.Email}`} className="btn btn-success">Reset password</Link>
            </td>        </tr>) : <tr></tr>;
    
    
        return (<table className="table table-striped table-bordered">
        <thead>
        <tr>
    <th>Name</th>
    <th>Gender</th>
    <th>Email</th>
    <th>City</th>
    <th>DateOfBirth</th>
    <th></th>
   </tr>
   </thead>
      <tbody>
    {users}
       </tbody>
    </table>
                        )
        }

  render () {
    return (
      <div className="container">
          <h1>Patients</h1>
          {this.Response()}
          <this.Table users = {this.state.users}/>
      </div>
    );
  }
}

export default PatientsWithDoctorForm;
