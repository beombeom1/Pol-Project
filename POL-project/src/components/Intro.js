import React, { useState, useEffect } from 'react';
import Char from '../rchar.png';
import pic01 from '../images2/LLM.jpg';
import pic02 from '../images2/TTS.png';
import pic03 from '../images2/Ranking.png';
import pic04 from '../images2/Game.png';

const Intro = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 isMounted를 true로 설정
    import('../components/assets2/css/intro.scss') // CSS 파일 import);
    setIsMounted(true);
  }, []);
  const items = [
    { src: pic01, title: 'LLM' },
    { src: pic02, title: 'STT - TTS' },
    { src: pic03, title: 'Ranking' },
    { src: pic04, title: 'Word Game' },
  ];
  const contents = [
    { content:'LLM을 사용하여 마치 친구처럼 GPT와 영어로 자유롭게 대화하며 실제 상황에서 활용 가능한 영어 실력을 키울 수 있습니다.'},
    { content:'오디오 녹음(Speech To Text)과 오디오 출력(Text To Speech) 기술을 활용하여 대화 봇과 보다 자연스럽고 편하게 대화할 수 있습니다. '},
    { content:'문제풀이를 통해 획득한 점수로 랭킹 순위를 올릴 수 있는 기능으로 사용자들과 비교하며 경쟁할 수 있습니다.'},
    { content:'학습자에게 맞춤형 영단어를 추천하고 학습한 단어로 단어 게임을 진행하여 보다 몰입감 있게 학습할 수 있습니다.'},
  ];
   const src = [
    { href: 'https://www.cloudflare.com/ko-kr/learning/ai/what-is-large-language-model'},
    { href: 'https://cloud.google.com/speech-to-text/?utm_source=google&utm_medium=cpc&utm_campaign=japac-KR-all-en-dr-BKWS-all-hv-trial-PHR-dr-1605216&utm_content=text-ad-none-none-DEV_c-CRE_631194512532-ADGP_Hybrid+%7C+BKWS+-+BRO+%7C+Txt+-AI+%26+ML-Speech+to+Text-gcp+speech+to+text-main-KWID_43700076521189445-kwd-725651037254&userloc_1009838-network_g&utm_term=KW_google+cloud+stt&gad_source=1&gclid=Cj0KCQjwkdO0BhDxARIsANkNcrdBU7TauZD9BdgaKrVttzBBq4JDOosuqwAvKuuCIg1nzKRLgzoEv5IaAijYEALw_wcB&gclsrc=aw.ds&hl=ko'},
    { href: '#'},
    { href: '#'}
   ]
  return (
    // <div className={styles.introContainer}>
      <div id="wrapper">
        <header id="header" className='alt'>
          <div className="inner">
            <h1 className={isMounted ? 'fade-in' : ''}>POL</h1>
            <h5  id="fade-de"className={isMounted ? 'fade-in' : ''}>
            POL은 단순히 영어를 익히는 것을 넘어, <br></br>자신감 있는 영어 사용자로 성장할 수 있도록 돕는 개인 맞춤형 학습 사이트입니다.
            </h5>
          </div>
        </header>

        <section id="intro" className="main2">
          <img src={Char} alt='pic'></img>
          <h2>POL은 다음과 같은 분들에게 특히 추천합니다</h2>
          <p className='m2p'>자신에게 맞는 학습 방식을 찾는 학생</p>
          <p className='m2p'>지루하지 않고 즐겁게 영어를 익히고 싶은 분</p>
          <p className='m2p'>실제 상황에서 활용할 수 있는 영어 실력을 키우고 싶은 분</p>
          <p className='m2p'>경쟁을 통해 동기를 부여받고 싶은 분</p>
          
          <ul className="actions">
            <li>
              <a href="/login" id='start-btn'className="button big">
                바로 시작
              </a>
            </li>
          </ul>
        </section>

        <section className="main2 items">
    {items.map((item, index) => (
       <article className="item" key={index}>
       <header>
         <a href="#">
           <img src={item.src} alt={item.title} />
         </a>
         <h3>{item.title}</h3>
       </header>
       <p>{contents[index].content}</p> 
        <ul className="actions">
          <li>
            <a href={src[index].href} className="button">
              More
            </a>
          </li>
        </ul>
      </article>
    ))}
  </section>

        <section id="cta" className="special">
          <h2>지금 바로 POL에 가입하고 영어 학습을 시작하세요!</h2>
          <p>
            함께 학습할 친구들을 구해보세요
          </p>
          <ul className="actions">
            <li>
              <a href="/login" className="button-big">
                시작하기
              </a>
            </li>
          </ul>
        </section>

        <footer id="footer">
          <ul className="icons">
            {['twitter', 'facebook', 'instagram', 'linkedin', 'envelope'].map((icon, index) => (
              <li key={index}>
                <a href="#" className={`icon fa-${icon}`}>
                  <span className="label">{icon.charAt(0).toUpperCase() + icon.slice(1)}</span>
                </a>
              </li>
            ))}
          </ul>
        </footer>

        <div className="copyright">
          Powered by: <a href="https://templated.co/">TEMPLATED.CO</a>
        </div>
      </div>
    //  </div>
  );
};

export default Intro;