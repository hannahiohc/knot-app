import { auth, database, storage } from "@/firebase"
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "@/components/timeline";
import Tweet from "@/components/tweet";
import Button from "@/components/button";

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;
const Settings = styled.div`
    width: 100%;
    margin: 20px 0;
    display: flex;
    align-items: center;
    gap: 20px;
`;
const AvatarUpload = styled.label`
    width: 120px;
    height: 120px;
    overflow: hidden;
    border-radius: 50%;
    background-color: var(--color-4);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
        width: 70px;
        color: var(--white);
    }
`;
const AvatarImg = styled.img`
    width: 100%;
`;
const AvatarInput = styled.input`
    display: none;
`;
const MyProfile = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;
const Buttons = styled.div`
    display: flex;
    gap: 6px;
`;
const Name = styled.span`
    font-size: 22px;
    line-height: 22px;
    font-weight: 600;
`;
const EditUsernameTextarea = styled.textarea`
    width: 240px;
    height: 22px;
    background-color: white;
    overflow-y: hidden;
    font-size: 22px;
    line-height: 22px;
    font-weight: 600;
    &::placeholder {
        font-size: 13px;
        padding-left: 5px;
    }
`;
const Tweets = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 50px;
`;

export default function Profile({}) {
    const user = auth.currentUser;
    // check if the user has a photoURL, if not set the default user pic
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [editUsername, setEditUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(user?.displayName || "");

    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (!user) return;
        if (files && files.length) {
            const file = files[0];
            // create location to save the image (don't keep the previous profile pictures)
            const locationRef = ref(storage, `avatars/${user?.uid}`); 
             // upload the image to the location
            const result = await uploadBytes(locationRef, file);
            // get the url of the image
            const avatarUrl = await getDownloadURL(result.ref); 
            setAvatar(avatarUrl);
            await updateProfile(user, {
                photoURL: avatarUrl,
            });
        }
    };

    const fetchTweets = async () => {
        const tweetQuery = query(
            collection(database, "tweets"),
            // bring tweets that user id equals to the current user. create an Firebase index with required fields (use Chrome)
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc"),
            limit(25)
        );
        const snapshot = await getDocs(tweetQuery);
        const tweets = snapshot.docs.map(doc => {
            const {tweet, createdAt, userId, username, photo} = doc.data();
            return {tweet, createdAt, userId, username, photo, id: doc.id};
        });
        setTweets(tweets);
    };

    useEffect(() => {
        if (user){
            fetchTweets();
        }
    }, [user]);

    useEffect(() => {
        fetchTweets();
    }, []);

    const navigate = useNavigate();
    const onLogOut = async () => {
        const ok = confirm("Are you sure you want to log out?");
        if (ok) {
            await auth.signOut();
            navigate("/login");
        }
    };

    const onEditUsername = async () => {
        setEditUsername(true);
    }

    const onSaveUsername = async () => {
        if (newUsername.length <= 15 && user) {
            try {
                await updateProfile(user, {
                    displayName: newUsername,
                });
                setEditUsername(false);
            } catch (error) {
                console.error("Error updating username: ", error);
            }
        } else {
            alert("Username must be 20 characters or less.");
        }
    }

    const cancelEditUsername = () => {
        setEditUsername(false);
        setNewUsername(user?.displayName || "name");
    }

    return (
        <Wrapper>
            <Settings>
                <AvatarUpload htmlFor="avatar">
                    {avatar ? (
                        <AvatarImg src={avatar} />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                        </svg>
                    )}
                </AvatarUpload>
                <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*" />
                <MyProfile>
                {editUsername ? (
                    <>
                    <EditUsernameTextarea
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter new username"
                    />
                    <Buttons>
                        <Button secondary onClick={onSaveUsername}>
                            Save
                        </Button>
                        <Button secondary onClick={cancelEditUsername}>
                            Cancel
                        </Button>
                    </Buttons>
                    </>
                ) : (
                    <>
                    <Name>{user?.displayName || "Anonymous"}</Name>
                    <Buttons>
                        <Button secondary onClick={onEditUsername}>
                        Edit Username
                        </Button>
                        <Button secondary onClick={onLogOut}>
                        Sign Out
                        </Button>
                    </Buttons>
                    </>
                )}
                </MyProfile>
            </Settings>
            <Tweets>
                {tweets.map(tweet => <Tweet key={tweet.id} {...tweet} />)}
            </Tweets>
        </Wrapper>
    )
}