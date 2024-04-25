import clsx from 'clsx';
import Layout from '@theme/Layout';
import ExamplepageFeatures from '@site/src/components/examplepageFeatures';
import Heading from '@theme/Heading';
import styles from './css/examples.module.css';

export default function MyReactPage(): JSX.Element {

  return (
    <Layout>
      <header className={clsx(styles.headerBanner)}>
        <div className="container">
          <Heading as="h1" className="example_title">PixiJS Examples</Heading>
        </div>
      </header>
      <main>
        <ExamplepageFeatures />
      </main>
    </Layout>
  );
}