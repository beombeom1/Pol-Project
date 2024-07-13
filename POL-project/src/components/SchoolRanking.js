import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SchoolRanking.css'; // CSS 파일 추가

function SchoolRanking({ toggleSidebar }) {
    const [rankings, setRankings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const res = await axios.get('http://localhost:3002/ranking');
                console.log('Rankings:', res.data); // 디버깅을 위해 로그 추가
                setRankings(res.data);
            } catch (error) {
                console.error('순위를 가져오는 중 오류 발생:', error);
                setError('순위를 가져오는 중 오류 발생');
            }
        };

        fetchRankings();
    }, []);

    return (
        <div>
            <h2>학교별 상위 5개 포인트 합계</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {rankings.length > 0 ? (
                <ul>
                    {rankings.map((school, index) => (
                        <li key={index} className="school-ranking">
                            {school.school} ㅣ  point: {school.total_point}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>순위 데이터를 불러오는 중입니다...</p>
            )}
        </div>
    );
}

export default SchoolRanking;
