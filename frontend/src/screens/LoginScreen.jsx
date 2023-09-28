import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { useLoginMutation } from "../slices/usersApiSlice";
import {setCredentials } from "../slices/authSlice";
import {toast} from "react-toastify";
import Loader from "../components/Loader";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, {isLoading}] = useLoginMutation();
    const {userInfo} = useSelector(state => state.auth);

    useEffect(() => {
        if(userInfo) {
            navigate("/");
        }
    }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        const res = await login({email, password}).unwrap();
        dispatch(setCredentials({...res}));
        toast.success("Login successful");
        navigate("/");
    } catch (error) {
        toast.error(error.data.message || error.error);
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-2">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="my-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
                type="password"
                placeholder="Enter password"    
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
        </Form.Group>

        {isLoading && <Loader/>}
        <Button disabled={isLoading} type="submit" variant="primary" className="mt-3">
            Sign In
        </Button>

        <Row className="py-3">
            <Col>
                New Customer? <Link to="/register">Register</Link>
            </Col>
        </Row>
      </Form>
    </FormContainer>
  );
}
