import React from 'react';
import '../../css/Login/index.css';

const Login = () => {
    return (
        <div className="login-container">
            <div className='container'>
                <div class="row text-center">
                    <h1 className='col-12 mb-1 login-header'>Welcome</h1>
                    <h2 className='col-12 mb-5 login-header'>Login to your account</h2>
                </div>
                <div className="row">
                    <div className="col-12">
                        <form className="login-form">
                            <div className="mb-3 mx-auto d-block w-50">
                                <input
                                    type="email"
                                    className="form-control custom-input"
                                    id="email"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className="mb-5 mx-auto d-block w-50">
                                <input
                                    type="password"
                                    className="form-control custom-input"
                                    id="password"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn login-btn mx-auto d-block w-50">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;