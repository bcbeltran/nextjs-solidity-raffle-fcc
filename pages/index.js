import Head from 'next/head'
import styles from '../styles/Home.module.css'
//import ManualHeader from '../components/ManualHeader'
import Header from '../components/Header'
import RaffleEntrance from '../components/RaffleEntrance'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Decentralized Raffle</title>
        <meta name="description" content="Connect to a smart contract where you can donate to current animal rescue projects around the world" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <RaffleEntrance />
    </div>
  )
}
