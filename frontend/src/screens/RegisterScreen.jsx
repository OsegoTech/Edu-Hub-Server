import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import Loader from "../components/Loader";


export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassowrd] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if(userInfo) {
        navigate("/");
    }
}, [navigate, userInfo]);

  const [name, setName] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else{
        try {
            const res = await register({name, email, password}).unwrap();
            dispatch(setCredentials({...res}));
            toast.success("Registration successful");
            navigate("/");
        } catch (error) {
            toast.error(error.data.message || error.error);
        }
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="my-2">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
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
        <Form.Group controlId="confirmPassword" className="my-2">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassowrd(e.target.value)}
          ></Form.Control>
        </Form.Group>
        {isLoading && <Loader />}
        <Button disabled={isLoading} type="submit" variant="primary" className="mt-3">
          Sign Up
        </Button>

        <Row className="py-3">
          <Col>
            Already registered? <Link to="/login">Sign</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
}
