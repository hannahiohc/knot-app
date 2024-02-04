import { database } from "@/firebase";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import Tweet from "../tweet/tweet";
import { Unsubscribe } from "firebase/auth";
import "./style.css";

export interface ITweet {
    id: string;
    photo?: string; // not required
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}

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
        <div className="timeline">
            {tweets.map((tweet => 
                <Tweet key={tweet.id} {...tweet} />
            ))}
        </div>
    )
}