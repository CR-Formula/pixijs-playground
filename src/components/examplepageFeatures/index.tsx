import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string;
  page: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Hello Triangle',
    page: '/examples/helloTriangle',
    Svg: require('@site/static/img/helloTriangle.svg').default,
    description: (
      <>
        This example displays simple use of drawing a triangle.
      </>
    ),
  },
  {
    title: 'Moving Line',
    page: '/examples/movingLine',
    Svg: require('@site/static/img/movingLine.svg').default,
    description: (
      <>
        This example displays a randomly moving line.
      </>
    ),
  },
];

function Feature({title, page, Svg, description}: FeatureItem): JSX.Element {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
      <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to={page}>
            {title}
          </Link>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function examplepageFeature(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
