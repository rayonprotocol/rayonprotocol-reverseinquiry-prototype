import React, { Component } from 'react';

// view
import Container from 'common/view/Container';

// styles
import styles from './HomeVC.scss';

class HomeVC extends Component<{}, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.contentContainer}>
        <div className={styles.topMain}>
          <img src={require('../images/bg.png')} />
          <div className={styles.topMainOverlay}>
            <div className={styles.titleWrap}>
              <p className={styles.title}>Rayon Protocol</p>
              <p className={styles.subTitle}>- Reverse Inquiry -</p>
            </div>
          </div>
        </div>
        <Container>
          <section>
            <div className={styles.sectionTitle}>Create Account Guideline</div>
            <div className={styles.description}>
              <p>1. Install Metamask</p>
              <p>2. Click on Create Account on top right</p>
              <p>3. Select account type as Borrower or Lender</p>
              <p>4. Set user ID</p>
            </div>
          </section>
        </Container>
      </div>
    );
  }
}

export default HomeVC;
