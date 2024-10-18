import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import zxcvbn from 'zxcvbn';
import RegisterFormStyles from './Registerstyle';
import api from '../../api/request';

function Register(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [messagePaswordsMatch, setMessagePaswordsMatch] = useState('');
  const [messageCorectEmail, setMessageCorectEmail] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isCorectEmail, setIsCorectEmail] = useState(false);
  const [isCorectPaswords, setIsCorectPaswords] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCorectEmail && isCorectPaswords && password.length >= 8) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [isCorectEmail, isCorectPaswords]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // в залежності від складності паролю змінюємо passwordStrength від 0 до 3
    // 0 слабий 3 максимальний треба ще кольори додати змінювані зараз заглушка
    const pwd = e.target.value;
    setPassword(pwd);
    if (pwd.length < 8) {
      setIsButtonDisabled(true);
      setPasswordStrength(0);
    } else {
      const { score } = zxcvbn(password);
      setPasswordStrength(score);
    }
  };

  const getPasswordStrengthText = (levelPassword: number): string => {
    switch (levelPassword) {
      case 0:
        return 'Слабкий пароль';
      case 1:
        return 'Середній пароль';
      case 2:
        return 'Сильний пароль';
      case 3:
        return 'Надійний пароль';
      default:
        return '';
    }
  };

  const handleRepeatedPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const repeatedpwd = e.target.value;
    setRepeatedPassword(repeatedpwd);
    if (repeatedpwd !== password) {
      setIsCorectPaswords(false);
      setMessagePaswordsMatch('Паролі не збігаються');
    } else {
      setIsCorectPaswords(true);
      setMessagePaswordsMatch('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const eml = e.target.value;
    setEmail(eml);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!emailRegex.test(eml)) {
      setMessageCorectEmail('Неправильний email');
      setIsButtonDisabled(true);
      setIsCorectEmail(false);
    } else {
      setMessageCorectEmail('');
      setIsCorectEmail(true);
    }
  };
  const registrationUser = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (password === repeatedPassword && isCorectEmail && isCorectPaswords) {
      try {
        await api.post('/user', {
          email,
          password,
        });
        Swal.fire({
          icon: 'success',
          title: 'Повідомлення',
          text: 'Користувача створено успішно, можете авторизуватись',
        });
        navigate('/login');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Ой...',
          text: 'Помилка створення користувача',
          footer: error instanceof Error ? error.message : String(error),
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ой...',
        text: 'Дані для реєстрації не коректні',
      });
    }
  };

  return (
    <Box sx={RegisterFormStyles.container}>
      <Box component="form" onSubmit={registrationUser} sx={RegisterFormStyles.formContainer}>
        <Typography variant="h4" gutterBottom>
          Реєстрація
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          type="email"
          onChange={handleEmailChange}
          helperText={messageCorectEmail}
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
          helperText={password.length < 8 ? 'В паролі має бути не менше 8 символів' : ''}
          sx={RegisterFormStyles.textField}
        />
        <Box sx={RegisterFormStyles.passwordStrengthBar}>
          <Box sx={RegisterFormStyles.passwordStrengthBar}>
            <Box className={passwordStrength >= 0 ? 'active weak' : ''} />
            <Box className={passwordStrength >= 1 ? 'active fair' : ''} />
            <Box className={passwordStrength >= 2 ? 'active good' : ''} />
            <Box className={passwordStrength >= 3 ? 'active strong' : ''}>
              <p>{getPasswordStrengthText(passwordStrength)}</p>
            </Box>
          </Box>
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
