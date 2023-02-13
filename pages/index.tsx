import { Post } from '@/typings/db'
import fetcher from "@/utils/fetchers";
import DefaultLayout from "@/layouts/DefaultLayout";
import {useQuery} from "@tanstack/react-query";
import fetchers from "@/utils/fetchers";
import PostItem from "@/components/PostItem";

export default function Home() {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<Post[], Error>(["posts"], () => fetchers({
    queryKey: '/posts'
  }), {
    staleTime: 5 * 1_000, // 5초 동안 캐시하겠다.
    refetchOnMount: true, // default 컴포넌트가 마운트 됐을 때 실행시켜 주겠다.
    refetchOnWindowFocus: true // default 컴포넌트가 있는 윈도우, 탭에 포커싱이 갔을 때 다시 실행시켜 주겠다.
  })

  return (
    <DefaultLayout>
      { isLoading ? (<div>Loading...</div>) : (
        <main>
          {posts?.map(post => <PostItem key={post.id} post={post}/>)}
        </main>
      )}
    </DefaultLayout>
  )
}
