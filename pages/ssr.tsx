import type { GetServerSideProps, NextPage } from "next";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Fragment } from "react";
import Link from "next/link";
import { Post } from "@/typings/db";
import DefaultLayout from "@/layouts/DefaultLayout";
import PostItem from "@/components/PostItem";

const getPosts = async () => {
  const { data } = await axios.get<Post[]>("http://localhost:3055/posts");
  return data;
};

const SSR: NextPage = () => {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<Post[], Error>(["posts"], getPosts, {
    refetchOnWindowFocus: false,
  });


  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <DefaultLayout>
      {isLoading
        ? <div>loading...</div>
        : posts.map(post => <PostItem post={post} key={post.id} />)
      }
    </DefaultLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      dehydratedState: {}
    }
  }
}

export default SSR;