import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Container, TextField, Button, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../api/request';
import loginFormStyles from './Loginstyle'; // import styles from styles

function LoginForm(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response: { result: string; token: string; refreshToken: string } = await api.post('/login', {
        email,
        password,
      });
      // логіка після успішної авторизації
      if (response.result === 'Authorized') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        navigate('/');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ой...',
        text: 'Помилка входу, можливо невірні логін, пароль',
        footer: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleShowPasswordChange = (): void => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <Container maxWidth={false} sx={loginFormStyles.container}>
      <Box component="form" onSubmit={handleSubmit} sx={loginFormStyles.formContainer}>
        <Typography component="h1" variant="h5" sx={{ color: '#3498db', mb: 2 }}>
          Вхід
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          type="email"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={handleEmailChange}
          sx={loginFormStyles.textField}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={handlePasswordChange}
          sx={loginFormStyles.textField}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showPassword}
              color="primary"
              onChange={handleShowPasswordChange}
              sx={loginFormStyles.checkBox}
            />
          }
          label="Показувати пароль"
          sx={{ color: '#3498db' }}
        />
        <Button type="submit" fullWidth variant="contained" sx={loginFormStyles.submitButton}>
          Увійти
        </Button>
        <Typography variant="body2" color="#3498db">
          Ще немає акаунта?{' '}
          <Link to="/register/" style={loginFormStyles.linkText}>
            Зареєструватись
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginForm;
