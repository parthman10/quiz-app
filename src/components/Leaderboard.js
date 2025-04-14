import React, { useState, useEffect } from 'react';
import '../styles/Leaderboard.css';

const Leaderboard = ({ score, onNavigate }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  
  useEffect(() => {
    // Load leaderboard from localStorage
    const savedLeaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    setLeaderboard(savedLeaderboard);
    
    // Check if we need to ask for a username
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    } else if (score > 0) {
      setShowNameInput(true);
    }
  }, [score]);
  
  const handleSaveUsername = () => {
    if (username.trim()) {
      localStorage.setItem('username', username);
      setShowNameInput(false);
      
      // Update the latest score with the username
      const updatedLeaderboard = [...leaderboard];
      if (updatedLeaderboard.length > 0) {
        // Assuming the latest score is at the beginning
        updatedLeaderboard[0].username = username;
        setLeaderboard(updatedLeaderboard);
        localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
      }
    }
  };

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      
      {showNameInput && (
        <div className="username-input-container">
          <p>Congratulations on your score! Please enter your name:</p>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              className="username-input"
            />
            <button onClick={handleSaveUsername} className="save-button">Save</button>
          </div>
        </div>
      )}
      
      {leaderboard.length > 0 ? (
        <div className="scores-table">
          <div className="table-header">
            <div className="rank-cell">Rank</div>
            <div className="name-cell">Name</div>
            <div className="score-cell">Score</div>
            <div className="date-cell">Date</div>
          </div>
          
          {leaderboard.map((entry, index) => (
            <div key={index} className={`table-row ${index === 0 ? 'top-score' : ''}`}>
              <div className="rank-cell">{index + 1}</div>
              <div className="name-cell">{entry.username}</div>
              <div className="score-cell">{entry.percentage}%</div>
              <div className="date-cell">{new Date(entry.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-scores">No scores yet. Be the first to play!</p>
      )}
      
      <div className="leaderboard-buttons">
        <button 
          className="play-again-button"
          onClick={() => onNavigate('quiz')}
        >
          Play Again
        </button>
        
        <button 
          className="home-button"
          onClick={() => onNavigate('start')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;