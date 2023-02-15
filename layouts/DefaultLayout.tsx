import React, {useRef} from 'react';
import {NextPage} from "next";
import styles from '../styles/DefaultLayout.module.css'
import Link from "next/link";

interface Props {
  children: React.ReactNode
}

const DefaultLayout: NextPage<Props> = ({children}) => {
  const routes = useRef([
    { route: '/', text: 'useQuery' },
    { route: '/parallel/1', text: 'Parallel with useQuery' },
    { route: '/parallel/2', text: 'Dynamic Parallel with useQueries' },
    { route: '/dependent', text: 'Dependent' },
    { route: '/paginated', text: 'Paginated' },
    { route: '/infinite', text: 'Infinite' },
    { route: '/todos', text: 'Todos()' },
    { route: '/todos/1', text: 'Todos(basic - queryClient.invalidateQueries)' },
    { route: '/todos/2', text: 'Todos(queryClient.setQueryData)' },
    { route: '/todos/3', text: 'Todos(Optimistic Update)' },
    { route: '/ssr', text: 'Server Side Rendering' },
  ])

  return (
    <>
      <nav className={styles.nav}>
        <ul>
          {routes.current?.map((route, index) => (
            <Link href={route.route} key={index}><li>{route.text}</li></Link>
          ))}
        </ul>
      </nav>
      <section>{children}</section>
    </>
  )
}

export default DefaultLayout;