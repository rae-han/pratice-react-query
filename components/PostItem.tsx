import React, {Fragment} from 'react';
import {NextPage} from "next";
import {Post} from "@/typings/db";

interface Props {
  post: Post
}

const PostItem: NextPage<Props> = ({ post }) => {
  if(!post) {
    return null;
  }

  return (
    <Fragment>
      <h2>제목: {post.title}</h2>
      <h3>글쓴이: {post.author}</h3>
      <h3>내용:</h3>
      <p>{post.description}</p>
    </Fragment>
  )
}

export default PostItem;