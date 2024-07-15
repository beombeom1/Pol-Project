import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SchoolRanking.css'; // CSS 파일 추가

function SchoolRanking({ toggleSidebar }) {
    const [schoolRankings, setSchoolRankings] = useState([]);
    const [userRanking, setUserRanking] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const schoolRes = await axios.get('http://localhost:3002/ranking');
                console.log('School Rankings:', schoolRes.data); // 디버깅을 위해 로그 추가
                setSchoolRankings(schoolRes.data);

                const userRes = await axios.get('http://localhost:3002/user_ranking');
                console.log('User Ranking:', userRes.data); // 디버깅을 위해 로그 추가
                setUserRanking(userRes.data);
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
            {schoolRankings.length > 0 ? (
                <ul>
                    {schoolRankings.map((school, index) => (
                        <li key={index} className="school-ranking">
                             {index + 1}위: {school.school} ㅣ point: {school.total_point}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>순위 데이터를 불러오는 중입니다...</p>
            )}
            
            <h2>개인별 상위 10명 포인트 순위</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {userRanking.length > 0 ? (
                <ul>
                    {userRanking.map((user, index) => (
                        <li key={user.userid} className="user-ranking">
                           {index + 1}위: {user.name} ({user.school}) ㅣ point: {user.point} ㅣ tier: {user.tier}
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
