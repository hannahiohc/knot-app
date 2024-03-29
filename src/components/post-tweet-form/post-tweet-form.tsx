import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { auth, database, storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "@/styles/button.css";
import "./style.css";

export default function PostTweetForm() {
    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        // only accept files less than 1mb
        if (files && files.length === 1 && files[0].size / (1024 ** 2) <= 1) {
            setFile(files[0]);
        } else {
            alert("Please upload an image that is less than 1MB.");
        }
    };
    
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser;
        // kill the function when the user is not logged in, still submitting, tweet is empty or the length of tweet is longer than 180
        if (!user || isLoading || tweet === "" || tweet.length > 180) return; 

        try {
            setLoading(true);
            // save contents of tweet
            const doc = await addDoc(collection(database, "tweets"), {
                tweet,
                createdAt: Date.now(),
                username: user.displayName || "Anonymous",
                userId: user.uid,
            });
            // check if the user attached a file(image)
            if (file) {
                // store it in a folder named the user's id and give the file a name(doc.id)
                const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
                const result = await uploadBytes(locationRef, file);
                // get the url of the image and update
                const url = await getDownloadURL(result.ref);
                await updateDoc(doc, {
                    photo: url,
                });
            };
            // reset the textarea
            setTweet("");
            setFile(null);
        } catch(error) { 
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="post-tweet-form" onSubmit={onSubmit}>
            <div className="tweet-form">
                <textarea onChange={onChange} value={tweet} placeholder="What is happening?" rows={5} maxLength={180} required />
                <div className="buttons">
                    <label className="attach-file-button" htmlFor="file">
                        {file ? (
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="added" aria-label="Photo Added">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            </>
                        ) : (
                            <>  
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="add" aria-label="Add Photo">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            </>
                        )}
                    </label>
                    <input className="attach-file-input" onChange={onFileChange} type="file" id="file" accept="image/*" />
                    <button className="button-primary" type="submit">{isLoading ? "Posting..." : "Post"}</button>
                </div>
            </div>
        </form>
    );
}