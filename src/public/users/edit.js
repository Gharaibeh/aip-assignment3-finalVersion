import React, { Component}  from 'react';
import jQuery from 'jquery';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Cookies from 'universal-cookie';
import apiUrl from '../../settings.js';
import 'react-datepicker/dist/react-datepicker.css';

const cookies = new Cookies();

class EditUserForm extends Component{
    constructor(props) {
    super(props);

    this.state = {
                        FullName: '',
                        FullName_valid: true,
                        DateOfBirth: '',
                        DateOfBirth_valid: true,
                        City: '',
                        City_valid: true,
                        Gender: 'Female',
                        Gender_valid: true,
                        Response_txt: '',
                        Error: false,
      
    }
    this.submitFormHandler = this.submitFormHandler.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.back = this.back.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }
  
  back() {
      window.location.replace(window.location.origin + '/users');
  }
  
  componentWillMount() {
      var url = apiUrl + '/users/search?'
                +'&Email='+this.props.match.params.email
                +'&Type='+this.props.match.params.type;
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
               this.setState({FullName : res[0].FullName}); 
               this.setState({DateOfBirth : ( (new Date(res[0].DateOfBirth)).getFullYear() + '-' + ( (new Date(res[0].DateOfBirth)).getMonth() + 1 > 9 ? (new Date(res[0].DateOfBirth)).getMonth() + 1 : ( '0' + ((new Date(res[0].DateOfBirth)).getMonth() + 1)) ) + '-' + (new Date(res[0].DateOfBirth)).getDate() )}); 
               this.setState({City : res[0].City}); 
               this.setState({Gender : res[0].Gender}); 
            }
        }.bind(this));
  }
  
  
  submitFormHandler(event) {
                if (this.state.FullName === "") {
        this.setState({FullName_valid: false});
        } else if (this.state.DateOfBirth === "") {
        this.setState({DateOfBirth_valid: false});
        } else if (this.state.City === "") {
        this.setState({City_valid: false});
        }  else {
        var url = apiUrl + '/users/edit?FullName='+this.state.FullName
                +'&Email='+this.props.match.params.email
                +'&Type='+this.props.match.params.type
                +'&DateOfBirth='+this.state.DateOfBirth
                +'&City='+this.state.City
                +'&Gender='+this.state.Gender;
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
               this.back();
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

        handleDateChange(date) {
        this.setState({
        DateOfBirth: date.format('YYYY-MM-DD')
        })
        }

        handleInputFocus(event) {
        this.setState({
        [event.target.name + '_valid'] : true
        })
        }
  
Response () {
        const danger = this.state.Error ? <div className="text-danger">{this.state.Response_txt}</div> : <div>{this.state.Response_txt}</div>;
        return (<div className="form-group">
    {danger}
    </div>
                        )
        }

        FullName () {
        const danger = this.state.FullName_valid ? '' : <div className="text-danger">Enter Full name.</div>;
                return (
<div className="form-group">
    <label>Full Name</label>
    <input type="text" className="form-control" value={this.state.FullName} name="FullName" onChange={this.handleInputChange} onFocus={this.handleInputFocus} required/>
    {danger}
</div>
                        )
        }

        DateOfBirth () {
        const danger = this.state.DateOfBirth_valid ? '' : <div className="text-danger">Enter Date of Birthday.</div>;
                return (
<div className="form-group">
    <label>Date of Birthday</label>
    <DatePicker type="text" className="form-control" selected={(moment(this.state.DateOfBirth))} dateFormat="YYYY-MM-DD" name="DateOfBirth" onChange={this.handleDateChange} onFocus={this.handleInputFocus} required/>
    {danger}
</div>
                        )
        }

        Gender () {
        const danger = this.state.Gender_valid ? '' : <div className="text-danger">Select Gender.</div>;
                return (
<div className="form-group">
    <label>Gender</label>
    <select className="form-control" value={this.state.Gender} name="Gender" onChange={this.handleInputChange} onFocus={this.handleInputFocus} required>
        <option value="Female">Female</option>
        <option value="Male">Male</option>
    </select>
    {danger}
</div>
                        )
        }
        
        City () {
        const danger = this.state.City_valid ? '' : <div className="text-danger">Enter City.</div>;
                return (
<div className="form-group">
    <label>City</label>
    <input type="text" className="form-control" value={this.state.City} name="City" onChange={this.handleInputChange} onFocus={this.handleInputFocus} required />
    {danger}
</div>
                        )
        }

       


        render () {
        return (
<div className="container">
    <form onSubmit={this.submitFormHandler} className="col-lg-6 col-lg-offset-3">
        <h1>Edit this user</h1>
        {this.Response()}
        {this.FullName()}
        {this.DateOfBirth()}
        {this.Gender()}
        {this.City()}
        <button onClick={this.back} className="btn btn-default pull-left" type="button"><span className="glyphicon glyphicon-arrow-left"></span>&nbsp;&nbsp;Back</button>
        <button type="submit" className="btn btn-primary pull-right"><span className="glyphicon glyphicon-ok"></span>&nbsp;&nbsp;Save</button>
    </form>
</div>
                );
        }
        }

export default EditUserForm;
