This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Project Initial Setting
```bash
npx create-next-app@latest --typescript
npm i eslint@8.22.0
npm i axios json-server
npm i @tanstack/react-query
npm i @tanstack/react-query-devtools
```

```typescript
// pages/_app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

```

- NextJS에서는 getStaticProps 또는 getServerSideProps 에서 props 객체를 페이지로 전달한 후에 리액트 쿼리의 initialData 옵션을 이용해 SSR을 구현할 수도 있다.
- 위 방법이 잘못된 것은 아니지만 권장하지 않는다.
- 이유는 깊이 있는 컴포넌트 단에서 서버 사이드 렌더링한 데이터가 필요할 경우 해당 컴포넌트까지 props로 전달을 해줘야하는 불편함이 있다.
- 반면에 이후에 Hydration 방식은 서버 사이드 렌더링시 사용했던 query key(식별자)를 이용하면 데이터를 불러올 수 있다.
- 공식 문서 또한 InitialData 옵션으로 설정하는 방법보다 Hydration 방식을 권장하고 있다.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```