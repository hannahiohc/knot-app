import PostTweetForm from "@components/post-tweet-form";
import Timeline from "@components/timeline";
import styled from "styled-components";

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export default function Home() {
    return (
        <Wrapper>
            <PostTweetForm />
            <Timeline />
        </Wrapper>
    )
}