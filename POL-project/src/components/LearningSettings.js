import React, { useState } from 'react';
import './LearningSettings.css';

function LearningSettings() {
    return (
        <div className="learning-settings-container">
            <h2>오늘의 암기 추천 단어!</h2>
            <div className='word'>
             <div>
                    <span>Sesquipedalian</span> - 매우 긴 말이나 글을 뜻합니다.
                </div>
                <div>
                    <span>Serendipity</span> - 우연히 발생한 좋은 사건이나 발견을 의미합니다.
                </div>
                <div>
                    <span>Ubiquitous</span> - 어디에나 존재하는, 널리 분포하는 것을 뜻합니다.
                </div>
                <div>
                    <span>Defenestration</span> - 창문을 통해 던지는 행위를 의미합니다.
                </div>
                <div>
                    <span>Soporific</span> - 수면을 유도하는, 졸음을 유발하는 것을 나타냅니다.
                </div>
                <div>
                    <span>Ebullient</span> - 매우 활기찬, 열정적인 사람이나 기분을 나타냅니다.
                </div>
                <div>
                    <span>Quixotic</span> - 비현실적이고 이상적인 것을 추구하는 것을 의미합니다.
                </div>
                <div>
                    <span>Pulchritudinous</span> - 아름다운 외모를 가진 것을 뜻합니다.
                </div>
                <div>
                    <span>Pernicious</span> - 치명적이고 해로운 영향을 가지는 것을 나타냅니다.
                </div>
                <div>
                    <span>Sycophant</span> - 비위를 맞추기 위해 아첨하는 사람을 의미합니다.
                </div>
            </div>
        </div>
    );
}

export default LearningSettings;
