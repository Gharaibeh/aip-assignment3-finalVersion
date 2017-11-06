import React, { Component}  from 'react';
import jQuery from 'jquery'; 
import Cookies from 'universal-cookie';
import { Switch, Route, Link } from 'react-router-dom'
import apiUrl from '../../settings.js';
const cookies = new Cookies();

class DeleteUserForm extends Component{
    constructor(props) {
    super(props);

    this.state = {
      Response_txt: '',
      Error: false,
    }

  }
 
  componentWillMount() {
      var url = apiUrl + '/users/delete?Email='+this.props.match.params.email
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
               this.setState({Error: false});
               this.setState({Response_txt:res.Ok});
               window.location.replace(window.location.origin + '/users');
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
        
  render () {
    return (
      <div className="container">
          {this.Response()}
      </div>
    );
  }
}

export default DeleteUserForm;
