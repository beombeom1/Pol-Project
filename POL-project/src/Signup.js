import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [schools, setSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [regions] = useState([
    { code: '100260', name: '서울특별시' },
    { code: '100267', name: '부산광역시' },
    { code: '100269', name: '인천광역시' },
    { code: '100272', name: '대구광역시' },
    { code: '100275', name: '광주광역시' },
    { code: '100271', name: '대전광역시' },
    { code: '100273', name: '울산광역시' },
    { code: '100276', name: '경기도' },
    { code: '100278', name: '강원도' },
    { code: '100280', name: '충청북도' },
    { code: '100281', name: '충청남도' },
    { code: '100282', name: '전북특별자치도' },
    { code: '100283', name: '전라남도' },
    { code: '100285', name: '경상북도' },
    { code: '100291', name: '경상남도' },
    { code: '100292', name: '제주도' }
  ]);

  const [highSchoolTypes] = useState([
    { code: '100362', name: '일반고' },
    { code: '100363', name: '특성화고' },
    { code: '100364', name: '특수목적고' }
  ]);

  const [universityTypes] = useState([
    { code: '100322', name: '전문대' },
    { code: '100323', name: '4년제' }
  ]);

  const [gubuns] = useState([
    { code: 'univ_list', name: '대학교' },
    { code: 'high_list', name: '고등학교' },
    { code: 'middle_list', name: '중학교' },
    { code: 'elem_list', name: '초등학교' }
  ]);

  const [region, setRegion] = useState('');
  const [schoolType1, setSchoolType1] = useState('');
  const [establishment, setEstablishment] = useState('');
  const [gubun, setGubun] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (region || schoolType1 || establishment || gubun) {
      fetchSchools(1, 1000); 
    }
  }, [region, schoolType1, establishment, gubun]);

  const fetchSchools = async (page = 1, perPage = 1000) => {
    try {
      const params = {
        apiKey: 'fa0f7bea886e6e9ccf10c5514eb0b58c',
        svcType: 'api',
        svcCode: 'SCHOOL',
        contentType: 'json',
        region,
        schoolType1,
        establishment,
        gubun,
        thisPage: page,
        perPage: perPage,
        searchSchulNm: searchTerm  // 검색어 추가
      };
      const response = await axios.get('https://www.career.go.kr/cnet/openapi/getOpenApi.json', { params });
      setSchools(response.data.dataSearch.content);
    } catch (error) {
      console.error('학교 데이터 가져오기 중 에러 발생:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/signup', {
        userid,
        password,
        name,
        school,
        gubun  // gubun 값을 함께 전송
      });
      console.log(response.data);
      alert('회원가입 성공');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('회원가입 실패');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <h2>회원가입</h2>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="userid">아이디</label>
          <input
            type="text"
            id="userid"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="gubun">구분</label>
          <select
            id="gubun"
            value={gubun}
            onChange={(e) => setGubun(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          >
            <option value="">선택하세요</option>
            {gubuns.map((gubun) => (
              <option key={gubun.code} value={gubun.code}>
                {gubun.name}
              </option>
            ))}
          </select>
        </div>
        {gubun === 'high_list' && (
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="schoolType1">학교유형1:</label>
            <select
              id="schoolType1"
              value={schoolType1}
              onChange={(e) => setSchoolType1(e.target.value)}
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            >
              <option value="">선택하세요</option>
              {highSchoolTypes.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {gubun === 'univ_list' && (
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="schoolType1">학교유형1:</label>
            <select
              id="schoolType1"
              value={schoolType1}
              onChange={(e) => setSchoolType1(e.target.value)}
              style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            >
              <option value="">선택하세요</option>
              {universityTypes.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="region">지역</label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          >
            <option value="">선택하세요</option>
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="schoolSearch">학교 검색</label>
          <input
            type="text"
            id="schoolSearch"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="학교 이름을 입력하세요"
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="school">학교</label>
          <select
            id="school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          >
            <option value="">학교를 선택하세요</option>
            {schools.map((school) => (
              <option key={school.seq} value={school.schoolName}>
                {school.schoolName}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          style={{ width: '100%', padding: '10px', margin: '10px 0', backgroundColor: 'lightblue' }}
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
