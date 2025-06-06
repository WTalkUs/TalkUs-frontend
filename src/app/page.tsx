import styles from "./page.module.css";
import PostsList from "./common/components/PostList";
import PostModal from "./common/components/PostModal";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <PostModal />
        <PostsList />
      </main>
    </div>
  );
}
