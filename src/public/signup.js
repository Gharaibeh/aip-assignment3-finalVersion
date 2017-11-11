import React, { Component}  from 'react';
import jQuery from 'jquery'; 
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Cookies from 'universal-cookie';
import apiUrl from '../settings.js';
import Email_filter from '../constraints';
import dateFromat from '../constraints';
import userType from '../constaints';

const cookies = new Cookies();

// Registration form page fields with validation like email, password/re-password, DOB, City and Full Name


        class RegisterForm extends Component{
        constructor(props) {
        super(props);
                this.state = {
                FullName: '',
                        FullName_valid: true,
                        DateOfBirth: moment().format(dateFromat),
                        DateOfBirth_valid: true,
                        City: '',
                        City_valid: true,
                        Gender: 'Female',
                        Gender_valid: true,
                        Email: '',
                        Email_valid: true,
                        Password: '',
                        Password_valid: true,
                        repeat_Password: '',
                        repeat_Password_valid: true,
                        Response_txt: '',
                        Error: false,
                        Type:  userType.PATIENT.toString(),
                }

        this.submitFormHandler = this.submitFormHandler.bind(this);
                this.handleInputChange = this.handleInputChange.bind(this);
                this.handleInputFocus = this.handleInputFocus.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        }
        
        

        submitFormHandler(event) {
                 if (this.state.FullName === "") {
        this.setState({FullName_valid: false});
        } else if (this.state.DateOfBirth === "") {
        this.setState({DateOfBirth_valid: false});
        } else if (this.state.City === "") {
        this.setState({City_valid: false});
        } else if (! Email_filter.test(this.state.Email)) {
        this.setState({Email_valid: false});
        } else if (this.state.Password === "") {
        this.setState({Password_valid: false});
        } else if (this.state.Password !== this.state.repeat_Password) {
        this.setState({repeat_Password_valid: false});
        } else {
        var url = apiUrl + '/register?FullName='+this.state.FullName
                +'&Email='+this.state.Email
                +'&DateOfBirth='+this.state.DateOfBirth
                +'&City='+this.state.City
                +'&Password='+this.state.Password
                +'&Type='+this.state.Type
                +'&Gender='+this.state.Gender;
        if (!(cookies.get('Id') === undefined))
        {
            url += '&Id='+ cookies.get('Id').toString();   
        }
               
        jQuery.getJSON(url,function (res){
             if (res.Error)
            {
                this.setState({Response_txt : res.Error.errmsg ? 'This e-mail address is used.' : res.Error});
                this.setState({Error : true});
            } else {
               this.setState({Error: false});
               this.setState({Response_txt : res.Ok}); 
              const Type = res.User.Type;
              cookies.set('Id',res.Id, { path: '/' });
                  if (Type == userType.Admin.toString() || Type == userType.Doctor.toString()) {
                 window.location.replace(window.location.origin + '/users');
              } else if (Type == userType.Patient.toString()) {
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

        handleDateChange(date) {
        this.setState({
        DateOfBirth: date.format(dateFromat)
        })
        }

        handleInputFocus(event) {
        this.setState({
        [event.target.name + '_valid'] : true
        })
        }

//Error response
Response () {
        const danger = this.state.Error ? <div className="text-danger">{this.state.Response_txt}</div> : <div>{this.state.Response_txt}</div>;
        return (<div className="form-group">
    {danger}
    </div>
                        )
        }
// Full name validation
        FullName () {
        const danger = this.state.FullName_valid ? '' : <div className="text-danger">Enter your Full name.</div>;
                return (
<div className="form-group">
    <label>Full Name</label>
    <input type="text" className="form-control" value={this.state.FullName} name="FullName" onChange={this.handleInputChange} onFocus={this.handleInputFocus} required/>
    {danger}
</div>
                        )
        }

// DOB validation
        DateOfBirth () {
        const danger = this.state.DateOfBirth_valid ? '' : <div className="text-danger">Enter your Date of Birthday.</div>;
                return (
<div className="form-group">
    <label>Date of Birthday</label>
    <DatePicker type="text" showYearDropdown className="form-control" selected={(this.state.DateOfBirth == '' ?  moment() : moment(this.state.DateOfBirth) )} dateFormat="YYYY-MM-DD" name="DateOfBirth" onChange={this.handleDateChange} onFocus={this.handleInputFocus} required/>
    {danger}
</div>
                        )
        }

 // Gender Validation
        Gender () {
        const danger = this.state.Gender_valid ? '' : <div className="text-danger">Select your Gender.</div>;
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
        
//User type { Patient | Doctor}
        Type () {
                return (
<div className="form-group">
    <label>Who are you?</label>
    <select className="form-control" value={this.state.Type} name="Type" onChange={this.handleInputChange} onFocus={this.handleInputFocus} required>
        <option value="Patient">Patient</option>
        <option value="Doctor">Doctor</option>
    </select>
</div>
                        )
        }


//City as a text field 
        City () {
        const danger = this.state.City_valid ? '' : <div className="text-danger">Enter your City.</div>;
                return (
<div className="form-group">
    <label>City</label>
    <input type="text" className="form-control" value={this.state.City} name="City" onChange={this.handleInputChange} onFocus={this.handleInputFocus} required />
    {danger}
</div>
                        )
        }

//Email format check
        Email () {
        const danger = this.state.Email_valid ? '' : <div className="text-danger">Check your E-mail address.</div>;
                return (
<div className="form-group">
    <label>E-mail address</label>
    <input type="Email" className="form-control" value={this.state.Email} name="Email" onChange={this.handleInputChange} onFocus={this.handleInputFocus} required/>
    {danger}
</div>
                        )
        }

//passowrd field 
        Password () {
        const danger = this.state.Password_valid ? '' : <div className="text-danger">Check your Password.</div>;
                return (
<div className="form-group">
    <label>Password</label>
    <input type="Password" className="form-control" value={this.state.Password} name="Password" onChange={this.handleInputChange} onFocus={this.handleInputFocus} required/>
    {danger}
</div>
                        )
        }

//Re-Password field
        repeat_Password () {
        const danger = this.state.repeat_Password_valid ? '' : <div className="text-danger">Repeat your Password.</div>;
                return (
<div className="form-group">
    <label>Repeat Password</label>
    <input type="Password" className="form-control" value={this.state.repeat_Password} name="repeat_Password" onChange={this.handleInputChange} onFocus={this.handleInputFocus} required/>
    {danger}
</div>
                        )
        }

//Render result
        render () {
        return (
<div className="container">
    <form onSubmit={this.submitFormHandler} className="col-lg-6 col-lg-offset-3">
        <h1>Registration</h1>
        {this.Response()}
        {this.FullName()}
        {this.DateOfBirth()}
        {this.Gender()}
        {this.Type()}
        {this.City()}
        {this.Email()}
        {this.Password()}
        {this.repeat_Password()}
        <button type="submit" className="btn btn-success">Sign-Up</button>
    </form>
</div>
                );
        }
        }

export default RegisterForm;
