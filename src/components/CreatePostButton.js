import React, { Component } from 'react';
import { Button, Modal, message } from "antd";
import axios from "axios";

import { PostForm } from "./PostForm";
import { BASE_URL, TOKEN_KEY } from "../constants";

class CreatePostButton extends Component {
    state = {
        visible: false,
        confirmLoading: false
    };

    showModal = () => {
        this.setState({visible: true});
    };

    handleOk = () => {
        this.setState({confirmLoading: true});
        // Step 1: get values from the form
        // Step 2: upload posts to the server
        this.postForm
            .validateFields()
            .then(form => {
                const { description, uploadPost } = form;
                const { type, originFileObj } = uploadPost[0];
                const postType = type.match(/^(image|video)/g)[0];

                // If the file type is allowed to be uploaded by backend
                if (postType) {
                    let formData = new FormData();
                    formData.append("message", description);
                    formData.append("media_file", originFileObj);

                    const opt = {
                        method: "POST",
                        url: `${BASE_URL}/upload`,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                        },
                        data: formData
                    };

                    // POST to backend
                    axios(opt)
                        .then(res => {
                            if (res.status === 200) {
                                // Inform user uploading is complete
                                // Reset form fields
                                // Close modal
                                // Set confirmLoading to false
                                // Inform Home to refresh current tab
                                message.success("The image or video is uploaded.");
                                this.postForm.resetFields();
                                this.handleCancel();
                                this.props.onShowPost(postType);
                                this.setState({confirmLoading: false});
                            }
                        })
                        .catch(err => {
                            console.log("Upload image/video failed: ", err.message);
                            message.error("Failed to upload image or video.");
                            this.setState({confirmLoading: false});
                        });
                }
            })
            .catch(err => {
                console.log('Error in validateFields form -> ', err);
            });
        };

        handleCancel = () => {
            console.log("Upload canceled");
            this.setState({visible: false});
        };

        render() {
            const { visible, confirmLoading } = this.state;

            return (
                <div>
                    <Button type="primary" onClick={this.showModal}>
                        Create New Post
                    </Button>
                    <Modal
                        title="Create New Post"
                        visible={visible}
                        onOk={this.handleOk}
                        okText="Create"
                        confirmLoading={confirmLoading}
                        onCancel={this.handleCancel}
                    >
                        <PostForm ref={refInstance => this.postForm = refInstance}/>
                    </Modal>
                </div>
            );
        }
    }

    export
    default
    CreatePostButton;