import PostTweetForm from "@components/post-tweet-form/post-tweet-form";
import Timeline from "@components/timeline/timeline";
import "@/App.css";

export default function Home() {
    return (
        <div className="home">
            <PostTweetForm />
            <Timeline />
        </div>
    )
}