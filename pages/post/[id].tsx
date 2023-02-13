import React from 'react';
import { NextPage } from 'next';
import {useRouter} from "next/router";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {Post} from "@/typings/db";
import {QueryFunctionContext} from "@tanstack/query-core";
import PostItem from "@/components/PostItem";
import DefaultLayout from "@/layouts/DefaultLayout";

const getPost = async (query: QueryFunctionContext) => {
  const { data } = await axios.get<Post>(
    `http://localhost:3055/posts/${query.queryKey[1]}`
  );
  return data;
};


const PostPage: NextPage = () => {
  const router = useRouter();
  const { id: postId } = router.query;

  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery<Post, Error>(
    ["post", postId],
    getPost,
    {
      initialData: () => {
        const posts = queryClient.getQueryData<Post[]>(["posts"]);
        const post = postId ? posts?.find((post) => post.id === +postId) : null;

        if (!post) {
          return undefined;
        }

        return post;
      },
    }
  );

  return (
    <DefaultLayout>
      {isLoading ? (
        <div>Loading...</div>
      ) : post ? (
        <main>
          <PostItem post={post} />
        </main>
      ) : null}
    </DefaultLayout>
  )
}

export default PostPage;