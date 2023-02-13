import type {NextPage} from "next";
import React from 'react';
import DefaultLayout from "@/layouts/DefaultLayout";
import { Post, User } from "@/typings/db";
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

const getUser = async ({ queryKey }: QueryFunctionContext) => {
  const response = await axios.get<User>(
    `http://localhost:3055/users/${queryKey[1]}`
  );
  return response.data;
};


const Dependent: NextPage = () => {
  const { data: user } = useQuery(["user", "raehan@google.com"], getUser);
  const { data: post, isLoading, isError } = useQuery(["post", user?.postId], getPost, {
    enabled: !!user?.postId,
  });

  if(isError) {
    return null;
  }

  return (
    <DefaultLayout>
      { isLoading ? (
        <div>loading...</div>
      ) : (
        <main>
          <PostItem post={post} />
        </main>
      )}
    </DefaultLayout>
  )
}

export default Dependent;