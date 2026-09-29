// fullstack-capstone-project/giftlink-frontend/src/components/RegisterPage/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
            }),
        });

        const json = await response.json();

        if (json.authtoken) {
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', firstName);
            sessionStorage.setItem('email', email);
            navigate('/app');
        } else {
            setShowerr(json.error || 'Registration failed');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4">
                        <h2 className="text-center mb-4">Register for GiftLink</h2>
                        {showerr && <div className="alert alert-danger">{showerr}</div>}
                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label className="form-label">First Name</label>
                                <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Last Name</label>
                                <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email address</label>
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
