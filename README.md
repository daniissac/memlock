# MemLock - Memorable & Secure Passwords

MemLock is a simple, lightweight web application that generates passwords that are both memorable and secure. It's designed to help create strong master passwords for password managers and other high-security applications where you need to remember the password.

## 🔐 [Try MemLock](https://daniissac.com/memlock)

<img src="icon.svg" width="150" height="150" />

## Features

- **Three Password Generation Methods**:
  - **Word-Based**: Creates passwords using common words with special characters and numbers for better memorability
  - **Pattern-Based**: Generates more complex passwords for higher security
  - **Passphrase**: Creates multi-word phrases that are easy to remember but hard to crack

- **Customization Options**:
  - Adjust password length
  - Include/exclude numbers
  - Include/exclude symbols
  - Use mixed case

- **User-Friendly Features**:
  - Password strength indicator
  - One-click copy to clipboard
  - Recently generated passwords list
  - Mobile-responsive design

## Why MemLock?

Most people use password managers to store their credentials, but often use weak master passwords to protect them. MemLock solves this problem by creating master passwords that are:

1. **Strong enough** to resist brute force and dictionary attacks
2. **Memorable enough** that you don't need to write them down
3. **Unique** to reduce the risk of credential stuffing attacks

## How to Use

1. Select your preferred password type
2. Adjust the length and character options
3. Click "Generate Password"
4. Use the copy button to copy your new password
5. Recently generated passwords are saved temporarily for convenience

## Installation

No installation required! MemLock runs entirely in your browser.

To host it yourself:

1. Clone this repository:
   ```
   git clone https://github.com/daniissac/memlock.git
   ```

2. Open `index.html` in your browser, or host it on any static hosting service like GitHub Pages.

## Privacy & Security

MemLock generates all passwords locally in your browser. No passwords are ever sent to any server or stored permanently. The application uses:

- No external APIs
- No cookies
- No analytics
- No data collection

Recently generated passwords are stored temporarily in your browser's memory and are cleared when you close the tab or browser.

## Security Tips

- Always use different passwords for different accounts
- Regularly update important passwords
- Consider using a reputable password manager alongside MemLock
- For critical accounts, enable two-factor authentication when available

## How MemLock Creates Strong Passwords

### Word-Based Passwords
Combines recognizable words with numbers and special characters to create passwords that are easier to remember but still secure. Example: `Tiger-Flame42!`

### Pattern-Based Passwords
Creates more complex random strings with a mix of characters for maximum security. Example: `j7K#p2Zt@xL9`

### Passphrases
Uses multiple words separated by special characters, which are both highly secure and memorable. Example: `Ocean.Candle.Zebra.123`

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks or libraries)

## License

This project is licensed under the MIT License - see the LICENSE file for details.



## Contact

If you have any questions or suggestions, please open an issue on GitHub.

---

Made with ❤️ by Dani Issac
