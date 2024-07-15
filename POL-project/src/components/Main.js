  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { Calendar, momentLocalizer } from 'react-big-calendar';
  import moment from 'moment';
  import { Link } from 'react-router-dom';
  import 'react-big-calendar/lib/css/react-big-calendar.css';
  import POLImg from './images/POL.png';
  import './Main.css';

  const localizer = momentLocalizer(moment);

  function Main({ setSidebarVisible }) {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const userid = localStorage.getItem('userid'); // 로컬 스토리지에서 userid 가져오기

    useEffect(() => {
      if (userid) {
        fetchData();
      }
    }, [userid]);

    const fetchData = async () => {
      try {
        const [attendanceResponse, eventsResponse] = await Promise.all([
          axios.get(`http://localhost:3002/attendance/${userid}`),
          axios.get(`http://localhost:3002/events/${userid}`)
        ]);

        const attendanceData = attendanceResponse.data.map(record => ({
          title: '출석체크',
          start: new Date(record.attendance_date),
          end: new Date(record.attendance_date),
          allDay: true,
        }));

        const eventData = eventsResponse.data.map(event => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start_date),
          end: new Date(event.end_date),
          allDay: true,
        }));

        setEvents([...attendanceData, ...eventData]);
      } catch (error) {
        console.error('데이터 가져오기 중 에러 발생:', error);
      }
    };

    const handleCheckAttendance = async () => {
      console.log('Checking attendance for userid:', userid); // 로그 추가
      try {
        const response = await axios.post('http://localhost:3002/attendance', { userid });
        console.log('Attendance check response:', response.data);
        alert('출석체크 되었습니다.');

        // 출석 체크 날짜 추가
        const today = new Date().toISOString().slice(0, 10);
        const newEvent = {
          title: '출석체크',
          start: new Date(today),
          end: new Date(today),
          allDay: true,
        };

        setEvents(prevEvents => {
          // 중복된 출석 체크 방지
          const isDuplicate = prevEvents.some(event => event.title === '출석체크' && event.start.toDateString() === newEvent.start.toDateString());
          if (!isDuplicate) {
            return [...prevEvents, newEvent];
          }
          return prevEvents;
        });
      } catch (error) {
        console.error('출석체크 요청 중 에러 발생:', error);
        if (error.response && error.response.status === 400) {
          alert('오늘 이미 출석체크를 완료했습니다.');
        } else {
          alert('출석체크 중 에러가 발생했습니다.');
        }
      }
    };

    const handleAddEvent = async () => {
      try {
        await axios.post('http://localhost:3002/events', {
          userid,
          title: newEvent.title,
          start_date: newEvent.start,
          end_date: newEvent.end,
        });
        alert('일정이 성공적으로 추가되었습니다.');
        const addedEvent = {
          title: newEvent.title,
          start: new Date(newEvent.start),
          end: new Date(newEvent.end),
          allDay: true,
        };
        setEvents(prevEvents => [...prevEvents, addedEvent]); // 새로운 이벤트를 기존 이벤트에 추가
        setNewEvent({ title: '', start: '', end: '' });
      } catch (error) {
        console.error('일정 추가 중 에러 발생:', error);
        if (error.response && error.response.status === 400) {
          alert('하루에 두 개 이상의 일정을 추가할 수 없습니다.');
        } else {
          alert('일정 추가 중 에러가 발생했습니다.');
        }
      }
    };

    const handleSearch = async () => {
      try {
        console.log(`Searching for query: ${searchQuery}`); // 로그 추가
        const response = await axios.get(`http://localhost:3002/events/search/${userid}?query=${searchQuery}`);
        const searchResults = response.data.map(event => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start_date),
          end: new Date(event.end_date),
          allDay: true,
        }));
        setSearchResults(searchResults);
        setIsSearchModalOpen(true); // 검색 결과 모달 열기
      } catch (error) {
        console.error('검색 중 에러 발생:', error);
      }
    };

    const handleSelectEvent = (event) => {
      if (event.title === '출석체크') {
        return; // 출석체크 이벤트일 경우 아무 일도 일어나지 않게 함
      }
      setSelectedEvent(event);
    };

    const handleDeleteEvent = async () => {
      if (!selectedEvent || !selectedEvent.id) return;
      try {
        await axios.delete(`http://localhost:3002/events/${selectedEvent.id}`);
        alert('이벤트가 성공적으로 삭제되었습니다.');
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        setSelectedEvent(null);
      } catch (error) {
        console.error('이벤트 삭제 중 에러 발생:', error);
        alert('이벤트 삭제 중 에러가 발생했습니다.');
      }
    };

    const formatDateToMySQL = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    };

    const handleEditEvent = async () => {
      if (!selectedEvent || !selectedEvent.id) return;

      const startDateFormatted = formatDateToMySQL(selectedEvent.start);
      const endDateFormatted = formatDateToMySQL(selectedEvent.end);

      try {
        await axios.put(`http://localhost:3002/events/${selectedEvent.id}`, {
          title: selectedEvent.title,
          start_date: startDateFormatted,
          end_date: endDateFormatted,
        });
        alert('이벤트가 성공적으로 수정되었습니다.');
        setEvents(events.map(event => event.id === selectedEvent.id ? { ...selectedEvent, start: new Date(startDateFormatted), end: new Date(endDateFormatted) } : event));
        setIsEditing(false);
      } catch (error) {
        console.error('이벤트 수정 중 에러 발생:', error);
        alert('이벤트 수정 중 에러가 발생했습니다.');
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setSelectedEvent(prevEvent => ({ ...prevEvent, [name]: value }));
    };

    return (
      <div className="main-container">
        <header className="main-header" >
          <div className="header-links">
            <Link className="login" to='/login' onClick={() => setSidebarVisible(false)}>로그인</Link>
            <Link className="signup" to='/signup' onClick={() => setSidebarVisible(false)}>회원가입</Link>
          </div>
        </header >
        <div className='user-text'>user님 환영해요! 오늘 하루는 어땠나요 ?</div>
        <div className="content-container">
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              className="custom-calendar"
              onSelectEvent={handleSelectEvent} // 이벤트 클릭 시 핸들러
            />
            <button className="check-attendance-btn" onClick={handleCheckAttendance}>
              출석체크
            </button>
          </div>
          <div className="search-form">
            <h2>일정 검색 및 추가</h2>
            <input type="text" placeholder="일정 제목" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button onClick={handleSearch} className='search-btn'>검색</button><br></br>
            <input type="text" placeholder="일정 제목" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
            <input type="date" value={newEvent.start} onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })} />
            <input type="date" value={newEvent.end} onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })} />
            <button onClick={handleAddEvent} className='add-plan'>일정 추가</button>
          </div>
          <div className='user-profile'>
            <h2>   최정우  {userid}님 </h2>
            <div className="profile-info">
              <p className='user-info'>
                학교 : 백석대학교<br></br>
                개인 순위 : 121위<br></br>
                등급 : master<br></br>
                난이도 : king--easy
              </p>
              <button className='logout-button'>로그아웃</button>
            </div>
          </div>
        </div>
        <div className="under-container">
          <div className="school-ranking">
          <h2>오늘의 숙어 추천</h2>
            <p>Bite the bullet : 어려운 결정을 내리거나 고통스러운 일을 감내하다.</p>
            <p>Break the ice : 어색함을 없애거나 사람들과 친밀감을 돈독하게 만들다.</p>
            <p>Burn the midnight oil : 밤 늦게까지 일하다.</p>
            <p>Cost an arm and a leg : 매우 비싸다.</p>
          </div>
          <div className="word-of-the-day">
          <h2>학교 랭킹</h2>
            <p>백석대학교 ········ 100p</p>
            <p>단국대학교 ········ 90p</p>
            <p>상명대학교 ········ 80p</p>
            <p>호서대학교 ········ 70p</p>
          </div>
        </div>

        {
          selectedEvent && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-button" onClick={() => setSelectedEvent(null)}>&times;</span>
                {isEditing ? (
                  <>
                    <h2>이벤트 수정</h2>
                    <input
                      type="text"
                      name="title"
                      value={selectedEvent.title}
                      onChange={handleChange}
                    />
                    <input
                      type="date"
                      name="start"
                      value={moment(selectedEvent.start).format('YYYY-MM-DD')}
                      onChange={handleChange}
                    />
                    <input
                      type="date"
                      name="end"
                      value={moment(selectedEvent.end).format('YYYY-MM-DD')}
                      onChange={handleChange}
                    />
                    <button onClick={handleEditEvent}>저장</button>
                    <button onClick={() => setIsEditing(false)}>취소</button>
                  </>
                ) : (
                  <>
                    <h2>{selectedEvent.title}</h2>
                    <p>
                      시작 날짜: {selectedEvent.start.toDateString()}<br />
                      종료 날짜: {selectedEvent.end.toDateString()}
                    </p>
                    <button onClick={() => setIsEditing(true)}>수정</button>
                    <button onClick={handleDeleteEvent}>삭제</button>
                  </>
                )}
              </div>
            </div>
          )
        }
        {
          isSearchModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close-button" onClick={() => setIsSearchModalOpen(false)}>&times;</span>
                <h2>검색 결과</h2>
                <ul>
                  {searchResults.map(event => (
                    <li key={event.id} onClick={() => handleSelectEvent(event)}>
                      {event.title} - {event.start.toDateString()} ~ {event.end.toDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        }
      </div >
    );
  }

  export default Main;
