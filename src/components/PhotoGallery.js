import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Gallery from 'react-grid-gallery';
import { Button, message } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

import { BASE_URL, TOKEN_KEY } from "../constants";

const captionStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%"
};

const wrapperStyle = {
    display: "block",
    minHeight: "1px",
    width: "100%",
    border: "1px solid #ddd",
    overflow: "auto"
};

function PhotoGallery(props) {
    const [ images, setImages ] = useState(props.images);
    const [ curImgIdx, setCurImgIdx ] = useState(0);
    const imageArr = images.map(image => {
        return {
            ...image,
            customOverlay: (
                <div style={captionStyle}>
                    <div>{`${image.user}: ${image.caption}`}</div>
                </div>
            )
        };
    });

    const onCurrentImageChange = index => {
        // console.log('Current image index = ', index);
        setCurImgIdx(index);
    }

    const deleteImage = () => {
        if (window.confirm(`Are you sure you want to delete this image?`)) {
            // Step 1: get the image ID to be deleted
            const curImg = images[curImgIdx];
            // Step 2: filter the image from the imageArr
            const newImageArr = images.filter((image, index) => index !== curImgIdx);
            console.log('Delete image ', newImageArr);
            // Step 3: send delete request to the server
            // Step 4: analyze the response from the server
            // Case 1: Success -> update the state: imageArr
            // Case 2: fail -> inform user
            const opt = {
                method: 'DELETE',
                url: `${BASE_URL}/post/${curImg.postId}`,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                }
            };

            axios(opt)
                .then(res => {
                    // Case 1: success
                    if (res.status === 200) {
                        setImages(newImageArr); // Set state
                    }
                })
                .catch(err => {
                    // Case 2: fail
                    message.error('Fetch posts failed');
                    console.log('Fetch posts failed: ', err.message);
                })
        }
    }

    useEffect( () => {
        setImages(props.images);
    }, [props.images]);

    return (
        <div style={wrapperStyle}>
            <Gallery
                images={imageArr}
                enableImageSelection={false}
                backdropClosesModal={true}
                currentImageWillChange={onCurrentImageChange}
                customControls={[
                    <button style={{marginTop: "12px"}}
                        key="deleteImage"
                        icon={<DeleteOutlined />}
                        type="primary"
                        size="small"
                        onClick={deleteImage}
                    >Delete Image</button>
                ]}
            />
        </div>
    );
}

PhotoGallery.propTypes = {
    images: PropTypes.arrayOf( // An array of a certain type
        PropTypes.shape({
            user: PropTypes.string.isRequired,
            caption: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            thumbnail: PropTypes.string.isRequired,
            thumbnailWidth: PropTypes.number.isRequired,
            thumbnailHeight: PropTypes.number.isRequired,
        })
    ).isRequired
};

export default PhotoGallery;