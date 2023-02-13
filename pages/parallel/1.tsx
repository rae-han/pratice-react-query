import type {NextPage} from "next";
import React from 'react';
import DefaultLayout from "@/layouts/DefaultLayout";
import { Post } from "@/typings/db";
import {QueryFunctionContext} from "@tanstack/query-core";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import PostItem from "@/components/PostItem";

const getPost = async (query: QueryFunctionContext) => {
  console.log(query);
  const { data } = await axios.get<Post>(
    `http://localhost:3055/posts/${query.queryKey[1]}`
  );
  return data;
};

const ParallelWithQuery: NextPage = () => {
  const { data: post1, isLoading: isLoading1, isError: isError1 } = useQuery<Post, Error>(["post", 1], getPost);
  const { data: post2, isLoading: isLoading2, isError: isError2 } = useQuery<Post, Error>(["post", 2], getPost);
  const { data: post3, isLoading: isLoading3, isError: isError3 } = useQuery<Post, Error>(["post", 3], getPost);
  const { data: post4, isLoading: isLoading4, isError: isError4 } = useQuery<Post, Error>(["post", 4], getPost);

  if (isError1 || isError2 || isError3 || isError4) {
    return null;
  }

  return (
    <DefaultLayout>
      { (isLoading1 || isLoading2 || isLoading3 || isLoading4) ? (
        <div>loading...</div>
      ) : (
        <main>
          <PostItem post={post1} />
          <PostItem post={post2} />
          <PostItem post={post3} />
          <PostItem post={post4} />
        </main>
      )}
    </DefaultLayout>
  )
}

export default ParallelWithQuery;