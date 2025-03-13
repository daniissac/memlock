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
    const commonWords = ['apple', 'beach', 'cloud', 'dream', 'earth', 'flame', 'grape', 'heart', 'igloo', 'juice', 'kiwi', 'lemon', 'mango', 'night', 'ocean', 'piano', 'quilt', 'river', 'sugar', 'tiger', 'umbrella', 'violet', 'water', 'xylophone', 'yacht', 'zebra'];

    // Store recent passwords (max 5)
    const recentPasswords = [];
    const maxRecentPasswords = 5;

    // Initial values
    lengthValue.textContent = passwordLength.value;

    passwordLength.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    passwordType.addEventListener('change', updateUIBasedOnPasswordType);
    generateButton.addEventListener('click', generatePassword);
    copyButton.addEventListener('click', copyPassword);
    updateUIBasedOnPasswordType();

    function updateUIBasedOnPasswordType() {
        const type = passwordType.value;
        if (type === 'wordBased') {
            passwordLength.min = "10";
            passwordLength.max = "20";
        } else if (type === 'patternBased') {
            passwordLength.min = "12";
            passwordLength.max = "30";
        } else if (type === 'passphrases') {
            passwordLength.min = "15";
            passwordLength.max = "40";
        }
        passwordLength.value = Math.max(passwordLength.min, Math.min(passwordLength.value, passwordLength.max));
        lengthValue.textContent = passwordLength.value;
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
        
        if (passwordOutput) {
            passwordOutput.value = password;
        }
        
        ratePasswordStrength(password);
        addToRecentPasswords(password);
    }

    function ratePasswordStrength(password) {
        if (!strengthIndicator || !strengthText) return;

        let strength = 0;
        if (password.length >= 8) strength += 10;
        if (password.length >= 12) strength += 10;
        if (password.length >= 16) strength += 10;
        if (password.length >= 20) strength += 10;
        if (/[a-z]/.test(password)) strength += 10;
        if (/[A-Z]/.test(password)) strength += 15;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
        strength = Math.min(strength, 100);
        strengthIndicator.style.width = `${strength}%`;

        const styles = getComputedStyle(document.documentElement);
        strengthIndicator.style.backgroundColor = strength < 40 ? styles.getPropertyValue('--danger') : strength < 70 ? styles.getPropertyValue('--warning') : styles.getPropertyValue('--success');
        strengthText.textContent = strength < 40 ? "Weak" : strength < 70 ? "Medium" : "Strong";
    }

    function copyPassword() {
        if (passwordOutput && passwordOutput.value) {
            navigator.clipboard.writeText(passwordOutput.value).then(showToast).catch(err => console.error('Failed to copy:', err));
        }
    }

    function showToast() {
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }
    }

    function addToRecentPasswords(password) {
        if (recentPasswords.includes(password)) return;
        recentPasswords.unshift(password);
        if (recentPasswords.length > maxRecentPasswords) recentPasswords.pop();
        renderRecentPasswords();
    }

    function renderRecentPasswords() {
        if (!recentPasswordsList) return;
        recentPasswordsList.innerHTML = '';
        recentPasswords.forEach(password => {
            const li = document.createElement('li');
            li.textContent = password;
            const copyBtn = document.createElement('button');
            copyBtn.innerText = "Copy";
            copyBtn.addEventListener('click', () => navigator.clipboard.writeText(password).then(showToast));
            li.appendChild(copyBtn);
            recentPasswordsList.appendChild(li);
        });
    }
});
