import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, database, storage } from "@/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import Button from "./button";

const Wrapper = styled.div`
    width: 100%;
    padding: 20px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: var(--color-2);
`;
const Column = styled.div`
    width: 100%;
    display: flex;
    position: relative;

    &.top {
        align-items: center;
    }
`;
const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
    line-height: 20px;
    color: var(--black);
`;
const Payload = styled.p`
    margin: 5px 0 20px;
    font-size: 15px;
    line-height: 18px;
    padding-right: 25px;
`;
const Photo = styled.img`
    width: 100%;
    height: 300px;
    object-fit: cover;
    object-position: center;
    border-radius: 2px;
`;
const Buttons = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 10;
    .kebab {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        transition: all 350ms ease; 
        &:hover {
            background-color: var(--color-4);
        }
    }
    svg {
        width: 18px;
        height: 18px;
        color: var(--black);
        transition: all 350ms ease; 
        &:hover {
            color: var(--white);
        }
    }
    ul {
        width: 136px;
        margin-top:5px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        background-color: var(--color-3);
        display: none;
        transition: all 350ms ease; 
    }
    li {
        width: 100%;
        &:first-child {
            border-bottom: 1px solid #dad4c9;
        }
    }
`;
const DeleteButton = styled.button`
    width: 100%;
    padding: 13px 0 10px 13px;
    text-align: left;
    border: none;
    font-size: 14px;
    cursor: pointer;
    background-color: transparent;
    color: var(--black);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    transition: all 350ms ease; 
    &:hover {
        background-color: #e5dfd5;
    }

`;
const EditButton = styled.button`
    width: 100%;
    padding: 10px 0 13px 13px;
    text-align: left;
    border: none;
    font-size: 14px;
    cursor: pointer;
    background-color: transparent;
    color: var(--black);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: all 350ms ease; 
    &:hover {
        background-color: #e5dfd5;
    }
`;
const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(22, 21, 27, 0.3);
    textarea {
        width: 500px;
        height: 200px;
        padding: 15px 17px;
        font-size: 15px;
        background-color: var(--color-2);
        border-radius: 10px;
    }
    .modal-buttons {
        margin-top: 10px;
        display: flex;
        gap: 10px;
    }
    button {
        color: var(--white);
        border: none;
        background-color: var(--color-4);
        padding: 5px 15px;
        font-size: 13px;
        border-radius: 20px;
        font-weight: 600;
        cursor: pointer;
    }
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const user = auth.currentUser;
    const [showButtons, setShowButtons] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedTweet, setEditedTweet] = useState(tweet);
    const [loading, setLoading] = useState(false);
    const buttonsRef = useRef<HTMLDivElement>(null);

    const onDelete = async () => {
        const ok = confirm("Are you sure you want to delete this?");
        // kill the function if user id doesn't match or the user said no
        if (!ok || user?.uid !== userId) return;
        try {
            await deleteDoc(doc(database, "tweets", id));
            // if the tweet has a photo, delete it too
            if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        } catch(error) {
            console.log(error);
        } finally {

        }
    }

    const onEdit = async () => {
        if (user?.uid !== userId) return;
        setEditedTweet(tweet);
        setShowEditModal(true);
    } 

    const onSave = async () => {
        if (user?.uid !== userId) return;

        try {
            setLoading(true);
            const tweetRef = doc(database, "tweets", id);
            await updateDoc(tweetRef, {tweet: editedTweet});
        } catch (error) {
            console.error("Error updating post: ",error);
        } finally {
            setLoading(false);
            setShowEditModal(false);
        }
    }

    const renderTweetContent = () => {
        return tweet.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (buttonsRef.current && !buttonsRef.current.contains(event.target as Node)) {
                setShowButtons(false);
            }
        };
        if (showButtons) {
            document.addEventListener("click", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        }
    }, [showButtons]);

    const toggleButtons = () => {
        setShowButtons(!showButtons);
    }

    return (
        <Wrapper>
            <Column className="top">
                <Username>{username}</Username>
                <Buttons ref={buttonsRef}>
                    <div className="kebab">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" onClick={toggleButtons}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                    </div>
                    {/* show the buttons only when the user id and the document id match */}
                    {user?.uid === userId && (
                        <ul className="buttons" style={{ display: showButtons ? "flex" : "none" }}>
                            <li>{user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null}</li>
                            <li>{user?.uid === userId ? <EditButton onClick={onEdit}>Edit</EditButton> : null}</li>                
                        </ul>
                    )}
                </Buttons>
            </Column>
            <Column>
                <Payload>{renderTweetContent()}</Payload>
            </Column>
            {/* if a photo doesn't exist, null */}
            {photo ? (
                <Column>
                    <Photo src={photo} />
                </Column>
            ) : null} 
            {showEditModal && (
                <Modal>
                    <textarea value={editedTweet} onChange={(e) => setEditedTweet(e.target.value)} />
                    <div className="modal-buttons">
                        <Button primary onClick={onSave} disabled={loading}>Save</Button>
                        <Button primary onClick={() => setShowEditModal(false)}>Close</Button>
                    </div>
                </Modal>
            )}
        </Wrapper>
    )
}