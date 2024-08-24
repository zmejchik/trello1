import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import RegisterFormStyles from './Registerstyle';

function Register(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [messagePaswordsMatch, setMessagePaswordsMatch] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // в залежності від складності паролю змінюємо passwordStrength від 0 до 3
    // 0 слабий 3 максимальний треба ще кольори додати змінювані зараз заглушка
    const pwd = e.target.value;
    setPassword(pwd);
    // перевірка паролю на складність
    switch (pwd.length) {
      case 0:
        setPasswordStrength(0);
        setIsButtonDisabled(true);
        break;
      case 1:
        setPasswordStrength(1);
        setIsButtonDisabled(false);
        break;
      case 2:
        setPasswordStrength(2);
        setIsButtonDisabled(false);
        break;
      case 3:
        setPasswordStrength(3);
        setIsButtonDisabled(false);
        break;
      case 4:
        setPasswordStrength(4);
        setIsButtonDisabled(false);
        break;
      default:
        setPasswordStrength(5);
        setIsButtonDisabled(false);
        break;
    }
  };
  const handleRepeatedPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // в залежності від складності паролю змінюємо passwordStrength від 0 до 3
    // 0 слабий 3 максимальний треба ще кольори додати змінювані зараз заглушка
    const repeatedpwd = e.target.value;
    setRepeatedPassword(repeatedpwd);
    if (repeatedpwd !== password) {
      setMessagePaswordsMatch('Паролі не збігаються');
    } else {
      setMessagePaswordsMatch('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // валідація пошти
    const eml = e.target.value;
    setEmail(eml);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (emailRegex.test(eml)) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Add form registration on the server side
  };

  return (
    <Box sx={RegisterFormStyles.container}>
      <Box component="form" onSubmit={handleSubmit} sx={RegisterFormStyles.formContainer}>
        <Typography variant="h4" gutterBottom>
          Реєстрація
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={handleEmailChange}
          sx={RegisterFormStyles.textField}
        />
        <TextField
          label="Пароль"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={handlePasswordChange}
          helperText="В паролі має бути не менше 6 символів"
          sx={RegisterFormStyles.textField}
        />
        <Box sx={RegisterFormStyles.passwordStrengthBar}>
          <Box className={passwordStrength > 1 ? 'active' : ''} />
          <Box className={passwordStrength > 2 ? 'active' : ''} />
          <Box className={passwordStrength > 3 ? 'active' : ''} />
          <Box className={passwordStrength > 4 ? 'active' : ''} />
        </Box>
        <TextField
          label="Повторіть пароль"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={repeatedPassword}
          onChange={handleRepeatedPasswordChange}
          helperText={messagePaswordsMatch}
          sx={RegisterFormStyles.textField}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isButtonDisabled}
          sx={RegisterFormStyles.submitButton}
          fullWidth
        >
          Зареєструватись
        </Button>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Вже є аккаунт?{' '}
          <Link to="/login/" style={RegisterFormStyles.linkText}>
            Увійти
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Register;
