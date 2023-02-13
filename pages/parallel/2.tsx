import type {NextPage} from "next";
import React, {useEffect} from 'react';
import DefaultLayout from "@/layouts/DefaultLayout";
import { Post } from "@/typings/db";
import axios from "axios";
import {useQueries, useQuery} from "@tanstack/react-query";
import PostItem from "@/components/PostItem";
import {QueryFunctionContext} from "@tanstack/query-core";

const getPost = async (query: QueryFunctionContext) => {
  console.log(query);
  const { data } = await axios.get<Post>(
    `http://localhost:3055/posts/${query.queryKey[1]}`
  );
  return data;
};

const ParallelWithQueries: NextPage = () => {
  const [
    { data: post1, isLoading: isLoading1, isError: isError1, error: error1 },
    { data: post2, isLoading: isLoading2, isError: isError2, error: error2 },
    { data: post3, isLoading: isLoading3, isError: isError3, error: error3 },
    { data: post4, isLoading: isLoading4, isError: isError4, error: error4 },
  ]  = useQueries({
    queries: [
      { queryKey: ["post", 1], queryFn: getPost },
      { queryKey: ["post", 2], queryFn: getPost },
      { queryKey: ["post", 3], queryFn: getPost },
      { queryKey: ["post", 4], queryFn: getPost },
    ]
  });

  if (isError1 || isError2 || isError3 || isError4) {
    return <div>error!</div>
  }

  if (isLoading1 || isLoading2 || isLoading3 || isLoading4) {
    return <div>loading...</div>
  }

  return (
    <DefaultLayout>
      <main>
        <PostItem post={post1} />
        <PostItem post={post2} />
        <PostItem post={post3} />
        <PostItem post={post4} />
      </main>
    </DefaultLayout>
  )
}

export default ParallelWithQueries;