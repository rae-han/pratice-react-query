import type { NextPage } from "next";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import {Fragment, useEffect} from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import PostItem from "@/components/PostItem";


interface Post {
  id: number;
  title: string;
  author: string;
  description: string;
}


const getPosts = async ({ pageParam = 1 }: QueryFunctionContext) => {
  console.log('pageParam', pageParam)
  const { data } = await axios.get<Post[]>(
    `http://localhost:3055/posts?_limit=2&_page=${pageParam}`
  );
  return data;
};


const InfiniteQueriesPage: NextPage = () => {
  const {
    data: postPages,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<Post[], Error>(["infinite"], getPosts, {
    getNextPageParam: (_lastPage, pages) => {
      console.log('_lastPage', _lastPage, 'pages', pages)
      if (pages.length === 5) {
        return undefined; // undefined를 반환하면 hasNextPage가 false가 된다.
      }

      return pages.length + 1; // fetchNextPage를 호출하면 이 값이 getPosts의 pageParam으로 전달 된다.
    },
  });

  useEffect(() => {
    console.log('hasNextPage', hasNextPage)
  }, [hasNextPage, postPages])


  return (
    <DefaultLayout>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          postPages?.pages.map((posts, i) => (
            <Fragment key={i}>
              {posts?.map((post) => (
                <PostItem key={post.id} post={post} />
              ))}
            </Fragment>
          ))
        )}
        <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
          Load More
        </button>
      </div>
    </DefaultLayout>
  );
};


export default InfiniteQueriesPage;