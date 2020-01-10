import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import gql from "graphql-tag";
import { useLazyQuery } from '@apollo/react-hooks'

const authData = gql`
  query login($email:String!,$password:String!) {
  login(email:$email,password: $password){
    id
    name
    email
    token
  }
}
`;

export default function Login(props) {
    const [userdata, setUserData] = useState(null);
    const [loginData, setLoginData] = useState(null)
    const [loginUser, { loading, data }] = useLazyQuery(authData, {
        variables: loginData
    });


    useEffect(() => {
        console.log(props)
    }, [props])

    async function authLogin(e) {
        e.preventDefault()
        setLoginData(userdata);
        await loginUser();

        if (await loading) {
            console.log("wait")
        }
        else {
            console.log(data)

            if (await data) {
                const { id, name, email, token } = data.login;

                // eslint-disable-next-line no-undef
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify({ id: id, name: name, email: email }))
                props.close();
            }
            else {
                console.log("sorry")

            }
        }
    }

    function handleChange(event) {
        const { name, value } = event.target
        setUserData({
            ...userdata,
            [name]: value
        })
        console.log(userdata)
    }

    return (
        <div >
            <Dialog style={{ padding: '10%' }} fullWidth={true} open={props.open} onClose={props.close} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"> Login </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        name="email"
                        onChange={handleChange}
                        label="Email Address"
                        type="email"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        onChange={handleChange}
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                    />
                </DialogContent>
                {/* <Button onClick={props.close} color="primary">
            Cancel
          </Button> */}
                <br />
                <br />
                <Button variant="contained" onClick={authLogin} color="primary">
                    Login
                </Button>
                <br />
                <br />
            </Dialog>
        </div>
    );
}