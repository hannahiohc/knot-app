import { ITweet } from "../timeline/timeline";
import { auth, database, storage } from "@/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";

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
        <div className="tweets">
            <div className="column top">
                <span className="tweet-username">{username}</span>
                <div className="tweet-buttons" ref={buttonsRef}>
                    <div className="kebab">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" onClick={toggleButtons}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                    </div>
                    {/* show the buttons only when the user id and the document id match */}
                    {user?.uid === userId && (
                        <ul className="buttons" style={{ display: showButtons ? "flex" : "none" }}>
                            <li>{user?.uid === userId ? 
                                <button onClick={onDelete}>Delete</button> : null}
                            </li>
                            <li>{user?.uid === userId ? 
                                <button onClick={onEdit}>Edit</button> : null}
                            </li>                
                        </ul>
                    )}
                </div>
            </div>
            <div className="column">
                <p className="payload">{renderTweetContent()}</p>
            </div>
            {/* if a photo doesn't exist, null */}
            {photo ? (
                <div className="column">
                    <img className="tweet-image" src={photo} />
                </div>
            ) : null} 
            {showEditModal && (
                <div className="modal">
                    <textarea value={editedTweet} onChange={(e) => setEditedTweet(e.target.value)} />
                    <div className="modal-buttons">
                        <button className="button-primary" onClick={onSave} disabled={loading}>Save</button>
                        <button className="button-primary" onClick={() => setShowEditModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}