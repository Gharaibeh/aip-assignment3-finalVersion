import React, { Component}  from 'react';
import jQuery from 'jquery'; 
import Cookies from 'universal-cookie';
import { Switch, Route, Link } from 'react-router-dom'
import apiUrl from '../settings.js';
const cookies = new Cookies();

class BindDoctorForm extends Component{
    constructor(props) {
    super(props);

    this.state = {
      Response_txt: '',
      Error: false,
    }

  }
 
// Binding doc components
  componentWillMount() {
      var url = apiUrl + '/users/bindDoctor?PatientId='+this.props.match.params.patientId
      +'&DoctorId='+this.props.match.params.doctorId;
               
        jQuery.getJSON(url,function (res){
             if (res.Error)
            {
                this.setState({Response_txt : res.Error});
                this.setState({Error : true});
            } else {
               this.setState({Error: false});
               this.setState({Response_txt:res.Ok});
               window.location.replace(window.location.origin + '/users');
            }
        }.bind(this));
    }
    
// Response for binding a doctor
    Response () {
        const danger = this.state.Error ? <div className="text-danger">{this.state.Response_txt}</div> : <div>{this.state.Response_txt}</div>;
        return (<div className="form-group">
    {danger}
    </div>
                        )
        }


//Render result
  render () {
    return (
      <div className="container">
          {this.Response()}
      </div>
    );
  }
}

export default BindDoctorForm;
