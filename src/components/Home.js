import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Col, message, Row, Tabs } from "antd";

import SearchBar from "./SearchBar";
import PhotoGallery from "./PhotoGallery";
import CreatePostButton from "./CreatePostButton";
import { BASE_URL, SEARCH_KEY, TOKEN_KEY } from "../constants";

const { TabPane } = Tabs;

function Home(props) {
    // State: posts, search option, active tab
    const [posts, setPost] = useState([]);
    const [searchOption, setSearchOption] = useState({
        type: SEARCH_KEY.all,
        keyword: ""
    });
    const [activeTab, setActiveTab] = useState("image");

    // Component Life Cycle
    // Case 1: search for the first time -> componentDidMount -> search: {type: all, value: ""}
    // Case 2: search after the first time -> componentDidUpdate -> search: {type: keyword / user, value}
    useEffect(() => {
        const {type, keyword} = searchOption;
        fetchPost(searchOption); // Fetch posts from the server
    }, [searchOption]);

    const fetchPost = option => {
        // Step 1: get search type / search context
        // Step 2: fetch posts from the server
        // Step 3: analyze response from the server
        // Case 1: success -> display posts => images / video
        // Case 2: failed -> inform user
        const { type, keyword } = option;
        let url = "";

        if (type === SEARCH_KEY.all) {
            url = `${BASE_URL}/search`;
        } else if (type === SEARCH_KEY.user) {
            url = `${BASE_URL}/search?user=${keyword}`;
        } else {
            url = `${BASE_URL}/search?keywords=${keyword}`;
        }

        const opt = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };

        axios(opt)
            .then(res => {
                if (res.status === 200) {
                    setPost(res.data);
                }
            })
            .catch(err => {
                message.error("Fetch posts failed");
                console.log("Fetch posts failed: ", err.message);
            });
    }

    const renderPosts = type => {
        // Corner case: if post does not exist
        if (!posts || posts.length === 0) {
            return <div>No data</div>
        }

        // Case 1: post is empty => return no data
        // Case 2: display images
        // Case 3: display videos
        if (type === "image") {
            // Render images
            const imageArr = posts
                .filter(item => item.type === "image")
                .map(image => {
                    return {
                        postId: image.id,
                        src: image.url,
                        user: image.user,
                        caption: image.message,
                        thumbnail: image.url,
                        thumbnailWidth: 300,
                        thumbnailHeight: 200
                    };
                });
            return <PhotoGallery images={imageArr}/>
        } else if (type === "video") {
            return (
                <Row gutter={32}>
                    {posts
                        .filter(post => post.type === "video")
                        .map(post => (
                            <Col span={8} key={post.url}>
                                <video src={post.url} controls={true} className="video-block" />
                                <p>{post.user}: {post.message}</p>
                            </Col>
                        ))}
                </Row>
            );
        }
    };

    const handleSearch = option => {
        // console.log('Option = ', option);
        const { type, keyword } = option;
        setSearchOption({type: type, keyword: keyword});
    };

    const showPost = type => {
        // console.log("Type -> ", type);
        setActiveTab(type);
        // Reload
        setTimeout(() => {
            setSearchOption({type:SEARCH_KEY.all, keyword: ""});
        }, 3000);
    };

    const operations = <CreatePostButton onShowPost={showPost} />

    return (
        <div className="home">
            <SearchBar handleSearch={handleSearch}/>
            <div className="display">
                <Tabs
                    onChange={key => setActiveTab(key)}
                    defaultActiveKey="image"
                    activeKey={activeTab}
                    tabBarExtraContent={operations}
                >
                    <TabPane tab="Images" key="image">
                        {renderPosts("image")}
                    </TabPane>
                    <TabPane tab="Videos" key="video">
                        {renderPosts("video")}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}

export default Home;