document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const setupScreen = document.getElementById('setup-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const weekOptionsContainer = document.getElementById('week-options');
    const timeLimitInput = document.getElementById('time-limit');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionCounter = document.getElementById('question-counter');
    const timerDisplay = document.getElementById('timer');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const scoreDisplay = document.getElementById('score');
    const timeTakenDisplay = document.getElementById('time-taken');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    const setupError = document.getElementById('setup-error');
    const quizError = document.getElementById('quiz-error');
    const detailedResultsContainer = document.getElementById('detailed-results');
    const themeToggle = document.querySelector('.theme-toggle');
    const progressBar = document.querySelector('.progress-bar');

    // State Variables
    let allQuestions = {};
    let currentQuizQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;
    let timeRemaining = 0;
    let totalTime = 0;
    let quizActive = false;
    let quizResultsDetail = []; // Array to store details for results screen
    let darkModeEnabled = localStorage.getItem('darkMode') === 'true';

    // Background Canvas Effect
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = 0;
    let mouseY = 0;
    let particles = [];
    
    // Initialize the background effect
    function initBackgroundEffect() {
        // Set canvas size to window size
        resizeCanvas();
        
        // Create initial particles
        createParticles(50);
        
        // Start animation
        animateParticles();
        
        // Add event listeners
        window.addEventListener('resize', resizeCanvas);
        document.addEventListener('mousemove', updateMousePosition);
        document.addEventListener('touchmove', handleTouchMove);
    }
    
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        // Recreate particles when canvas size changes
        createParticles(50);
    }
    
    function updateMousePosition(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    
    function handleTouchMove(e) {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    }
    
    function createParticles(count) {
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 5 + 2,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                color: darkModeEnabled ? 
                    `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 155 + 100}, 0.5)` :
                    `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 200 + 55}, 0.5)`
            });
        }
    }
    
    function animateParticles() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw particles
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > height) particle.speedY *= -1;
            
            // Change direction based on mouse position
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                const angle = Math.atan2(dy, dx);
                const influence = (200 - distance) / 200; // Stronger influence when closer
                
                particle.speedX += Math.cos(angle) * influence * 0.05;
                particle.speedY += Math.sin(angle) * influence * 0.05;
                
                // Limit speed
                const maxSpeed = 3;
                const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                if (speed > maxSpeed) {
                    particle.speedX = (particle.speedX / speed) * maxSpeed;
                    particle.speedY = (particle.speedY / speed) * maxSpeed;
                }
            }
            
            // Draw
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
        
        // Draw lines between close particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = darkModeEnabled ? 
                        `rgba(200, 200, 255, ${(100 - distance) / 500})` :
                        `rgba(100, 100, 200, ${(100 - distance) / 500})`;
                    ctx.stroke();
                }
            }
        }
        
        // Draw glow effect around mouse
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 150);
        if (darkModeEnabled) {
            gradient.addColorStop(0, 'rgba(102, 178, 255, 0.4)');
            gradient.addColorStop(0.5, 'rgba(71, 209, 71, 0.2)');
        } else {
            gradient.addColorStop(0, 'rgba(0, 123, 255, 0.3)');
            gradient.addColorStop(0.5, 'rgba(40, 167, 69, 0.1)');
        }
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(mouseX, mouseY, 150, 0, Math.PI * 2);
        ctx.fill();
        
        // Continue animation
        requestAnimationFrame(animateParticles);
    }
    
    // Update particle colors when theme changes
    function updateParticleColors() {
        particles.forEach(particle => {
            particle.color = darkModeEnabled ? 
                `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 155 + 100}, 0.5)` :
                `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 200 + 55}, 0.5)`;
        });
    }
    
    // Update toggle theme function to also update particle colors
    const originalToggleTheme = toggleTheme;
    toggleTheme = function() {
        originalToggleTheme();
        updateParticleColors();
    };
    
    // Initialize the background effect
    initBackgroundEffect();

    // Set initial theme based on local storage or system preference
    function initializeTheme() {
        // Check if user has a stored preference
        if (localStorage.getItem('darkMode') !== null) {
            darkModeEnabled = localStorage.getItem('darkMode') === 'true';
        } else {
            // Check user's system preference
            darkModeEnabled = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        
        updateTheme();
    }

    // Update the theme based on the current state
    function updateTheme() {
        document.documentElement.setAttribute('data-theme', darkModeEnabled ? 'dark' : 'light');
    }

    // Toggle dark mode
    function toggleTheme() {
        darkModeEnabled = !darkModeEnabled;
        localStorage.setItem('darkMode', darkModeEnabled);
        updateTheme();
    }

    // Add event listener for theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // --- Utility Functions ---

    // Fisher-Yates (Knuth) Shuffle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // --- Loading and Setup ---

    async function loadQuestions() {
        try {
            const response = await fetch('questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allQuestions = await response.json();
            populateWeekOptions();
        } catch (error) {
            console.error("Failed to load questions:", error);
            setupError.textContent = "Error loading questions. Please check the console or refresh.";
            startQuizBtn.disabled = true;
        }
    }

    function populateWeekOptions() {
        weekOptionsContainer.innerHTML = ''; // Clear previous options
        const weeks = Object.keys(allQuestions);
        weeks.forEach(weekKey => {
            const weekNumber = weekKey.replace('week', '');
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = weekKey;
            checkbox.id = `week-${weekNumber}`;
            label.htmlFor = `week-${weekNumber}`;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` Week ${weekNumber}`));
            weekOptionsContainer.appendChild(label);
        });
    }

    // --- Quiz Logic ---

    function startQuiz() {
        setupError.textContent = ''; // Clear previous errors
        const selectedWeeks = Array.from(weekOptionsContainer.querySelectorAll('input[type="checkbox"]:checked'))
                                   .map(cb => cb.value);

        if (selectedWeeks.length === 0) {
            setupError.textContent = "Please select at least one week.";
            return;
        }

        const timeLimitMinutes = parseInt(timeLimitInput.value, 10);
        if (isNaN(timeLimitMinutes) || timeLimitMinutes <= 0) {
            setupError.textContent = "Please enter a valid time limit (greater than 0).";
            return;
        }

        // Prepare questions
        currentQuizQuestions = [];
        selectedWeeks.forEach(weekKey => {
            if (allQuestions[weekKey]) {
                currentQuizQuestions.push(...allQuestions[weekKey]);
            }
        });

        if (currentQuizQuestions.length === 0) {
             setupError.textContent = "No questions found for the selected weeks.";
             return;
        }

        shuffleArray(currentQuizQuestions); // Shuffle questions for the quiz
        currentQuestionIndex = 0;
        score = 0;
        totalTime = timeLimitMinutes * 60;
        timeRemaining = totalTime;
        quizActive = true;
        quizResultsDetail = []; // Clear previous results detail

        // Reset progress bar
        progressBar.style.width = '0%';

        // Switch screens
        setupScreen.classList.add('hidden');
        resultsScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');

        displayQuestion();
        startTimer();
    }

    function displayQuestion() {
        quizError.textContent = ''; // Clear previous error
        if (currentQuestionIndex >= currentQuizQuestions.length || !quizActive) {
            endQuiz();
            return;
        }

        const questionData = currentQuizQuestions[currentQuestionIndex];
        questionText.textContent = questionData.question;
        optionsContainer.innerHTML = ''; // Clear previous options

        questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuizQuestions.length}`;
        nextQuestionBtn.textContent = (currentQuestionIndex === currentQuizQuestions.length - 1) ? "Finish Quiz" : "Next Question";
        nextQuestionBtn.disabled = true; // Disable until an option is selected

        // Update progress bar
        const progressPercentage = ((currentQuestionIndex) / currentQuizQuestions.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Shuffle options
        const shuffledOptions = shuffleArray([...questionData.options]);

        shuffledOptions.forEach(optionText => {
            const optionElement = document.createElement('button');
            optionElement.classList.add('option');
            optionElement.textContent = optionText;
            // Store correct answer data directly in the element for easier access during selection
            optionElement.dataset.correctAnswer = questionData.answer;
            optionElement.onclick = () => selectOption(optionElement, optionText === questionData.answer);
            optionsContainer.appendChild(optionElement);
        });
    }

    function selectOption(selectedButton, isCorrect) {
        if (!quizActive) return; // Don't process clicks after quiz ends

        // Disable further clicks on options for this question
        const allOptions = optionsContainer.querySelectorAll('.option');
        allOptions.forEach(btn => {
            btn.onclick = null; // Remove click listener
            btn.style.cursor = 'default'; // Change cursor
            // Highlight correct answer on all options
            if (btn.textContent === selectedButton.dataset.correctAnswer) {
                btn.classList.add('correct');
            }
        });

        // Record the result for this question
        const currentQuestionData = currentQuizQuestions[currentQuestionIndex];
        quizResultsDetail.push({
            question: currentQuestionData.question,
            userAnswer: selectedButton.textContent,
            correctAnswer: selectedButton.dataset.correctAnswer, // Get correct answer from dataset
            isCorrect: isCorrect
        });

        // Mark selected button (visually)
        if (!isCorrect) { // Only add 'incorrect' class if the user was wrong
            selectedButton.classList.add('incorrect');
        }
        // The correct answer is always highlighted with 'correct' class above

        if (isCorrect) {
            score++;
        }

        nextQuestionBtn.disabled = false; // Enable Next button
    }

    function nextQuestion() {
        if (!quizActive) return; // Prevent accidental clicks

        // Check if the current question was answered before moving on
        const currentQuestionData = currentQuizQuestions[currentQuestionIndex];
        const resultRecorded = quizResultsDetail.some(r => r.question === currentQuestionData.question);

        if (!resultRecorded) {
            // This case should ideally not happen if the Next button is disabled until an option is selected
            quizError.textContent = "Please select an option before moving to the next question.";
            return; // Prevent moving on
        }

        currentQuestionIndex++;
        displayQuestion();
    }

    function startTimer() {
        timerDisplay.textContent = `Time Left: ${formatTime(timeRemaining)}`;
        timerDisplay.classList.remove('timer-warning');
        clearInterval(timerInterval); // Clear any existing interval

        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = `Time Left: ${formatTime(timeRemaining)}`;

            // Add warning style when less than 20% time remains
            if (timeRemaining <= totalTime * 0.2) {
                timerDisplay.classList.add('timer-warning');
            }

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                quizError.textContent = "Time's up!";
                endQuiz(true); // Indicate timeout
            }
        }, 1000);
    }

    function endQuiz(timedOut = false) {
        if (!quizActive) return; // Prevent multiple calls
        quizActive = false; // Mark quiz as inactive

        clearInterval(timerInterval);

        // Disable option interaction immediately
        const allOptions = optionsContainer.querySelectorAll('.option');
        allOptions.forEach(btn => {
            btn.onclick = null;
            btn.style.cursor = 'default';
        });
        nextQuestionBtn.disabled = true; // Disable next button

        // Update progress bar to 100% at end
        progressBar.style.width = '100%';

        const timeTaken = totalTime - timeRemaining;
        scoreDisplay.textContent = `Your Score: ${score} out of ${currentQuizQuestions.length}`;
        timeTakenDisplay.textContent = `Time Taken: ${formatTime(timeTaken)}`;
        if (timedOut) {
            timeTakenDisplay.textContent += " (Time Limit Reached)";
        }

        // Display detailed results BEFORE switching screen
        displayDetailedResults();

        // Switch screens after a brief delay if timed out, to show the message
        setTimeout(() => {
            quizScreen.classList.add('hidden');
            resultsScreen.classList.remove('hidden');
        }, timedOut ? 1500 : 0); // Delay only if timed out
    }

    function displayDetailedResults() {
        detailedResultsContainer.innerHTML = '<h3>Answer Summary</h3>'; // Clear previous results and add heading

        if (currentQuizQuestions.length === 0) {
            detailedResultsContainer.innerHTML += '<p>No questions were available for the quiz.</p>';
            return;
        }

        currentQuizQuestions.forEach((questionData, index) => {
            // Find the result for this question in our recorded details
            const result = quizResultsDetail.find(r => r.question === questionData.question);

            const questionDiv = document.createElement('div');
            questionDiv.classList.add('result-question'); // Add base class

            const questionHeading = document.createElement('p');
            questionHeading.innerHTML = `<strong>Q${index + 1}:</strong> ${questionData.question}`;
            questionDiv.appendChild(questionHeading);

            const userAnswerPara = document.createElement('p');
            const correctAnswerPara = document.createElement('p');

            if (result) {
                // Question was answered
                userAnswerPara.innerHTML = `Your Answer: <span class="${result.isCorrect ? 'correct-answer-text' : 'incorrect-answer-text'}">${result.userAnswer}</span>`;
                correctAnswerPara.innerHTML = `Correct Answer: <span class="correct-answer-text">${result.correctAnswer}</span>`;

                if (!result.isCorrect) {
                    questionDiv.classList.add('incorrectly-answered'); // Add class for styling incorrect
                } else {
                    questionDiv.classList.add('correctly-answered'); // Add class for styling correct
                }

            } else {
                // Question was not answered (e.g., due to time out)
                userAnswerPara.innerHTML = 'Your Answer: <span class="unanswered-text">Unanswered</span>';
                correctAnswerPara.innerHTML = `Correct Answer: <span class="correct-answer-text">${questionData.answer}</span>`;
                questionDiv.classList.add('unanswered-question'); // Add class for styling unanswered
            }

            questionDiv.appendChild(userAnswerPara);
            questionDiv.appendChild(correctAnswerPara);

            detailedResultsContainer.appendChild(questionDiv);
        });
    }

    function restartQuiz() {
        resultsScreen.classList.add('hidden');
        setupScreen.classList.remove('hidden');
        setupError.textContent = '';
        quizError.textContent = '';
        detailedResultsContainer.innerHTML = ''; // Clear detailed results display
        // Reset quiz state variables
        currentQuizQuestions = [];
        currentQuestionIndex = 0;
        score = 0;
        clearInterval(timerInterval);
        timeRemaining = 0;
        totalTime = 0;
        quizActive = false;
        quizResultsDetail = [];
        populateWeekOptions();
    }


    // --- Event Listeners ---
    startQuizBtn.addEventListener('click', startQuiz);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    restartQuizBtn.addEventListener('click', restartQuiz);


    // --- Initial Load ---
    loadQuestions();
});