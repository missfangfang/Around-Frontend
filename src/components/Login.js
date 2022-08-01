import React from 'react';
import { Button, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

import {BASE_URL} from "../constants";

function Login(props) {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        // Step 1: get username/password from the form
        // Step 2: send user info to the server
        // Step 3: parse the response
            // Case 1: success -> pass token to App component
            // Case 2: failed -> inform user
        const {username, password} = values;
        const opt = {
            method: "POST",
            url: `${BASE_URL}/signin`,
            data: {
                username: username,
                password: password
            },
            headers: {"Content-Type": "application/json"}
        };

        axios(opt)
            .then(res => {
                if (res.status === 200) {
                    // 200 = frontend and backend's data communication is OK
                    // Backend returns res to frontend
                    const { data } = res;
                    console.log(data);
                    props.handleLoggedIn(data);
                    message.success("Login successful");
                }
            })
            .catch(err => {
                console.log("Login failed: ", err.message);
                message.error("Login failed")
            });
    };

    return (
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
            <Form.Item
                name="username"
                rules={[
                    {
                        required: true,
                        message: "Please input your Username"
                    }
                ]}
            >
                <Input
                    prefix={<UserOutlined className="site-form-item-icon"/>}
                    placeholder="Username"
                />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: "Please input your Password!"
                    }
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon"/>}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
                Or <Link to="/register">register now!</Link>
            </Form.Item>
        </Form>
    );
}

export default Login;