import React, { Component } from 'react';


class Splash extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }




  render() {


    return (

      <div>


      <nav className="navbar navbar-primary navbar-transparent navbar-absolute">
          <div className="container">
              <div className="navbar-header">
                  <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">
                      <span className="sr-only">Toggle navigation</span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand" href="#">
                   
                </a>
              </div>
              <div className="collapse navbar-collapse">
                  <ul className="nav navbar-nav navbar-right">


                      <li className=" active ">
                          <a>
                              <i className="material-icons">fingerprint</i>Login
                          </a>
                      </li>

                  </ul>
              </div>
          </div>
      </nav>
      <div className="wrapper wrapper-full-page">
          <div className="full-page login-page"  data-image="assets/img/lock.jpeg">
              <div className="content">
                  <div className="container">
                      <div className="row">
                          <div className="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">
                              <form onSubmit={this.handleSubmit}>
                                  <div className="card card-login card-hidden">


                                  <div className="card-header text-center" data-background-color="rose">
                                    <h4 className="card-title">Loading</h4>

                                </div>

                                      <div className="card-content">
                                       
                                        
                                         
                                          
                                      </div>
                                      
                                  </div>
                              </form>
                          </div>
                      </div>
                  </div>
              </div>
              <footer className="footer">
                  <div className="container">
                      <nav className="pull-left">
                          <ul>

                          </ul>
                      </nav>
                      <p className="copyright pull-right">

                          
                          <script>
                              document.write(new Date().getFullYear())
                          </script>
                          


                      </p>
                  </div>
              </footer>
          </div>
      </div>
      </div>







    );
  }
}

export default Splash;
