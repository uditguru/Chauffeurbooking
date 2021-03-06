/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks'
import UIfx from 'uifx';
import successAudio from './applepay.mp3';
// import { Query } from "react-apollo";
import gql from "graphql-tag";
import StripeCheckout from 'react-stripe-checkout';
import Lottie from 'react-lottie';
// import logo from './logo.svg';
import { TextField, Grid, Button, Card, CardContent, Typography } from '@material-ui/core';
import './App.css';
// import Login from './login';
import Success from './success.json';
import ErrorMe from './error.json';
// eslint-disable-next-line no-undef
// const stripe = Stripe("pk_live_NJ6VYJdwp8zYTx1EMK4GPfGf");
const paymentDone = new UIfx(
    successAudio,
    {
        volume: 1.0, // number between 0.0 ~ 1.0
        throttleMs: 100
    }
)

// eslint-disable-next-line no-undef
// id

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: Success,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const failedOptions = {
    loop: false,
    autoplay: true,
    animationData: ErrorMe,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const bookingData = gql`
    mutation createBooking($input:bookingInput){
        createBooking(input: $input){
            user{
                name
                email
            }
            driver{
                name
                car
            }
            pickup
            mobile
        }
    }
`;

// const sessionData = gql`
//         {
//             payment(id:"93284reuj"){
//                 id
//                 payment_intent
//             }
//         }
// `


function Booking(props) {
    console.log(props.location.query)
    // eslint-disable-next-line no-unused-vars
    const udata = JSON.parse(localStorage.getItem('user'));
    if (!props.location.query) {
        window.location.href = "/";
    }
    const [driver] = useState(props.location.query.driver);
    const { distance, destination } = props.location.query;
    const [payData, setPayData] = useState(null);
    const [form, setForm] = useState('')
    // const [getSession,{loading,data}] = useLazyQuery(sessionData);
    const [pushBooking] = useMutation(bookingData);
    // const [makePayment,{loading,data}] = useLazyQuery(paymentQr,{
    //     variables : bookingData
    // });

    const { name, languages, rate, car } = props.location.query.driver;

    function change(event) {
        event.preventDefault();
        const { name, value } = event.target;
        setForm({
            ...form,
            [name]: value
        });
    }

    function onToken(res) {
        console.log(res)
        addBooking(res)
    }

    async function addBooking(res) {
        try {
            let bookingData = {
                from: "Bangalore,Karnataka",
                to: destination,
                driver: {
                    name: driver.name,
                    car: driver.car,
                    languages: driver.languages,
                    rate: driver.rate
                },
                user: {
                    name: udata.name,
                    email: udata.email
                },
                pickup: form.pickup,
                mobile: form.mobile,
                transactionId: res.id,
                cardId: res.card.id,
                amount: parseInt(distance < 300 ? 300 * driver.rate : driver.rate * distance),
            }
            // console.log(bookingData)
            // console.log(loading,data)
            const status = await pushBooking({ variables: { input: bookingData } })
            console.log(status)

            if (status.data.createBooking) {
                paymentDone.play();
                setPayData(true)
            } else {
                setPayData(false)
            }
        }
        catch (error) {
            setPayData(false)
        }
    }

    //    async function openCheckout(){
    //        const sess = await getSession();

    //        console.log(sess)
    //        console.log(data)
    //         if(data){
    //         await stripe.redirectToCheckout({
    //             sessionId: data.payment.id
    //         }).then(res=>{
    //             console.log(res)
    //         });
    //     }
    //     }

    return (
        <div className="App input-head" >
            {!payData ? (
                <Typography variant="h5">Booking Details</Typography>) : (
                    <Typography variant="h5">Booking Confirmed</Typography>
                )}

            <Card className="card-result">

                <CardContent className="card-content">
                    <Typography> From:  Bangalore,Karnataka </Typography>
                    <Typography> To: {destination} </Typography>

                </CardContent>
            </Card>

            <Card className="card-result">

                <CardContent className="card-content">
                    <Typography variant="h6">Booking For</Typography>
                    <br>
                    </br>
                    <Typography> {udata.name} </Typography>
                    <Typography> {udata.email} </Typography>

                </CardContent>
            </Card>
            {name &&
                <Card className="card-result">


                    <CardContent className="card-content">
                        <Typography variant="h6">Driver Details</Typography>
                        <br>
                        </br>
                        <Typography>Name: {name} </Typography>
                        <Typography>Vehicle: {car} </Typography>
                        <Typography>Driver Can Speak {languages.join(", ")} </Typography>
                        <Typography>Charges {rate}/Kms </Typography>
                        <Typography>Ride : {distance}/kms</Typography>
                        {
                            !payData ? (
                                <Typography>Your will be Charged ₹ {Math.round(distance < 300 ? driver.rate * 300 : distance * driver.rate)}</Typography>
                            ) : (
                                    <Typography>You Paid ₹ {Math.round(distance < 300 ? driver.rate * 300 : distance * driver.rate)}</Typography>
                                )
                        }
                    </CardContent>
                </Card>}
            <Card>
                <CardContent>

                    <Typography>Additional Details:</Typography>
                    <br></br>
                    <Grid container spacing={3} >
                        <Grid item xs={6}>
                            <TextField disabled={payData} onChange={change} name="pickup" fullWidth={true} id="filled-basic" label="Pick-up Location" variant="filled" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField disabled={payData} onChange={change} name="mobile" fullWidth={true} id="filled-basic" label="Mobile Number" variant="filled" />
                        </Grid>
                    </Grid>
                    {payData === null && (<div className="sButton">
                        <StripeCheckout
                            stripeKey="pk_test_Gn4qL2DuuoOnpn24p1EqElvA"
                            token={onToken}
                            currency="INR"
                            locale="auto"
                            amount={distance < 300 ? driver.rate * 300 * 100 : distance * driver.rate * 100}
                            panelLabel="Pay {{amount}}"
                        >
                            <Button variant="contained" color="primary" >Proceed to Book</Button>
                        </StripeCheckout>
                        {/* <Button onClick={openCheckout} variant="contained" color="primary" >Proceed to Book</Button> */}
                    </div>)}
                    {payData && (<div>
                        <Lottie options={defaultOptions}
                            height={200}
                            width={200} />
                        <Typography variant="h6">Booking was Confirmed</Typography>
                    </div>)}
                    {payData === false && (
                        <div>
                            <br></br>
                            <Lottie options={failedOptions}
                                height={200}
                                width={200} />
                            <Typography variant="h6">Payment was failed! Retry to Book</Typography>
                            <StripeCheckout
                                stripeKey="pk_test_Gn4qL2DuuoOnpn24p1EqElvA"
                                token={onToken}
                                currency="INR"
                                locale="auto"
                                amount={distance < 300 ? driver.rate * 300 * 100 : distance * driver.rate * 100}
                                panelLabel="Pay {{amount}}">
                                <Button variant="contained" color="primary" >Try Booking again</Button>
                            </StripeCheckout>
                        </div>
                    )}
                </CardContent>

            </Card>
        </div>
    );
}

export default Booking;