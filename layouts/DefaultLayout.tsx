import React, {useRef} from 'react';
import {NextPage} from "next";
import styles from '../styles/DefaultLayout.module.css'
import Link from "next/link";

interface Props {
  children: React.ReactNode
}

const DefaultLayout: NextPage<Props> = ({children}) => {
  const routes = useRef([
    { id: 1, route: '/', text: 'useQuery' },
    { id: 2, route: '/parallel/1', text: 'Parallel with useQuery' },
    { id: 3, route: '/parallel/2', text: 'Dynamic Parallel with useQueries' },
    { id: 4, route: '/dependent', text: 'Dependent' },
    { id: 5, route: '/paginated', text: 'Paginated' },
    { id: 6, route: '/infinite', text: 'Infinite' },
  ])

  return (
    <>
      <nav className={styles.nav}>
        <ul>
          {routes.current?.map((route) => (
            <Link href={route.route} key={route.id}><li>{route.text}</li></Link>
          ))}
        </ul>
      </nav>
      <section>{children}</section>
    </>
  )
}

export default DefaultLayout;