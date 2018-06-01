import React, { Component } from 'react';

// view
import Container from 'common/view/Container';

// styles
import styles from './TopBanner.scss';

interface TopBannerProps {
  title: string;
  description: string;
}

class TopBanner extends Component<TopBannerProps, {}> {
  render() {
    return (
      <div className={styles.topBanner}>
        <Container className={styles.contentContainer}>
          <div className={styles.title}>{this.props.title}</div>
          <div className={styles.description}>{this.props.description}</div>
          <img src={require('../../../assets/img/rayon-logo.png')} />
        </Container>
      </div>
    );
  }
}

export default TopBanner;
