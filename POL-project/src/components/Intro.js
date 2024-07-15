import React, { useState, useEffect } from 'react';
import Char from '../rchar.png';
import pic01 from '../images2/pic01.jpg';
import pic02 from '../images2/pic02.jpg';
import pic03 from '../images2/pic03.jpg';
import pic04 from '../images2/pic04.jpg';

const Intro = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 isMounted를 true로 설정
    import('../components/assets2/css/intro.scss') // CSS 파일 import);
    setIsMounted(true);
  }, []);
  const items = [
    { src: pic01, title: 'Feugiat et faucibus' },
    { src: pic02, title: 'Blandit adipiscing' },
    { src: pic03, title: 'Lorem massa nulla' },
    { src: pic04, title: 'Ipsum sed tempus' },
  ];
  return (
    // <div className={styles.introContainer}>
      <div id="wrapper">
        <header id="header" className='alt'>
          <div className="inner">
            <h1 className={isMounted ? 'fade-in' : ''}>POL</h1>
            <h5 className={isMounted ? 'fade-in' : ''}>
              POL 은 Personalized Online Learning System<br></br>
              개인화된 온라인 학습'시스템을 제공하자는 목표로 제작 하였습니다.
            </h5>
          </div>
        </header>

        <section id="intro" className="main2">
          <img src={Char} alt='pic'></img>
          <h2>POL의 사용법</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae
            malesuada turpis. Nam pellentesque in ac aliquam. Aliquam tempor
            mi porta egestas maximus lorem ipsum dolor.
          </p>
          <ul className="actions">
            <li>
              <a href="#" className="button big">
                Learn More
              </a>
            </li>
          </ul>
        </section>

        <section className="main2 items">
    {items.map((item, index) => (
      <article className="item" key={index}>
        <header>
          <a href="#">
            <img src={item.src} alt="" />
          </a>
          <h3>{item.title}</h3>
        </header>
        <p>
          Fusce malesuada efficitur venenatis. Pellentesque tempor leo sed
          massa hendrerit hendrerit. In sed feugiat est, eu congue elit. Ut
          porta magna vel felis sodales vulputate. Donec faucibus dapibus
          lacus non ornare.
        </p>
        <ul className="actions">
          <li>
            <a href="#" className="button">
              More
            </a>
          </li>
        </ul>
      </article>
    ))}
  </section>

        <section id="cta" className="special">
          <h2>Etiam veroeros lorem</h2>
          <p>
            Phasellus ac augue ac magna auctor tempus proin
            accumsan lacus a nibh commodo in pellentesque dui
            in hac habitasse platea dictumst.
          </p>
          <ul className="actions">
            <li>
              <a href="/login" className="button-big">
                Get Started
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