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
    refetchOnMount: false, // SSR 이후 한번 더 refetch 가 일어나는 것이 불필요하다고 느낄 경우에는 refetchOnMount를 false로 하거나
    // staleTime: Infinity // staleTime을 Infinity로 설정하면 SSR 이후 refetch가 발생하지 않는다.
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
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["posts"], getPosts);

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

export default SSR;