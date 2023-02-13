import type { NextPage } from "next";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Fragment, useState } from "react";
import PostItem from "@/components/PostItem";
import DefaultLayout from "@/layouts/DefaultLayout";


interface Post {
  id: number;
  title: string;
  author: string;
  description: string;
}


const getPosts = async ({ queryKey }: QueryFunctionContext) => {
  const { data } = await axios.get<Post[]>(
    `http://localhost:3055/posts?_limit=2&_page=${queryKey[1]}`
  );
  return data;
};


const PaginatedPage: NextPage = () => {
  const [page, setPage] = useState(1);
  const { data: posts, isLoading } = useQuery<Post[], Error>(
    ["paginated", page],
    getPosts,{
      keepPreviousData: true,
    }
  );


  return (
    <DefaultLayout>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          posts?.map((post) => (
            <PostItem key={post.id} post={post} />
          ))
        )}
        <button
          onClick={() => setPage((page) => page - 1)}
          disabled={page === 1}
        >
          Prev Page
        </button>
        <button
          onClick={() => setPage((page) => page + 1)}
          disabled={page === 5}
        >
          Next Page
        </button>
      </div>
    </DefaultLayout>
  );
};


export default PaginatedPage;