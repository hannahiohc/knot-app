import { database } from "@/firebase";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
    id: string;
    photo?: string; // not required
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

export default function Timeline() {
    const [tweets, setTweet] = useState<ITweet[]>([]);

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchTweets = async () => {
            // set the collection of database and order them by newest
            const tweetsQuery = query(
                collection(database, "tweets"),
                orderBy("createdAt", "desc"),
                // don't show all the tweets
                limit(25)
            );

            // subscribe when the user enters the page
            unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
                // extract the data, put it in variable(tweets) and set in the state(setTweet) for real time connection
                const tweets = snapshot.docs.map((doc) => {
                    const { tweet, createdAt, userId, username, photo } = doc.data();
                    return {
                        tweet,
                        createdAt,
                        userId,
                        username,
                        photo,
                        id: doc.id,
                    };
                });
                setTweet(tweets);
            });
        };
        fetchTweets();

        // when the user is not on the page, don't update the timeline
        return () => {
          unsubscribe && unsubscribe();
        };
      }, []);

    return (
        <Wrapper>
            {tweets.map((tweet => 
                <Tweet key={tweet.id} {...tweet} />
            ))}
        </Wrapper>
    )
}