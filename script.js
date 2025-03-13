document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const passwordOutput = document.getElementById('passwordOutput');
    const generateButton = document.getElementById('generateButton');
    const copyButton = document.getElementById('copyButton');
    const passwordType = document.getElementById('passwordType');
    const passwordLength = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    const useNumbers = document.getElementById('useNumbers');
    const useSymbols = document.getElementById('useSymbols');
    const useMixedCase = document.getElementById('useMixedCase');
    const strengthIndicator = document.getElementById('strengthIndicator');
    const strengthText = document.getElementById('strengthText');
    const recentPasswordsList = document.getElementById('recentPasswords');
    const toast = document.getElementById('toast');

    // Common words for word-based passwords
    const commonWords = [
        'apple', 'beach', 'cloud', 'dream', 'earth', 'flame', 'grape', 'heart',
        'igloo', 'juice', 'kiwi', 'lemon', 'mango', 'night', 'ocean', 'piano',
        'quilt', 'river', 'sugar', 'tiger', 'umbrella', 'violet', 'water', 'xylophone',
        'yacht', 'zebra', 'anchor', 'basket', 'candle', 'dolphin', 'eagle', 'forest',
        'garden', 'hammer', 'island', 'jacket', 'kettle', 'lantern', 'mountain', 'needle',
        'orange', 'penguin', 'queen', 'rabbit', 'sunset', 'turtle', 'unicorn', 'volcano',
        'window', 'yellow', 'zephyr', 'autumn', 'blossom', 'canyon', 'diamond', 'emerald'
    ];

    // Store recent passwords (max 5)
    const recentPasswords = [];
    const maxRecentPasswords = 5;

    // Initial values
    lengthValue.textContent = passwordLength.value;

    // Update length value when slider changes
    passwordLength.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    // Password Type change
    passwordType.addEventListener('change', function() {
        updateUIBasedOnPasswordType();
    });

    // Generate password
    generateButton.addEventListener('click', generatePassword);

    // Copy password
    copyButton.addEventListener('click', copyPassword);

    // Initialize UI
    updateUIBasedOnPasswordType();

    // Functions
    function updateUIBasedOnPasswordType() {
        const type = passwordType.value;
        
        // Adjust slider min/max based on password type
        if (type === 'wordBased') {
            passwordLength.min = "10";
            passwordLength.max = "20";
            if (parseInt(passwordLength.value) > 20) {
                passwordLength.value = "20";
                lengthValue.textContent = "20";
            }
        } else if (type === 'patternBased') {
            passwordLength.min = "12";
            passwordLength.max = "30";
        } else if (type === 'passphrases') {
            passwordLength.min = "15";
            passwordLength.max = "40";
            if (parseInt(passwordLength.value) < 15) {
                passwordLength.value = "15";
                lengthValue.textContent = "15";
            }
        }
    }

    function generatePassword() {
        const type = passwordType.value;
        const length = parseInt(passwordLength.value);
        const includeNumbers = useNumbers.checked;
        const includeSymbols = useSymbols.checked;
        const includeMixedCase = useMixedCase.checked;
        
        let password = '';
        
        switch(type) {
            case 'wordBased':
                password = generateWordBasedPassword(length, includeNumbers, includeSymbols, includeMixedCase);
                break;
            case 'patternBased':
                password = generatePatternBasedPassword(length, includeNumbers, includeSymbols, includeMixedCase);
                break;
            case 'passphrases':
                password = generatePassphrase(length, includeNumbers, includeSymbols, includeMixedCase);
                break;
        }
        
        // Trim password if it exceeds the requested length
        if (password.length > length) {
            password = password.substring(0, length);
        }
        
        // Update display
        passwordOutput.value = password;
        
        // Rate password strength
        ratePasswordStrength(password);
        
        // Add to recent passwords
        addToRecentPasswords(password);
    }

    function generateWordBasedPassword(targetLength, includeNumbers, includeSymbols, includeMixedCase) {
        // Pick 1-3 random words based on desired length
        let words = [];
        let remainingLength = targetLength;
        
        // We'll use at least one word, maybe more if we have space
        while (remainingLength > 3 && words.length < 3) {
            const randomWord = commonWords[Math.floor(Math.random() * commonWords.length)];
            
            // Only add if it fits within our target length
            if (randomWord.length <= remainingLength - (words.length > 0 ? 1 : 0)) {
                if (includeMixedCase) {
                    // Capitalize first letter of some words
                    words.push(Math.random() > 0.5 
                        ? randomWord.charAt(0).toUpperCase() + randomWord.slice(1) 
                        : randomWord);
                } else {
                    words.push(randomWord);
                }
                
                remainingLength -= randomWord.length;
                // Account for separator
                if (words.length > 0) remainingLength -= 1;
            } else {
                // If we can't fit another word, break
                break;
            }
        }
        
        // Join words with separators
        let password = words.join('-');
        
        // Add numbers if requested and we have room
        if (includeNumbers && remainingLength > 0) {
            const numDigits = Math.min(remainingLength, 4);
            for (let i = 0; i < numDigits; i++) {
                password += Math.floor(Math.random() * 10);
            }
            remainingLength -= numDigits;
        }
        
        // Add symbols if requested and we have room
        if (includeSymbols && remainingLength > 0) {
            const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';
            const numSymbols = Math.min(remainingLength, 2);
            for (let i = 0; i < numSymbols; i++) {
                password += symbols.charAt(Math.floor(Math.random() * symbols.length));
            }
        }
        
        return password;
    }

    function generatePatternBasedPassword(length, includeNumbers, includeSymbols, includeMixedCase) {
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
        
        let allChars = lowercaseChars;
        if (includeMixedCase) allChars += uppercaseChars;
        if (includeNumbers) allChars += numberChars;
        if (includeSymbols) allChars += symbolChars;
        
        // Ensure we have at least one character from each requested set
        let password = '';
        
        if (includeMixedCase) {
            password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
        }
        
        password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
        
        if (includeNumbers) {
            password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
        }
        
        if (includeSymbols) {
            password += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
        }
        
        // Fill remaining length with random characters
        while (password.length < length) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }
        
        // Shuffle the characters to make pattern less predictable
        return shuffleString(password);
    }

    function generatePassphrase(targetLength, includeNumbers, includeSymbols, includeMixedCase) {
        // Select 3-5 random words
        const numWords = Math.floor(Math.random() * 3) + 3; // 3-5 words
        const words = [];
        
        for (let i = 0; i < numWords; i++) {
            let word = commonWords[Math.floor(Math.random() * commonWords.length)];
            
            // Apply mixed case if requested
            if (includeMixedCase) {
                if (i === 0 || Math.random() > 0.5) {
                    word = word.charAt(0).toUpperCase() + word.slice(1);
                }
            }
            
            words.push(word);
        }
        
        // Join with separator
        let separators = ['-', '_', '.'];
        // Add symbols to separators if requested
        if (includeSymbols) {
            separators = separators.concat(['!', '@', '#', '$', '%', '&']);
        }
        
        const separator = separators[Math.floor(Math.random() * separators.length)];
        let passphrase = words.join(separator);
        
        // Add numbers if requested
        if (includeNumbers) {
            // Add 2-4 random digits at the end
            const numDigits = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < numDigits; i++) {
                passphrase += Math.floor(Math.random() * 10);
            }
        }
        
        return passphrase;
    }

    function shuffleString(string) {
        const array = string.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    function ratePasswordStrength(password) {
        // Calculate password strength
        let strength = 0;
        
        // Length
        if (password.length >= 8) strength += 10;
        if (password.length >= 12) strength += 10;
        if (password.length >= 16) strength += 10;
        if (password.length >= 20) strength += 10;
        
        // Character diversity
        if (/[a-z]/.test(password)) strength += 10;
        if (/[A-Z]/.test(password)) strength += 15;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
        
        // Entropy-like metrics
        const uniqueChars = new Set(password.split('')).size;
        strength += (uniqueChars / password.length) * 20;
        
        // Words vs random
        const wordCount = (password.match(/[a-zA-Z]{3,}/g) || []).length;
        if (wordCount > 0) strength += Math.min(wordCount * 5, 20);
        
        // Cap strength at 100
        strength = Math.min(strength, 100);
        
        // Update UI
        strengthIndicator.style.width = `${strength}%`;
        
        if (strength < 40) {
            strengthIndicator.style.backgroundColor = var(--danger);
            strengthText.textContent = "Weak";
        } else if (strength < 70) {
            strengthIndicator.style.backgroundColor = var(--warning);
            strengthText.textContent = "Medium";
        } else {
            strengthIndicator.style.backgroundColor = var(--success);
            strengthText.textContent = "Strong";
        }
    }

    function copyPassword() {
        if (passwordOutput.value) {
            navigator.clipboard.writeText(passwordOutput.value)
                .then(() => {
                    showToast();
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        }
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    function addToRecentPasswords(password) {
        // Don't add if it's already in the list
        if (recentPasswords.includes(password)) return;
        
        // Add to beginning of array
        recentPasswords.unshift(password);
        
        // Remove oldest if we exceed max
        if (recentPasswords.length > maxRecentPasswords) {
            recentPasswords.pop();
        }
        
        // Update UI
        renderRecentPasswords();
    }

    function renderRecentPasswords() {
        recentPasswordsList.innerHTML = '';
        
        recentPasswords.forEach(password => {
            const li = document.createElement('li');
            li.textContent = password;
            
            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            copyBtn.title = "Copy to clipboard";
            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(password)
                    .then(() => {
                        showToast();
                    });
            });
            
            li.appendChild(copyBtn);
            recentPasswordsList.appendChild(li);
        });
    }
});
