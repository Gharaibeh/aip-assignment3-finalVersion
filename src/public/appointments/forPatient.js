import React, { Component}  from 'react';
import jQuery from 'jquery'; 
import Cookies from 'universal-cookie';
import { Switch, Route, Link } from 'react-router-dom'
import apiUrl from '../../settings.js';

const cookies = new Cookies();

class PatientAppointmentsForm extends Component{
    constructor(props) {
    super(props);

    this.state = {
      appointments: [],
      patient:'',
      Response_txt: '',
      Error: false,
    }

  }
 
    // find By ID form
  componentWillMount() {
        var url = apiUrl + '/users/findById';
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
               console.log(res);
               this.setState({Error: false});
               this.setState({patient:res.Email});
               res.Appointments.sort(function (a, b) {
                   if (a.Date > b.Date) {
                       return 1;
                   }
                   if (a.Date < b.Date) {
                       return -1;
                   }
                   return 0;
               });
               this.setState({appointments:res.Appointments});
            }
        }.bind(this));
    }
    
    Response () {
        const danger = this.state.Error ? <div className="text-danger">{this.state.Response_txt}</div> : <div>{this.state.Response_txt}</div>;
        return (<div className="form-group">
    {danger}
    </div>
                        )
        }
        
    
        // View the result on a table

Table (props) {
    var url = apiUrl + '/users/findById';

    const appointments = props.appointments ? props.appointments.map((appointment) =>
        <tr>
            <td>{appointment.Medication}</td>
            <td>{appointment.Date.replace(/T/,' ').substr(0,16)}</td>
            <td>{appointment.Log}</td>
            <td>{appointment.DoctorID.FullName}</td>
        </tr> 
    ) : null;
    
    
    return (
        <table className="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>Medication</th>
                    <th>Date</th>
                    <th>Log</th>
                    <th>Doctor's Name</th>
                </tr>
            </thead>
            <tbody>
                {appointments}
            </tbody>
        </table>
    );
}

  render () {
    return (
      <div className="container">
          <h1>Your appointments</h1>
          {this.Response()}
          <this.Table appointments = {this.state.appointments} patient = {this.state.patient}/>
      </div>
    );
  }
}

export default PatientAppointmentsForm;
