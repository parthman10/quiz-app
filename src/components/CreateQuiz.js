import React, { useState, useEffect } from 'react';
import '../styles/CreateQuiz.css';

const CreateQuiz = ({ onNavigate }) => {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCategory, setQuizCategory] = useState('general');
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      timeLimit: 20,
      difficulty: 'medium'
    }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Categories for quiz
  const categories = [
    { id: 'general', name: 'General Knowledge' },
    { id: 'science', name: 'Science' },
    { id: 'history', name: 'History' },
    { id: 'geography', name: 'Geography' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'sports', name: 'Sports' },
    { id: 'custom', name: 'Custom' }
  ];

  // Difficulty levels
  const difficultyLevels = [
    { id: 'easy', name: 'Easy', color: 'var(--pastel-green)' },
    { id: 'medium', name: 'Medium', color: 'var(--pastel-yellow)' },
    { id: 'hard', name: 'Hard', color: 'var(--pastel-orange)' }
  ];

  // Add autosave functionality
  useEffect(() => {
    const autosaveData = localStorage.getItem('quizDraft');
    if (autosaveData) {
      try {
        const { title, category, savedQuestions } = JSON.parse(autosaveData);
        setQuizTitle(title || '');
        setQuizCategory(category || 'general');
        if (savedQuestions && savedQuestions.length > 0) {
          setQuestions(savedQuestions);
        }
      } catch (err) {
        console.error('Error loading autosaved data:', err);
      }
    }
  }, []);

  // Autosave draft
  useEffect(() => {
    if (quizTitle || questions.some(q => q.question.trim() !== '')) {
      const draftData = {
        title: quizTitle,
        category: quizCategory,
        savedQuestions: questions
      };
      localStorage.setItem('quizDraft', JSON.stringify(draftData));
    }
  }, [quizTitle, quizCategory, questions]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        timeLimit: 20,
        difficulty: 'medium'
      }
    ]);
    setCurrentStep(questions.length);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
      setCurrentStep(Math.min(currentStep, newQuestions.length - 1));
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex) => {
    if (questions[questionIndex].options.length < 6) {
      const newQuestions = [...questions];
      newQuestions[questionIndex].options.push('');
      setQuestions(newQuestions);
    }
  };

  const removeOption = (questionIndex, optionIndex) => {
    if (questions[questionIndex].options.length > 2) {
      const newQuestions = [...questions];
      newQuestions[questionIndex].options.splice(optionIndex, 1);
      
      // Adjust correctAnswer if needed
      if (newQuestions[questionIndex].correctAnswer === optionIndex) {
        newQuestions[questionIndex].correctAnswer = 0;
      } else if (newQuestions[questionIndex].correctAnswer > optionIndex) {
        newQuestions[questionIndex].correctAnswer--;
      }
      
      setQuestions(newQuestions);
    }
  };

  const clearDraft = () => {
    if (window.confirm('Are you sure you want to clear this draft? All progress will be lost.')) {
      localStorage.removeItem('quizDraft');
      setQuizTitle('');
      setQuizCategory('general');
      setQuestions([
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          timeLimit: 20,
          difficulty: 'medium'
        }
      ]);
      setCurrentStep(0);
    }
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  const handleSubmit = () => {
    // Validate quiz
    if (!quizTitle.trim()) {
      setError('Please enter a quiz title');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setError(`Question ${i + 1} is empty`);
        setCurrentStep(i);
        return;
      }

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setError(`Option ${j + 1} in question ${i + 1} is empty`);
          setCurrentStep(i);
          return;
        }
      }
    }

    setError('');
    setIsSubmitting(true);

    // In a real app, you would send this to a server
    // For now, we'll just save it to localStorage
    try {
      const quizzes = JSON.parse(localStorage.getItem('customQuizzes') || '[]');
      const newQuiz = {
        id: Date.now(),
        title: quizTitle,
        category: quizCategory,
        questions,
        createdAt: new Date().toISOString()
      };
      
      quizzes.push(newQuiz);
      localStorage.setItem('customQuizzes', JSON.stringify(quizzes));
      
      // Clear draft after successful submission
      localStorage.removeItem('quizDraft');
      
      setSuccess('Quiz created successfully!');
      setIsSubmitting(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        setSuccess('');
        setQuizTitle('');
        setQuizCategory('general');
        setQuestions([
          {
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
            timeLimit: 20,
            difficulty: 'medium'
          }
        ]);
        setCurrentStep(0);
      }, 2000);
    } catch (err) {
      setError('Failed to save quiz. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-quiz-container">
      <h2 className="create-title">Create Your Own Quiz</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="quiz-form">
        <div className="form-header">
          <div className="form-group">
            <label htmlFor="quiz-title">Quiz Title</label>
            <input
              type="text"
              id="quiz-title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter a title for your quiz"
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="quiz-category">Category</label>
            <select
              id="quiz-category"
              value={quizCategory}
              onChange={(e) => setQuizCategory(e.target.value)}
              className="form-control"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mode-toggle">
          <button 
            className={`mode-button ${!previewMode ? 'active' : ''}`}
            onClick={() => setPreviewMode(false)}
          >
            Edit
          </button>
          <button 
            className={`mode-button ${previewMode ? 'active' : ''}`}
            onClick={togglePreviewMode}
          >
            Preview
          </button>
        </div>
        
        {!previewMode ? (
          <>
            <div className="questions-navigation">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`question-nav-button ${currentStep === index ? 'active' : ''}`}
                  onClick={() => setCurrentStep(index)}
                >
                  {index + 1}
                </button>
              ))}
              <button className="add-question-button" onClick={addQuestion}>+</button>
            </div>
            
            <div className="question-editor">
              <h3>Question {currentStep + 1}</h3>
              
              <div className="form-group">
                <label htmlFor="question-text">Question</label>
                <input
                  type="text"
                  id="question-text"
                  value={questions[currentStep].question}
                  onChange={(e) => updateQuestion(currentStep, 'question', e.target.value)}
                  placeholder="Enter your question"
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Difficulty</label>
                <div className="difficulty-selector">
                  {difficultyLevels.map(level => (
                    <button
                      key={level.id}
                      className={`difficulty-button ${questions[currentStep].difficulty === level.id ? 'active' : ''}`}
                      style={{ backgroundColor: level.color }}
                      onClick={() => updateQuestion(currentStep, 'difficulty', level.id)}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <div className="options-header">
                  <label>Options</label>
                  <button 
                    className="add-option-button"
                    onClick={() => addOption(currentStep)}
                    disabled={questions[currentStep].options.length >= 6}
                  >
                    Add Option
                  </button>
                </div>
                {questions[currentStep].options.map((option, index) => (
                  <div key={index} className="option-input-group">
                    <input
                      type="radio"
                      id={`correct-${index}`}
                      name={`correct-answer-${currentStep}`}
                      checked={questions[currentStep].correctAnswer === index}
                      onChange={() => updateQuestion(currentStep, 'correctAnswer', index)}
                      className="correct-radio"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(currentStep, index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="form-control option-input"
                    />
                    {questions[currentStep].options.length > 2 && (
                      <button 
                        className="remove-option-button"
                        onClick={() => removeOption(currentStep, index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="form-group">
                <label htmlFor="time-limit">Time Limit (seconds)</label>
                <input
                  type="number"
                  id="time-limit"
                  value={questions[currentStep].timeLimit}
                  onChange={(e) => updateQuestion(currentStep, 'timeLimit', parseInt(e.target.value) || 10)}
                  min="5"
                  max="60"
                  className="form-control time-input"
                />
              </div>
              
              {questions.length > 1 && (
                <button
                  className="remove-question-button"
                  onClick={() => removeQuestion(currentStep)}
                >
                  Remove Question
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="quiz-preview">
            <h3 className="preview-title">Quiz Preview: {quizTitle || "Untitled Quiz"}</h3>
            <div className="preview-category">Category: {categories.find(c => c.id === quizCategory)?.name}</div>
            
            <div className="preview-questions">
              {questions.map((q, index) => (
                <div key={index} className="preview-question-card">
                  <div className="preview-question-header">
                    <span className="preview-question-number">Question {index + 1}</span>
                    <span className={`preview-difficulty ${q.difficulty}`}>
                      {difficultyLevels.find(d => d.id === q.difficulty)?.name}
                    </span>
                  </div>
                  <div className="preview-question-text">{q.question || "Empty question"}</div>
                  <div className="preview-options">
                    {q.options.map((option, optIndex) => (
                      <div 
                        key={optIndex} 
                        className={`preview-option ${q.correctAnswer === optIndex ? 'correct' : ''}`}
                      >
                        {option || `Option ${optIndex + 1} (empty)`}
                        {q.correctAnswer === optIndex && <span className="correct-indicator">✓</span>}
                      </div>
                    ))}
                  </div>
                  <div className="preview-time-limit">Time: {q.timeLimit} seconds</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="form-actions">
          <div className="secondary-actions">
            <button
              className="clear-button"
              onClick={clearDraft}
            >
              Clear Draft
            </button>
            <button
              className="cancel-button"
              onClick={() => onNavigate('start')}
            >
              Cancel
            </button>
          </div>
          
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Create Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;