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
            <div className={styles.sectionTitle}>회원가입</div>
            <div className={styles.description}>
              <p>1. 메타마스크를 설치해주세요</p>
              <p>2. 우측 상단의 가입하기를 선택해주세요</p>
              <p>3. 금융사는 Lender, 개인 회원은 Persional을 선택해야합니다</p>
              <p>4. 사용할 이름과 패스워드를 설정합니다</p>
            </div>
          </section>
          {/* <section>
            <div className={styles.sectionTitle}>역경매</div>
            <div className={styles.description}>
              <p>1-1 개인회원은 경매를 등록하기 위해 좌측 상단 경매공고를 클릭합니다</p>
              <p>1-2 목록 하단 글쓰기를 선택해주세요</p>
              <p>1-3 제목과 내용을 입력하고 등록 버튼을 누릅니다</p>
              <p>2-1 금융사는 경매 공고에서 공고 목록중 하나를 클릭합니다</p>
              <p>2-2 들어간 목록의 내용을 확인하고 데이터 요청 버튼을 클릭합니다</p>
            </div>
          </section> */}
        </Container>
      </div>
    );
  }
}

export default HomeVC;
